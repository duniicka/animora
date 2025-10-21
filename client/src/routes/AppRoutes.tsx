import React from "react";
import { Routes, Route, type RouteObject } from "react-router-dom";

import Home from "../pages/Client/Home";
import About from "../pages/Client/About";
import Contact from "../pages/Client/Contact";
import Profile from "../pages/Client/Profile";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PetList from "../pages/Client/PetList";
import PetDetails from "../pages/Client/PetDetails";
import AddPet from "../pages/Owner/AddPet";
import MyPets from "../pages/Owner/MyPets";
import EditPet from "../pages/Owner/EditPet";
import AdoptionRequest from "../pages/Client/AdoptionRequest";
import AdminDashboard from "../pages/Admin/Dashboard";
import ManagePets from "../pages/Admin/ManagePets";
import ManageUsers from "../pages/Admin/ManageUsers";
import ClientLayout from "../layouts/client/ClientLayout";
import AuthLayout from "../layouts/auth/AuthLayout";
import { ResetPassword } from "../pages/Auth/ResetPassword";
import AdminLayout from "../layouts/admin/AdminLayout";
import OwnerLayout from "../layouts/owner/OwnerLayout";
import NotFound from "../pages/Error/NotFound";
import OwnerDashboard from "../pages/Owner/OwnerDashboard";
import AdoptionProcess from "../pages/Client/AdoptionProcess";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import OwnerChat from "../pages/Owner/OwnerChat";
// Define the routes using RouteObject array
const ROUTES: RouteObject[]  = [
   {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
         index: true,
         element: <Home />
      },
      {
         path: "about",
         element: <About />
      },
      {
         path: "adoption-process",
         element: <AdoptionProcess />
      },
      {
         path: "contact",
         element: <Contact />
      },
      {
         path: "profile",
         element: <Profile />
      },
      {
         path: "pets",
         element: <PetList />
      },
      {
         path: "pets/:id",
         element: <PetDetails pet={undefined as any} setPage={() => {}} />
      },
      {
         path: "adoption-request/:petId", 
         element: <AdoptionRequest />
      },
    ]
   },

   {
      element: <AuthLayout />,
      path: "/auth",
      children: [
         {
            path: "login",
            element: <Login />
         },
         {
            path: "register",
            element: <Register />
         },
         {
            path: "reset-password",
            element: <ResetPassword />
         },
         {
            path: "reset-password/:token",
            element: <ResetPassword />
         },
         {
            path: "forgot-password",
            element: <ForgotPassword />
         }
      ]
   },
   {
      element: <AdminLayout />,
      path: "/admin",
      children: [
         {
            index: true,
            element: <AdminDashboard />
         },
         {
            path: "manage-pets",
            element: <ManagePets />
         },
         {
            path: "manage-users",
            element: <ManageUsers />
         }
      ]
   },
   {
      element: <OwnerLayout />,
      path: "/owner",
      children: [
         {
            index: true,
            element: <OwnerDashboard pets={[]} navigate={() => {}} currentOwnerId={""} />
         },
         {
            path: "add-pet",
            element: <AddPet navigate={() => {}} addPet={() => {}} />
         },
         {
            path: "my-pets",
            element: <MyPets />
         },
         {
            path: "edit-pet/:id",
            element: <EditPet pets={[]} currentOwnerId={""} navigateToEdit={() => {}} navigate={() => {}} />
         },
         {
            path: "chat",
            element: <OwnerChat />
         }
      ]
   },
   {
      path: "*",
      element: <NotFound setPage={() => {}} />
   }
];

export default ROUTES;
