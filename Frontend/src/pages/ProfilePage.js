import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';

function ProfilePage() {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    console.log("User context:", user);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`https://classify-backend-production.up.railway.app/userInfo/${user.id}`);
                setProfile(response.data);
            } catch (err) {
                setError('Failed to load profile');
            }
        };
        if (user) {
            fetchProfile();
        }
    }, [user]);

    if (error) return <p>{error}</p>;
    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="bg-neutral-800 min-h-screen text-white px-4 py-8">
            <div className="flex items-center space-x-6 px-4">
                <img
                    src={profile.display_picture_link}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border border-gray-600"
                />
                <h1 className="text-3xl font-bold">{profile.username}</h1>
            </div>
            <div className="mt-6 px-4 text-gray-300 space-y-2 text-lg">
                <p><span className="text-gray-400">Year of study:</span> {profile.year_of_study}</p>
                <p><span className="text-gray-400">Enrolled course:</span> {profile.enrolled_course}</p>
                <p><span className="text-gray-400">Faculty:</span> {profile.faculty}</p>
            </div>
            <div className="mt-10 b-6 px-4">
                <Link
                    to="/"
                    className="text-orange-600 hover:text-white hover:underline text-lg"
                >
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}

export default ProfilePage;
