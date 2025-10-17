import React from "react";
import { BrowserRouter, createBrowserRouter, Route, BrowserRouter as Router, RouterProvider, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";

const router = createBrowserRouter(AppRoutes);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
