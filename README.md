# Kafshdoozak - Issue Tracker

A full-featured issue tracking and feedback management system built as a comprehensive front-end bootcamp project for Bale.

## About The Project

Kafshdoozak is a modern, responsive issue tracker that enables teams to manage feedback, track bugs, and collaborate on project issues. The application provides a complete workflow from issue creation to resolution, featuring real-time updates, file attachments, commenting systems, voting mechanisms, and customizable boards.

## Key Features & Capabilities

- **Issue Management**: Create, edit, view, and track issues with detailed information
- **Board View**: Organize issues on a Kanban-style board with status columns
- **Authentication System**: Secure user signup, login, and logout functionality
- **Comments & Discussions**: Thread-based commenting system with infinite scroll
- **File Attachments**: Upload and manage files associated with issues
- **Voting System**: Upvote/downvote issues to prioritize feedback
- **Labels & Tags**: Categorize and filter issues with customizable labels
- **User Profiles**: Manage user data and profile pictures
- **Advanced Filtering**: Search and filter issues by various criteria
- **Responsive Design**: Fully responsive UI with light/dark theme support
- **Real-time Updates**: Efficient state management with Redux and RxJS

## Technologies Used

### Core
- **React 18.3** - Component-based UI library
- **TypeScript 5.2** - Type-safe JavaScript
- **Vite 5.3** - Next-generation front-end build tool

### State Management & Side Effects
- **Redux Toolkit 2.2** - Simplified Redux with modern patterns
- **Redux-Observable 3.0** - Reactive programming with RxJS for async operations
- **RxJS 7.8** - Reactive extensions for managing complex async flows and side effects

### Routing & Navigation
- **React Router DOM 6.26** - Client-side routing

### Styling
- **SCSS/SASS 1.77** - CSS preprocessor with modular styling approach
- **Shabnam Font** - Persian/Farsi typography support

### Testing
- **Vitest 2.1** - Fast unit testing framework
- **Jest 29.7** - JavaScript testing framework
- **Testing Library** - Component testing utilities
- **Redux Mock Store** - Redux testing utilities

### Deployment
- **Docker** - Containerization for consistent deployment

## Challenges Faced (Junior Developer Insights)

### 1. **State Management Complexity**
Managing global state across multiple features (issues, board, authentication, comments) using Redux Toolkit required understanding action creators, reducers, and proper state normalization patterns.

### 2. **Asynchronous Operations with RxJS**
Implementing Redux-Observable epics with RxJS posed a significant learning curve. Managing side effects like API calls, handling race conditions, and implementing features like debounced search required understanding reactive programming concepts and operators like `switchMap`, `mergeMap`, and `catchError`.

### 3. **TypeScript Integration**
Properly typing Redux slices, epic actions, and React components while maintaining type safety throughout the application required deep understanding of TypeScript generics and utility types.

### 4. **Infinite Scroll & Performance**
Implementing efficient infinite scrolling for issues and comments lists while managing state updates and preventing unnecessary re-renders required careful optimization with React hooks like `useIntersector` and debouncing strategies.

### 5. **File Upload Management**
Handling file uploads with proper error handling, progress tracking, and state management across multiple components presented challenges in coordinating UI updates with async operations.

### 6. **Authentication Flow**
Implementing secure authentication with proper token management, protected routes, and maintaining user session state across page refreshes required understanding of React Router guards and local storage strategies.

### 7. **Component Architecture**
Designing reusable, modular components with proper separation of concerns (presentational vs. container components) while maintaining SCSS modules for styling required careful planning and refactoring.

### 8. **Testing Async Flows**
Writing tests for Redux epics using jest-marbles and mock stores to verify complex async workflows and error handling scenarios was challenging but essential for code reliability.

### 9. **Theme Management**
Implementing a dark/light theme system using React Context while ensuring all components properly respond to theme changes required systematic SCSS variable management.

### 10. **Responsive Design**
Creating a fully responsive layout that works seamlessly across desktop, tablet, and mobile devices while maintaining usability and aesthetic consistency required CSS Grid, Flexbox expertise, and mobile-first thinking.

## Getting Started

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MohammadBabaE/Kafshdoozak-issue-tracker.git

# Navigate to project directory
cd Kafshdoozak-issue-tracker

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── views/           # Page-level components
├── state/           # Redux slices and epics
├── hooks/           # Custom React hooks
├── context/         # React context providers
└── styles/          # Global styles and SCSS modules
```

## Learning Outcomes

This project demonstrates proficiency in:
- Modern React development patterns
- Advanced state management with Redux
- Reactive programming with RxJS
- TypeScript in a real-world application
- Comprehensive testing strategies
- Responsive design implementation
- Docker containerization

---

**Developed as part of the Bale Front-End Bootcamp**
