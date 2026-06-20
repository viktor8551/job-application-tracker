# Job Application Tracker

A small job application tracker for managing roles, statuses, dates, job links, and notes during a job search.

## About

I started this project because I am currently searching for a job myself and wanted to build something around that process.

This is mostly a personal side project for learning, experimenting, and building something useful for myself. I do not currently expect this to become a published website or a real production app. It is a small project I am building for fun.

## Features

- Track job applications in one place
- Organize applications by status
- Keep useful details such as dates, job links, and notes
- Search and filter the application list
- Get a quick overview of application progress

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| UI | shadcn-style local components, Radix UI, Phosphor Icons |
| Backend | ASP.NET Core, Entity Framework Core |
| Database | PostgreSQL |
| Testing | xUnit, Testcontainers |
| Local tools | Docker Compose, pgAdmin |

## Project Structure

```txt
.
|-- api/         # ASP.NET Core API
|-- api.Tests/   # API tests
|-- web/         # React frontend
`-- docker-compose.yml
```

## Getting Started

### Prerequisites

- .NET SDK
- Node.js
- Docker

### Start PostgreSQL

Docker must be running.

From the repository root:

```powershell
docker compose up -d
```

This starts:

- PostgreSQL on port `5432`
- pgAdmin on port `5050`

### Apply database migrations

```powershell
dotnet ef database update --project api
```

### Start the API

```powershell
dotnet run --project api
```

### Start the frontend

```powershell
cd web
npm install
npm run dev
```

## Tests

The API tests use Testcontainers, so Docker must be running before running tests.

```powershell
dotnet test
```
