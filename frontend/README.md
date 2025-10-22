# Identity Frontend - React Application

A simple, clean React frontend for the Identity session-based authentication backend.

## Features

- **Session-Based Authentication**: Secure login/register using HTTP-only cookies
- **Protected Routes**: Client-side route protection for authenticated users
- **Clean Architecture**: Well-organized folder structure following best practices
- **Reusable Components**: Modular UI components for consistency
- **Form Validation**: Client-side validation for better UX
- **Responsive Design**: Mobile-friendly interface
- **No External UI Libraries**: Pure CSS styling

## Tech Stack

- **React** 18.3.1
- **Vite** 6.0.7 (Build tool)
- **React Router DOM** 7.1.3 (Routing)

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── api/                 # API service layer
│   │   ├── config.js        # API configuration
│   │   └── auth.api.js      # Authentication API calls
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── Alert.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── layout/          # Layout components
│   │       └── Navbar.jsx
│   ├── context/             # React Context
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── ProfilePage.jsx
│   ├── App.jsx              # Main app component with routing
│   ├── App.css              # App-specific styles
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── .env                     # Environment variables
└── package.json
```

## Setup & Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` if your backend runs on a different port

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Design Principles

### 1. **Separation of Concerns**
- API logic separated from components
- Business logic in Context API
- Presentation logic in components

### 2. **Component Composition**
- Reusable UI components (Button, Input, Card, Alert)
- Layout components for consistent structure
- Page components for routing

### 3. **State Management**
- AuthContext provides global authentication state
- Local state for form management
- No external state management libraries needed

### 4. **Security**
- Credentials included in fetch for session cookies
- Protected routes redirect unauthenticated users
- Client-side validation prevents invalid requests

### 5. **Clean Code**
- JSDoc comments for documentation
- Consistent naming conventions
- Single responsibility principle

## Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/profile` - User profile (protected)

## API Integration

The frontend communicates with the backend using the following endpoints:

- `POST /auth/register-session` - User registration
- `POST /auth/login-session` - User login
- `GET /auth/profile-session` - Get user profile (protected)
- `POST /auth/logout-session` - User logout (protected)

All requests include `credentials: 'include'` to send session cookies.

## Authentication Flow

1. **Registration/Login**: User submits credentials
2. **Session Creation**: Backend creates session and sets HTTP-only cookie
3. **State Update**: Frontend updates AuthContext with user data
4. **Route Protection**: ProtectedRoute component checks authentication
5. **Logout**: Backend destroys session, frontend clears user state

## Building for Production

```bash
npm run build
```

The build files will be in the `dist/` directory.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
- No IE11 support

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:3000`)

## Notes

- Ensure backend is running before starting frontend
- Backend must have CORS configured to allow frontend origin
- Session cookies require same-site or proper CORS configuration
