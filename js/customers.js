/*
  VRAFM Customer Management JavaScript
  Topics used: let/const, arrays, objects, functions, Date, Math.random,
  array methods (unshift), arrow functions, strict mode, and DOM manipulation.
*/

"use strict";

const customerTableBody = document.querySelector(".customers-table tbody");
const customerSearch = document.querySelector('.search-box input[type="search"]');
const addCustomerButton = document.querySelector(".add-customer-btn");
const paginationSummary = document.querySelector(".customer-pagination > span");
const summaryCards = document.querySelectorAll(".customer-summary strong");

// Read the existing sample customers from the HTML table into an array of objects.
let customers = [];

if (customerTableBody) {
    const existingRows = customerTableBody.querySelectorAll("tr");

    existingRows.forEach((row) => {
        const nameElement = row.querySelector(".customer-name strong");
        const idElement = row.querySelector(".customer-name span");
        const contactElements = row.querySelectorAll("td:nth-child(2) > *");
        const rentalsCell = row.querySelector("td:nth-child(3)");
        const joinedCell = row.querySelector("td:nth-child(4)");
        const statusElement = row.querySelector(".customer-status");

        if (nameElement && idElement && statusElement) {
            customers.push({
                id: idElement.textContent.trim(),
                name: nameElement.textContent.trim(),
                email: contactElements[0] ? contactElements[0].textContent.trim() : "",
                phone: contactElements[1] ? contactElements[1].textContent.trim() : "",
                bookings: rentalsCell ? rentalsCell.textContent.trim() : "0 rentals",
                joined: joinedCell ? joinedCell.textContent.trim() : "",
                status: statusElement.textContent.trim(),
                avatarClass: row.querySelector(".customer-avatar") ?
                    Array.from(row.querySelector(".customer-avatar").classList).find(
                        (className) => className.startsWith("avatar-")
                    ) || "avatar-blue" : "avatar-blue"
            });
        }
    });
}

const getInitials = (name) => {
    return name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
};

const renderCustomers = (list) => {
    if (!customerTableBody) return;

    customerTableBody.innerHTML = "";

    list.forEach((customer) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const nameWrapper = document.createElement("div");
        nameWrapper.className = "customer-name";

        const avatar = document.createElement("div");
        avatar.className = "customer-avatar " + customer.avatarClass;
        avatar.textContent = getInitials(customer.name);

        const nameDetails = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = customer.name;
        const customerId = document.createElement("span");
        customerId.textContent = customer.id;

        nameDetails.append(name, customerId);
        nameWrapper.append(avatar, nameDetails);
        nameCell.appendChild(nameWrapper);

        const contactCell = document.createElement("td");
        const email = document.createElement("strong");
        email.textContent = customer.email;
        const phone = document.createElement("span");
        phone.textContent = customer.phone;
        contactCell.append(email, phone);

        const bookingsCell = document.createElement("td");
        bookingsCell.textContent = customer.bookings;

        const joinedCell = document.createElement("td");
        joinedCell.textContent = customer.joined;

        const statusCell = document.createElement("td");
        const status = document.createElement("span");
        status.className = "customer-status " + customer.status.toLowerCase();
        status.textContent = customer.status;
        statusCell.appendChild(status);

        const actionCell = document.createElement("td");
        const viewButton = document.createElement("button");
        viewButton.className = "view-btn";
        viewButton.type = "button";
        viewButton.textContent = "View";
        viewButton.addEventListener("click", () => {
            alert(
                "Customer Details\n\n" +
                "ID: " + customer.id + "\n" +
                "Name: " + customer.name + "\n" +
                "Email: " + customer.email + "\n" +
                "Phone: " + customer.phone + "\n" +
                "Bookings: " + customer.bookings + "\n" +
                "Joined: " + customer.joined + "\n" +
                "Status: " + customer.status
            );
        });
        actionCell.appendChild(viewButton);

        row.append(nameCell, contactCell, bookingsCell, joinedCell, statusCell, actionCell);
        customerTableBody.appendChild(row);
    });

    if (paginationSummary) {
        paginationSummary.textContent = "Showing " + list.length + " customer(s)";
    }

    updateCustomerSummary();
};

const updateCustomerSummary = () => {
    if (summaryCards.length >= 4) {
        summaryCards[0].textContent = customers.length;
        summaryCards[1].textContent = customers.filter(
            (customer) => customer.status === "Active"
        ).length;
        summaryCards[2].textContent = customers.filter((customer) => {
            return customer.joined === new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        }).length;
        summaryCards[3].textContent = customers.filter(
            (customer) => customer.status === "Inactive"
        ).length;
    }
};

const filterCustomers = () => {
    const searchTerm = customerSearch ? customerSearch.value.toLowerCase().trim() : "";

    const filteredCustomers = customers.filter((customer) => {
        return customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.id.toLowerCase().includes(searchTerm) ||
            customer.phone.toLowerCase().includes(searchTerm) ||
            customer.status.toLowerCase().includes(searchTerm);
    });

    renderCustomers(filteredCustomers);
};

if (customerSearch) {
    customerSearch.addEventListener("input", filterCustomers);
}

if (addCustomerButton) {
    addCustomerButton.addEventListener("click", () => {
        const name = prompt("Enter the customer's full name:");
        if (name === null) return;

        if (name.trim() === "") {
            alert("Customer name cannot be empty.");
            return;
        }

        const email = prompt("Enter the customer's email address:");
        if (email === null) return;

        if (email.trim() === "") {
            alert("Email cannot be empty.");
            return;
        }

        const phone = prompt("Enter the customer's phone number:");
        if (phone === null) return;

        const randomNumber = Math.floor(100 + Math.random() * 900);
        const newCustomer = {
            id: "#CUST-" + String(customers.length + randomNumber).padStart(3, "0"),
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            bookings: "0 rentals",
            joined: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }),
            status: "Active",
            avatarClass: "avatar-blue"
        };

        // Add the new object at the beginning of the array.
        customers.unshift(newCustomer);

        if (customerSearch) customerSearch.value = "";
        renderCustomers(customers);
        alert("Customer added successfully for this session.");
    });
}

// Render the initial customer array and connect the View buttons.
renderCustomers(customers);

console.log("VRAFM Customer Management loaded.");
