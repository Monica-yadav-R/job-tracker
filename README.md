# Job Tracker

Job Tracker is a full-stack web application for managing job applications.

It allows users to create, view, update, and delete their job applications while tracking their application status. Each user can access only their own jobs through authentication and authorization.

## Features

* User registration and login
* JWT-based authentication
* User-specific job access
* Create, read, update, and delete jobs
* Track application status
* Dashboard with application statistics
* Form validation and error handling
* Persistent data storage with SQLite
* Frontend connected to the FastAPI backend using JavaScript `fetch()`

## Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* JWT authentication

### Frontend

* HTML
* CSS
* JavaScript
* Fetch API

## Project Structure

```text
JOB TRACKER/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── dependencies.py
│   ├── schemas/
│   │   ├── job.py
│   │   └── user.py
│   └── models/
│       ├── job.py
│       └── user.py
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── css/
│   └── js/
│       ├── config.js
│       ├── api.js
│       ├── script.js
│       ├── login.js
│       ├── register.js
│       └── dashboard.js
│
├── requirements.txt
├── README.md
└── .gitignore
```

### Backend

* `main.py` contains the FastAPI application and API endpoints.
* `auth.py` contains JWT authentication configuration.
* `database.py` creates the SQLite database connection and database sessions.
* `dependencies.py` contains the dependency used to authenticate the current user.
* `schemas/` contains Pydantic models used for request validation and API responses.
* `models/` contains SQLAlchemy models representing database tables.

### Frontend

* `index.html` provides the main job management interface.
* `login.html` provides the login form.
* `register.html` provides the registration form.
* `dashboard.html` displays job application statistics.
* `api.js` contains functions that communicate with the FastAPI API.
* `script.js` handles the main job tracker interface.
* `login.js` handles user login.
* `register.js` handles user registration.
* `dashboard.js` loads and displays dashboard statistics.
* `config.js` stores the backend API base URL.

## Authentication and Authorization

The application uses JWT-based authentication.

The authentication flow is:

```text
User
 ↓
Register
 ↓
Password is hashed
 ↓
User stored in database
 ↓
Login
 ↓
FastAPI verifies credentials
 ↓
JWT access token returned
 ↓
Frontend stores token
 ↓
Token sent with protected requests
 ↓
FastAPI verifies token
 ↓
Current user identified
 ↓
User can access only their own jobs
```

Passwords are never stored as plain text. They are hashed before being stored in the database.

Each job is associated with the user who created it through `user_id`. Protected job endpoints check the authenticated user's ID before allowing access to a job.

## API Endpoints

| Method | Endpoint         | Purpose                              |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/register`      | Register a new user                  |
| POST   | `/login`         | Authenticate a user and return a JWT |
| GET    | `/jobs`          | Get the current user's jobs          |
| POST   | `/jobs`          | Create a job                         |
| GET    | `/jobs/{job_id}` | Get one user's job                   |
| PUT    | `/jobs/{job_id}` | Update a user's job                  |
| DELETE | `/jobs/{job_id}` | Delete a user's job                  |

## Job Fields

Each job contains:

* Company
* Role
* Location
* Salary
* Status
* Application date

Supported statuses:

* Saved
* Applied
* Interview
* Rejected
* Offer
* Withdrawn

## Frontend → Backend Flow

The frontend communicates with FastAPI using JavaScript's `fetch()` API.

```text
HTML
 ↓
JavaScript
 ↓
fetch()
 ↓
HTTP request
 ↓
FastAPI endpoint
 ↓
Validation
 ↓
Authentication / authorization
 ↓
SQLAlchemy
 ↓
SQLite database
 ↓
JSON response
 ↓
JavaScript
 ↓
HTML UI
```

## Running the Project Locally

### 1. Activate the virtual environment

On Windows PowerShell:

```powershell
.\fastapi\Scripts\Activate.ps1
```

### 2. Start the FastAPI backend

From the project root:

```bash
uvicorn backend.main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

Interactive API documentation is available through FastAPI's Swagger UI at:

```text
http://127.0.0.1:8000/docs
```

### 3. Start the frontend

Open the `frontend` folder using VS Code Live Server.

The frontend will normally run at:

```text
http://127.0.0.1:5500
```

Register a user, log in, and then use the Job Tracker application.

## Testing

The application was tested for:

* User registration
* User login
* Invalid login credentials
* Validation errors
* Protected API endpoints
* Creating jobs
* Viewing jobs
* Updating jobs
* Deleting jobs
* Dashboard statistics
* Logout
* Redirecting unauthenticated users
* User-specific job access
* Optional location and salary fields

## Future Improvements

**OPTIONAL — DO AFTER THE CORE PROJECT IS COMPLETE**

Possible future improvements include:

* Automated API tests
* Production database
* Deployment
* Resume upload improvements
* More advanced dashboard statistics
* Improved UI styling

```

```
