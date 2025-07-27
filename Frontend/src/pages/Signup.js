import { Link, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react'
import Axios from 'axios'

function Signup() {

    const [usernameReg, setUsernameReg] = useState('')
    const [passwordReg, setPasswordReg] = useState('')
    const [yearOfStudy, setYearOfStudy] = useState("");
    const [displayPicLink, setDisplayPicLink] = useState("");
    const [course, setCourse] = useState("");
    const [faculty, setFaculty] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const register = async () => {
        // Validate all required fields
        if (
            !usernameReg ||
            !passwordReg ||
            !yearOfStudy ||
            !course ||
            !faculty
        ) {
            setErrorMessage("Please fill all required fields.");
            return;
        }

        try {
            const response = await Axios.post(
            "https://classify-backend-production.up.railway.app/signup",
            {
                username: usernameReg,
                pass: passwordReg,
                year_of_study: yearOfStudy,
                enrolled_course: course,
                faculty: faculty,
                display_picture_link: displayPicLink,
            }
            );

            if (response.data.success) {
                //  navigate to login or homepage after signup
                navigate("/login");
            } else {
                setErrorMessage(response.data.message || "Signup failed.");
            }
        } catch (error) {
            console.error("Signup error: ", error);
            setErrorMessage("An error occurred during signup. Please try again.");
        }
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
            <div className="mt-3">
                <label htmlFor="username" className="block text-base mb-2">Year of Study</label>
                <select
                    id="yearOfStudy"
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                >
                    <option value="">Select Year of Study</option>
                    {[1, 2, 3, 4, 5].map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                    ))}
                </select>
            </div>
            <div className="mt-3">
                <label htmlFor="username" className="block text-base mb-2">Enrolled Course</label>
                <input type="text" id="username" placeholder="Enter Course..." onChange={e => setCourse(e.target.value)}
                className="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" />
            </div>
            <div className="mt-3">
                <label htmlFor="username" className="block text-base mb-2">Faculty</label>
                <input type="text" id="username" placeholder="Enter Faculty..." onChange={e => setFaculty(e.target.value)}
                className="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" />
            </div>
            <div className="mt-3">
                <label htmlFor="username" className="block text-base mb-2">Link to Display Picture</label>
                <input type="text" id="username" placeholder="Enter Link..." onChange={e => setDisplayPicLink(e.target.value)}
                className="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" />
            </div>

            {errorMessage && (
                <div className="mt-3 text-red-600 font-semibold">{errorMessage}</div>
            )}

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