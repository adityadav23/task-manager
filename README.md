# Task Management API

A comprehensive RESTful API for a task management system using Node.js. The API includes user authentication, role-based access control, task management, real-time updates, notifications, and analytics.

## Table of Contents
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## Features
- User Authentication (JWT)
- Role-Based Access Control (Admin, Manager, User)
- Task Management (CRUD)
- Task Assignment
- Real-Time Updates (WebSockets)
- Notifications (Twilio)
- Analytics
- Rate Limiting
- Centralized Error Handling
- OpenAPI Specification (Swagger)

## Setup

### Prerequisites
- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/yourusername/task-management-api.git
   cd task-management-api

2. Install Dependencies
    npm install

3. Create .env file and add below variables
  
   PORT=3000
   JWT_SECRET=your_jwt_secret
   
   MONGODB_URI=mongodb://localhost:27017/taskmanager

   EMAIL_USERNAME=your_email@gmail.com

   EMAIL_PASSWORD=your_email_password

   SENDGRID_API_KEY=your_sendgrid_api_key

   TWILIO_ACCOUNT_SID=your_twilio_account_sid

   TWILIO_AUTH_TOKEN=your_twilio_auth_token

   TWILIO_PHONE_NUMBER=your_twilio_phone_number

5. Start development server
   
   npm run dev
   
7. Run tests

   npm test

 ##Usage

   Authentication
    User Registration
        Endpoint: POST /api/auth/register
        Description: Register a new user
        Body Parameters:
            username: string
            email: string
            password: string

    User Login
        Endpoint: POST /api/auth/login
        Description: Log in a user and get a JWT token
        Body Parameters:
            username: string (or email)
            password: string

    User Logout
        Endpoint: POST /api/auth/logout
        Description: Log out the authenticated user
        Headers: Authorization: Bearer <token>

 User Profile

    Get User Profile
        Endpoint: GET /api/user/profile
        Description: Retrieve the profile information of the authenticated user
        Headers: Authorization: Bearer <token>

 Task Management

    Create Task
        Endpoint: POST /api/tasks
        Description: Create a new task
        Body Parameters:
            title: string
            description: string
            dueDate: string (ISO format)
            priority: string (low, medium, high)
            status: string (pending, in-progress, completed)
            assignedTo: string (User ID)

    Read Tasks
        Endpoint: GET /api/tasks
        Description: Retrieve a list of tasks with optional filtering and sorting parameters
        Query Parameters:
            status: string
            priority: string
            dueDate: string (ISO format)

    Update Task
        Endpoint: PUT /api/tasks/:id
        Description: Update task details
        Body Parameters: (any of the create task parameters)

    Delete Task
        Endpoint: DELETE /api/tasks/:id
        Description: Delete a task

    Assign Task
        Endpoint: POST /api/tasks/:id/assign
        Description: Assign a task to a user
        Body Parameters:
            assignedTo: string (User ID)

Real-Time Updates

    WebSockets
        Endpoint: /ws
        Description: Establish a WebSocket connection for real-time updates

Notifications

    Configure Notification Preferences
        Endpoint: POST /api/notifications/preferences
        Description: Configure notification preferences (e.g., email, SMS)
        Body Parameters:
            email: boolean
            sms: boolean

Analytics

    Get Task Completion Statistics by User
        Endpoint: GET /api/analytics/tasks/completion/user
        Description: Retrieve task completion statistics for a specific user
        Query Parameters:
            user: string (User ID)

    Get Task Completion Statistics by Team
        Endpoint: GET /api/analytics/tasks/completion/team
        Description: Retrieve task completion statistics for a specific team
        Query Parameters:
            team: string (Team ID)

API Documentation

The API is documented using OpenAPI Specification (OAS) and can be accessed via Swagger UI.

    Swagger UI: http://localhost:3000/api-docs



