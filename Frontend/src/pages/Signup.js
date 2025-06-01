import { Link } from "react-router-dom"
import React, { useState } from 'react'
import Axios from 'axios'

function Signup() {

    const [usernameReg, setUsernameReg] = useState('')
    const [passwordReg, setPasswordReg] = useState('')

    const register = () => {
        Axios.post('${process.env.REACT_APP_API_URL}/signup', {
            username: usernameReg, 
            password: passwordReg
        }).then((response) => {
            console.log(response)
        });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-neutral-800">
            <div className="w-96 p-6 shadow-lg bg-white rounded-md form-box" id="register-form">
            <h1 className="text-3xl block text-center font-semibold"><i className="fa-solid fa-user"></i> Register</h1>
            <hr className="border-gray-300 mt-3"/>
            <div className="mt-3">
                <label htmlFor="username" className="block text-base mb-2">Username</label>
                <input type="text" id="username" placeholder="Enter Username..." onChange={e => setUsernameReg(e.target.value)}
                className="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" />
            </div>
            <div className="mt-3">
                <label htmlFor="password" className="block text-base mb-2">Password</label>
                <input type="password" id="password" placeholder="Enter Password..." onChange={e=>setPasswordReg(e.target.value)}
                className="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" />
            </div>
            <div className="mt-5">
                <button type="submit" onClick={register} 
                className="border-2 border-orange-600 bg-orange-600 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-orange-600 font-semibold">Register</button>
            </div>
            <div className="mt-3 flex">
                <label htmlFor="register" className="block test-base mb-2">Have an account?</label>
                <Link className="px-1 text-sky-700 font-semibold" to="/login">Log In</Link>
            </div>
            </div>

        </div>
    );
}

export default Signup;