import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, RouterProvider, Routes, Route, createBrowserRouter} from 'react-router-dom';
import Axios from 'axios'

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage';
import Signup from './pages/Signup';
import FriendsPage from './pages/FriendsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

import UserContext from './contexts/UserContext';

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
    {
        path: '/friends',
        element: <FriendsPage />,
    },
    {
        path: '/settings',
        element: <SettingsPage />,
    },
    {
        path: '/profile/:id',
        element: <ProfilePage />,
    },
]);

function Root() {
    const [user, setUser] = React.useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <RouterProvider router={router} />
        </UserContext.Provider>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
)