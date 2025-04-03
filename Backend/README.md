# Express API Backend

## Overview

Feature-Based Architecture for a User Management API.

```
src/
├── features/                    # Feature modules
│   ├── auth/                   # Authentication feature
│   │   ├── api/               # API routes
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.controller.ts
│   │   │
│   │   ├── services/          # Business logic
│   │   │   ├── auth.service.ts
│   │   │   └── jwt.service.ts
│   │   │
│   │   ├── repositories/      # Data access
│   │   │
│   │   ├── entities/          # Database entities
│   │   │
│   │   ├── dtos/             # Data Transfer Objects
│   │   │   └── login.dto.ts
│   │   │
│   │   └── middleware/        # Feature-specific middleware
│   │       └── auth.middleware.ts
│   │
│   └── users/                 # User management feature
│       ├── api/
│       ├── services/
│       ├── repositories/
│       ├── dtos/
│       ├── middleware/
│       ├── valueObjects/
│       └── entities/
│
├── common/                     # Shared code
│   ├── utils/                 # Utility functions
│   │   └── passwordHasher.ts
│   │
│   ├── types/                 # Shared types
│   ├── errors/                # Shared errors
│   ├── enums/                 # Shared enums
│   │
│   └── valueObjects/            # Shared value objects
│       └── Address.ts
│
├── config/                     # Configuration
│   ├── seed.ts                # Database seed
│   └── database.ts            # Database config
│
├── api/                        # API routes
│
└── app.ts                     # Main application setup
```

## Installation

To install dependencies:

```bash
bun install
```

Configure database connection in `.env` file.

To run:

```bash
bun run dev
```

## API Endpoints

### Authentication

- POST `/api/login` - Login
- POST `/api/register` - Register

### Users

- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- POST `/api/users` - Create user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

## Dependencies

project:

Core Framework

- **Express**: Fast, minimalist web framework for Node.js that handles HTTP requests and responses
  Database
- **TypeORM**: TypeScript/JavaScript ORM that works with PostgreSQL through decorators
- **pg**: PostgreSQL client for Node.js
- **reflect-metadata**: Enables TypeScript decorators for TypeORM
  Authentication & Security
- **bcryptjs**: Password hashing library for secure password storage
- **jsonwebtoken**: JWT implementation for authentication
  Request Handling
- **body-parser**: Middleware for parsing request bodies
- **cors**: Middleware for enabling Cross-Origin Resource Sharing
  Development Tools
- **dotenv**: Loads environment variables from .env files
  Type Safety & Validation
- **class-transformer**: Converts class instances to/from plain JavaScript objects
- **class-validator**: Provides validation decorators for TypeScript classes
