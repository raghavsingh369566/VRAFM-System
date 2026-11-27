/* =========================================================
   VRAFM - Vehicle Rental & Fleet Management
   script.js  (beginner-friendly version)

   HOW THIS FILE WORKS (read this first!)
   1. Our data lives in two lists (arrays): "vehicles" and "records".
   2. Small functions "draw" that data on the page.
   3. Whenever the data changes we call refresh(), which
      redraws the page AND saves the data in the browser.

   FEATURES (nothing was removed):
   - Logo                -> scroll to top
   - Nav links           -> Dashboard / Vehicles / Maintenance / Bookings
   - Profile (RS Admin)  -> menu: My Profile, Settings, Logout
   - Stat cards          -> filter the fleet by that status
   - Search box + filter -> find vehicles
   - + Add Maintenance   -> add maintenance form
   - Vehicle card / image / title / "View Details" -> details popup
   - Details popup       -> update status, add maintenance, delete
   - Table rows          -> record popup (mark completed / delete)
   - Bookings            -> new booking + mark returned
   - Message (toast)     -> click to dismiss
   - Esc key             -> closes popups and menu
   - Data saved with localStorage
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";


    /* =====================================================
       STEP 1: SETTINGS AND OUR DATA
       ===================================================== */

    // The name used to save our data in the browser
    const STORAGE_KEY = "vrafm_data_v1";

    // Our two lists. They get filled in at the bottom (STEP 16).
    let vehicles = [];
    let records = [];

    // What the user typed in the search box
    let searchTerm = "";

    // The popup that is open right now (null = no popup)
    let activeOverlay = null;


    /* =====================================================
       STEP 2: GET THE HTML ELEMENTS WE NEED
       ===================================================== */

    const vehicleGrid = document.querySelector(".vehicle-grid");
    const tableBody = document.querySelector(".maintenance-section tbody");
    const filterSelect = document.getElementById("vehicleFilter");
    const addBtn = document.getElementById("addMaintenanceBtn");
    const sectionHeader = document.querySelector(".fleet-section .section-header");
    const logo = document.querySelector(".logo");
    const profile = document.querySelector(".profile");

    // querySelectorAll gives a "NodeList"; Array.from turns it into a normal list
    const statCards = Array.from(document.querySelectorAll(".stat-card"));
    const navLinks = Array.from(document.querySelectorAll(".navbar a"));

    // The four numbers at the top
    const totalEl = document.getElementById("totalVehicles");
    const availableEl = document.getElementById("availableVehicles");
    const rentedEl = document.getElementById("rentedVehicles");
    const maintenanceEl = document.getElementById("maintenanceVehicles");

    // The filter value that goes with each stat card (same order as the cards)
    const statFilters = ["all", "available", "rented", "maintenance"];

    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    /* =====================================================
       STEP 3: EXTRA STYLES
       (so you don't need to edit style.css)
       ===================================================== */

    const extraStyle = document.createElement("style");
    extraStyle.textContent = `
        .logo, .profile, .stat-card, .vehicle-image, .vehicle-title h3,
        .table-container tbody tr[data-id], .vrafm-toast { cursor: pointer; }

        .stat-card { transition: transform .2s, box-shadow .2s, border-color .2s; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,.08); }
        .stat-card.stat-active { border-color: #2563eb; box-shadow: 0 0 0 2px #2563eb33; }
        .stat-card:focus-visible, .profile:focus-visible, .logo:focus-visible {
            outline: 2px solid #2563eb; outline-offset: 3px; border-radius: 8px;
        }

        .profile { position: relative; user-select: none; }
        .profile-menu {
            position: absolute; top: 52px; right: 0; min-width: 180px;
            background: #fff; border: 1px solid #e5e7eb; border-radius: 10px;
            box-shadow: 0 12px 30px rgba(0,0,0,.12); padding: 6px; z-index: 500;
        }
        .profile-menu button {
            display: block; width: 100%; text-align: left; background: none; border: none;
            padding: 10px 12px; border-radius: 6px; font-size: 14px; color: #374151; cursor: pointer;
        }
        .profile-menu button:hover { background: #f3f4f6; }
        .profile-menu button.danger { color: #dc2626; }

        .vrafm-row { display: flex; justify-content: space-between; gap: 12px;
            padding: 9px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .vrafm-row span:first-child { color: #6b7280; }
        .vrafm-row:last-of-type { border-bottom: none; }

        .booking-item { display: flex; justify-content: space-between; align-items: center; gap: 12px;
            padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 10px; }
        .booking-item p { font-size: 12px; color: #6b7280; }
        .small-btn { padding: 7px 12px; font-size: 13px; border-radius: 6px; cursor: pointer;
            border: 1px solid #2563eb; background: #fff; color: #2563eb; font-weight: 600; }
        .small-btn:hover { background: #2563eb; color: #fff; }
        .modal-sub { margin: 18px 0 10px; font-size: 16px; }
        .modal-note { color: #6b7280; font-size: 14px; }
    `;
    document.head.appendChild(extraStyle);


    /* =====================================================
       STEP 4: SMALL HELPER FUNCTIONS
       ===================================================== */

    // Makes text safe to put inside HTML (used for names the user types)
    function escapeHTML(text) {
        if (text === null || text === undefined) text = "";
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // Turns 4500 into "₹4,500"
    function formatCost(amount) {
        return "₹" + Number(amount).toLocaleString("en-IN");
    }

    // Turns "2026-09-10" into "10 Sep 2026"
    function formatDate(isoText) {
        if (!isoText) return "-";
        const parts = isoText.split("-");              // ["2026", "09", "10"]
        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);
        const dayText = String(day).padStart(2, "0");  // 5 -> "05"
        return dayText + " " + MONTHS[month - 1] + " " + year;
    }

    // Today's date as "2026-11-27" (used for date inputs)
    function todayISO() {
        return new Date().toISOString().split("T")[0];
    }

    // Turns "available" into "Available"
    function statusLabel(status) {
        if (status === "available") return "Available";
        if (status === "rented") return "Rented";
        return "Maintenance";
    }

    // Turns "₹4,500" into the number 4500
    function parseCost(text) {
        const digitsOnly = text.replace(/[^\d]/g, "");
        return Number(digitsOnly) || 0;
    }

    // Makes a (nearly) unique id number
    function makeId() {
        return Date.now() + Math.floor(Math.random() * 100000);
    }

    // Finds a vehicle by its id (returns null if not found)
    function findVehicle(id) {
        for (const v of vehicles) {
            if (v.id === id) return v;
        }
        return null;
    }

    // Finds a record by its id (returns null if not found)
    function findRecord(id) {
        for (const r of records) {
            if (r.id === id) return r;
        }
        return null;
    }

    // Scrolls smoothly to an element
    function scrollToElement(element) {
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Lets a normal element (not a button) work with Enter / Space keys too
    function makeClickable(element, whatToDo) {
        element.setAttribute("role", "button");
        element.setAttribute("tabindex", "0");
        element.addEventListener("click", whatToDo);
        element.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                whatToDo();
            }
        });
    }


    /* =====================================================
       STEP 5: SAVE AND LOAD (so data stays after refreshing)
       ===================================================== */

    // Read the starting data from the HTML that is already on the page
    function loadFromPage() {
        vehicles = [];
        const cards = vehicleGrid.querySelectorAll(".vehicle-card");

        for (const card of cards) {
            const info = card.querySelectorAll(".vehicle-info strong");
            const statusEl = card.querySelector(".status");

            // Which status class does the badge have?
            let status = "available";
            if (statusEl.classList.contains("rented")) status = "rented";
            if (statusEl.classList.contains("maintenance")) status = "maintenance";
            if (statusEl.classList.contains("available")) status = "available";

            vehicles.push({
                id: makeId(),
                name: card.querySelector("h3").textContent.trim(),
                plate: card.querySelector(".vehicle-title p").textContent.trim(),
                image: card.querySelector("img").getAttribute("src"),
                status: status,
                category: info[0].textContent.trim(),
                lastService: info[1].textContent.trim(),
                nextService: info[2].textContent.trim(),
                cost: parseCost(info[3].textContent),
                customer: "",      // who rented it (only used when rented)
                returnDate: ""     // when it comes back (only used when rented)
            });
        }

        records = [];
        const rows = tableBody.querySelectorAll("tr");

        for (const row of rows) {
            const cells = row.querySelectorAll("td");
            const badge = cells[5].querySelector(".table-status");

            let status = "pending";
            if (badge.classList.contains("completed")) status = "completed";

            records.push({
                id: makeId(),
                vehicle: cells[0].textContent.trim(),
                type: cells[1].textContent.trim(),
                date: cells[2].textContent.trim(),
                next: cells[3].textContent.trim(),
                cost: parseCost(cells[4].textContent),
                status: status
            });
        }
    }

    function saveData() {
        try {
            const data = { vehicles: vehicles, records: records };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn("Could not save data:", error);
        }
    }

    // If saved data exists, use it instead of the starting data
    function loadSavedData() {
        try {
            const text = localStorage.getItem(STORAGE_KEY);
            if (!text) return;                       // nothing saved yet

            const data = JSON.parse(text);
            if (Array.isArray(data.vehicles) && Array.isArray(data.records)) {
                vehicles = data.vehicles;
                records = data.records;
            }
        } catch (error) {
            // Saved data was broken, so we simply ignore it
        }
    }


    /* =====================================================
       STEP 6: SHOW THE DATA ON THE PAGE
       ===================================================== */

    // Fill the 4 number cards at the top
    function updateStats() {
        let available = 0;
        let rented = 0;
        let maintenance = 0;

        for (const v of vehicles) {
            if (v.status === "available") available++;
            if (v.status === "rented") rented++;
            if (v.status === "maintenance") maintenance++;
        }

        totalEl.textContent = vehicles.length;
        availableEl.textContent = available;
        rentedEl.textContent = rented;
        maintenanceEl.textContent = maintenance;
    }

    // Put a blue border on the stat card that matches the current filter
    function highlightStat() {
        for (let i = 0; i < statCards.length; i++) {
            const isSelected = (statFilters[i] === filterSelect.value) && (filterSelect.value !== "all");
            statCards[i].classList.toggle("stat-active", isSelected);
        }
    }

    // Draw the vehicle cards (uses the search box and the filter dropdown)
    function renderVehicles() {
        const filter = filterSelect.value;
        const term = searchTerm.trim().toLowerCase();
        let html = "";

        for (const v of vehicles) {
            // Skip vehicles that don't match the filter
            if (filter !== "all" && v.status !== filter) continue;

            // Skip vehicles that don't match the search text
            const text = (v.name + " " + v.plate + " " + v.category).toLowerCase();
            if (term !== "" && !text.includes(term)) continue;

            html += `
                <article class="vehicle-card" data-id="${v.id}">
                    <div class="vehicle-image" data-action="details">
                        <img src="${escapeHTML(v.image)}" alt="${escapeHTML(v.name)}">
                    </div>
                    <div class="vehicle-content">
                        <div class="vehicle-title">
                            <div>
                                <h3 data-action="details">${escapeHTML(v.name)}</h3>
                                <p>${escapeHTML(v.plate)}</p>
                            </div>
                            <span class="status ${v.status}">${statusLabel(v.status)}</span>
                        </div>
                        <div class="vehicle-info">
                            <div><span>Category</span><strong>${escapeHTML(v.category)}</strong></div>
                            <div><span>Last Service</span><strong>${escapeHTML(v.lastService)}</strong></div>
                        </div>
                        <div class="vehicle-info">
                            <div><span>Next Service</span><strong>${escapeHTML(v.nextService)}</strong></div>
                            <div><span>Maintenance Cost</span><strong>${formatCost(v.cost)}</strong></div>
                        </div>
                        <button class="details-btn" data-action="details">View Details</button>
                    </div>
                </article>
            `;
        }

        highlightStat();

        if (html === "") {
            html = '<p style="grid-column:1/-1;text-align:center;color:#6b7280;padding:40px 0;">No vehicles found.</p>';
        }

        vehicleGrid.innerHTML = html;
    }

    // Draw the rows of the maintenance table (each row is clickable)
    function renderRecords() {
        let html = "";

        for (const r of records) {
            const label = (r.status === "completed") ? "Completed" : "In Progress";

            html += `
                <tr data-id="${r.id}" title="Click to view record">
                    <td>${escapeHTML(r.vehicle)}</td>
                    <td>${escapeHTML(r.type)}</td>
                    <td>${escapeHTML(r.date)}</td>
                    <td>${escapeHTML(r.next)}</td>
                    <td>${formatCost(r.cost)}</td>
                    <td><span class="table-status ${r.status}">${label}</span></td>
                </tr>
            `;
        }

        if (html === "") {
            html = '<tr><td colspan="6" style="text-align:center;color:#6b7280;">No maintenance records yet.</td></tr>';
        }

        tableBody.innerHTML = html;
    }

    // Redraw everything and save
    function refresh() {
        updateStats();
        renderVehicles();
        renderRecords();
        saveData();
    }


    /* =====================================================
       STEP 7: TOAST (small message, click to dismiss)
       ===================================================== */

    // Shows a message for 2.8 seconds. Use type "error" for a red message.
    function showToast(message, type) {
        // Remove any older message first
        const oldToasts = document.querySelectorAll(".vrafm-toast");
        for (const old of oldToasts) old.remove();

        const toast = document.createElement("div");
        toast.className = "vrafm-toast";
        if (type === "error") toast.classList.add("error");
        toast.textContent = message;
        toast.style.pointerEvents = "auto";
        document.body.appendChild(toast);

        function hideToast() {
            toast.classList.remove("show");
            setTimeout(function () {
                toast.remove();
            }, 300);
        }

        toast.addEventListener("click", hideToast);

        // Wait one frame, then fade the message in
        requestAnimationFrame(function () {
            toast.classList.add("show");
        });

        setTimeout(hideToast, 2800);
    }


    /* =====================================================
       STEP 8: POPUP (MODAL) HELPERS
       ===================================================== */

    // Opens a popup with a title and some HTML inside. Returns the popup.
    function openModal(title, bodyHTML) {
        closeModal();      // only one popup at a time

        const overlay = document.createElement("div");
        overlay.className = "vrafm-overlay";
        overlay.innerHTML = `
            <div class="vrafm-modal" role="dialog" aria-modal="true">
                <div class="vrafm-modal-header">
                    <h2>${escapeHTML(title)}</h2>
                    <button class="modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="vrafm-modal-body">${bodyHTML}</div>
            </div>
        `;

        // Clicking the dark background or the X closes the popup
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay || event.target.closest(".modal-close")) {
                closeModal();
            }
        });

        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";     // stop page scrolling behind popup
        activeOverlay = overlay;
        return overlay;
    }

    function closeModal() {
        if (activeOverlay) {
            activeOverlay.remove();
            activeOverlay = null;
            document.body.style.overflow = "";
        }
    }


    /* =====================================================
       STEP 9: ADD MAINTENANCE POPUP
       ===================================================== */

    // Open the form. If selectedId is given, that vehicle is pre-selected.
    function openAddMaintenance(selectedId) {
        if (vehicles.length === 0) {
            showToast("There are no vehicles to service.", "error");
            return;
        }

        // Build the list of vehicles for the dropdown
        let options = "";
        for (const v of vehicles) {
            const selected = (v.id === selectedId) ? "selected" : "";
            options += `<option value="${v.id}" ${selected}>${escapeHTML(v.name)} (${escapeHTML(v.plate)})</option>`;
        }

        const overlay = openModal("Add Maintenance", `
            <form id="maintenanceForm" novalidate>
                <label for="mVehicle">Vehicle</label>
                <select id="mVehicle">${options}</select>

                <label for="mType">Service Type</label>
                <select id="mType">
                    <option>Regular Service</option>
                    <option>Oil Change</option>
                    <option>Brake Service</option>
                    <option>Tyre Replacement</option>
                    <option>Battery Replacement</option>
                    <option>Engine Repair</option>
                    <option>Other</option>
                </select>

                <label for="mDate">Service Date</label>
                <input type="date" id="mDate" value="${todayISO()}">

                <label for="mNext">Next Service Date</label>
                <input type="date" id="mNext">

                <label for="mCost">Cost (₹)</label>
                <input type="number" id="mCost" min="0" step="1" placeholder="e.g. 4500">

                <label for="mStatus">Status</label>
                <select id="mStatus">
                    <option value="completed">Completed</option>
                    <option value="pending">In Progress</option>
                </select>

                <button type="submit" class="add-btn">Save Maintenance</button>
            </form>
        `);

        const form = overlay.querySelector("#maintenanceForm");
        form.addEventListener("submit", function (event) {
            event.preventDefault();     // stops the page from reloading
            saveMaintenance(overlay);
        });
    }

    // Runs when the Add Maintenance form is submitted
    function saveMaintenance(overlay) {
        const vehicleId = Number(overlay.querySelector("#mVehicle").value);
        const type = overlay.querySelector("#mType").value;
        const date = overlay.querySelector("#mDate").value;
        const next = overlay.querySelector("#mNext").value;
        const cost = overlay.querySelector("#mCost").value;
        const status = overlay.querySelector("#mStatus").value;

        // Check the form
        if (date === "" || next === "" || cost === "") {
            showToast("Please fill in all fields.", "error");
            return;
        }
        if (next < date) {
            showToast("Next service can't be before the service date.", "error");
            return;
        }
        if (Number(cost) < 0) {
            showToast("Cost can't be negative.", "error");
            return;
        }

        const vehicle = findVehicle(vehicleId);
        if (vehicle === null) return;

        // 1. Add a new record at the top of the table
        records.unshift({
            id: makeId(),
            vehicle: vehicle.name,
            type: type,
            date: formatDate(date),
            next: formatDate(next),
            cost: Number(cost),
            status: status
        });

        // 2. Update the vehicle's information
        vehicle.lastService = formatDate(date);
        vehicle.nextService = formatDate(next);
        vehicle.cost = Number(cost);

        // 3. Update the vehicle's status
        if (status === "pending") {
            vehicle.status = "maintenance";          // work still going on
        } else if (vehicle.status === "maintenance") {
            vehicle.status = "available";            // work finished
        }

        refresh();
        closeModal();
        showToast("Maintenance record added.");
    }


    /* =====================================================
       STEP 10: VEHICLE DETAILS POPUP
       ===================================================== */

    function openDetails(id) {
        const v = findVehicle(id);
        if (v === null) return;

        // Count how many records this vehicle has
        let recordCount = 0;
        for (const r of records) {
            if (r.vehicle === v.name) recordCount++;
        }

        // Show the customer only if the vehicle is rented and we know the name
        let rentedLine = "";
        if (v.status === "rented" && v.customer) {
            let returnText = "";
            if (v.returnDate) {
                returnText = " (return " + escapeHTML(formatDate(v.returnDate)) + ")";
            }
            rentedLine = `<p><strong>Rented to:</strong> ${escapeHTML(v.customer)}${returnText}</p>`;
        }

        const overlay = openModal("Vehicle Details", `
            <div class="vehicle-detail">
                <img src="${escapeHTML(v.image)}" alt="${escapeHTML(v.name)}">
                <h3>${escapeHTML(v.name)}</h3>
                <p><strong>Number Plate:</strong> ${escapeHTML(v.plate)}</p>
                <p><strong>Category:</strong> ${escapeHTML(v.category)}</p>
                <p><strong>Status:</strong> <span class="status ${v.status}">${statusLabel(v.status)}</span></p>
                ${rentedLine}
                <p><strong>Last Service:</strong> ${escapeHTML(v.lastService)}</p>
                <p><strong>Next Service:</strong> ${escapeHTML(v.nextService)}</p>
                <p><strong>Maintenance Cost:</strong> ${formatCost(v.cost)}</p>
                <p><strong>Service Records:</strong> ${recordCount}</p>

                <label for="dStatus" style="font-weight:600;font-size:14px;">Change Status</label>
                <select id="dStatus" style="width:100%;padding:11px;border:1px solid #d1d5db;border-radius:6px;margin-top:6px;">
                    <option value="available" ${v.status === "available" ? "selected" : ""}>Available</option>
                    <option value="rented" ${v.status === "rented" ? "selected" : ""}>Rented</option>
                    <option value="maintenance" ${v.status === "maintenance" ? "selected" : ""}>Maintenance</option>
                </select>

                <div class="modal-actions" style="flex-wrap:wrap;">
                    <button class="add-btn" id="updateStatusBtn">Update Status</button>
                    <button class="details-btn" id="detailMaintBtn">Add Maintenance</button>
                    <button class="delete-btn" id="deleteVehicleBtn">Delete Vehicle</button>
                </div>
            </div>
        `);

        // Button: Update Status
        overlay.querySelector("#updateStatusBtn").addEventListener("click", function () {
            v.status = overlay.querySelector("#dStatus").value;

            // A vehicle that is not rented has no customer
            if (v.status !== "rented") {
                v.customer = "";
                v.returnDate = "";
            }

            refresh();
            closeModal();
            showToast(v.name + " is now " + statusLabel(v.status) + ".");
        });

        // Button: Add Maintenance
        overlay.querySelector("#detailMaintBtn").addEventListener("click", function () {
            openAddMaintenance(v.id);
        });

        // Button: Delete Vehicle
        overlay.querySelector("#deleteVehicleBtn").addEventListener("click", function () {
            deleteVehicle(v);
        });
    }

    // Delete a vehicle (and its records)
    function deleteVehicle(vehicle) {
        const sure = confirm("Delete " + vehicle.name + "? Its maintenance records will also be removed.");
        if (!sure) return;

        // Keep only the vehicles and records that do NOT belong to this vehicle
        const keptVehicles = [];
        for (const v of vehicles) {
            if (v.id !== vehicle.id) keptVehicles.push(v);
        }
        vehicles = keptVehicles;

        const keptRecords = [];
        for (const r of records) {
            if (r.vehicle !== vehicle.name) keptRecords.push(r);
        }
        records = keptRecords;

        refresh();
        closeModal();
        showToast("Vehicle deleted.", "error");
    }


    /* =====================================================
       STEP 11: MAINTENANCE RECORD POPUP (click a table row)
       ===================================================== */

    function openRecord(id) {
        const r = findRecord(id);
        if (r === null) return;

        const label = (r.status === "completed") ? "Completed" : "In Progress";

        // Only show "Mark Completed" if the work is still in progress
        let completeButton = "";
        if (r.status === "pending") {
            completeButton = '<button class="add-btn" id="completeBtn">Mark Completed</button>';
        }

        const overlay = openModal("Maintenance Record", `
            <div class="vrafm-row"><span>Vehicle</span><strong>${escapeHTML(r.vehicle)}</strong></div>
            <div class="vrafm-row"><span>Service Type</span><strong>${escapeHTML(r.type)}</strong></div>
            <div class="vrafm-row"><span>Service Date</span><strong>${escapeHTML(r.date)}</strong></div>
            <div class="vrafm-row"><span>Next Service</span><strong>${escapeHTML(r.next)}</strong></div>
            <div class="vrafm-row"><span>Cost</span><strong>${formatCost(r.cost)}</strong></div>
            <div class="vrafm-row"><span>Status</span>
                <span class="table-status ${r.status}">${label}</span>
            </div>
            <div class="modal-actions">
                ${completeButton}
                <button class="delete-btn" id="deleteRecordBtn">Delete Record</button>
            </div>
        `);

        // Button: Mark Completed (only exists when status is pending)
        const completeBtn = overlay.querySelector("#completeBtn");
        if (completeBtn) {
            completeBtn.addEventListener("click", function () {
                completeRecord(r);
            });
        }

        // Button: Delete Record
        overlay.querySelector("#deleteRecordBtn").addEventListener("click", function () {
            deleteRecord(r);
        });
    }

    function completeRecord(record) {
        record.status = "completed";

        // Does this vehicle still have other work in progress?
        let stillWorking = false;
        for (const other of records) {
            if (other.vehicle === record.vehicle && other.status === "pending") {
                stillWorking = true;
            }
        }

        // If not, and it is in maintenance, make it available again
        for (const v of vehicles) {
            if (v.name === record.vehicle && v.status === "maintenance" && !stillWorking) {
                v.status = "available";
            }
        }

        refresh();
        closeModal();
        showToast("Marked as completed.");
    }

    function deleteRecord(record) {
        if (!confirm("Delete this maintenance record?")) return;

        // Keep every record except this one
        const keptRecords = [];
        for (const r of records) {
            if (r.id !== record.id) keptRecords.push(r);
        }
        records = keptRecords;

        refresh();
        closeModal();
        showToast("Record deleted.", "error");
    }


    /* =====================================================
       STEP 12: BOOKINGS POPUP
       ===================================================== */

    function openBookings() {
        let rentedHTML = "";
        let options = "";
        let rentedCount = 0;

        for (const v of vehicles) {
            // Rented vehicles go in the "Current Rentals" list
            if (v.status === "rented") {
                rentedCount++;

                let who = "Customer not recorded";
                if (v.customer) who = v.customer;

                let back = "";
                if (v.returnDate) back = " &middot; Return " + escapeHTML(formatDate(v.returnDate));

                rentedHTML += `
                    <div class="booking-item">
                        <div>
                            <strong>${escapeHTML(v.name)}</strong>
                            <p>${escapeHTML(v.plate)} &middot; ${escapeHTML(who)}${back}</p>
                        </div>
                        <button class="small-btn" data-return="${v.id}">Mark Returned</button>
                    </div>
                `;
            }

            // Available vehicles go in the booking form dropdown
            if (v.status === "available") {
                options += `<option value="${v.id}">${escapeHTML(v.name)} (${escapeHTML(v.plate)})</option>`;
            }
        }

        if (rentedHTML === "") {
            rentedHTML = '<p class="modal-note">No vehicles are currently rented.</p>';
        }

        // Show the booking form only if some vehicle is available
        let formHTML = '<p class="modal-note">No vehicles are available to book right now.</p>';
        if (options !== "") {
            formHTML = `
                <form id="bookingForm" novalidate>
                    <label for="bVehicle">Vehicle</label>
                    <select id="bVehicle">${options}</select>

                    <label for="bCustomer">Customer Name</label>
                    <input type="text" id="bCustomer" placeholder="e.g. Rahul Sharma">

                    <label for="bReturn">Return Date</label>
                    <input type="date" id="bReturn" min="${todayISO()}">

                    <button type="submit" class="add-btn">Confirm Booking</button>
                </form>
            `;
        }

        const overlay = openModal("Bookings", `
            <h3 class="modal-sub" style="margin-top:0;">Current Rentals (${rentedCount})</h3>
            ${rentedHTML}
            <h3 class="modal-sub">New Booking</h3>
            ${formHTML}
        `);

        // "Mark Returned" buttons
        const returnButtons = overlay.querySelectorAll("[data-return]");
        for (const button of returnButtons) {
            button.addEventListener("click", function () {
                returnVehicle(Number(button.dataset.return));
            });
        }

        // Booking form (only exists if a vehicle is available)
        const form = overlay.querySelector("#bookingForm");
        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                saveBooking(form);
            });
        }
    }

    function saveBooking(form) {
        const v = findVehicle(Number(form.querySelector("#bVehicle").value));
        const customer = form.querySelector("#bCustomer").value.trim();
        const returnDate = form.querySelector("#bReturn").value;

        if (v === null) return;

        if (customer === "" || returnDate === "") {
            showToast("Enter customer name and return date.", "error");
            return;
        }

        v.status = "rented";
        v.customer = customer;
        v.returnDate = returnDate;

        refresh();
        showToast(v.name + " booked for " + customer + ".");
        openBookings();          // show the popup again with updated lists
    }

    function returnVehicle(id) {
        const v = findVehicle(id);
        if (v === null) return;

        v.status = "available";
        v.customer = "";
        v.returnDate = "";

        refresh();
        showToast(v.name + " marked as returned.");
        openBookings();
    }


    /* =====================================================
       STEP 13: PROFILE MENU (My Profile, Settings, Logout)
       ===================================================== */

    function closeProfileMenu() {
        const menu = profile.querySelector(".profile-menu");
        if (menu) menu.remove();
    }

    function toggleProfileMenu() {
        // If the menu is already open, close it
        if (profile.querySelector(".profile-menu")) {
            closeProfileMenu();
            return;
        }

        const menu = document.createElement("div");
        menu.className = "profile-menu";
        menu.innerHTML = `
            <button data-menu="profile">My Profile</button>
            <button data-menu="settings">Settings</button>
            <button data-menu="logout" class="danger">Logout</button>
        `;
        profile.appendChild(menu);

        menu.addEventListener("click", function (event) {
            event.stopPropagation();      // don't let the profile toggle again

            const item = event.target.closest("[data-menu]");
            if (!item) return;

            closeProfileMenu();

            if (item.dataset.menu === "profile") openProfile();
            if (item.dataset.menu === "settings") openSettings();
            if (item.dataset.menu === "logout") logout();
        });
    }

    function openProfile() {
        openModal("My Profile", `
            <div class="vrafm-row"><span>Name</span><strong>Admin</strong></div>
            <div class="vrafm-row"><span>Initials</span><strong>RS</strong></div>
            <div class="vrafm-row"><span>Role</span><strong>Fleet Administrator</strong></div>
            <div class="vrafm-row"><span>Vehicles managed</span><strong>${vehicles.length}</strong></div>
        `);
    }

    function openSettings() {
        const overlay = openModal("Settings", `
            <p class="modal-note">Fleet data is saved in this browser. You can reset it back to the default demo data.</p>
            <div class="modal-actions">
                <button class="delete-btn" id="resetDataBtn">Reset All Data</button>
            </div>
        `);

        overlay.querySelector("#resetDataBtn").addEventListener("click", resetData);
    }

    function resetData() {
        if (!confirm("Reset all data to the defaults?")) return;

        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            // ignore
        }
        location.reload();        // reload the page
    }

    function logout() {
        if (confirm("Log out of VRAFM?")) {
            showToast("Logged out (demo only).");
        }
    }


    /* =====================================================
       STEP 14: SEARCH BOX (added next to the filter)
       ===================================================== */

    function setupSearch() {
        const controls = document.createElement("div");
        controls.className = "fleet-controls";
        controls.style.cssText = "display:flex;gap:12px;align-items:center;";

        const search = document.createElement("input");
        search.type = "search";
        search.id = "searchVehicle";
        search.placeholder = "Search name, plate, category...";
        search.style.cssText =
            "padding:10px 14px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;min-width:230px;";

        // Put the search box and the filter dropdown side by side
        sectionHeader.insertBefore(controls, filterSelect);
        controls.appendChild(search);
        controls.appendChild(filterSelect);

        search.addEventListener("input", function () {
            searchTerm = search.value;
            renderVehicles();
        });
    }


    /* =====================================================
       STEP 15: NAVIGATION, LOGO, STAT CARDS AND OTHER CLICKS
       ===================================================== */

    // Highlight one nav link (by its text)
    function setActiveNav(name) {
        for (const link of navLinks) {
            link.classList.toggle("active", link.textContent.trim() === name);
        }
    }

    function setupNavigation() {
        for (const link of navLinks) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                const name = link.textContent.trim();

                if (name === "Dashboard") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else if (name === "Vehicles") {
                    scrollToElement(document.getElementById("fleet"));
                } else if (name === "Maintenance") {
                    scrollToElement(document.getElementById("maintenance"));
                } else if (name === "Bookings") {
                    openBookings();
                }

                setActiveNav(name);
            });
        }

        // Highlight the nav link of the section you are looking at
        window.addEventListener("scroll", function () {
            if (activeOverlay) return;      // do nothing while a popup is open

            let current = "Dashboard";
            const fleet = document.getElementById("fleet");
            const maintenance = document.getElementById("maintenance");

            if (fleet && fleet.getBoundingClientRect().top <= 140) current = "Vehicles";
            if (maintenance && maintenance.getBoundingClientRect().top <= 140) current = "Maintenance";

            setActiveNav(current);
        }, { passive: true });
    }

    function setupClicks() {
        // Add Maintenance button
        addBtn.addEventListener("click", function () {
            openAddMaintenance();
        });

        // Filter dropdown
        filterSelect.addEventListener("change", renderVehicles);

        // Logo -> go to the top
        makeClickable(logo, function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveNav("Dashboard");
        });

        // Profile -> open / close the menu
        makeClickable(profile, toggleProfileMenu);

        // Click anywhere else on the page to close the profile menu
        document.addEventListener("click", function (event) {
            if (!profile.contains(event.target)) closeProfileMenu();
        });

        // Stat cards -> show only those vehicles
        for (let i = 0; i < statCards.length; i++) {
            const card = statCards[i];
            const filterValue = statFilters[i];

            card.title = "Click to show these vehicles";

            makeClickable(card, function () {
                filterSelect.value = filterValue;
                searchTerm = "";

                const search = document.getElementById("searchVehicle");
                if (search) search.value = "";

                renderVehicles();
                scrollToElement(document.getElementById("fleet"));
                setActiveNav("Vehicles");
            });
        }

        // Vehicle cards: image, title and "View Details" button
        vehicleGrid.addEventListener("click", function (event) {
            const clicked = event.target.closest('[data-action="details"]');
            if (!clicked) return;

            const card = clicked.closest(".vehicle-card");
            if (card) openDetails(Number(card.dataset.id));
        });

        // Maintenance table rows
        tableBody.addEventListener("click", function (event) {
            const row = event.target.closest("tr[data-id]");
            if (row) openRecord(Number(row.dataset.id));
        });

        // Esc key closes the popup and the profile menu
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeModal();
                closeProfileMenu();
            }
        });
    }


    /* =====================================================
       STEP 16: START THE PAGE
       ===================================================== */

    loadFromPage();       // starting data from the HTML
    loadSavedData();      // replace it with saved data (if any)
    setupSearch();        // add the search box
    setupNavigation();    // nav links + scroll highlight
    setupClicks();        // all the other clicks
    refresh();            // draw everything
});