import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) navigate('/');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
        
        <input 
          type="text" placeholder="Full Name" 
          className="w-full p-2 mb-4 border rounded"
          value={name} onChange={(e) => setName(e.target.value)} required 
        />
        <input 
          type="email" placeholder="Email" 
          className="w-full p-2 mb-4 border rounded"
          value={email} onChange={(e) => setEmail(e.target.value)} required 
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-2 mb-6 border rounded"
          value={password} onChange={(e) => setPassword(e.target.value)} required 
        />
        
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Register
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;