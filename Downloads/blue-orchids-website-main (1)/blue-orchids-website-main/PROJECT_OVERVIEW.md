# Blue Orchids – Project Overview 🌸

This document provides a comprehensive overview of the **Blue Orchids** salon booking system, its current features, the technology used, and how it was implemented.

---

## 1. Description: What is it?
**Blue Orchids** is a premium web application developed for a women’s beauty sanctuary located in Magarpatta City, Pune. The platform serves as a bridge between the salon and its customers, providing a seamless way to browse services, view offers, and book appointments with real-time payment integration.

The system is designed with a "mobile-first" approach, ensuring a premium experience on smartphones while maintaining a luxurious aesthetic on desktop.

---

## 2. Key Features

### ✨ Premium User Experience
- **Luxury Aesthetic**: The site uses a sophisticated "Blue & Gold" theme with a dark navy background (`#0a1428`) and champagne gold accents (`#c9a96e`), reflecting the salon's premium brand identity.
- **Orchid Preloader**: A custom-designed loading animation featuring spinning flower petals and an animated progress bar to keep users engaged during initial page loads (enforced 2-second minimum duration for brand awareness).
- **Responsive Design**: Fluid layouts that adapt perfectly to devices ranging from large monitors to small phone screens.

### 📅 Advanced Booking System
- **Cross-Page Booking**: Users can book from the quick-action modal on the home page or from the dedicated booking form on the contact page.
- **Intelligent Validation**: Real-time checking of phone numbers (+91 format), email addresses, and guest counts.
- **Dynamic Scheduling**: Integrated date and time pickers to ensure valid appointment scheduling.

### 💳 Payment Integration (Google Pay)
- **Seamless Checkout**: Integrated the **Google Pay JS API** to allow users to pay the booking fee (flat ₹10.00) directly through the site.
- **Payment Success Flow**:
  - **Confetti Animation**: High-performance canvas-based confetti celebrates every successful booking.
  - **Animated Status Popup**: A modern success dialog that provides instant feedback.
- **Secure Processing**: Supports both **UPI** and **Card** payments with simulated fallbacks for non-GPay environments.

### 🔒 Admin Dashboard
- **Real-Time Statistics**: Tracks Total Bookings, Pending Requests, Confirmed Appointments, and **Paid** status at a glance.
- **Management Controls**: Admins can change booking status (Confirm/Cancel), delete specific records, or search the entire sheet.
- **Security Features**:
  - **Admin Login**: Password-protected access (`admin123`) from a subtle entry point in the website footer.
  - **Bulk Deletion**: A "Delete All" feature (also password-protected) to easily clear the booking records.

---

## 3. Technology Stack

### Frontend
- **HTML5**: Semantic structure for SEO and accessibility.
- **CSS3 (Vanilla)**: Custom styling used exclusively to avoid generic frameworks. Features CSS variables for a consistent design system, glassmorphism effects, and smooth transitions.
- **JavaScript (ES6+)**: Powers all interactive elements, modal logic, and API calls.
- **Canvas API**: Used for the high-performance confetti effect.
- **Google Pay API**: Handles the payment lifecycle.

### Backend
- **Node.js + Express.js**: High-performance server environment.
- **Sequelize ORM**: Object-Relational Mapping for robust communication with the database.
- **MySQL**: Relational database chosen for its reliability and consistency in storing sensitive booking data.
- **Express-Validator**: Middleware to ensure all incoming data is sanitized and valid.

### Testing & Quality Assurance
- **Jest**: Unit and integration testing for the API and database models.
- **Supertest**: Simulates HTTP requests for verifying API endpoints.

---

## 4. How it was Made (The Process)

1.  **Requirement Analysis**: Identified the core needs of the salon (booking, payments, and an easy-to-use admin panel).
2.  **Logic & Database Design**: Designed a MySQL schema to track everything from customer info to payment status.
3.  **Core Development**: Built the Node.js server and primary API routes first to ensure a functional foundation.
4.  **UI/UX Implementation**: Developed the HTML/CSS with a focus on high-end aesthetics, using gradients and premium typography (Playfair Display & Inter).
5.  **Payment Integration**: Added complex lifecycle management for Google Pay, ensuring the backend is updated only after a successful payment signal.
6.  **Interactive Polish**: Added secondary visual effects like the confetti and the orchid-petal preloader to differentiate the brand.
7.  **Security Hardening**: Implemented password protection for sensitive admin actions to prevent accidental or unauthorized data manipulation.

---

© 2026 Blue Orchids – The Beauty Hub. All rights reserved.
