// Entry point: renders vehicle data into the page, then starts the booking logic.
import { vehicle } from "./data/vehicle-data.js";
import { formatCurrency } from "./utils/price-calculator.js";
import { initBooking } from "./booking/booking.js";

function renderVehicle() {
  const setText = (id, text) => { document.getElementById(id).textContent = text; };

  const image = document.getElementById("vehicle-image");
  image.src = vehicle.image;
  image.alt = vehicle.name;

  setText("vehicle-heading", vehicle.name);
  setText("vehicle-price", formatCurrency(vehicle.dailyPrice));
  setText("vehicle-category", vehicle.category);
  setText("vehicle-fuel", vehicle.fuelType);
  setText("vehicle-transmission", vehicle.transmission);
  setText("vehicle-seats", String(vehicle.seats));
  setText("vehicle-description", vehicle.description);

  const badge = document.getElementById("vehicle-availability");
  badge.textContent = vehicle.available ? "Available" : "Unavailable";
  badge.classList.toggle("bg-success", vehicle.available);
  badge.classList.toggle("bg-danger", !vehicle.available);

  // Feature cards reuse the existing Bootstrap column + .feature-box markup.
  const list = document.getElementById("features-list");
  list.innerHTML = "";
  vehicle.features.forEach((feature) => {
    const col = document.createElement("div");
    col.className = "col";
    const box = document.createElement("div");
    box.className = "feature-box";
    box.textContent = feature;
    col.appendChild(box);
    list.appendChild(col);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderVehicle();
  initBooking(vehicle);
});
