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
     - [x] **Login**: Accepts email and password, validates them against the database, and returns a JWT.
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
   - [x] Validate all incoming data (e.g., email format, required fields).

3. **Database**
   - [x] Use **PostgreSQL** or **MongoDB** to store user data.
   - [x] User Schema:
     - [x] `id` (auto-generated)
     - [x] `firstName`
     - [x] `lastName`
     - [x] `email` (unique)
     - [x] `phoneNumber`
     - [x] `role` (Admin/User)
     - [x] `status` (Active/Inactive)
     - [x] `address` (object with fields: street, number, city, postalCode)
     - [x] `profilePicture` (URL)
   - [x] Seed the database with 50 sample users.

---

### Frontend Requirements (React)

1. **Login Page**

   - [x] A form where users can log in using their email and password.
   - [x] On successful login, store the JWT in local storage or cookies and redirect the user to the dashboard.
   - [x] Show an error message for invalid credentials.

2. **Dashboard**

   - [x] Display a table of users with the following columns:
     - [x] **Name**
     - [x] **Email**
     - [x] **Phone Number**
     - [x] **Role**
     - [x] **Status**
     - [x] **Actions**: Edit and Delete buttons
   - Features:
     - [x] Fetch users from the `/users` endpoint (paginated, filtered, and searchable).
     - [x] Include controls for:
       - [x] **Search**: Text input for searching by name or email.
       - [x] **Filters**: Dropdowns for filtering by Role and Status.
       - [x] **Pagination**: Buttons for navigating between pages.
     - [x] Show a loading spinner while data is being fetched.

   `Use Skeleton`

3. **Add User Form**

   - [x] Create a form to add a new user to the table using the `/users` endpoint.
   - [x] Fields:
     - [x] **First Name**
     - [x] **Last Name**
     - [x] **Email**
     - [x] **Phone Number**
     - [x] **Role** (dropdown with "Admin" and "User" options)
     - [x] **Status** (dropdown with "Active" and "Inactive" options)
     - [x] **Address**:
       - [x] Street
       - [x] Number
       - [x] City
       - [x] Postal Code
       - [x] Google Maps Integration:
         - [x] Include a Google Maps component where users can either type their address (autocomplete) or select a location on the map.
         - [x] When a location is selected, the form fields for the address should be automatically populated.

        ```javascript
          Aggregate the autocomplete component to automatically populate the address fields on select option of the search. *(Autocomplete Address)*
          Aggregate the map component to automatically populate the address fields on select location. *(Reverse Geocoding)*
        ```

     - [x] **Profile Picture**:
       - [x] Allow the user to upload an image file (e.g., `.jpg`, `.png`).
       - [x] Use a library like **Multer** on the backend to upload the image and save its URL in the database.
  
      ```javascript
       Use **Sharp** to process the image and convert it to WebP format.
       ```
   - [x] Validate the form and show appropriate error messages.

4. **Edit User**

   - [x] Clicking the "Edit" button in the table should open a form pre-filled with the user’s current data.
   - [x] Save changes by sending a `PUT` request to `/users/:id`.

5. **Delete User**
   - [x] Clicking the "Delete" button should prompt a confirmation dialog.
   - [x] On confirmation, delete the user using the `/users/:id` endpoint.

---

### Bonus Features (Optional)

- [x] Implement a **Role-Based Access Control**:

  - [x] Allow only Admin users to access the dashboard and perform user management.

  ```javascript

  On the backend and frontend, implement role-based access control (RBAC) to ensure that only the roles permitted can access the sections marked with the role permissions.

  THE ROLES SEED ARE:
  - User
  - Admin
  - Manager
  - Supplier
  - Employee
  - Customer

  AND THE PERMISSIONS ARE:
  - application:all      - user:read
  - user:create          - user:update
  - user:delete          - role:read
  - role:create          - role:update
  - role:delete          - role:assign
  - role:assign          - role:unassign
  - category:read        - category:create
  - category:update      - category:delete
  - model:read           - model:create
  - model:update         - model:delete
  - settings:read        - settings:create
  - settings:update      - settings:delete
  - project:read         - project:create
  - project:update       - project:delete

  The permissions are assigned to the roles Without criteria, only for demo purposes.
  ```

- [x] Use **TypeScript** for both the frontend and backend.
- [x] Style the frontend using **Material-UI**, **TailwindCSS**, or another modern UI library.

  `Use Shadcn for Frontend`

- Include **Unit Tests** and **Integration Tests** for key features.
- [x] Add **pagination controls** to show the total number of users and the current page.
- Use **Docker** to containerize the app (both frontend and backend).
- [x] Implement a **global state management solution** (e.g., Redux, Recoil, Zustand).

  `Use Redux`

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

**Note**: User credentials for login are:

```javascript
user.email = "GonzaloVinegas@gmail.com";
user.role = "Admin";
user.password = "password123";
//master password: password123
//for all other users
```
