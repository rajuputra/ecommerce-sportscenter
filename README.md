# 🏆 SportsCenter: Elite E-Commerce Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Material UI](https://img.shields.io/badge/MUI-5.18.0-007FFF.svg)](https://mui.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1.svg)](https://www.mysql.com/)

**SportsCenter** is a premium, high-performance e-commerce application designed for professional athletes and sports enthusiasts. Built with a robust **Java Spring Boot** backend and a sleek, responsive **React** frontend, this project demonstrates industry-standard practices in full-stack development, security, and UI/UX design.

---

## 📸 Project Showcases

<details open>
<summary><b>Click to toggle visibility of screenshots</b></summary>

### 🏠 Home Page (Premium Hero Section)
| Light Mode | Dark Mode |
|------------|-----------|
| ![Home Light](screenshots/home%20light%20mode.png) | ![Home Dark](screenshots/darkmode%20home%20page.png) |

### 🛒 Product Catalog (Store)
| Light Mode | Dark Mode |
|------------|-----------|
| ![Store Light](screenshots/store%20light%20mode.png) | ![Store Dark](screenshots/store%20dark%20mode.png) |

### 📞 Contact Page
| Light Mode | Dark Mode |
|------------|-----------|
| ![Contact Light](screenshots/contact%20light%20mode.png) | ![Contact Dark](screenshots/contact%20dark%20mode.png) |

---

### 🛍️ Shopping Experience
| Premium Product Card | Interactive Shopping Cart |
|----------------------|--------------------------|
| ![Product Card](screenshots/product%20card.png) | ![Shopping Cart](screenshots/shopping%20card.png) |

---

### 💳 Checkout & Order Flow
| 🔑 Secure Login | 📦 Shipping Details |
|-----------------|---------------------|
| ![Login](screenshots/login%20page.png) | ![Checkout](screenshots/checkout%20page.png) |

| 📝 Order Review | 💳 Secure Payment |
|-----------------|-------------------|
| ![Review](screenshots/review%20order%20page.png) | ![Payment](screenshots/payment%20page.png) |

| 📋 Order History | ✅ Success Confirmation |
|------------------|-------------------------|
| ![Orders](screenshots/myorder%20page.png) | ![Success](screenshots/after%20order.png) |

</details>

---

## 🚀 Key Features

### 💻 Frontend (React + TypeScript)
- **Premium UI/UX**: Built with Material UI (MUI) following modern design principles (Glassmorphism, Dark Mode, Micro-animations).
- **State Management**: Fully powered by **Redux Toolkit** for predictable state changes and efficient basket handling.
- **Dynamic Catalog**: Real-time filtering, sorting, and pagination for thousands of products.
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop devices.
- **Form Handling**: Complex validation using **React Hook Form** and **Yup**.
- **Secure Routing**: Protected routes for checkout and order history using React Router.

### ⚙️ Backend (Spring Boot + Java)
- **RESTful API**: Clean and scalable API architecture following SOLID principles.
- **Security**: Robust authentication and authorization using **Spring Security** and **JWT (JSON Web Tokens)**.
- **Data Persistence**: **Spring Data JPA** with **MySQL** for reliable data storage.
- **Caching**: Integrated **Redis** for high-performance session and basket management.
- **API Documentation**: Automated documentation with **SpringDoc OpenAPI (Swagger)**.
- **Mapping**: Optimized DTO mapping using **MapStruct**.
- **Clean Code**: Leveraging **Lombok** to reduce boilerplate and improve readability.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Material UI (MUI) 5
- **State**: Redux Toolkit
- **Routing**: React Router 7
- **Networking**: Axios

### Backend
- **Language**: Java 25
- **Framework**: Spring Boot 4.0.6
- **Security**: Spring Security + JWT
- **Database**: MySQL 8
- **Cache**: Redis
- **Documentation**: Swagger UI / OpenAPI 3

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Java JDK** (v25+)
- **MySQL**
- **Redis**

### Setup Backend
1. Configure your MySQL database in `src/main/resources/application.yaml`.
2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Setup Frontend
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## 👨‍💻 Author
**Raju Putra** - *Full Stack Developer*
[GitHub](https://github.com/rajuputra) | [LinkedIn](YOUR_LINKEDIN_URL)

---
*Developed with passion for the sports community.*
