# React Template

[English](/README.md) | [Vietnamese](/README-VIETNAMESE.md)

#

## Introduction

A feature-based CMS React template designed to work seamlessly with the [Clean Architecture .NET template](https://github.com/minhsangdotcom/clean-architecture).

## Give a :star:

If you find this helpful or learn something from it, feel free to give it a :star:

## Feature-Based Structure :rocket:

A feature-based structure organizes code by business features or functional domains rather than by technical layers. Each feature folder contains all the related components, hooks, utilities, styles, and tests needed for that specific feature to function independently.

### Pros

- **High Cohesion** - Related code stays together, making features easier to understand and modify.
- **Scalability** - Easy to add new features without affecting existing structure
- **Team Collaboration** - Multiple developers can work with minimal conflicts
- **Maintainability** - Changes are isolated to specific features

### Cons

- **Initial Complexity** - Requires upfront planning for feature boundaries
- **Potential Duplication** - Risk of recreating similar components across features
- **Unclear Boundaries** - Some functionality may blur between features

## :file_folder: Project Structure

```
src/
├── assets/          # Static files (images, fonts, icons)
├── components/      # Reusable UI components
├── config/          # App configuration files
├── design-system/   # Design tokens and theme configuration
├── features/        # Feature-based modules
├── hooks/           # Custom React hooks
├── layouts/         # Page layout components
├── lib/             # Third-party library configurations
├── locales/         # Internationalization (i18n) translation files
├── notifications/   # Notification system utilities
├── routes/          # Routing configuration
├── services/        # API calls and external services
├── store/           # State management (Redux/Zustand)
├── styles/          # Global styles and CSS modules
├── types/           # TypeScript type definitions
├── utils/           # Helper functions and utilities
├── App.tsx          # Root application component
├── i18n.d.ts        # i18n TypeScript declarations
├── i18n.ts          # i18n configuration
├── index.css        # Global CSS styles
├── main.tsx         # Application entry point
└── vite-env.d.ts    # Vite environment type definitions

```

## Features :sparkles:

1. :lock: **Authentication** – Login & Forgot Password
2. :bust_in_silhouette: **Profile Management** – Update Profile & Change Password
3. :shield: **Role Management**
4. :busts_in_silhouette: **User Management**
5. :globe_with_meridians: **Multi-language Support (i18n)**
6. :mag: **Advanced Data Handling** – Sorting, Searching, Filtering (LHS Bracket), Pagination (Offset & Cursor), fully compatible with the [Clean Architecture .NET template](https://github.com/minhsangdotcom/clean-architecture)
7. :iphone: **Fully Responsive UI** – Optimized for all screen sizes

## Some Screenshots :fire:

<p align="center">
  <img src="/screenshot/login.png" alt="Login" width="720" /><br />
  <img src="/screenshot/forgot-password.png" alt="Forgot Password" width="720" /><br />
  <img src="/screenshot/reset-password.png" alt="Reset Password" width="720" /><br />
  <img src="/screenshot/profile.png" alt="Profile" width="720" /><br />
  <img src="/screenshot/change-password.png" alt="Change Password" width="720" /><br />
  <img src="/screenshot/home.png" alt="Home" width="720" /><br />
  <img src="/screenshot/role.png" alt="Role Management" width="720" /><br />
  <img src="/screenshot/create-role.png" alt="Create Role" width="720" /><br />
  <img src="/screenshot/user.png" alt="User Management" width="720" /><br />
  <img src="/screenshot/create-user.png" alt="Create User" width="720" /><br />
  <img src="/screenshot/update-user.png" alt="Update User" width="720" /><br />
  <img src="/screenshot/data-hanling.png" alt="Data Handling" width="720" /><br />
</p>

<p align="center">
  <img src="/screenshot/home-mobile.png" width="220" />
  <img src="/screenshot/role-mobile.png" width="220" />
  <img src="/screenshot/create-role-mobile.png" width="220" />
</p>

<p align="center">
  <img src="/screenshot/user-mobile.png" width="220" />
  <img src="/screenshot/user-mobile-2.png" width="220" />
  <img src="/screenshot/update-user-mobile.png" width="220" />
</p>

## :package: Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
npm install
# or
yarn --network-timeout 1000000000
```

### 3. Environment setup

Create a `.env.development` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_HOST_PORT=3000
VITE_STORAGE_PREFIX=theTemplate_
VITE_DEFAULT_LANGUAGE=vi
VITE_SUPPORTED_LANGUAGES=en,vi
```

> **Note:** `http://localhost:8080/api/v1` points to the .NET backend template. Make sure your backend is running on this URL.

### 4. Run development server

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## Tech Stack

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **i18next** - Internationalization

## License

This project is under [MIT License](/LICENSE).
