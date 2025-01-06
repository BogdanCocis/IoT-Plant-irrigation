import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./pages/Autentification/Login";
import Register from "./pages/Autentification/Register";
import UserDashboard from "./pages/Dashbord/UserDashboard";
import ChildDashboard from "./pages/Dashbord/ChildDashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>,
    },
    {
        path: "/userdashboard",
        element: <UserDashboard/>,
    },
    {
        path: "/childdashboard",
        element: <ChildDashboard/>,
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
reportWebVitals();