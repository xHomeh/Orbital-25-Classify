import { Link } from "react-router-dom"

function FriendsPage() {
    return (
        <div className="bg-neutral-800 min-h-screen">
            <div className="w-full flex flex-row bg-neutral-800 h-[1/10]">
                <Link to="/" className="flex w-[1/10] h-full justify-end text-orange-600 text-xl block text-left px-3 py-2 hover:text-white">Classify</Link>
                <div className="flex w-[8/10] h-full"></div>            
                <Link to="/login" className="flex w-[1/10] h-full justify-start text-orange-600 text-xl block text-right px-3 py-2 absolute top-0 right-0 hover:text-white">Login</Link>
            </div>
            <hr className="border-gray-400" />
            <div className="flex flex-col gap-2 text-gray-400 mt-3 px-3">
                <Link to="/" className="hover:text-orange-600 hover:underline">Timetable</Link>
                <Link to="/friends" className="text-orange-600 hover:underline">Friends</Link>
                <Link to="/settings" className="hover:text-orange-600 hover:underline">Settings</Link>
            </div>
            <h1 className="text-gray-300 mt-4 mx-4">WORK IN PROGRESS!</h1>
        </div>
    );
}

export default FriendsPage;