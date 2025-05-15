import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignUpProps {
    onSignup: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                alert('signed up!');
                navigate('/Login');
            } else {
                alert(data.message || 'signup failed');
            }
        } catch (err) {
            alert('error');
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">Sign Up</h2>
                <input type="email" placeholder="email" className="mb-3 w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="mb-3 w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-500">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;