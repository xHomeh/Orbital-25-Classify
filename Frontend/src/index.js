import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, RouterProvider, Routes, Route, createBrowserRouter} from 'react-router-dom';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage';
import Signup from './pages/Signup';

import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        errorElement: <NotFoundPage />, 
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)