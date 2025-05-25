import { Link } from "react-router-dom"

function HomePage() {
    return (
        <div>
            <div class="w-full flex flex-row bg-gray-800 h-[1/10]">
                <div class="flex w-[1/10] h-full justify-end text-orange-500 text-2xl block text-left px-3 py-2">Classify</div>
                <div class="flex w-[8/10] h-full"></div>            
                <Link to="/login" class="flex w-[1/10] h-full justify-start text-orange-500 text-2xl block text-right px-3 py-2 absolute top-0 right-0">Login</Link>
            </div>
            <h1>WORK IN PROGRESS!</h1>
        </div>
        
    );
}

export default HomePage;