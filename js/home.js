console.log("HOME JS LOADED");
/* =====================================
   VRAFM - HOME PAGE JAVASCRIPT
   ===================================== */


// 1. SELECT THEME TOGGLE CHECKBOX

const themeToggle = document.getElementById("theme-toggle");


// 2. LOAD SAVED THEME WHEN PAGE OPENS

const savedTheme = localStorage.getItem("vrafm-theme");

if (savedTheme === "dark") {
    themeToggle.checked = true;
} else {
    themeToggle.checked = false;
}


// 3. CHANGE AND SAVE THEME

themeToggle.addEventListener("change", function () {

    if (themeToggle.checked) {

        localStorage.setItem("vrafm-theme", "dark");

        console.log("Dark Mode Activated");

    } else {

        localStorage.setItem("vrafm-theme", "light");

        console.log("Light Mode Activated");

    }

});


// // 4. UPDATE FOOTER YEAR

// const footer = document.querySelector(".footer-custom p");

// if (footer) {

//     footer.innerHTML =
//         `&copy; ${new Date().getFullYear()} VRAFM System. All rights reserved.`;

// }


// console.log("VRAFM Home Page JavaScript Loaded!");
// Update footer year automatically
const footerYear = document.querySelector(".footer-custom p");

if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace(
        "2024",
        new Date().getFullYear()
    );
}


// Vehicle category filtering
const categories = document.querySelectorAll(".category-box");
const vehicles = document.querySelectorAll(".vehicle-card");
const showAllButton = document.getElementById("show-all");

categories.forEach(category => {
    category.addEventListener("click", () => {

        const selectedCategory = category.dataset.filter;

        vehicles.forEach(vehicle => {
            const vehicleColumn = vehicle.closest(".col-md-4");

            if (vehicle.dataset.category === selectedCategory) {
                vehicleColumn.style.display = "block";
            } else {
                vehicleColumn.style.display = "none";
            }
        });
    });
});


// Show all vehicles
if (showAllButton) {
    showAllButton.addEventListener("click", () => {
        vehicles.forEach(vehicle => {
            vehicle.closest(".col-md-4").style.display = "block";
        });
    });
}


// Connect View Details buttons to Vehicle Booking page

// Connect View Details buttons to Vehicle Booking page

const vehicleCards = document.querySelectorAll(".vehicle-card");

vehicleCards.forEach(function(card) {

    const button = card.querySelector("a.btn-outline-primary");

    // Find vehicle name from heading
    const title = card.querySelector(
        ".card-title, h1, h2, h3, h4, h5, h6"
    );

    if (button && title) {

        const vehicleName = title.textContent.trim();

        button.href =
            "vehicle-booking.html?vehicle=" +
            encodeURIComponent(vehicleName);

        console.log("Vehicle linked:", vehicleName);
    }

});