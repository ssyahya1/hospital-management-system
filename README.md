# Hospital Management System

A full-stack Hospital Management System built to manage patients, doctors, appointments, users, and transactions through a secure web application.

I built this project as a practical full-stack application to understand how a real-world system works across the frontend, backend, database, authentication, authorization, and deployment.

The application is deployed and can be accessed through the production frontend.

---

## Overview

The system is divided into two main parts:

* **Frontend** — A React application that provides the user interface for patients, doctors, and administrators.
* **Backend** — A Node.js and Express REST API that handles authentication, authorization, validation, business logic, and database operations.

PostgreSQL is used as the database. The application uses JWT authentication, API-key protection, role-based authorization, password hashing, input validation, and ownership checks to protect resources.

The frontend communicates with the backend through REST API requests.

---

## Features

### User Management

* Create patient, doctor, and administrator accounts
* User login and authentication
* Password hashing using bcrypt
* JWT-based authentication
* Password reset through email
* Retrieve the currently authenticated user's profile
* Edit user information
* Change user roles
* Activate and deactivate user accounts
* Prevent deactivated users from accessing protected resources
* Validate duplicate email addresses

### Patient Management

* Create patient profiles
* Store date of birth and blood group
* Retrieve patient information
* Allow patients to access their own profile
* Allow authorized doctors and administrators to access patient information
* Restrict patient information using role-based authorization
* Validate patient information before storing it
* Automatically create the patient record when a patient user is created

### Appointment Management

* Create appointments
* View appointments
* View a patient's own appointments
* View individual appointments
* Update appointment date and time
* Update appointment status
* Cancel appointments
* Prevent appointments from being created in the past
* Prevent appointments from being updated to the past
* Prevent doctors from having duplicate appointments at the same date and time
* Restrict doctors to their own appointments
* Prevent patients from viewing other patients' appointments
* Control appointment updates using role-based authorization

### Transaction Management

* Create patient transactions
* View transactions for authorized users
* Allow patients to view their own transactions
* View individual transactions
* Update transaction status
* Validate transaction information
* Prevent updates to transactions that are no longer pending
* Restrict transaction management to authorized roles

### Authentication and Security

* JWT authentication
* Password hashing with bcrypt
* API-key protection
* Role-based authorization
* Patient ownership checks
* Doctor ownership checks
* Input validation
* Protected routes
* Environment variables for sensitive configuration
* Parameterized PostgreSQL queries
* Centralized error handling
* Deactivated account protection
* Secure password reset flow using email

---

## User Roles

The application currently supports three main roles.

| Role        | Main Access                                               |
| ----------- | --------------------------------------------------------- |
| **Patient** | Own profile, appointments, and transactions               |
| **Doctor**  | Appointment management and authorized patient information |
| **Admin**   | User, patient, appointment, and transaction management    |

Access to protected resources is controlled using authentication and role-based authorization.

---

## Technologies Used

### Backend

* **Node.js** — JavaScript runtime
* **Express.js** — REST API framework
* **PostgreSQL** — Relational database
* **pg** — PostgreSQL client for Node.js
* **bcrypt** — Password hashing
* **jsonwebtoken** — JWT authentication
* **dotenv** — Environment variable management
* **Resend** — Password reset email delivery

### Frontend

* **React** — Frontend library
* **Vite** — Frontend development and build tool
* **JavaScript** — Application logic
* **HTML** — Page structure
* **CSS** — Styling

### Deployment

* **Vercel** — Frontend and backend deployment
* **Neon** — PostgreSQL database

---

## System Architecture

The application follows a simple three-layer architecture:

```text
┌─────────────────────────┐
│        Frontend         │
│       React + Vite      │
└────────────┬────────────┘
             │
             │ HTTP / REST API
             ▼
┌─────────────────────────┐
│         Backend         │
│    Node.js + Express    │
└────────────┬────────────┘
             │
             │ SQL Queries
             ▼
┌─────────────────────────┐
│        Database         │
│       PostgreSQL        │
└─────────────────────────┘
```

### How the application works

1. A user interacts with the React frontend.
2. The frontend sends an HTTP request to the Express backend.
3. Authentication middleware verifies the user's JWT.
4. The backend checks the user's current account status.
5. Role-based middleware determines whether the user has permission to access the resource.
6. Validation middleware checks incoming data.
7. Controllers handle the application logic.
8. The backend communicates with PostgreSQL.
9. PostgreSQL returns the requested data.
10. The backend sends a JSON response back to the frontend.
11. The frontend updates the user interface based on the response.

This separation keeps the frontend, backend logic, and database operations organized and easier to maintain.

---

## Project Structure

```text
Hospital-Backend/
│
├── controllers/
│   ├── usercontroller.js
│   ├── patientController.js
│   ├── appointmentController.js
│   └── transactionController.js
│
├── db/
│   └── db.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── apiKeyMiddleware.js
│   ├── validatePatient.js
│   ├── validateAppointment.js
│   ├── validateAppointmentUpdate.js
│   ├── validateTransaction.js
│   ├── validateTransactionUpdate.js
│   └── errorHandler.js
│
├── routes/
│   ├── userRoutes.js
│   ├── patientRoutes.js
│   ├── appointmentRoutes.js
│   └── transactionRoute.js
│
├── hospital-management/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .env
├── package.json
├── server.js
└── README.md
```

---

# Backend

The backend is responsible for:

* REST API endpoints
* Authentication
* Authorization
* Input validation
* Business logic
* Database communication
* Password reset
* Error handling
* Security

The backend runs locally on:

```text
http://localhost:3000
```

The backend is also deployed to Vercel for production use.

---

# Authentication

The application uses JSON Web Tokens (JWT) for authentication.

When a user successfully logs in, the backend generates a JWT containing the authenticated user's ID and role.

Protected endpoints require the token in the request header:

```text
Authorization: Bearer <token>
```

The authentication middleware verifies the token and then checks the user's current status in the database.

If the token is invalid or expired, the API returns:

```text
401 Unauthorized
```

If the user's account has been deactivated, the API returns:

```text
403 Forbidden
```

This means that deactivating an already logged-in user also prevents them from continuing to access protected resources.

---

# Password Reset

The application includes a password recovery system.

The flow works as follows:

1. The user requests a password reset.
2. The backend generates a secure reset token.
3. The token is stored with an expiration time.
4. An email containing the reset link is sent using Resend.
5. The user opens the reset link.
6. The new password is validated and securely hashed.
7. The password is updated in the database.
8. The reset token is cleared.

Password reset tokens are temporary and expire after the configured period.

---

# Role-Based Authorization

After authentication, the user's role is checked before accessing protected resources.

The application currently supports:

```text
Patient → Own profile, appointments, and transactions

Doctor  → Appointment management and authorized patient information

Admin   → User, patient, appointment, and transaction management
```

If an authenticated user does not have permission to access a resource, the API returns:

```text
403 Forbidden
```

Ownership checks are also used where necessary. For example, a patient cannot request another patient's private appointments or transactions.

---

# API Key Protection

Protected API routes can also require an API key.

The key is sent through the request header:

```text
x-api-key: <your-api-key>
```

The API key is stored in environment variables and is not hard-coded into the application.

Requests without a valid API key are rejected by the API-key middleware.

---

# API Endpoints

## Users

### Create User

```http
POST /api/users
```

Creates a new user.

Supported roles:

```text
patient
doctor
admin
```

When a patient is created, the patient's date of birth and blood group are also stored in the patient table.

Example:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "date_of_birth": "2001-08-20",
  "blood_group": "O+"
}
```

---

### Login

```http
POST /api/users/login
```

Authenticates a user and returns a JWT token.

Example:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Deactivated accounts cannot log in.

---

### Get My Profile

```http
GET /api/users/me
```

Returns the profile of the currently authenticated user.

Requires:

```text
Authorization: Bearer <token>
```

---

### Update User

```http
PUT /api/users/:id
```

Updates user information such as name, email, and role.

Role changes are handled so that patient records remain consistent with the user's role.

---

### Deactivate User

```http
PATCH /api/users/:id/deactivate
```

Deactivates a user account.

A deactivated user cannot log in and cannot continue accessing protected resources using an existing session.

---

### Reactivate User

```http
PATCH /api/users/:id/reactivate
```

Reactivates a previously deactivated user account.

---

# Patient API

### Get Patients

```http
GET /api/patients
```

Returns patient information.

**Allowed roles:**

* Doctor
* Admin

---

### Get My Patient Profile

```http
GET /api/patients/me
```

Returns the authenticated patient's own profile.

**Allowed role:**

* Patient

---

### Create Patient Profile

```http
POST /api/patients
```

Creates a patient profile.

**Allowed roles:**

* Doctor
* Admin

Example:

```json
{
  "user_id": 3,
  "date_of_birth": "2001-08-20",
  "blood_group": "O+"
}
```

Patient profiles require a date of birth. Blood group is optional.

---

# Appointment API

### Create Appointment

```http
POST /api/appointments
```

Creates an appointment for a patient.

**Allowed roles:**

* Doctor
* Admin

The doctor is determined from the authenticated user's identity instead of trusting a `doctor_id` supplied by the client.

Example:

```json
{
  "patient_id": 14,
  "appointment_date": "2026-09-12",
  "appointment_time": "15:00"
}
```

The API prevents appointments from being created in the past and prevents a doctor from having multiple appointments at the same date and time.

---

### Get Appointments

```http
GET /api/appointments
```

Returns appointments available to the authenticated user's role.

Doctors can view their own appointments, while administrators can access the appointment list.

---

### Get My Appointments

```http
GET /api/appointments/me
```

Returns appointments belonging to the authenticated patient.

**Allowed role:**

* Patient

---

### Get Appointment by ID

```http
GET /api/appointments/:id
```

Returns a specific appointment.

Patients can only access their own appointments.

Doctors can only access appointments assigned to them.

---

### Update Appointment

```http
PATCH /api/appointments/:id
```

Updates an appointment.

**Allowed roles:**

* Doctor
* Admin

Example:

```json
{
  "appointment_date": "2026-09-15",
  "appointment_time": "16:00",
  "status": "completed"
}
```

Valid statuses:

```text
scheduled
completed
cancelled
```

The API validates appointment dates and times and prevents invalid status changes.

---

# Transaction API

### Create Transaction

```http
POST /api/transactions
```

Creates a transaction for a patient.

**Allowed role:**

* Admin

Example:

```json
{
  "patient_id": 14,
  "amount": 5000,
  "transaction_type": "consultation"
}
```

---

### Get All Transactions

```http
GET /api/transactions
```

Returns transaction records.

**Allowed role:**

* Admin

---

### Get My Transactions

```http
GET /api/transactions/me
```

Returns transactions belonging to the authenticated patient.

**Allowed role:**

* Patient

---

### Get Transaction by ID

```http
GET /api/transactions/:id
```

Returns information about a specific transaction.

Patient ownership is checked before returning the transaction.

---

### Update Transaction

```http
PATCH /api/transactions/:id
```

Updates the status of a transaction.

**Allowed role:**

* Admin

Valid statuses:

```text
pending
completed
cancelled
```

A transaction that is no longer pending cannot be updated.

---

# Database

The application uses PostgreSQL as its relational database.

The main tables are:

```text
users
patients
appointments
transactions
```

The database is hosted using Neon PostgreSQL in production.

---

## Users Table

Stores user information, authentication details, account status, and roles.

```text
users
├── id
├── name
├── email
├── password
├── role
├── is_active
└── created_at
```

The `is_active` field is used to control whether an account can access the application.

---

## Patients Table

Stores information specific to patients.

```text
patients
├── id
├── user_id
├── date_of_birth
└── blood_group
```

Each patient profile is connected to a user.

---

## Appointments Table

Stores appointments between patients and doctors.

```text
appointments
├── id
├── patient_id
├── doctor_id
├── appointment_date
├── appointment_time
├── status
└── created_at
```

An appointment belongs to one patient and one doctor.

A database constraint prevents the same doctor from having two appointments at the same date and time.

---

## Transactions Table

Stores financial transactions associated with patients.

```text
transactions
├── id
├── patient_id
├── amount
├── transaction_type
├── status
└── transaction_date
```

---

# Database Relationships

```text
users
  │
  │
  │ 1
  ▼
patients
  │
  │
  ├───────────────┐
  │               │
  ▼               ▼
appointments   transactions
  │
  │
  ▼
users
(doctor)
```

### Relationships

* A user can have a patient profile.
* A patient can have multiple appointments.
* A doctor can have multiple appointments.
* A patient can have multiple transactions.
* An appointment belongs to one patient and one doctor.
* A transaction belongs to one patient.
* Patient information is linked to the corresponding user through `user_id`.

---

# Validation

Incoming data is validated before reaching the database.

The application validates things such as:

* Required fields
* Positive numeric IDs
* Valid dates
* Valid appointment times
* Valid blood groups
* Valid transaction types
* Valid transaction statuses
* Valid appointment statuses
* Future appointment dates
* Future appointment times
* Valid update requests
* Duplicate email addresses

Validation is handled through separate middleware where appropriate.

Keeping validation separate from controllers makes the backend easier to maintain and keeps the controllers focused on application logic.

---

# Error Handling

The backend uses centralized error-handling middleware.

Controllers pass unexpected errors to the error handler using:

```js
next(error);
```

The API uses appropriate HTTP status codes for common situations.

| Status | Meaning                 |
| ------ | ----------------------- |
| `200`  | Request successful      |
| `201`  | Resource created        |
| `400`  | Invalid request         |
| `401`  | Authentication required |
| `403`  | Access denied           |
| `404`  | Resource not found      |
| `409`  | Conflict                |

For example, attempting to create an appointment when the doctor already has an appointment at the same date and time returns:

```text
409 Conflict
```

---

# Security

Security is an important part of the project.

The backend uses:

* **bcrypt** for password hashing
* **JWT** for authentication
* **API keys** for additional API protection
* **Role-based authorization**
* **Patient ownership checks**
* **Doctor ownership checks**
* **Input validation**
* **Environment variables**
* **Parameterized SQL queries**
* **Protected routes**
* **Centralized error handling**
* **Account activation/deactivation checks**

Parameterized queries are used when communicating with PostgreSQL to reduce the risk of SQL injection.

Sensitive values such as database credentials, API keys, JWT secrets, and email service credentials are stored in environment variables rather than being hard-coded into the application.

---

# Environment Variables

The backend uses environment variables for configuration.

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_NAME=hospital_db
PORT=3000
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key
RESEND_API_KEY=your_resend_api_key
CLIENT_URL=http://localhost:5173
```

The actual values should never be committed to GitHub.

The `.gitignore` file should contain:

```text
node_modules/
.env
```

For production, the environment variables are configured through the deployment platform.

---

# Running the Backend Locally

Clone the project and move into the backend directory:

```bash
cd F:\Hospital-Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the required database and authentication variables.

Start the server:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

---

# Running the Frontend Locally

Move into the frontend directory:

```bash
cd hospital-management
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide the local frontend URL.

The frontend uses environment variables to determine which backend API it communicates with.

---

# Frontend

The React frontend provides separate interfaces for the three user roles.

### Patient

Patients can:

* View their dashboard
* View their profile
* View their appointments
* View their transactions
* Access only their own protected information

### Doctor

Doctors can:

* View their dashboard
* View appointments assigned to them
* Create appointments
* Update appointments
* Access authorized patient information

### Admin

Administrators can:

* View the admin dashboard
* Manage users
* Create users
* Edit users
* Change user roles
* Activate and deactivate accounts
* Manage patients
* Manage appointments
* Manage transactions

The frontend uses protected routes and authentication state to control access to different sections of the application.

---

# Deployment

The application is deployed for production use.

### Frontend

The React/Vite frontend is deployed using Vercel.

### Backend

The Node.js/Express backend is also deployed using Vercel.

### Database

The PostgreSQL database is hosted using Neon.

The production frontend communicates with the deployed backend rather than the local development server.

---

# Testing

The application has been manuually tested across its main workflows.

Testing includes:

* User creation
* Patient creation
* Doctor creation
* Admin creation
* User login
* Invalid login attempts
* JWT authentication
* Role-based authorization
* API-key protection
* Password reset
* Password reset email delivery
* Patient access control
* Doctor access control
* Appointment creation
* Appointment validation
* Duplicate appointment prevention
* Appointment ownership
* Appointment status changes
* Transaction creation
* Transaction validation
* Transaction access control
* Transaction status changes
* User deactivation
* Blocking deactivated users
* User reactivation
* Frontend/backend communication
* Production deployment

---

# Project Goals

This project was built as a practical way to learn and apply full-stack development concepts.

The main concepts covered include:

* REST APIs
* Node.js
* Express.js
* PostgreSQL
* SQL
* CRUD operations
* Database relationships
* JWT authentication
* Authorization
* Middleware
* Password hashing
* API security
* Input validation
* Error handling
* Role-based access control
* Frontend and backend communication
* Database transactions
* Email-based password recovery
* Production deployment

The project also helped me understand how different parts of a real-world application work together rather than treating the frontend, backend, and database as completely separate projects.

---

# Future Improvements

Although the core application is functional, there are still areas that can be improved over time.

Possible future improvements include:

* Automated backend testing
* Automated frontend testing
* More comprehensive API documentation
* Improved UI/UX
* More advanced dashboard statistics
* Appointment calendar views
* Additional hospital management modules
* Improved mobile experience
* More detailed audit logging
* Further production security hardening
* Android application version using the existing React application

These are future improvements rather than requirements for the current working version of the application.

---

# Author

*Syed Muhammad Yahya*

I built this project as part of my journey into full-stack development. The goal was to move beyond individual tutorials and build a complete application that connects a React frontend, Express REST API, PostgreSQL database, authentication, authorization, validation, and production deployment.

The project gave me practical experience with designing APIs, working with relational databases, protecting resources, handling real application errors, and deploying a full-stack application.