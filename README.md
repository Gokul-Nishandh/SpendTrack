#  SpendTrack

**SpendTrack** is a full-stack expense tracker and analyzer web application developed as part of a DBMS project. The app allows users to manage, split, and analyze their personal and group expenses in a user-friendly interface. It integrates a MySQL database with a React frontend and a FastAPI backend, providing a fast, reliable, and responsive experience.

---

##  Features

-  **User Authentication** – Sign up and log in securely.
-  **Friend System** – Add and manage friends via phone numbers.
-  **Expense Tracking** – Add individual and group expenses.
-  **Expense Splitting** – Split expenses among group participants and ensure total accuracy.
-  **Spend Analysis** – Visualize and analyze your spending habits.
-  **Real-time Validation** – Ensures total split equals the actual expense.
-  **Backend APIs** – RESTful endpoints to support all app features.
-  **Persistent Storage** – Uses MySQL to store user data, expenses, and groups.

---

##  Tech Stack

- **Frontend:** HTML, CSS, JavaScript, React
- **Backend:** FastAPI (Python)
- **Database:** MySQL
- **Other Tools:** Uvicorn, NPM

---

##  How to Run the Application

Follow the steps below to set up and run the SpendTrack application on your local machine.

### 1. Clone the Repository
- git clone https://github.com/Gokul-Nishandh/SpendTrack

### 2. Start the frontend
- cd src
- npm install
- npm start

### 3. Start the Backend
- cd backend
- uvicorn app:app --reload

### You will see the app running on http://127.0.0.1:8000

### Database setup :
- Make sure you have MySQL installed and running. Import your database schema and data using the provided .sql file (if any). Update the database connection credentials inside app.py or relevant configuration files.
