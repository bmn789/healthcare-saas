# Healthcare SaaS Frontend

A B2B healthcare platform frontend built with React, TypeScript, Vite, Tailwind CSS, Zustand, Firebase Authentication, and Service Worker notifications.

This project demonstrates:
- Authentication workflows (sign in + self signup)
- Protected routing and session handling
- Analytics and dashboard UI
- Patient management with grid/list views
- Responsive layout with desktop sidebar and mobile hamburger navigation
- Local notification flow using service workers

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- Firebase Authentication
- Recharts (analytics charts)
- Lucide React (icons)

## Features

### 1) Authentication
- Email/password login via Firebase
- Self-signup in UI (`Create account`)
- Validation and error states
- Session persistence with auth state listener
- Protected app routes

### 2) Application Pages
- `Login`
- `Dashboard`
- `Analytics`
- `Patient Details`
- `Not Found (404)`

### 3) Patient Details Module
- Toggle between:
  - Grid view
  - List view
- State persisted in `uiStore`
- Mobile-safe table behavior (table scrolls in container, not full page)

### 4) Notifications (Service Worker)
- Service worker registration on app load
- Trigger notification use case on Dashboard
- Notification click returns/focuses app window

## Project Structure

```text
src/
  components/
    auth/ProtectedRoute.tsx
    layout/AppLayout.tsx
    patients/
      PatientGrid.tsx
      PatientList.tsx
      ViewToggle.tsx
  data/patients.ts
  hooks/useNotifications.ts
  lib/firebase.ts
  pages/
    LoginPage.tsx
    DashboardPage.tsx
    AnalyticsPage.tsx
    PatientDetailsPage.tsx
    NotFoundPage.tsx
  store/
    authStore.ts
    uiStore.ts
  types/patient.ts
  App.tsx
  main.tsx
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- A Firebase project with Authentication enabled

### Installation

```bash
npm install
```

### Environment Variables

Create `.env` from `.env.example` and fill in Firebase values:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Firebase Setup Checklist

In Firebase Console:
- Enable **Authentication**
- Enable **Email/Password** sign-in provider
- Add `localhost` to authorized domains
- Create a test user (or use self-signup from the app)

## Run Scripts

```bash
npm run dev      # Start development server
npm run lint     # Run ESLint
npm run build    # Type-check + production build
npm run preview  # Preview production build
```

## Demo Flow

1. Open app and sign in or create an account
2. Explore Dashboard metrics
3. Trigger local notification from Dashboard
4. Open Analytics trends
5. Go to Patient Details and switch Grid/List views

## Notes

- Notification behavior can vary by browser and OS permission settings.
- This project currently uses mocked patient data in `src/data/patients.ts`.
