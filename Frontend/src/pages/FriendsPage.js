import { Link } from "react-router-dom"
import React, { useContext, useState, useEffect } from 'react'
import UserContext from '../contexts/UserContext'
import axios from 'axios'

function FriendsPage() {
    const { user } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [message, setMessage] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const followersRes = await axios.get(`https://classify-backend-production.up.railway.app/followers/${user.id}`);
                setFollowers(followersRes.data);
                const followingRes = await axios.get(`https://classify-backend-production.up.railway.app/following/${user.id}`);
                setFollowing(followingRes.data);
                setMessage("");
            } catch (err) {
                console.error(err);
                setMessage("Failed to load followers or following.");
                setFollowers([]);
                setFollowing([]);
            }
        };
        fetchData();
    }, [user]);

    // to reset
    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setMessage('');
      };
    
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await axios.get('https://classify-backend-production.up.railway.app/suggestedUsers', {
                    params: { term: searchTerm }
                });
                setSuggestions(response.data);
                setMessage(''); 
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setSuggestions([]);
                    setMessage('No users found.');
                } else {
                    console.error('Error fetching suggestions:', error);
                    setMessage('Failed to fetch suggestions.');
                }
            }
        };
        fetchSuggestions();
    }, [searchTerm]);

    const handleFollow = async (followId) => {
        if (!user) {
            setMessage("You must be logged in to follow users.");
            return;
        }
        if (user.id === followId) {
            setMessage("You cannot follow yourself.");
            return;
        }

        try {
            const response = await axios.post('/follow', {
                userId: user.id,
                followId
            });

            // Axios throws for non-2xx responses, so no need to check 304 explicitly
            setMessage(`Now following ${followId}`);
            setSuggestions(suggestions.filter(u => u.id !== followId));

            // Refresh following list
            try {
                const followingRes = await axios.get(`/following/${user.id}`);
                setFollowing(followingRes.data);
            } catch (refreshErr) {
                console.error(refreshErr);
                setMessage("Failed to refresh following list.");
            }
        } catch (error) {
            if (error.response) {
                // handle 400 or custom errors from server
                if (error.response.status === 304) {
                    setMessage(`Already following ${followId}`);
                } else {
                    setMessage(error.response.data.message || error.response.data.error || 'Failed to follow user.');
                }
            } else {
                console.error("Follow error:", error);
                setMessage("Failed to follow user.");
            }
        }
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
                <Link to="/" className="hover:text-orange-600 hover:underline">Timetable</Link>
                <Link to="/friends" className="text-orange-600 hover:underline">Friends</Link>
                <Link to="/settings" className="hover:text-orange-600 hover:underline">Settings</Link>
            </div>
            <h1 className="text-gray-300 mt-4 mx-4">WORK IN PROGRESS!</h1>

            <div className="p-4">
                <div className="mb-6 max-w-md">
                    {/* search bar with user input */}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Search users to follow..."
                        className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                    />
        
                    {/* suggestions popup, clickable users */}
                    {suggestions.length > 0 && (
                        <ul className="border border-gray-500 bg-neutral-700 text-white rounded shadow-md mt-2 max-h-60 overflow-y-auto">
                            {suggestions.map((user) => (
                                <li
                                    key={user.id}
                                    className="flex justify-between items-center px-4 py-2 cursor-pointer"
                                >
                                    <span>{user.username}</span>
                                    <button
                                        className="text-sm text-white hover:underline"
                                        onClick={() => handleFollow(user.id)}
                                    >
                                        Follow
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* message */}
                    {message && <p className="text-green-600 mt-2">{message}</p>}

                    {/* following list */}
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-orange-600 mb-2">You are following:</h2>
                        {following.length > 0 ? (
                            <ul className="divide-y divide-gray-200 border border-gray-300 rounded shadow bg-white">
                                {following.map((user) => (
                                    <li
                                        key={user.id}
                                        className="px-4 py-2 hover:bg-blue-50 transition-colors text-orange-600"
                                    >
                                        {user.username}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400">You're not following anyone yet.</p>
                        )}
                    </div>

                    {/* followers list */}
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-orange-600 mb-2">Your followers:</h2>
                        {followers.length > 0 ? (
                            <ul className="divide-y divide-gray-200 border border-gray-300 rounded shadow bg-white">
                                {followers.map((user) => (
                                    <li
                                        key={user.id}
                                        className="px-4 py-2 hover:bg-blue-50 transition-colors text-orange-600"
                                    >
                                        {user.username}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400">No followers yet.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default FriendsPage;