// Booking form logic: validation, live summary, confirmation and persistence.
import {
  validateName, validateEmail, validatePhone, validateLocation,
  validatePickupDate, validateReturnDate, validateTerms, normalizePhone,
} from "../utils/validation.js";
import {
  formatCurrency, getTodayString, addOneDay, calculateRentalDays,
  calculateTotal, formatDisplayDate,
} from "../utils/price-calculator.js";
import { saveBooking, getLatestBooking, generateBookingId } from "../utils/storage.js";

const $ = (id) => document.getElementById(id);
const PROCESSING_DELAY_MS = 800; // simulated processing time for user feedback

export function initBooking(vehicle) {
  const form = $("booking-form");
  const fields = {
    name: $("full-name"),
    email: $("email"),
    phone: $("phone"),
    location: $("pickup-location"),
    pickupDate: $("pickup-date"),
    pickupTime: $("pickup-time"),
    returnDate: $("return-date"),
    returnTime: $("return-time"),
    requests: $("special-requests"),
    terms: $("agree-terms"),
  };

  let isSubmitting = false;
  let notificationTimer = null;

  // Each rule returns an error message ("" = valid), keyed by field.
  const rules = {
    name: () => validateName(fields.name.value),
    email: () => validateEmail(fields.email.value),
    phone: () => validatePhone(fields.phone.value),
    location: () => validateLocation(fields.location.value),
    pickupDate: () => validatePickupDate(fields.pickupDate.value, getTodayString()),
    returnDate: () => validateReturnDate(fields.returnDate.value, fields.pickupDate.value),
    terms: () => validateTerms(fields.terms.checked),
  };
  const errorElementIds = {
    name: "full-name-error", email: "email-error", phone: "phone-error",
    location: "pickup-location-error", pickupDate: "pickup-date-error",
    returnDate: "return-date-error", terms: "agree-terms-error",
  };

  /** Shows or clears the error for one field. Returns true if valid. */
  function checkField(key) {
    const message = rules[key]();
    const input = fields[key];
    $(errorElementIds[key]).textContent = message;
    input.classList.toggle("is-invalid", Boolean(message));
    input.classList.toggle("is-valid", !message && key !== "terms");
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  // ---------- Booking summary ----------
  function setSummary(id, text, isPlaceholder) {
    const el = $(id);
    el.textContent = text;
    el.classList.toggle("text-muted", isPlaceholder);
  }

  function updateSummary() {
    const { pickupDate, returnDate, location } = fields;
    setSummary("summary-vehicle", vehicle.name, false);
    setSummary("summary-rate", `${formatCurrency(vehicle.dailyPrice)} / day`, false);
    setSummary("summary-location", location.value || "Selected pickup location", !location.value);
    setSummary("summary-pickup-date",
      pickupDate.value ? formatDisplayDate(pickupDate.value) : "Selected date", !pickupDate.value);
    setSummary("summary-return-date",
      returnDate.value ? formatDisplayDate(returnDate.value) : "Selected date", !returnDate.value);

    // Only show a total when both dates are valid; otherwise a placeholder.
    const datesValid = !rules.pickupDate() && !rules.returnDate();
    const days = datesValid ? calculateRentalDays(pickupDate.value, returnDate.value) : 0;
    if (days > 0) {
      setSummary("summary-days", `${days} ${days === 1 ? "day" : "days"}`, false);
      setSummary("summary-total", formatCurrency(calculateTotal(vehicle.dailyPrice, days)), false);
    } else {
      setSummary("summary-days", "Select valid dates", true);
      setSummary("summary-total", "Select valid dates", true);
    }
    return days;
  }

  // ---------- Dates ----------
  function syncDateLimits() {
    fields.pickupDate.min = getTodayString();
    // Return must be at least one day after pickup (or after today if no pickup yet).
    fields.returnDate.min = addOneDay(fields.pickupDate.value || getTodayString());
  }

  // ---------- Notifications ----------
  function notify(message, type) {
    const box = $("notification");
    clearTimeout(notificationTimer);
    box.innerHTML = "";
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-dismissible mb-3`;
    alert.textContent = message;
    const close = document.createElement("button");
    close.type = "button";
    close.className = "btn-close";
    close.setAttribute("aria-label", "Close");
    close.addEventListener("click", () => (box.innerHTML = ""));
    alert.appendChild(close);
    box.appendChild(alert);
    notificationTimer = setTimeout(() => (box.innerHTML = ""), 6000);
  }

  // ---------- Confirmation section ----------
  function renderConfirmation(booking) {
    const container = $("confirmation-content");
    container.innerHTML = "";
    if (!booking) {
      const p = document.createElement("p");
      p.className = "text-muted mb-0";
      p.textContent = "No booking has been confirmed yet.";
      container.appendChild(p);
      return;
    }
    const withTime = (date, time) =>
      `${formatDisplayDate(date)}${time ? `, ${time}` : ""}`;
    const rows = [
      ["Booking ID", booking.bookingId],
      ["Customer", booking.customerName],
      ["Vehicle", booking.vehicleName],
      ["Pickup Location", booking.pickupLocation],
      ["Pickup", withTime(booking.pickupDate, booking.pickupTime)],
      ["Return", withTime(booking.returnDate, booking.returnTime)],
      ["Duration", `${booking.rentalDays} ${booking.rentalDays === 1 ? "day" : "days"}`],
      ["Total Amount", formatCurrency(booking.totalAmount)],
    ];
    if (booking.specialRequests) rows.push(["Special Requests", booking.specialRequests]);

    const dl = document.createElement("dl");
    dl.className = "row mb-0";
    const addRow = (label, valueNode, isLast) => {
      const dt = document.createElement("dt");
      dt.className = "col-5 col-sm-3 fw-normal text-muted";
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.className = `col-7 col-sm-9 ${isLast ? "mb-0" : "fw-semibold"}`;
      dd.appendChild(valueNode);
      dl.append(dt, dd);
    };
    rows.forEach(([label, value]) => addRow(label, document.createTextNode(value)));
    const badge = document.createElement("span");
    badge.className = "badge bg-warning text-dark";
    badge.textContent = booking.status;
    addRow("Status", badge, true);
    container.appendChild(dl);
  }

  // ---------- Form actions ----------
  function setProcessing(on) {
    isSubmitting = on;
    $("confirm-btn").disabled = on;
    $("reset-btn").disabled = on;
    $("confirm-spinner").classList.toggle("d-none", !on);
    $("confirm-label").textContent = on ? "Processing..." : "Confirm Booking";
  }

  function clearValidationState() {
    Object.entries(fields).forEach(([key, input]) => {
      input.classList.remove("is-invalid", "is-valid");
      input.removeAttribute("aria-invalid");
      if (errorElementIds[key]) $(errorElementIds[key]).textContent = "";
    });
  }

  function resetForm() {
    form.reset();
    clearValidationState();
    syncDateLimits();
    updateSummary();
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser's default form submission
    if (isSubmitting) return; // prevent duplicate submissions

    if (!vehicle.available) {
      notify("Sorry, this vehicle is currently unavailable.", "danger");
      return;
    }

    // Run every check (no short-circuit) so all errors show at once.
    const results = Object.keys(rules).map((key) => checkField(key));
    const days = updateSummary();
    if (results.includes(false) || days <= 0) {
      notify("Please fix the highlighted fields and try again.", "danger");
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      const booking = {
        bookingId: generateBookingId(),
        customerName: fields.name.value.trim().replace(/\s+/g, " "),
        email: fields.email.value.trim(),
        phone: normalizePhone(fields.phone.value),
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        pickupLocation: fields.location.value,
        pickupDate: fields.pickupDate.value,
        pickupTime: fields.pickupTime.value,
        returnDate: fields.returnDate.value,
        returnTime: fields.returnTime.value,
        rentalDays: days,
        dailyPrice: vehicle.dailyPrice,
        totalAmount: calculateTotal(vehicle.dailyPrice, days),
        specialRequests: fields.requests.value.trim(),
        status: "Pending Confirmation",
        createdAt: new Date().toISOString(),
      };

      if (saveBooking(booking)) {
        renderConfirmation(booking);
        resetForm();
        notify(`Booking ${booking.bookingId} created successfully!`, "success");
        $("confirmation-heading").scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        notify("Could not save your booking. Browser storage may be full or disabled.", "danger");
      }
      setProcessing(false);
    }, PROCESSING_DELAY_MS);
  }

  // ---------- Event wiring ----------
  // Validate a field live, but only once the user has interacted with it.
  const liveFields = ["name", "email", "phone", "location", "pickupDate", "returnDate"];
  liveFields.forEach((key) => {
    const input = fields[key];
    input.addEventListener("blur", () => { if (input.value !== "") checkField(key); });
    const liveEvent = key === "location" ? "change" : "input";
    input.addEventListener(liveEvent, () => {
      // Re-check on every edit once validated before, so errors clear as soon as fixed.
      if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) checkField(key);
    });
  });

  fields.pickupDate.addEventListener("change", () => {
    syncDateLimits();
    checkField("pickupDate");
    // Return date depends on pickup date: re-check it if the user already filled it in.
    if (fields.returnDate.value) checkField("returnDate");
    updateSummary();
  });
  fields.returnDate.addEventListener("change", () => {
    checkField("returnDate");
    updateSummary();
  });
  fields.pickupDate.addEventListener("input", updateSummary);
  fields.returnDate.addEventListener("input", updateSummary);
  fields.location.addEventListener("change", updateSummary);
  fields.terms.addEventListener("change", () => checkField("terms"));

  form.addEventListener("submit", handleSubmit);
  $("reset-btn").addEventListener("click", () => {
    resetForm();
    notify("Form has been reset.", "info");
  });

  // ---------- Initial state ----------
  syncDateLimits();
  updateSummary();
  renderConfirmation(getLatestBooking()); // shows latest saved booking after refresh
}
