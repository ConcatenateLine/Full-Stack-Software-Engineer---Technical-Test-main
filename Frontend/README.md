# User Management Dashboard

A modern React TypeScript application for managing users with features like search, filtering, pagination, and CRUD operations.

Feature-Based Architecture for a User Management Application.

```
## Project Reference Structure of implementation


src/
├── App.tsx              # Main application component
├── App.css              # Global styles for the application
├── index.css            # Tailwind CSS configuration
├── main.tsx             # Entry point of the application
├── vite-env.d.ts        # Vite environment type declarations
├── assets/              # Static assets (images, fonts, etc.)
├── common/              # Shared components and utilities
│   ├── components/      # Reusable UI components
│   │   ├── DataTable.tsx # Table component with filtering and pagination
│   │   └── ...          # Other shared components
│   └── types/           # Shared TypeScript types and interfaces
├── components/          # Global UI components
├── features/            # Feature-based architecture
│   └── user/            # User management feature
│       ├── UserContainer.tsx      # Main user list container
│       ├── UserAddContainer.tsx   # Add new user form container
│       ├── UserUpdateContainer.tsx # Edit user form container
│       ├── components/            # User-specific UI components
│       │   └── UserColumns.tsx     # Table column definitions
│       ├── services/              # API services
│       │   └── UserService.ts      # User-related API calls
│       ├── slices/                # Redux state management
│       │   └── userSlice.ts        # User state management
│       └── types/                 # User-specific TypeScript types
├── hooks/               # Custom React hooks
│   └── useAuth.ts       # Authentication hook
├── lib/                 # Utility libraries
└── types/               # Global TypeScript types


```

## Tech Stack

- React
- TypeScript
- Vite
- Redux Toolkit
- React Query
- Shadcn UI
- Tailwind CSS
- TanStack Table
- Lucide React Icons
- React Router
- Sonner (Toast Notifications)
- zod
- react-hook-form
- react-router

## Features

- User Authentication with JWT
- Responsive Dashboard UI
- Advanced User Table with:
  - Search functionality
  - Role-based filtering (Admin/User)
  - Status filtering (Active/Inactive)
  - Pagination
  - Column customization
- User CRUD operations
  - Add new users
  - Edit existing users
  - Delete users
- State management with Redux Toolkit
- Loading states and error handling'

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install

3. Run the development server:
   ```bash
   npm run dev

4. Open http://localhost:5173 in your browser

## License

MIT License