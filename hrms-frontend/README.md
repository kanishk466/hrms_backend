
# HRMS Lite – Full Stack Application

##  Project Overview

HRMS Lite is a lightweight, web-based Human Resource Management System designed to manage **employee records** and **daily attendance**.
The application simulates a basic internal HR tool for a single admin user and focuses on **core HR operations**, clean UI, and production-ready backend APIs.

The system allows an admin to:

* Add, view, and delete employees
* Mark and update daily attendance (Present / Absent)
* View attendance records
* Filter attendance by date
* View total present days per employee

The project is intentionally kept minimal to demonstrate **end-to-end full-stack development skills** including frontend, backend, database design, validation, error handling, and deployment.

---

##  Tech Stack Used

### Frontend

* **React (Vite)**
* **JavaScript / TypeScript**
* **Tailwind CSS**
* **Axios**
* **React Router**

### Backend

* **FastAPI**
* **Python**
* **Motor (Async MongoDB driver)**
* **Pydantic (validation)**

### Database

* **MongoDB (MongoDB Atlas)**

### Deployment

* **Frontend**: Vercel
* **Backend**: Render
* **Database**: MongoDB Atlas

---

##  Steps to Run the Project Locally

###  Clone the Repository

```bash
git clone <your-github-repo-url>
cd <repo-name>
```

---

###  Backend Setup (FastAPI)

#### Navigate to backend folder

```bash
cd backend
```

#### Create virtual environment

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

#### Create `.env` file

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hrms_lite
```

#### Run backend server

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

```
http://localhost:8000
```

Swagger Docs:

```
http://localhost:8000/docs
```

---

###  Frontend Setup (React)

#### Navigate to frontend folder

```bash
cd frontend
```

#### Install dependencies

```bash
npm install
```

#### Create `.env` file

```env
VITE_API_URL=http://localhost:8000
```

#### Run frontend

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:5173
```

---

##  Key Features Implemented

* Employee CRUD (Add, View, Delete)
* Attendance management (Mark & Update)
* Attendance filtering by date
* Attendance summary (total present days per employee)
* Server-side validation
* Proper HTTP status codes & error messages
* Loading, empty, and error UI states
* RESTful API design
* Production-ready deployment

---

##  Assumptions & Limitations

* Single admin user (no authentication or authorization)
* No role-based access control
* No payroll, leave management, or reporting features
* Attendance history is not versioned (only latest status per date)
* Deleting an employee does not automatically delete attendance records
* Designed for small to medium datasets (HRMS Lite scope)

---

##  Live Deployment

* **Frontend URL**: `<Vercel URL>`
* **Backend API URL**: `<Render URL>`
* **Swagger Docs**: `<Render URL>/docs`



