import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../contexts/UserContext';

function ProfilePage() {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/userInfo/${user.id}`);
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
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{profile.username}'s Profile</h1>
            <img src={profile.pictureUrl} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Year of Study:</strong> {profile.year_of_study}</p>
            <p><strong>Course:</strong> {profile.enrolled_course}</p>
            <p><strong>Faculty:</strong> {profile.faculty}</p>
        </div>
    );
}

export default ProfilePage;
