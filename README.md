# Billora

> A modern web-based invoice management system for creating and managing professional invoices, customers, and business information.

## Overview

Billora is a full-stack invoice management application designed to simplify the process of managing business information, customers, and invoices from a single web application.

The system provides user authentication, business profile management, customer management, and invoice management through a responsive web interface.

---

## Features

### Authentication
- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected application features

### Business Management
- Create business profile
- Update business information
- Manage business details used for invoices

### Customer Management
- Add customers
- View customers
- Update customer information
- Delete customers

### Invoice Management
- Create invoices
- View invoices
- Update invoices
- Delete invoices
- Manage invoice and customer relationships

### Backend API
- RESTful API architecture
- PostgreSQL database
- Express.js backend
- Error handling
- CORS support

---

## Tech Stack

### Frontend

- React
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- PostgreSQL
- `pg`
- JWT
- bcryptjs
- CORS
- dotenv

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL

---

## System Architecture

```text
┌─────────────────────┐
│      React UI       │
│      Frontend       │
└──────────┬──────────┘
           │
           │ HTTP / REST API
           ▼
┌─────────────────────┐
│     Express.js      │
│      Backend        │
└──────────┬──────────┘
           │
           │ SQL
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│      Database       │
└─────────────────────┘
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
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   └── authController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── businessRoutes.js
│   │   ├── customerRoutes.js
│   │   └── invoiceRoutes.js
│   │
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Database

Billora uses PostgreSQL as its relational database.

The application stores information related to:

- Users
- Businesses
- Customers
- Invoices

Relationships between these entities allow the application to manage invoice data efficiently.

---

## Authentication

Billora uses JWT-based authentication.

### Registration Flow

```text
User
  │
  ▼
Register
  │
  ▼
Validate Input
  │
  ▼
Hash Password
  │
  ▼
Store User in PostgreSQL
  │
  ▼
Registration Successful
```

### Login Flow

```text
User
  │
  ▼
Login
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
Authenticated Session
```

Passwords are never stored as plain text. They are hashed using `bcryptjs`.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

### Customers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/customers` | Get customers |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

### Business

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/business` | Get business information |
| POST | `/api/business` | Create business |
| PUT | `/api/business/:id` | Update business |

### Invoices

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/invoices` | Get invoices |
| POST | `/api/invoices` | Create invoice |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |

---

## Environment Variables

The backend requires the following environment variables:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Important

Never commit `.env` files or database credentials to GitHub.

Add the following to `.gitignore`:

```gitignore
node_modules/
.env
.env.local
dist/
build/
```

For production deployment, configure environment variables directly in Render and Vercel.

---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/shreevarshan918/BILLORA.git
```

```bash
cd BILLORA
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` folder:

```text
server/.env
```

Add:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=5000
```

### 4. Start the Backend

```bash
node server.js
```

The backend will run at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 5. Start the Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

## Production Deployment

Billora uses the following deployment architecture:

```text
┌──────────────────┐
│   React Frontend │
└────────┬─────────┘
         │
         ▼
      Vercel
         │
         │ API Requests
         ▼
┌──────────────────┐
│ Express Backend  │
└────────┬─────────┘
         │
         ▼
       Render
         │
         ▼
┌──────────────────┐
│    PostgreSQL    │
└──────────────────┘
```

### Backend

Production API:

https://billora-api-jq5a.onrender.com

### Health Check

https://billora-api-jq5a.onrender.com/api/health

---

## Security

The application follows basic security practices including:

- Password hashing with bcrypt
- JWT authentication
- Environment variables for secrets
- Parameterized PostgreSQL queries
- CORS configuration
- `.env` excluded from version control

Parameterized queries are used to reduce the risk of SQL injection.

Example:

```javascript
pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
);
```

---

## Future Improvements

Potential improvements include:

- PDF invoice generation
- Invoice download
- Email invoice delivery
- Payment tracking
- Invoice status management
- Dashboard analytics
- Search and filtering
- Business logo upload
- Improved responsive design
- Invoice templates
- Automated invoice numbering

---

## Project Status

**Status: Completed**

The core application functionality is implemented and deployed.

### Completed

- User registration
- User login
- JWT authentication
- Business management
- Customer management
- Invoice management
- PostgreSQL integration
- REST API
- Frontend deployment
- Backend deployment
- Production environment configuration

---

## Author

**Shreevarshan Y J **

GitHub:

https://github.com/shreevarshan918

---

## License

This project is intended for educational and project-development purposes.
