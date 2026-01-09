# Tech2Buddy - React Catalog

This project is a modern, stylish e-commerce catalog built with React, Vite, Tailwind CSS, and Firebase. It features a fully animated interface, an admin panel for inventory management, and a seamless checkout process via WhatsApp.

## Features

- **Modern Tech Stack**: React, Vite, Tailwind CSS.
- **Fluid Animations**: Powered by Framer Motion for a smooth user experience.
- **Real-time Backend**: Firebase Firestore for live product inventory.
- **Admin Panel**: Secret admin area to add, edit, and delete products.
- **WhatsApp Checkout**: Simple and effective order completion via WhatsApp.
- **Responsive Design**: Looks great on all devices, from mobile to desktop.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

### 1. Configure Firebase

Before running the application, you need to set up your Firebase configuration.

1.  Open the `public/config.js` file.
2.  Replace the placeholder values in the `__firebase_config` object with your actual Firebase project credentials.

    ```javascript
    var __firebase_config = JSON.stringify({
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID"
    });
    ```

### 2. Install Dependencies

Navigate to the project directory in your terminal and run the following command to install the required packages:

```bash
npm install
```

### 3. Run the Development Server

Once the dependencies are installed, you can start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## How to Access the Admin Panel

The admin panel is hidden behind a secret trigger:

1.  **Double-tap** the logo in the top-left corner of the navigation bar.
2.  A modal will appear asking for a passcode.
3.  The default passcode is `2024`. Enter it and click "Authorize".

You will be redirected to the Inventory Lab, where you can manage products.

## Project Structure

-   `public/`: Contains static assets and the crucial `config.js` for Firebase credentials.
-   `src/`: Contains all the React application source code.
    -   `App.jsx`: The main application component containing all views, logic, and state.
    -   `main.jsx`: The entry point for the React application.
    -   `index.css`: Tailwind CSS directives and base styles.
-   `package.json`: Lists all project dependencies and scripts.
-   `vite.config.js`: Configuration file for the Vite bundler.
-   `tailwind.config.js`: Configuration for Tailwind CSS.
