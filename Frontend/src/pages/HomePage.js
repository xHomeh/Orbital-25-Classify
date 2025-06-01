import React, { useState, useEffect, useContext } from 'react'
import { Link } from "react-router-dom"
import UserContext from '../contexts/UserContext'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
// 8 to 20 hours
const hours = Array.from({ length: 13 }, (_, i) => 8 + i)

// map day from long to short form for display 
const dayMap = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
}

// function to assign each module to a random unique colour
const getColorForModule = (moduleCode) => {
    const colors = [
      'bg-red-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200',
      'bg-indigo-200', 'bg-orange-200', 'bg-teal-200', 'bg-cyan-200', 'bg-lime-200'
    ];
    let hash = 0;
    for (let i = 0; i < moduleCode.length; i++) {
      hash = moduleCode.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};
  

function HomePage() {

    const { user } = useContext(UserContext);
    // timetable does not account for logged in user's saved modules yet 

    // states to manage all selected classes, all modules, current search term, current suggestions
    const [classes, setClasses] = useState([]);
    const [allModules, setAllModules] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // fetch all module data from nusmods api and set all modules, only need to run once on mount
    useEffect(() => {
        fetch('https://api.nusmods.com/v2/2024-2025/moduleList.json')
        .then(res => res.json())
        .then(data => setAllModules(data));
    }, []);

    // updates selected classes state, takes in module code and semester (default to 1)
    // to make the timetable for now, replace with RandomTimetableGenerator + saving logged modules logic after
    const addModule = async (moduleCode, semester = 1) => {
        const res = await fetch(`https://api.nusmods.com/v2/2024-2025/modules/${moduleCode}.json`);
        const data = await res.json();
        const timetable = data.semesterData.find(s => s.semester === semester)?.timetable || [];

        const selectedTypes = {};
        const chosenClasses = [];

        for (const cls of timetable) {
        if (!selectedTypes[cls.lessonType]) {
            selectedTypes[cls.lessonType] = true;
            chosenClasses.push({
            ...cls,
            moduleCode,
            });
        }
        }

        setClasses(prev => [...prev, ...chosenClasses]);
    };

    // updates suggested modules based on the current search term
    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase();
        setSearchTerm(value);
        if (value.length > 1) {
        const filtered = allModules.filter(m => m.moduleCode.startsWith(value)).slice(0, 10);
        setSuggestions(filtered);
        } else {
        setSuggestions([]);
        }
    };

    // update selected classes on click (search term and suggestion resets, clicked module `added to classes)
    const handleSelect = (moduleCode) => {
        setSearchTerm('');
        setSuggestions([]);
        addModule(moduleCode);
    };

    return (
        <div className="bg-neutral-800 min-h-screen">

            {/* top row */}
            <div className="w-full flex flex-row bg-neutral-800 h-[1/10]">
                <Link to="/" className="flex w-[1/10] h-full justify-end text-orange-600 text-xl block text-left px-3 py-2 hover:text-white">Classify</Link>
                <div className="flex w-[8/10] h-full"></div>  
                {/* if logged in, show user, else link  to login page*/}   
                {user ? (
                    <div className="flex w-[1/10] h-full justify-start text-white font-bold text-xl px-3 py-2 absolute top-0 right-0">
                        Welcome, {user.username}
                    </div>
                ) : (     
                    <Link to="/login" className="flex w-[1/10] h-full justify-start text-orange-600 text-xl block text-right px-3 py-2 absolute top-0 right-0 hover:text-white">
                        Login
                    </Link>
                )}
            </div>
            <hr className="border-gray-400" />

            <div className="flex flex-col gap-2 text-gray-400 mt-3 px-3">
                <Link to="/" className="text-orange-600 hover:underline">Timetable</Link>
                <Link to="/friends" className="hover:text-orange-600 hover:underline">Friends</Link>
                <Link to="/settings" className="hover:text-orange-600 hover:underline">Settings</Link>
            </div>
            <h1 className="text-gray-300 mt-4 mx-4">WORK IN PROGRESS!</h1>

            <div className="p-4">
                <div className="mb-6 max-w-md">
                    {/* search bar with user input */}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder="Search module code (e.g. CS2030S)"
                        className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                    />
                    {/* suggestions popup, clickable modules */}
                    {suggestions.length > 0 && (
                        <ul className="border border-gray-300 rounded bg-white shadow mt-1 max-h-60 overflow-y-auto">
                        {suggestions.map((m) => (
                            <li
                            key={m.moduleCode}
                            onClick={() => handleSelect(m.moduleCode)}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            >
                            {m.moduleCode} - {m.title}
                            </li>
                        ))}
                        </ul>
                    )}
                </div>
                
                <div className="overflow-x-auto"> {/* scrollable if too long */}
                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns: '80px repeat(13, 1fr)', // 1 column for day label, 13 for hours
                            gridTemplateRows: '40px repeat(5, 1fr)', // 1 row for time headers, 5 for days
                        }}
                    >
                        {/* top-left empty cell */}
                        <div className="bg-gray-800 text-white flex items-center justify-center font-semibold"></div>

                        {/* hour headers */}
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="bg-gray-800 text-white flex items-center justify-center font-semibold"
                            >
                                {hour}:00
                            </div>
                        ))}

                        {/* filled timetable */}
                        {days.map(day => (
                            <React.Fragment key={day}>
                                {/* day label on the left */}
                                <div className="bg-gray-50 text-right pr-2 py-2 font-semibold">{day}</div>
                                
                                {/* all time slots */}
                                {hours.map(hour => (
                                    <div key={day + hour} className="relative h-16 border border-gray-200 bg-white">
                                        {classes.map((cls, index) => {
                                            const clsDay = dayMap[cls.day];
                                            const clsHour = parseInt(cls.startTime.slice(0, 2), 10);
                                            // colored if selected classes has timeslot */}
                                            if (clsDay === day && clsHour === hour) {
                                                const colorClass = getColorForModule(cls.moduleCode);
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`absolute inset-1 ${colorClass} text-xs rounded p-1 shadow`}
                                                    >
                                                        {cls.moduleCode} {cls.lessonType} ({cls.classNo})
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;