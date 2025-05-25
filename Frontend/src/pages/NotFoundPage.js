import { Link } from "react-router-dom"

function NotFoundPage() {
    return (
        <div class="flex flex-col">
            404 Not Found
            <div class="border-2 border-black">
                <Link class="border-2 border-black" to="/">Return to Home page</Link>
            </div>
        </div>

    )
}

export default NotFoundPage;