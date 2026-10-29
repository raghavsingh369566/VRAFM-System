/*
  VRAFM Admin Dashboard JavaScript
  Topics used: variables, functions, arrays, objects, Date, DOM, arrow functions.
*/

"use strict";

const adminPage = {
    totalVehicles: 48,
    availableVehicles: 31,
    rentedVehicles: 17,
    totalCustomers: 286
};

// Show today's date on the dashboard.
const dashboardHeader = document.querySelector(".dashboard-header");

if (dashboardHeader) {
    const dateMessage = document.createElement("p");
    dateMessage.className = "dashboard-today";
    dateMessage.textContent = "Today: " + new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    dashboardHeader.appendChild(dateMessage);
}

// Calculate fleet utilization instead of hard-coding the percentage.
const utilizationPercent = Math.round(
    (adminPage.rentedVehicles / adminPage.totalVehicles) * 100
);

const progressHeading = document.querySelector(".progress-heading");
const progressBar = document.querySelector(".progress-bar-custom > div");

if (progressHeading) {
    const percentLabel = progressHeading.querySelector("strong");
    if (percentLabel) {
        percentLabel.textContent = utilizationPercent + "%";
    }
}

if (progressBar) {
    progressBar.style.width = utilizationPercent + "%";
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("aria-valuenow", utilizationPercent);
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
}

// Make the dashboard's sample records available as an array of objects.
const recentBookings = [
    { customer: "Arjun Sharma", vehicle: "Premium Sedan", status: "Confirmed" },
    { customer: "Priya Singh", vehicle: "Luxury SUV", status: "Active" },
    { customer: "Rahul Verma", vehicle: "Standard Sedan", status: "Completed" }
];

// Add helpful behavior to the placeholder quick-action links.
const quickActionLinks = document.querySelectorAll('.action-card[href="#"]');

quickActionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const actionName = link.querySelector("strong");
        if (actionName) {
            alert(actionName.textContent + " is a UI placeholder in this frontend prototype.");
        }
    });
});

// Log a small summary for learning/debugging in the browser console.
console.log("VRAFM Admin Dashboard loaded.");
console.log("Fleet utilization:", utilizationPercent + "%");
console.log("Recent booking records:", recentBookings.length);
