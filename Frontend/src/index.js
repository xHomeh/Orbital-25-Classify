import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, RouterProvider, Routes, Route, createBrowserRouter} from 'react-router-dom';

import HomePage from './pages/HomePage';
import Login from './pages/Login'

import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/login',
        element: <Login />,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)