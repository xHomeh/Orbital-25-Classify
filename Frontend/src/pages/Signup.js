import { Link } from "react-router-dom"

function Signup() {
    return (
        <div class="flex justify-center items-center h-screen bg-zinc-900">
            <div class="w-96 p-6 shadow-lg bg-white rounded-md form-box" id="register-form">
            <h1 class="text-3xl block text-center font-semibold"><i class="fa-solid fa-user"></i> Register</h1>
            <hr class="border-gray-300 mt-3"/>
            <div class="mt-3">
                <label for="username" class="block text-base mb-2">Username</label>
                <input type="text" id="username" class="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" placeholder="Enter Username..."/>
            </div>
            <div class="mt-3">
                <label for="email" class="block text-base mb-2">Email</label>
                <input type="email" id="email" class="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" placeholder="Enter Email..."/>
            </div>
            <div class="mt-3">
                <label for="password" class="block text-base mb-2">Password</label>
                <input type="password" id="password" class="border border-gray-200 w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" placeholder="Enter Password..."/>
            </div>
            <div class="mt-5">
                <button type="submit" class="border-2 border-orange-600 bg-orange-600 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-orange-600 font-semibold">Register</button>
            </div>
            <div class="mt-3 flex">
                <label for="register" class="block test-base mb-2">Have an account?</label>
                <Link class="px-1 text-sky-700 font-semibold" to="/login">Log In</Link>
            </div>
            </div>

        </div>
    );
}

export default Signup;