# Job Application Tracker with AI

## Project Overview

Job Application Tracker is a full-stack web application that helps users organize and manage their job applications in one place. Users can create an account, log in securely, and track job applications with details such as company name, job role, application status, date, and notes.

The application also includes an AI-powered feature that provides assistance related to the job application workflow.

## Problem Statement

Managing multiple job applications can become confusing. Users may apply to different companies and forget the current status, job role, application date, or important notes.

This application provides a simple solution for storing and managing job applications in one organized dashboard.

## Features

- User Signup
- User Login
- Authentication and protected routes
- Dashboard for managing job applications
- Add job applications
- Store company and job role information
- Track application status
- Store application dates and notes
- AI-powered assistance
- Form validation
- Error and success messages
- Backend API integration
- Database integration

## Technology Stack

### Frontend

- HTML
- CSS
- JavaScript
- Vite

### Backend

- Node.js
- Express.js

### Database

- SQLite
- Prisma ORM

### Authentication

- JWT (JSON Web Token)

### AI Feature

The application includes an AI-powered feature integrated through the backend. The AI functionality supports the job application workflow and helps users generate useful suggestions or content.

## Application Architecture

The project follows a full-stack architecture:

Frontend
→ Sends requests to the Backend API
→ Backend handles authentication and application logic
→ Prisma communicates with SQLite Database
→ Backend also handles AI requests securely

The frontend communicates with the backend using API requests. Authentication is used to protect user data and private routes.

## User Flow

1. User creates an account.
2. User logs into the application.
3. The user accesses the protected dashboard.
4. The user creates and manages job applications.
5. The user tracks the status of applications.
6. The user can use the AI-powered feature for assistance.

## Database

The application uses SQLite as the local database and Prisma as the ORM.

The database stores:

- User information
- User job applications
- Application status
- Application dates
- Notes
- AI-generated content where applicable

## Authentication

Authentication is implemented using JWT.

Users can:

- Create an account
- Log in
- Access protected routes after authentication
- Be redirected when authentication is not available

## Validation and Error Handling

The application includes basic validation and error handling.

Examples include:

- Required field validation
- Invalid login handling
- API error handling
- User-friendly success and error messages
- Protected routes for unauthorized users

## Challenge Faced
One challenge during development was configuring the database connection and authentication system. The project was initially configured differently, and the database setup required changes to support local SQLite usage.
The issue was resolved by configuring the SQLite database, updating the Prisma schema, generating the Prisma client, and running database migrations.

## Future Improvements
-Deploy the frontend and backend
,Add more detailed job application analytics
,Add search and filtering
,Add email notifications
,Improve AI suggestions
,Add profile management

## Installation and Setup

### Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
