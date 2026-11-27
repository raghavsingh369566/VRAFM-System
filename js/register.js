
/* =====================================
   VRAFM - REGISTER PAGE JAVASCRIPT
   ===================================== */


// 1. DARK MODE PERSISTENCE

const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("vrafm-theme");

if (savedTheme === "dark") {
    themeToggle.checked = true;
} else {
    themeToggle.checked = false;
}

themeToggle.addEventListener("change", function () {

    if (themeToggle.checked) {
        localStorage.setItem("vrafm-theme", "dark");
    } else {
        localStorage.setItem("vrafm-theme", "light");
    }

});


// 2. SELECT FORM ELEMENTS

const registerForm = document.querySelector(".register-card form");

const fullName = document.getElementById("fullName");

const email = document.getElementById("email");

const phone = document.getElementById("phone");

const password = document.getElementById("password");

const confirmPassword = document.getElementById("confirmPassword");

const terms = document.getElementById("terms");


// 3. SHOW / HIDE PASSWORD

function addPasswordToggle(input) {

    const toggleButton = document.createElement("button");

    toggleButton.type = "button";
    toggleButton.className = "btn btn-outline-secondary btn-sm mt-2";
    toggleButton.textContent = "Show";

    input.parentElement.appendChild(toggleButton);

    toggleButton.addEventListener("click", function () {

        if (input.type === "password") {

            input.type = "text";
            toggleButton.textContent = "Hide";

        } else {

            input.type = "password";
            toggleButton.textContent = "Show";

        }

    });

}

addPasswordToggle(password);

addPasswordToggle(confirmPassword);


// 4. REGISTRATION FORM VALIDATION

registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Full Name Validation

    if (fullName.value.trim().length < 2) {

        alert("Please enter a valid full name.");
        fullName.focus();
        return;

    }


    // Email Validation

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {

        alert("Please enter a valid email address.");
        email.focus();
        return;

    }


    // Phone Number Validation

    const phonePattern = /^\+?[0-9\s()-]{7,15}$/;

    if (!phonePattern.test(phone.value.trim())) {

        alert("Please enter a valid phone number.");
        phone.focus();
        return;

    }


    // Password Validation

    if (password.value.length < 6) {

        alert("Password must contain at least 6 characters.");
        password.focus();
        return;

    }


    // Confirm Password Validation

    if (password.value !== confirmPassword.value) {

        alert("Password and Confirm Password do not match.");
        confirmPassword.focus();
        return;

    }


    // Terms and Conditions Validation

    if (!terms.checked) {

        alert("Please accept the Terms and Conditions.");
        terms.focus();
        return;

    }


    // Registration Success

    alert("Registration successful! Welcome to VRAFM.");

    // Redirect to Login Page

    window.location.href = "login.html";

});


// 5. CONSOLE MESSAGE

console.log("VRAFM Register Page JavaScript Loaded!");
