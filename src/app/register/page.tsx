'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function Page() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('/api/register', {
        name,
        email,
        password,
        phone,
      });

      alert('Registered successfully!');
      window.location.href = '/login';
    } catch (error) {
      alert('Registration failed.');
    }
  };

  return (
    <div className="bg-zinc-100 p-8 rounded-lg shadow-lg mx-auto w-full max-w-md my-5">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Register</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white text-lg font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition"
      >
        Register
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-green-600 hover:underline font-medium">
          Login
        </a>
      </p>
    </div>
  );
}
  