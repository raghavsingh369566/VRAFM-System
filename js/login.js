
/* =====================================
   VRAFM - LOGIN PAGE JAVASCRIPT
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


// 2. SHOW / HIDE PASSWORD

const passwordInput = document.getElementById("password");

const passwordButton = document.createElement("button");

passwordButton.type = "button";
passwordButton.className = "btn btn-outline-secondary btn-sm mt-2";
passwordButton.textContent = "Show";

passwordInput.parentElement.appendChild(passwordButton);

passwordButton.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        passwordButton.textContent = "Hide";

    } else {

        passwordInput.type = "password";
        passwordButton.textContent = "Show";

    }

});


// 3. LOGIN FORM VALIDATION

const loginForm = document.querySelector(".login-card form");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = passwordInput.value;

    if (email === "" || password === "") {

        alert("Please fill in all required fields.");
        return;

    }

    if (password.length < 6) {

        alert("Password must contain at least 6 characters.");
        return;

    }

    // Demo login only - no backend authentication

    alert("Login successful! Welcome to VRAFM.");

    window.location.href = "index.html";

});


// 4. FORGOT PASSWORD

const forgotPassword = document.querySelector(
    ".login-footer a[href='#']"
);

forgotPassword.addEventListener("click", function (event) {

    event.preventDefault();

    alert("Please contact the administrator to reset your password.");

});


// 5. CONSOLE MESSAGE

console.log("VRAFM Login Page JavaScript Loaded!");
