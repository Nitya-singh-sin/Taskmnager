# TaskFlow – Task & Project Management System

TaskFlow is a full-stack MERN application that helps users manage projects and tasks efficiently. It includes secure authentication, project management features, and a Kanban-style task board for organizing work.

## Features

* User Registration & Login
* JWT Authentication & Authorization
* Create, Update, and Delete Projects
* Create, Update, and Delete Tasks
* Kanban Board (To Do, In Progress, Done)
* Protected Routes
* Responsive User Interface

## Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Token)
* bcryptjs

---

## Getting Started

### Clone the Repository

```bash
git clone <your-repository-url>
cd taskflow
```

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Application URLs

Frontend:

```bash
http://localhost:3000
```

Backend:

```bash
http://localhost:5000
```

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login user          |
| GET    | /api/auth/me       | Get logged-in user  |

### Projects

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | /api/projects     | Get all projects    |
| POST   | /api/projects     | Create a project    |
| GET    | /api/projects/:id | Get project details |
| PUT    | /api/projects/:id | Update project      |
| DELETE | /api/projects/:id | Delete project      |

### Tasks

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| GET    | /api/tasks/:projectId | Get all tasks for a project |
| POST   | /api/tasks/:projectId | Create a task               |
| PUT    | /api/tasks/task/:id   | Update task                 |
| DELETE | /api/tasks/task/:id   | Delete task                 |

---

## Authentication

Protected routes require a valid JWT token in the request header:

```http
Authorization: Bearer <your_token>
```

---

## Future Improvements

* Task Due Dates
* File Attachments
* Team Collaboration
* Activity Logs
* Email Notifications

---

## Author

Nitya Singh

MERN Stack Developer
