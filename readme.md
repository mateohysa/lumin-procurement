# Smart Procurement Platform

**Smart Procurement Platform** is a full-stack web application that streamlines the tender/procurement lifecycle. It provides separate dashboards and role-based flows for:

- **Procurement Managers (Admin)**: Create and manage tenders, review vendor submissions, select winners, and generate reports.
- **Vendors**: Browse and apply to open tenders, view application status, and get AI-driven insights to improve proposals.
- **Evaluators**: Review submissions, score evaluation criteria, and submit evaluations.

The platform is built with:

- **Back-End**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT-based authentication, AWS S3 file uploads
- **Front-End**: React 18, Vite, TypeScript, React Router, React Query, Context API, Tailwind CSS, Lucide Icons, Radix UI
- **AI Services**: Integration with a mock AI service for scoring and insights

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Setup & Installation](#setup--installation)
5. [Environment Variables](#environment-variables)
6. [Running the Application](#running-the-application)
   - [Back-End](#back-end)
   - [Front-End](#front-end)
7. [Project Structure](#project-structure)
8. [API Endpoints](#api-endpoints)
9. [Front-End Routes](#front-end-routes)
10. [Authentication & Authorization](#authentication--authorization)
11. [Database Models](#database-models)
12. [Contributing](#contributing)
13. [License](#license)
14. [Docker Compose (Fake)](#docker-compose-fake)

---

## Features

- Role-based dashboards (Admin, Vendor, Evaluator)
- JWT authentication & role-based guards
- Create, update, delete, and list tenders
- Vendor submission portal with file attachments (S3)
- Evaluator scoring UI with per-criterion weights
- Batch evaluation across multiple vendors per tender
- AI-driven insights and proposal scoring (mocked service)
- Search, sort, and filter across tenders and submissions
- Responsive UI with Tailwind CSS & Radix components
- React Query for server state management

---

## Tech Stack

**Back-End**
- Node.js & Express (TypeScript)
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for auth
- AWS S3 (via `fileService`) for file uploads
- Express Validator for request validation

**Front-End**
- React 18, Vite, TypeScript
- React Router for client routing
- React Query for data fetching/caching
- Context API for auth state
- Tailwind CSS & Radix UI for styling & components
- Lucide Icons & Sonner/Toaster for notifications

**AI Services**
- `aiService` (mock) for evaluating proposals via text-based scoring

---

## Prerequisites

- Node.js v16+ & npm or Yarn
- MongoDB instance (local or Atlas)
- AWS S3 bucket credentials (for file uploads)

---

## Setup & Installation

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd lumina-procurement
   ```
2. **Back-End**
   ```bash
   cd server
   npm install
   ```
3. **Front-End**
   ```bash
   cd ../client
   npm install
   ```

---

## Environment Variables

### Server (`server/.env`)
```
PORT=5173
MONGO_URI=mongodb://localhost:27017/procurement_db
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=your_bucket_name
``` 

### Client (`client/.env`)
```
VITE_API_URL=http://localhost:5173/api
CLIENT_URL=http://localhost:8080
``` 

---

## Running the Application

### Back-End

```bash
cd server
npm run dev
``` 
Server runs on `http://localhost:5173` and exposes `/api` routes.

### Front-End

```bash
cd client
npm run dev
``` 
Client runs on `http://localhost:8080`, with `/api` calls proxied to the back-end.

---

## Project Structure

```
├── server/              # Express back-end
│   ├─ src/
│   │  ├─ config/db.config.ts   # MongoDB connection
│   │  ├─ routes/               # Express routers
│   │  ├─ services/             # Business logic & DB access
│   │  ├─ models/               # Mongoose schemas
│   │  ├─ middleware/           # Auth & validation
│   │  └─ utils/jwt.ts          # JWT handling
│   └─ .env                     # Server env vars

└── client/              # React front-end
    ├─ src/
    │  ├─ pages/                # Route-level pages
    │  ├─ components/           # Shared UI components
    │  ├─ contexts/AuthContext.tsx
    │  ├─ lib/api-client.ts     # Axios wrapper
    │  └─ App.tsx, main.tsx
    └─ vite.config.ts
``` 

---

## API Endpoints

| Method | Path                                | Description                             | Access                    |
|--------|-------------------------------------|-----------------------------------------|---------------------------|
| POST   | /api/login                          | Log in and receive JWT                  | Public                    |
| POST   | /api/register                       | Create new user                         | Public                    |
| GET    | /api/profile                        | Get current user                        | Authenticated             |
| GET    | /api/tenders/open                   | List open tenders for vendors           | Authenticated (Vendor)    |
| GET    | /api/tenders                        | List tenders (filterable)               | Public                    |
| GET    | /api/tenders/:id                    | Get single tender details               | Public                    |
| POST   | /api/tenders                        | Create new tender                       | Authenticated (Admin)     |
| PUT    | /api/tenders/:id                    | Update tender                           | Authenticated (Admin)     |
| DELETE | /api/tenders/:id                    | Delete tender                           | Authenticated (Admin)     |
| GET    | /api/tenders/:id/submissions        | List submissions for a tender           | Authenticated             |
| POST   | /api/tenders/files                  | Upload attachments                      | Authenticated             |
| GET    | /api/tenders/for-evaluation         | Tenders assigned to evaluator           | Authenticated (Evaluator) |
| GET    | /api/evaluators                     | List evaluators                         | Authenticated             |

---

## Front-End Routes

```
/login                # Authentication screen
/                     # Dashboard (role-based)
/tenders              # Admin: list all tenders
/tenders/:id          # Tender detail
/tenders/:id/submissions # Admin: view vendor submissions
/create-tender        # Admin: new tender form
/available-tenders    # Vendor: browse open tenders
/apply-tender/:id     # Vendor: submit proposal
/my-submissions       # Vendor: view past submissions
/evaluate-tender/:id  # Evaluator: scoring form redirect
/evaluation-form/:id  # Evaluator: scoring form
/my-evaluations       # Evaluator: pending evaluations
/completed-evaluations # Evaluator: history
``` 

---

## Authentication & Authorization

- **JWT**: `Authorization: Bearer <token>` header required on protected routes.
- **Roles**: `admin` (procurement_manager), `vendor`, `evaluator`.
- **Front-End**: `<ProtectedRoute>` wrapper in React Router uses context to guard by role.

---

## Contribution

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/XYZ`)
3. Commit your changes (`git commit -m "Add XYZ feature"`)
4. Push to branch (`git push origin feature/XYZ`)
5. Open a Pull Request

---

## Docker Compose (Fake)

This repository includes a sample `docker-compose.yaml` for local development use only. It spins up three services:

- **api**: The back-end server (Node.js + Express), mounting the `server` folder and exposing port `5173`.
- **client**: The front-end app (Vite), mounting the `client` folder and exposing port `8080`.
- **db**: A MongoDB container, persisting data in a Docker volume.

To run all services locally (mocked only, not for production):
```bash
# From the project root
docker-compose up --build
```

This will:
- Install dependencies and start the back-end on `http://localhost:5173`.
- Install dependencies and start the front-end on `http://localhost:8080`.
- Launch MongoDB accessible at `mongodb://localhost:27017`.

> Note: This setup is a development convenience. For production deployments, please configure proper Dockerfiles, multi-stage builds, and secure environment variables.

---

