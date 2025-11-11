# Lottery Management Web Application

A full-stack web application for managing and participating in a **lottery** event, built with **Angular 18**, **PrimeNG**, and **C# / .NET Core 8**. The system provides comprehensive management of gifts, donors, buyers, and lottery draws.

---

## Key Features

- **Gift Management:** Add, edit, delete gifts with unique identifiers and validation.  
- **Donor Management:** Full CRUD operations and tracking of donated gifts.  
- **Buyer Management:** Manage purchased gifts and quantities.  
- **Lottery System:** Random winner selection for each gift.  
- **Navigation:** Intuitive routing between Home, Gifts, Donors, Purchase, Payment, and Lottery pages.  
- **Professional UI:** Responsive and visually consistent interface using PrimeNG components and **Reactive Forms** for dynamic form handling.

---

## Technologies

- **Frontend:** Angular 18, PrimeNG, Reactive Forms, TypeScript, RxJS, Angular Router, CSS  
- **Backend:** C# / .NET Core 8 Web API, RESTful
- **Data Storage:** In-memory lists (no database required)  
- **Architecture:** Layered design with Controllers, Services, Repositories, DTOs, and Entities  
- **Error Handling:** Centralized middleware with logging and validation  

---

## Architecture & Best Practices

- **Separation of Concerns:** Clear distinction between Controllers, Services, and Repositories.  
- **Reactive Frontend:** Angular services, Observables, and Reactive Forms for asynchronous data handling and dynamic forms.  
- **Scalability:** Async operations in backend Web API for handling multiple concurrent requests.  
- **Clean Code:** Modular components, strong typing, and organized folder structure.  
- **Validation & Integrity:** Unique constraints, mandatory fields, default values, and proper error handling.  

---
