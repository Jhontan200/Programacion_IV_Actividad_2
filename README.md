# Programacion_IV_Actividad_2 🚀

A comprehensive project management and user authentication system built with Vue.js for the frontend and Express.js for the backend, utilizing a PostgreSQL database for data persistence. This application allows users to manage projects, track their progress, and maintain user roles and access.

## 🌟 Key Features

- **Project Management:** Full CRUD (Create, Read, Update, Delete) operations for projects, including details like name, description, start date, and status.
- **User Authentication:** Secure user login and management system with distinct roles (Administrator, Resident Engineer, Site Supervisor).
- **Status Tracking:** Projects can be assigned various statuses (Planned, In Progress, Completed, Suspended).
- **Interactive Dashboard:** Visualizations of project progress and user roles using Chart.js.
- **Responsive Design:** A clean and intuitive user interface built with Tailwind CSS, ensuring usability across devices.
- **Session Management:** User sessions are maintained through local storage for a seamless experience.

## 🛠️ Tech Stack

- **Frontend:** Vue.js, Vite, Tailwind CSS, Chart.js, Axios, SweetAlert2
- **Backend:** Node.js, Express.js, PostgreSQL (via `pg` library), CORS, dotenv, Nodemon
- **Database:** PostgreSQL (connected via Neon/PostgreSQL connection string)
- **Languages:** JavaScript, HTML, CSS, Markdown, JSON

## 📦 Dependencies

### Backend

- `cors`: For enabling Cross-Origin Resource Sharing.
- `dotenv`: To load environment variables from a `.env` file.
- `express`: The foundational web framework for Node.js.
- `pg`: PostgreSQL client for Node.js.
- `nodemon`: A utility that monitors for changes in your source code and automatically restarts your server.

### Frontend

- `@tailwindcss/postcss`: Tailwind CSS integration with PostCSS.
- `axios`: Promise-based HTTP client for making requests to the backend API.
- `chart.js`: For creating interactive charts and visualizations.
- `sweetalert2`: For attractive and responsive alert messages.
- `vue`: The progressive JavaScript framework for building user interfaces.
- `@vitejs/plugin-vue`: Vite plugin for Vue 3.
- `autoprefixer`: PostCSS plugin to parse CSS and add vendor prefixes.
- `postcss`: A tool for transforming CSS with JavaScript plugins.
- `tailwindcss`: A utility-first CSS framework.
- `vite`: A build tool that aims to provide a faster and leaner development experience.

## 🚀 Installation

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Jhontan200/Programacion_IV_Actividad_2.git
    cd Programacion_IV_Actividad_2
    ```
2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
3.  **Install backend dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file** in the `backend` directory with your PostgreSQL connection details:
    ```dotenv
    DATABASE_URL=postgres://user:password@host:port/database
    PORT=3000
    ```
5.  **Start the backend server in development mode:**
    ```bash
    npm run dev
    ```
    (This will use `nodemon` to automatically restart the server on code changes.)

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    (This will start the Vite development server.)

## 💡 Usage

This project is a full-stack web application designed for managing construction projects and user access.

1.  **Login:** Upon starting the application, you will be greeted with a login page. Enter your credentials to access the system.
2.  **Dashboard:** The main dashboard displays key metrics and visualizations:
    *   **Project Statistics:** Total projects, projects in progress, and completed projects.
    *   **Project Status Distribution:** A bar chart showing the count of projects by their current status.
    *   **Completion Rate:** A donut chart illustrating the percentage of completed projects.
    *   **User Roles:** A donut chart showing the distribution of users across different roles.
3.  **Project Management:** Navigate to the 'Gestión de Proyectos' section to:
    *   View all projects in a sortable and filterable table.
    *   Add new projects with details like name, description, start date, and status.
    *   Edit existing project details.
    *   View detailed information about a specific project.
    *   Delete projects.
    *   Filter projects by status and search by name or description.
4.  **User Management:** Access the 'Gestión de Ingreso' section to:
    *   View a list of all registered users.
    *   Add new users with roles and passwords.
    *   Edit existing user information (name, email, role). Passwords can be updated separately.
    *   View detailed user information.
    *   Delete users.
    *   Filter users by role and search by name or email.
5.  **Logout:** Securely log out of the application to end your session.

## 🏗️ Project Structure

```
programacion_iv_actividad_2/
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── application/use-cases/
│   │   ├── domain/entities/
│   │   ├── domain/repositories/
│   │   ├── infrastructure/database/
│   │   ├── infrastructure/repositories/
│   │   ├── infrastructure/web/controllers/
│   │   └── infrastructure/web/routes/
│   ├── .env (example)
│   ├── package.json
│   ├── README.md
│   └── src/app.js (Backend Entry Point)
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── views/
│   │   ├── services/
│   │   ├── App.vue (Main App Component)
│   │   ├── main.js (Frontend Entry Point)
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   └── vite.config.js
└── README.md (Root README)
```

## 🌐 API Reference

### Projects API (`/api/projects`)

-   `GET /`: Get all projects.
-   `POST /`: Create a new project.
-   `GET /statuses`: Get all available project statuses.
-   `PUT /:id`: Update a project by ID.
-   `DELETE /:id`: Delete a project by ID.

### Users API (`/api/users`)

-   `GET /`: Get all users.
-   `POST /`: Create a new user.
-   `PUT /:id`: Update a user by ID.
-   `DELETE /:id`: Delete a user by ID.
-   `POST /login`: Authenticate a user.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any improvements or bug reports.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a Pull Request.

## 📄 License

No license information was provided for this repository.

## 🔗 Important Links

-   [Project Repository](https://github.com/Jhontan200/Programacion_IV_Actividad_2)

---

> Created by Jhontan.
> 
> ⭐ [Star](https://github.com/Jhontan200/Programacion_IV_Actividad_2/stargazers) | 🍴 [Fork](https://github.com/Jhontan200/Programacion_IV_Actividad_2/forks) | 🐞 [Issues](https://github.com/Jhontan200/Programacion_IV_Actividad_2/issues)
