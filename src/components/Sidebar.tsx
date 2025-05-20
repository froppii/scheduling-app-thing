import React from 'react';
import { Link } from 'react-router-dom';
import TinyCalendar from './TinyCalendar';

const Sidebar = () => {
    return (
        <div className="w-64 h-full bg-gray-800 text-white p-4">
            <div>
                <h2 className="text-xl font-bold mb-6">sidebar!</h2>
                <nav className="flex flex-col space-y-4">
                    <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
                    <Link to="/calendar" className="hover:text-blue-400">Calendar</Link>
                    <Link to="/settings" className="hover:text-blue-400">Settings</Link>
                </nav>
            </div>

            <div className="mt-6">
                <TinyCalendar />
            </div>
        </div>


    );
};

export default Sidebar;