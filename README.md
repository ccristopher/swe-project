# Team <Pet & Prose> — Spring 2026 (Section 16942)

## Overview

## Links

## Workflow

## Getting Started

Install dependencies inside each app folder:

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

Create local env files from the examples:

```bash
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env
```

Then fill in the Clerk keys and MongoDB credentials.

## Run Locally

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

## Environment Variables

`backend/.env`

```bash
DB_USER=
DB_PASSWORD=
```

`frontend/.env.local`

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```
