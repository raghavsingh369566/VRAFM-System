# 🚗 Vehicle Rental & Fleet Management System

<p align="center">
  <strong>A Modern, Responsive Vehicle Rental & Fleet Management Platform UI</strong>
</p>

<p align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![BEM](https://img.shields.io/badge/CSS-BEM-4CAF50?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Design-8A2BE2?style=for-the-badge)
![4 Member Team](https://img.shields.io/badge/Team-4%20Members-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-UI%20Prototype-green?style=for-the-badge)

</p>

---

## 📌 Executive Overview

**VRAFM (Vehicle Rental & Fleet Management System)** is a frontend-based
web application UI designed to organize vehicle rental operations and
fleet management through a centralized and responsive interface.

The system provides separate interfaces for **customers and
administrators**, allowing the project to demonstrate the complete
visual workflow of a modern vehicle rental platform.

Built strictly with **HTML5 and CSS3**, the project focuses on semantic
HTML structure, responsive layouts, CSS Flexbox, CSS Grid, reusable
components, CSS custom properties, and a modular styling architecture.

The current version is a **frontend UI prototype** and does not include
JavaScript, backend services, database connectivity, authentication, or
online payment processing.

---

# 🚘 Vehicle & Fleet Coverage

VRAFM is designed to provide a unified interface for managing
different types of rental vehicles.

The vehicle categories represented in the UI may include:

- 🚗 **Cars:** Sedan, Hatchback, SUV, Luxury Cars.
- 🏍️ **Bikes:** Standard Bikes, Sports Bikes, Scooters.
- 🚐 **Vans:** Passenger Vans and Utility Vans.
- 🚙 **Premium Vehicles:** Luxury and High-End Rental Vehicles.
- 🚚 **Commercial Vehicles:** Utility and Transport Vehicles.

The interface is designed so that vehicle information such as
category, specifications, rental price and status can be displayed
in a structured format.

---

# 🚀 Key Functional Modules

| Module | Icon | Description | Owner |
|--------|------|-------------|-------|
| **Home & Vehicle Listing** | 🏠 | Landing page, navigation, vehicle categories, vehicle cards and vehicle browsing interface. | Dev 1 |
| **Vehicle Details & Booking** | 🚗 | Vehicle specifications, rental information, booking form and booking confirmation UI. | Dev 2 |
| **Admin Dashboard & Management** | 📊 | Dashboard overview, vehicle records, booking records and customer management interface. | Dev 3 |
| **Maintenance & Fleet Status** | 🛠️ | Maintenance records, service information, vehicle status and responsive integration. | Dev 4 |

---

# 👤 Customer Interface

The customer-facing portion of VRAFM provides a structured interface
for users who want to explore and rent vehicles.

### Customer Modules


Customer Interface
│
├── Home
│
├── Vehicle Listing
│
├── Vehicle Details
│
└── Booking


---

# 📂 Repository File Structure

VRAFM-System/
├── index.html                              # Home Page (Dev 1)
├── IMPLEMENTATION_PLAN.md                  # Detailed 4-Member Development Plan
├── README.md                               # Master Project Documentation
│
├── pages/
│   ├── vehicles.html                       # Vehicle Listing (Dev 1)
│   ├── vehicle-details.html                # Vehicle Details (Dev 2)
│   ├── booking.html                        # Booking Interface (Dev 2)
│   ├── booking-confirmation.html           # Booking Confirmation (Dev 2)
│   ├── admin.html                           # Admin Dashboard (Dev 3)
│   ├── customers.html                       # Customer Management (Dev 3)
│   └── maintenance.html                     # Maintenance & Fleet Status (Dev 4)
│
├── assets/
│   ├── images/
│   │   ├── logo/                            # Project Logo
│   │   ├── vehicles/                        # Vehicle Images
│   │   ├── cars/                            # Car Images
│   │   └── bikes/                           # Bike Images
│   │
│   └── icons/                               # UI Icons
│
└── css/
    ├── main.css                             # Master CSS Aggregator
    │
    ├── tokens/
    │   └── variables.css                    # CSS Custom Properties & Design Tokens
    │
    ├── base/
    │   ├── reset.css                        # CSS Reset & Normalization
    │   └── layout.css                       # Global Layout Structure
    │
    ├── components/
    │   ├── buttons.css                      # Button Variants & Hover States
    │   ├── cards.css                        # Vehicle & Dashboard Cards
    │   ├── forms.css                        # Forms & Input Components
    │   ├── tables.css                       # Admin Data Tables
    │   ├── badges.css                       # Status & Category Badges
    │   └── navbar.css                       # Navigation Component
    │
    └── pages/
        ├── home.css                         # Scoped Home Page Styles
        ├── vehicles.css                     # Scoped Vehicle Listing Styles
        ├── vehicle-details.css              # Scoped Vehicle Details Styles
        ├── booking.css                      # Scoped Booking Page Styles
        ├── admin.css                        # Scoped Admin Dashboard Styles
        ├── customers.css                    # Scoped Customer Page Styles
        └── maintenance.css                  # Scoped Maintenance Page Styles

---
## 👥 Team Member Task Distribution

The project is divided among four team members. Each member is responsible for specific HTML pages, CSS components, and page-level styling.

| Team Member | Role | Module | Main Responsibilities | Branch |
|---|---|---|---|---|
| **Raghav Singh** | Dev 1 | 🏠 Home & Vehicle Listing | Homepage, navigation, vehicle listing, vehicle cards, responsive layout | `feature/Raghav` |
| **Rishabh Varshney** | Dev 2 | 🚗 Vehicle Details & Booking | Vehicle details, booking form, confirmation page, form styling | `feature/Rishabh` |
| **Riya** | Dev 3 | 🛠️ Admin & Customer Management | Admin dashboard, customer management, tables, status badges | `feature/riya` |
| **Rishi** | Dev 4 | 🔧 Maintenance & Fleet Status | Maintenance page, fleet status, reusable cards, responsive testing | `feature/rishi` |

---

#🚗 VRAFM-System

Vehicle Rental & Fleet Management System

Built with HTML5 & CSS3 by a 4-member development team.

Made with ❤️ by the VRAFM Engineering Team
