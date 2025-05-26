import { Link } from "react-router-dom"

function NotFoundPage() {
    return (
        <div className="bg-neutral-800 min-h-screen">
            <div className="text-3xl px-2 py-1 text-white">404 Not Found</div>
            <div className="mt-5 px-2">
                <Link className="border-2 border-orange-500 text-orange-500 hover:text-white hover:border-white rounded-md text-3xl py-2 px-2" to="/">Return to Home page</Link>
            </div>
        </div>

    )
}

export default NotFoundPage;