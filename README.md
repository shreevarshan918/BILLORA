# Billora

> A full-stack SaaS invoicing platform for small businesses to manage businesses, customers, invoices, and payments from one place.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](YOUR_VERCEL_URL)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?logo=render)](https://billora-api-jq5a.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/shreevarshan918/BILLORA)

---

## Overview

Billora is a full-stack web application designed to simplify invoice management for small businesses.

It provides authenticated users with a centralized system to manage their business information, customers, invoices, and invoice statuses through a responsive web interface.

The application uses a React frontend, an Express.js REST API, and PostgreSQL for persistent data storage.

---

## Live Application

**Frontend:** [Billora on Vercel](https://billora-coral.vercel.app/)

**Backend API:** [Billora API on Render](https://billora-api-jq5a.onrender.com)

**API Health Check:** [Health Check](https://billora-api-jq5a.onrender.com/api/health)

---

## Features

### Authentication

* User registration
* User login
* Password hashing with bcrypt
* JWT-based authentication
* Protected API routes
* Persistent authenticated sessions

### Business Management

* Create business profile
* Update business information
* Store business contact details
* Manage business information used on invoices

### Customer Management

* Add customers
* View customers
* Update customer information
* Delete customers
* Associate customers with invoices

### Invoice Management

* Create invoices
* View invoice history
* Update invoices
* Delete invoices
* Associate invoices with customers
* Track invoice status
* View invoice details
* Print invoices
* Save invoices as PDF through the browser print interface

### Dashboard

* Invoice overview
* Revenue information
* Payment/status information
* Business activity summary

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* PostgreSQL
* `pg`
* JWT
* `bcryptjs`
* CORS
* dotenv

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** PostgreSQL

---

## System Architecture

```text
┌─────────────────────────┐
│       React + Vite      │
│        Frontend         │
└────────────┬────────────┘
             │
             │ HTTPS / REST API
             ▼
┌─────────────────────────┐
│      Node.js +          │
│      Express.js         │
│        Backend          │
└────────────┬────────────┘
             │
             │ SQL
             ▼
┌─────────────────────────┐
│       PostgreSQL        │
│        Database         │
└─────────────────────────┘

       Deployment

React Frontend → Vercel
Express API   → Render
PostgreSQL    → Cloud Database
```

---

## Project Structure

```text
BILLORA/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── ...
```

---

## Database

Billora uses PostgreSQL as its relational database.

The application manages data related to:

* Users
* Businesses
* Customers
* Invoices
* Invoice items

The database relationships allow users to associate businesses with their customers and invoices while maintaining structured relational data.

---

## Authentication Flow

### Registration

```text
User
  │
  ▼
Registration Form
  │
  ▼
Validate Input
  │
  ▼
Hash Password
  │
  ▼
Store User
  │
  ▼
Registration Complete
```

### Login

```text
User
  │
  ▼
Login Form
  │
  ▼
Find User
  │
  ▼
Verify Password
  │
  ▼
Generate JWT
  │
  ▼
Authenticated Application
```

Passwords are hashed using `bcryptjs` and are not stored as plain text.

---

## REST API

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Authenticate a user |

### Customers

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/customers`     | Get customers     |
| POST   | `/api/customers`     | Create a customer |
| PUT    | `/api/customers/:id` | Update a customer |
| DELETE | `/api/customers/:id` | Delete a customer |

### Business

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| GET    | `/api/business`     | Get business information    |
| POST   | `/api/business`     | Create business information |
| PUT    | `/api/business/:id` | Update business information |

### Invoices

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| GET    | `/api/invoices`            | Get invoices          |
| POST   | `/api/invoices`            | Create an invoice     |
| PUT    | `/api/invoices/:id`        | Update an invoice     |
| PATCH  | `/api/invoices/:id/status` | Update invoice status |
| DELETE | `/api/invoices/:id`        | Delete an invoice     |

> API endpoints may evolve as the application is developed.

---

## Security

Billora implements several basic application security practices:

* JWT-based authentication
* Password hashing using `bcryptjs`
* Protected API routes
* Environment variables for sensitive configuration
* Parameterized PostgreSQL queries
* CORS configuration
* `.env` excluded from version control

Example of a parameterized query:

```javascript
pool.query(
  "SELECT id FROM users WHERE email = $1",
  [email]
);
```

Parameterized queries help reduce the risk of SQL injection.

---

## Environment Variables

The backend uses environment variables for sensitive configuration.

Example:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
PORT=5000
```

The `.env` file must **never** be committed to GitHub.

Production environment variables are configured through the deployment platform.

---

## Local Development

### Prerequisites

* Node.js
* npm
* PostgreSQL
* Git

### 1. Clone the repository

```bash
git clone https://github.com/shreevarshan918/BILLORA.git
cd BILLORA
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure backend environment variables

Create:

```text
server/.env
```

Add:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Start the backend

```bash
npm run dev
```

The backend will normally run at:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

## Production Deployment

Billora is deployed using a separated frontend/backend architecture.

```text
                ┌─────────────────┐
                │  React Frontend │
                └────────┬────────┘
                         │
                         ▼
                      Vercel
                         │
                         │ HTTPS API Requests
                         ▼
                ┌─────────────────┐
                │ Express Backend │
                └────────┬────────┘
                         │
                         ▼
                      Render
                         │
                         ▼
                    PostgreSQL
```

### Frontend

Deployed on **Vercel**.

### Backend

Deployed on **Render**:

https://billora-api-jq5a.onrender.com

### Database

PostgreSQL is used for persistent application data.

---

## Screenshots

Screenshots of the application can be added here to demonstrate the production UI.

Recommended screenshots:

* Dashboard
* Customer management
* Invoice creation
* Invoice list
* Invoice details

Example:

```markdown
![Billora Dashboard](screenshots/dashboard.png)
```

---

## Future Improvements

Potential future improvements include:

* Automated email invoice delivery
* Online payment integration
* Advanced dashboard analytics
* Invoice search and filtering
* Business logo upload
* Multiple invoice templates
* Recurring invoices
* Improved notification system
* Automated invoice reminders
* Enhanced mobile responsiveness

---

## Project Status

**Production MVP — Deployed**

The core Billora application is implemented and deployed with:

* User authentication
* Business management
* Customer management
* Invoice management
* Invoice status tracking
* PostgreSQL integration
* REST API
* React frontend
* Cloud deployment

The project can be extended with additional SaaS features as development continues.

---

## Author

**Shreevarshan Y J**

GitHub:
https://github.com/shreevarshan918

---

## License

This project is intended for educational, portfolio, and project-development purposes.
