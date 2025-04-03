# Full-Stack Software Engineer - Technical Test

## Overview

The purpose of this test is to evaluate the candidate's ability to work with both the backend and frontend, manage state effectively, handle database operations, and integrate with APIs. The test includes tasks for building an API using **Express** and creating a React-based client to interact with the API.

---

## Instructions

You are tasked with creating a **full-stack application** for managing users. The application must include the following features:

---

### Backend Requirements (Express)

1. **Authentication**
   - [x] Implement a simple JWT-based authentication system.
   - [x] Include endpoints for:
     - [x]  **Login**: Accepts email and password, validates them against the database, and returns a JWT.
     - [x] **Protected Routes**: Middleware to validate the JWT for protected routes.
   - [x] Seed the database with at least one default user (e.g., `admin@example.com`, password: `password`).

2. **User Management API**
   - [x] Create the following endpoints:
     - [x] `GET /users`: Returns a paginated, filtered, and searchable list of users.
       - **Query Parameters**:
         - [x] `page` (number): Page number for pagination.
         - [x] `limit` (number): Number of users per page.
         - [x] `role` (optional): Filter by role (e.g., Admin, User).
         - [x] `status` (optional): Filter by status (Active/Inactive).
         - [x] `search` (optional): Search by partial matches in `name` or `email`.
     - [x] `POST /users`: Creates a new user.
     - [x] `PUT /users/:id`: Updates an existing user by ID.
     - [x] `DELETE /users/:id`: Deletes a user by ID.
   -  [x] Validate all incoming data (e.g., email format, required fields).

3. **Database**
   - [x] Use **PostgreSQL** or **MongoDB** to store user data.
   - [x] User Schema:
     - [x] `id` (auto-generated)
     - [x] `firstName`
     - [x] `lastName`
     - [x] `email` (unique)
     - [x] `phoneNumber`
     - [] `role` (Admin/User)
     - [x] `status` (Active/Inactive)
     - [x] `address` (object with fields: street, number, city, postalCode)
     - [] `profilePicture` (URL)
   - [x] Seed the database with 50 sample users.

---

### Frontend Requirements (React)

1. **Login Page**
   - A form where users can log in using their email and password.
   - On successful login, store the JWT in local storage or cookies and redirect the user to the dashboard.
   - Show an error message for invalid credentials.

2. **Dashboard**
   - Display a table of users with the following columns:
     - **Name**
     - **Email**
     - **Phone Number**
     - **Role**
     - **Status**
     - **Actions**: Edit and Delete buttons
   - Features:
     - Fetch users from the `/users` endpoint (paginated, filtered, and searchable).
     - Include controls for:
       - **Search**: Text input for searching by name or email.
       - **Filters**: Dropdowns for filtering by Role and Status.
       - **Pagination**: Buttons for navigating between pages.
     - Show a loading spinner while data is being fetched.

3. **Add User Form**
   - Create a form to add a new user to the table using the `/users` endpoint.
   - Fields:
     - **First Name**
     - **Last Name**
     - **Email**
     - **Phone Number**
     - **Role** (dropdown with "Admin" and "User" options)
     - **Status** (dropdown with "Active" and "Inactive" options)
     - **Address**:
       - Street
       - Number
       - City
       - Postal Code
       - Google Maps Integration:
          - Include a Google Maps component where users can either type their address (autocomplete) or select a location on the map.
          - When a location is selected, the form fields for the address should be automatically populated.
     - **Profile Picture**:
       - Allow the user to upload an image file (e.g., `.jpg`, `.png`).
       - Use a library like **Multer** on the backend to upload the image and save its URL in the database.
   - Validate the form and show appropriate error messages.

4. **Edit User**
   - Clicking the "Edit" button in the table should open a form pre-filled with the user’s current data.
   - Save changes by sending a `PUT` request to `/users/:id`.

5. **Delete User**
   - Clicking the "Delete" button should prompt a confirmation dialog.
   - On confirmation, delete the user using the `/users/:id` endpoint.

---

### Bonus Features (Optional)

- Implement a **Role-Based Access Control**:
  - Allow only Admin users to access the dashboard and perform user management.
- Use **TypeScript** for both the frontend and backend.
- Style the frontend using **Material-UI**, **TailwindCSS**, or another modern UI library.
- Include **Unit Tests** and **Integration Tests** for key features.
- Add **pagination controls** to show the total number of users and the current page.
- Use **Docker** to containerize the app (both frontend and backend).
- Implement a **global state management solution** (e.g., Redux, Recoil, Zustand).

---

## Deliverables

1. **Source Code**:
   - A GitHub repository containing both the frontend and backend projects.
   - Include clear folder structures and comments.
2. **README.md**:
   - How to set up and run the project (backend, frontend, and database).
   - A brief explanation of your implementation and any decisions made.
   - List of libraries or frameworks used.
   - Any challenges faced and how they were overcome.
3. **Postman Collection** (Optional):
   - Export a Postman collection for the backend API.

---

## Evaluation Criteria

- **Functionality**: Does the app meet the requirements?
- **Code Quality**: Is the code clean, readable, and well-structured?
- **UI/UX Design**: Is the interface intuitive and visually appealing?
- **Problem-Solving**: How well were challenges addressed?
- **Bonus Features**: Extra points for implementing optional tasks.

---

## How to Submit

1. Push your code to a public GitHub repository.
2. Share the repository link and any additional files (e.g., Postman collection) via email.

---

**Good luck!** We look forward to reviewing your work!
