# Library Management System — Angular 19 Frontend

A complete Angular 19 frontend for the LMS backend (Spring Boot, port 8080).

## Features

| Module | Roles | What it does |
|--------|-------|--------------|
| Login | All | Authenticate via staff_id + password |
| Books | All | List, search, view detail |
| Add/Edit Book | Admin | Create books with name, author, ISBN |
| Book Copies | Admin/Librarian | View copies, add copies, issue/return |
| Staff | Admin only | Create, activate/deactivate, delete staff |
| Members | Admin/Librarian | Register, list, delete members |
| Issue Book | Librarian/Admin | Issue a copy to a member by copy ID |
| Return Book | Librarian/Admin | Return a copy, calculate fine |
| Profile | All | View own staff info |

## Tech Stack

- **Angular 19** — standalone components, signals, new control flow (`@if`, `@for`)
- **Angular Router** — lazy-loaded routes with auth/role guards
- **Angular HttpClient** — with a global error interceptor
- **RxJS** — for API calls
- **SCSS** — custom dark design system matching the provided mockups

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Make sure backend is running on http://localhost:8080

# 3. Start the dev server
ng serve

# Open http://localhost:4200
```

## Login Credentials

| Role | Staff ID | Password |
|------|----------|----------|
| Admin | 10101010 | qwerty@123 |
| Staff (example) | 1 | rahul@123 |

## Project Structure

```
src/app/
├── core/
│   ├── models/          # TypeScript interfaces matching API
│   ├── services/        # auth, books, staff, members, toast
│   ├── guards/          # authGuard, guestGuard, adminGuard
│   └── interceptors/    # global HTTP error handler
├── features/
│   ├── auth/            # login, profile
│   ├── books/           # list, detail, form, modals
│   ├── staff/           # staff list with CRUD
│   └── members/         # member list, issue/return
└── shared/
    └── components/      # layout (navbar), toast
```

## API Base URL

Edit `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080'   // ← change this if needed
};
```

## Role-Based Access

- **Admin** — full access: books, copies, staff management
- **Librarian** — books, members, issue/return, fine calculation
- **Manager** — read-only: books list, profile

## Angular 19 Patterns Used

- `signal()` / `computed()` for reactive state
- `@if` / `@for` control flow syntax
- Standalone components (no NgModules)
- `inject()` function for dependency injection
- Lazy-loaded routes via `loadComponent`
- `withComponentInputBinding()` for route param as `@Input`
