# 🏥 Hospital Management System

A full-stack Hospital Management System designed to manage patients, doctors, appointments, users, and transactions through a secure web application.

This project is being built as a practical full-stack application to understand how a real-world system works from the frontend and REST API to authentication, authorization, and database operations.

---

## 📌 Overview

The system is divided into two main parts:

* **Frontend** — Provides the user interface for interacting with the system.
* **Backend** — Provides the REST API and handles authentication, authorization, validation, business logic, and database operations.

The backend uses **PostgreSQL** for data storage and uses **JWT authentication**, **API-key protection**, and **role-based authorization** to secure the application.

---

# ✨ Features

## 👤 User Management

* Create new users
* User login
* Password hashing using bcrypt
* JWT-based authentication
* Retrieve the currently authenticated user's profile
* Support for patient, doctor, and admin roles

## 🧑‍⚕️ Patient Management

* Create patient profiles
* Retrieve patient information
* Allow patients to access their own profile
* Restrict patient information based on user roles
* Validate patient information before storing it

## 📅 Appointment Management

* Create appointments
* View appointments
* View a patient's own appointments
* View individual appointments
* Update appointment date and time
* Update appointment status
* Prevent appointments from being created in the past
* Prevent appointments from being updated to the past
* Prevent doctors from having duplicate appointments at the same time
* Restrict doctors to their own appointments
* Prevent patients from viewing other patients' appointments
* Control appointment updates using role-based authorization

## 💳 Transaction Management

* Create patient transactions
* View all transactions for authorized users
* Allow patients to view their own transactions
* View individual transactions
* Update transaction status
* Validate transaction information
* Prevent updates to transactions that are no longer pending

## 🔐 Security

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

---

# 👥 User Roles

The system currently supports three main roles:

| Role        | Main Access                                                   |
| ----------- | ------------------------------------------------------------- |
| **Patient** | Own profile, appointments, and transactions                   |
| **Doctor**  | Manage appointments and access authorized patient information |
| **Admin**   | Administrative features and transaction management            |

Access to protected endpoints is controlled through authentication and role-based authorization.

---

# 🛠️ Technologies Used

## Backend

* **Node.js** — JavaScript runtime
* **Express.js** — REST API framework
* **PostgreSQL** — Relational database
* **pg** — PostgreSQL client for Node.js
* **bcrypt** — Password hashing
* **jsonwebtoken** — JWT authentication
* **dotenv** — Environment variable management

## Frontend

* **React** — Frontend library
* **JavaScript** — Application logic
* **HTML** — Page structure
* **CSS** — Styling

The frontend communicates with the backend through REST API requests.

---

# 🏗️ System Architecture

The application follows a simple three-layer architecture:

```text
┌─────────────────────────┐
│        Frontend         │
│          React          │
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

### How it works

1. The user interacts with the React frontend.
2. The frontend sends HTTP requests to the Express.js backend.
3. The backend authenticates the user and checks their permissions.
4. Middleware validates the incoming request.
5. Controllers handle the application logic.
6. The backend communicates with PostgreSQL.
7. PostgreSQL returns the requested data.
8. The backend sends a JSON response back to the frontend.

This separation keeps the frontend, backend logic, and database operations organized and easier to maintain.

---

# 📂 Project Structure

```text
Hospital-Management-System/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── patientController.js
│   │   ├── appointmentController.js
│   │   └── transactionController.js
│   │
│   ├── db/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── apiKeyMiddleware.js
│   │   ├── validatePatient.js
│   │   ├── validateAppointment.js
│   │   ├── validateAppointmentUpdate.js
│   │   ├── validateTransaction.js
│   │   ├── validateTransactionUpdate.js
│   │   └── errorHandler.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── transactionRoute.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🔙 Backend

The backend is responsible for:

* REST API endpoints
* Authentication
* Authorization
* Validation
* Business logic
* Database communication
* Error handling
* Security

The backend runs locally on:

```text
http://localhost:3000
```

---

# 🔑 Authentication

The application uses **JSON Web Tokens (JWT)** for authentication.

When a user successfully logs in, the backend generates a JWT containing information about the authenticated user and their role.

Protected endpoints require the token in the request header:

```text
Authorization: Bearer <token>
```

The authentication middleware verifies the token before allowing the request to continue.

Invalid or expired tokens return:

```text
401 Unauthorized
```

---

# 🛡️ Role-Based Authorization

After authentication, the user's role is checked before accessing protected resources.

The system uses middleware to restrict endpoints based on roles.

For example:

```text
Patient → Own information
Doctor  → Appointment management
Admin   → Administrative operations
```

If an authenticated user does not have permission to access a resource, the API returns:

```text
403 Forbidden
```

---

# 🔐 API Key Protection

Protected API routes can also require an API key.

The key is sent through the request header:

```text
x-api-key: <your-api-key>
```

The API key is stored in the `.env` file and is not hard-coded into the application.

Requests without a key return:

```text
401 Unauthorized
```

Requests with an incorrect key return:

```text
403 Forbidden
```

---

# 🌐 API Endpoints

## Users

### Create User

```http
POST /api/users
```

Creates a new user.

Example:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
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

# 🧑‍⚕️ Patient API

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

---

# 📅 Appointment API

### Create Appointment

```http
POST /api/appointments
```

Creates an appointment for a patient.

**Allowed roles:**

* Doctor
* Admin

The doctor is determined from the authenticated user's JWT instead of trusting a `doctor_id` supplied by the client.

Example:

```json
{
  "patient_id": 14,
  "appointment_date": "2026-09-12",
  "appointment_time": "15:00"
}
```

---

### Get Appointments

```http
GET /api/appointments
```

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

The API prevents invalid date/time updates and prevents inappropriate status changes.

---

# 💳 Transaction API

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

A transaction that is no longer `pending` cannot be updated.

---

# 🗄️ Database

The application uses **PostgreSQL** as its relational database.

The main tables are:

```text
users
patients
appointments
transactions
```

---

## Users Table

Stores user information, login credentials, and roles.

```text
users
├── id
├── name
├── email
├── password
├── role
└── created_at
```

---

## Patients Table

Stores additional information about patients.

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

Stores doctor appointments.

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

Appointments connect patients with doctors.

A unique database constraint prevents the same doctor from having two appointments at the same date and time.

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

# 🔗 Database Relationships

```text
users
  │
  │ 1
  │
  │
  ▼
patients
  │
  │ 1
  │
  ├───────────────┐
  │               │
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

---

# ✅ Validation

Incoming data is validated before it reaches the database.

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

Validation is handled through separate middleware.

This keeps the controllers focused on application logic instead of putting all validation inside the controllers.

---

# ⚠️ Error Handling

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

For example, attempting to create an appointment when the doctor already has an appointment at the same date and time returns a `409 Conflict`.

---

# 🔒 Security

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

Parameterized queries are used when communicating with PostgreSQL to reduce the risk of SQL injection.

Sensitive values such as database passwords and JWT secrets are kept outside the source code.

---

# ⚙️ Environment Variables

The backend uses a `.env` file for configuration.

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
```

> Do not commit the `.env` file to GitHub.

The `.gitignore` file should contain:

```text
node_modules/
.env
```

---

# 🚀 Running the Backend

Clone the project and move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the PostgreSQL database and authentication variables.

Start the server:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

---

# 💻 Frontend

The frontend is being developed using React.

Its main purpose is to provide a simple interface for interacting with the hospital management API.

Planned frontend functionality includes:

* Login and registration
* Role-based dashboards
* Patient dashboard
* Doctor dashboard
* Admin dashboard
* Patient profile management
* Appointment management
* Transaction management
* API error handling
* Authentication state management
* Responsive design

The frontend will communicate with the backend using HTTP requests and will use the authentication system provided by the backend.

---

# ▶️ Running the Frontend

Move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend development server will provide the local URL shown by Vite.

---

# 🧪 Testing

The backend has been tested for:

* User registration
* User login
* JWT authentication
* Role-based authorization
* API-key protection
* Patient access control
* Appointment creation
* Appointment validation
* Duplicate appointment prevention
* Appointment ownership
* Appointment status changes
* Transaction creation
* Transaction validation
* Transaction access control
* Transaction status changes
* Invalid and expired authentication
* Unauthorized access attempts

---

# 🎯 Project Goals

This project was created as a practical way to learn and apply full-stack development concepts.

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
* Frontend and backend communication
* Role-based access control

---

# 🔮 Future Improvements

The project will continue to evolve.

Planned improvements include:

* Complete React frontend
* Role-based dashboards
* Better UI/UX
* Appointment calendar
* Doctor and patient management interfaces
* Improved transaction interface
* More advanced validation
* API documentation
* Automated testing
* Deployment of the complete application
* Production-ready security improvements
* Responsive design for different screen sizes

---

# 👨‍💻 Author

**Syed Muhammad Yahya**

This project is part of my journey into full-stack development, with a focus on learning how real-world applications are designed, secured, connected to databases, and built from frontend to backend.
