import { Link } from "react-router-dom"
import React, { useContext, useState, useEffect } from 'react'
import UserContext from '../contexts/UserContext'

function FriendsPage() {
    const { user } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [message, setMessage] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        if (user) {
            fetch(`${process.env.REACT_APP_API_URL}/followers/${user.id}`)
                .then(res => {
                    if (res.status === 304) return [];
                    if (!res.ok) throw new Error(`Error fetching followers: ${res.status}`);
                    return res.json();
                })
                .then(data => setFollowers(data))
                .catch(err => {
                    console.error(err);
                    setMessage("Failed to load followers.");
                });
            fetch(`${process.env.REACT_APP_API_URL}/following/${user.id}`)
                .then(res => {
                    if (res.status === 304) return [];
                    if (!res.ok) throw new Error(`Error fetching following: ${res.status}`);
                    return res.json();
                })
                .then(data => setFollowing(data))
                .catch(err => {
                    console.error(err);
                    setMessage("Failed to load following.");
                });
        }
    }, [user])

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!user) {
                setSuggestions([]);
                return;
              }
            if (searchTerm.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/suggestedUsers?term=${searchTerm}&userId=${user.id}`);
                if (response.status === 304) {
                    setSuggestions([]);
                    return;
                }
                if (!response.ok) {
                    const text = await response.text(); // read error text (HTML or message)
                    throw new Error(`Server responded with status ${response.status}: ${text}`);
                }
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setMessage("Failed to fetch suggestions.");
            }
        }
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, followId })
            });
            if (response.status === 304) {
                setMessage(`Already following ${followId}`);
                return;
            }
            const data = await response.json();
            if (response.ok) {
                setMessage(`Now following ${followId}`);
                setSuggestions(suggestions.filter(u => u.id !== followId));
                // refresh following
                fetch(`${process.env.REACT_APP_API_URL}/following/${user.id}`)
                    .then(res => {
                        if (res.status === 304) return [];
                        if (!res.ok) throw new Error(`Error refreshing following: ${res.status}`);
                        return res.json();
                    })
                    .then(data => setFollowing(data))
                    .catch(err => {
                        console.error(err);
                        setMessage("Failed to refresh following list.");
                    });
            } else {
                setMessage(data.message || data.error);
            }
        } catch (err) {
            console.error("Follow error:", err);
            setMessage("Failed to follow user.");
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

            {/* search bar */}
            <input
                type="text"
                placeholder="Search users to follow..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-4 p-2 rounded bg-neutral-700 text-white w-full max-w-md"
            />

            {/* message */}
            {message && <p className="text-green-400 mt-2">{message}</p>}

            {/* suggested users */}
            <div className="mt-4">
                {suggestions.length > 0 && (
                    <div>
                        <h2 className="text-lg mb-2 text-orange-500">Suggested Users:</h2>
                        <ul className="space-y-2">
                            {suggestions.map(user => (
                                <li key={user.id} className="flex justify-between bg-neutral-700 p-2 rounded">
                                    <span>{user.username}</span>
                                    <button
                                        className="text-sm text-orange-400 hover:text-white"
                                        onClick={() => handleFollow(user.id)}
                                    >
                                        Follow
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* following List */}
            <div className="mt-6">
                <h2 className="text-lg text-orange-500 mb-2">You are following:</h2>
                <ul className="space-y-1">
                    {following.map(user => (
                        <li key={user.id} className="text-gray-300">{user.username}</li>
                    ))}
                </ul>
            </div>

            {/* followers List */}
            <div className="mt-6">
                <h2 className="text-lg text-orange-500 mb-2">Your followers:</h2>
                <ul className="space-y-1">
                    {followers.map(user => (
                        <li key={user.id} className="text-gray-300">{user.username}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default FriendsPage;