# VRAFM Team Implementation Plan (Next Steps)

This plan outlines the next development phases for the rest of the team (Dev 2, Dev 3, Dev 4), building upon the core frontend architecture and Bootstrap framework established by Dev 1 (Raghav).

## Core Architecture Guidelines

All subsequent developers must build on top of the established foundation:
- Use **Bootstrap 5.3** for layout (containers, rows, cols, and responsive utilities).
- Do **not** use JavaScript. All logic (like theming) must be handled through CSS.
- Maintain the **Pure CSS Theme Toggle** by ensuring all new HTML files include the `<input type="checkbox" id="theme-toggle">` at the very top of the `<body>`.
- Use the CSS variables defined in `css/tokens/variables.css` (e.g., `var(--bg-primary)`, `var(--card-bg)`) to ensure new pages automatically support Light and Dark mode seamlessly.
- Maintain consistent navigation: The login page is the entry point, and once logged in, users should see a "Logout" button instead of "Login" in the navigation bar.

---

## Dev 2: Rishabh (Vehicle Details & Booking)
**Focus:** Creating the user flow for examining a vehicle and completing a booking.

### Required Pages
* **`pages/vehicle-details.html`**: A comprehensive page showing a large image of the selected vehicle, specifications (engine, seats, fuel type), pricing, and a prominent "Book Now" call to action.
* **`pages/booking.html`**: A Bootstrap-powered form for customers to enter rental dates, personal information, and payment method details (frontend only - use HTML5 validation).
* **`pages/booking-confirmation.html`**: A success page with a mock booking reference number and summary of the vehicle rented.

### Required CSS
* Create `css/pages/vehicle-details.css`.
* Create `css/pages/booking.css`.

---

## Dev 3: Riya (Admin & Customer Management)
**Focus:** Building the administrator interface to manage the platform.

### Required Pages
* **`pages/admin.html`**: A dashboard featuring summary cards (Total Vehicles, Active Bookings, Revenue, New Customers) using Bootstrap Grids and Cards.
* **`pages/customers.html`**: A data table (using Bootstrap's `.table` classes) listing registered customers with Action buttons (Edit/Delete icons).

### Required CSS
* Create `css/pages/admin.css`.
* Create `css/pages/customers.css`.
* Create reusable `css/components/tables.css` and `css/components/badges.css` for consistent data representation.

---

## Dev 4: Rishi (Maintenance & Fleet Status)
**Focus:** Managing vehicle health and availability.

### Required Pages
* **`pages/maintenance.html`**: An interface showing a list of vehicles currently in maintenance, repair, or awaiting inspection. Include status badges (e.g., "In Service", "Available", "Needs Inspection") to visually indicate health.

### Required CSS
* Create `css/pages/maintenance.css` leveraging the existing components created by Dev 3 (`badges.css` and `tables.css`) to ensure consistency across the admin panels.

---
**Note to the Team:** Please ensure you test your pages at mobile, tablet, and desktop breakpoints before submitting your code!
