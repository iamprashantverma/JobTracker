# Job Tracker Application

A full-stack job application tracking system built with React frontend and Spring Boot backend.

## Features

### Authentication
- User registration and login
- Session-based authentication
- Protected routes

### Job Management
- Add new job applications
- View all job applications with filtering
- Edit existing job applications
- Delete job applications
- Filter by status, company, and date range

### Dashboard
- Overview of application statistics
- Recent applications
- Quick actions

## Frontend Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Backend Integration

This frontend is designed to work with the Spring Boot backend that provides the following endpoints:

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration  
- `POST /auth/logout` - User logout

### Job Endpoints
- `GET /jobs` - Get all jobs (with pagination)
- `POST /jobs` - Add new job (multipart form data with resume file)
- `GET /jobs/{id}` - Get job by ID
- `PUT /jobs/{id}` - Update job
- `DELETE /jobs/{id}` - Delete job
- `GET /jobs/between?from={date}&to={date}` - Get jobs between dates
- `GET /jobs/company/{companyName}` - Get jobs by company
- `GET /jobs?status={status}` - Get jobs by status

**Note**: The current backend API supports single-filter queries. When multiple filters are applied simultaneously (e.g., status + company), the frontend performs client-side filtering after fetching all jobs. For better performance with large datasets, consider implementing a combined search endpoint in the backend.

### User Endpoints
- `GET /user` - Get current user details

## Project Structure

```
src/
├── component/
│   └── NavBar.jsx          # Navigation component
├── context/
│   └── AuthContext.jsx     # Authentication context
├── pages/
│   ├── Dashboard.jsx       # Dashboard with statistics
│   ├── JobList.jsx         # Job listing with filters
│   ├── AddJob.jsx          # Add new job form
│   ├── EditJob.jsx         # Edit job form
│   ├── LogIn.jsx           # Login page
│   └── SignUp.jsx          # Registration page
├── service/
│   └── apiService.js       # API service functions
├── App.jsx                 # Main app component with routing
├── App.css                 # Custom styles
└── main.jsx               # App entry point
```

## Technologies Used

- **React 19** - Frontend framework
- **React Router DOM** - Client-side routing
- **React Bootstrap** - UI components
- **React Toastify** - Notifications
- **React Icons** - Icon library
- **Vite** - Build tool and dev server

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Session-Based Authentication

The application uses session-based authentication with cookies. Make sure your Spring Boot backend is configured to:

1. Enable CORS for your frontend URL
2. Configure session management
3. Set appropriate cookie settings for cross-origin requests

Example Spring Boot CORS configuration:
```java
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
```

## Job Status Types

The application supports the following job statuses:
- **APPLIED** - Initial application submitted
- **INTERVIEW** - Interview scheduled or completed
- **OFFER** - Job offer received
- **REJECTED** - Application rejected

## Features Overview

### Dashboard
- Statistics cards showing counts by status
- Recent job applications list
- Quick action buttons

### Job Management
- Comprehensive job listing with search and filters
- Add new job applications with all relevant details
- Edit existing applications
- Delete applications with confirmation
- Filter by status, company name, and date ranges

### Authentication
- Secure login/logout functionality
- Session persistence
- Protected routes that redirect to login when not authenticated
- User-friendly error handling and validation