import { Link, useNavigate } from "react-router-dom"
import React, { useState, useContext } from 'react'
import Axios from 'axios'
import UserContext from '../contexts/UserContext'


function Login() {

    const [usernameLogin, setUsernameLogin] = useState('')
    const [passwordLogin, setPasswordLogin] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const login = async () => {
        try {
            const response = await Axios.post('https://classify-backend-production.up.railway.app/login', {
                username: usernameLogin, 
                password: passwordLogin
            });

            if (response.data.success) {
                setUser({ 
                    id: response.data.user.id,
                    username: response.data.user.username })
                navigate('/')
            } else {
                setErrorMessage(response.data.message)
            }

        } catch (error) {    
            console.error("Login error: ", error);
            setErrorMessage("An error occurred during login. Please try again.");
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-neutral-800">
            <div className="w-96 p-6 shadow-lg bg-white rounded-md form-box active" id="login-form">
            <h1 className="text-3xl block text-center font-semibold"><i className="fa-solid fa-user"></i> Login</h1>
            <hr className="border-gray-300 mt-3"/>
        
            <div className="mt-3">
                <label htmlFor="username" className="block text-base mb-2">Username</label>
                <input type="text" id="username" placeholder="Enter Username..." onChange={e => setUsernameLogin(e.target.value)} 
                className="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" />
            </div>

            <div className="mt-3">
                <label htmlFor="password" className="block text-base mb-2">Password</label>
                <input type="password" id="password" placeholder="Enter Password..." onChange={e=>setPasswordLogin(e.target.value)}
                className="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" />
            </div>

            <div className="mt-5">
                <button type="submit" onClick={login}
                className="border-2 border-orange-600 bg-orange-600 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-orange-600 font-semibold">Login</button>
            </div>

            <div className="mt-3 flex">
                <label htmlFor="register" className="block test-base mb-2">New to Classify?</label>
                <Link className="px-1 text-sky-700 font-semibold" to="/signup">Sign Up</Link>
            </div>

            <div>
                <Link className="text-sky-700 font-semibold" to="/">Back to Home</Link>
            </div>

            </div>
        </div>
    );
}

export default Login;