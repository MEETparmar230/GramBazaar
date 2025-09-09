'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signUpSchema } from '@/lib/validations/register';

export default function Page() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleRegister = async () => {
  setLoading(true);

  const validation = signUpSchema.safeParse({
    name,
    email,
    phone,
    password,
    confirmPassword,
  });

  if (!validation.success) {
    const fieldErrors: typeof errors = {};
    validation.error.issues.forEach((err) => {
      const field = err.path[0] as keyof typeof errors;
      fieldErrors[field] = err.message;
    });
    setErrors(fieldErrors);
    setLoading(false);
    return;
  }

  try {
    await axios.post('/api/register', {
      name,
      email,
      phone,
      password, 
      confirmPassword
    });

    toast.success('Registered successfully!');
    window.location.href = '/login';
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      toast.error(err.response?.data?.error || "Request failed");
      console.error("Axios Error:", err.response?.data);
    } else if (err instanceof Error) {
      toast.error(err.message);
      console.error("General error:", err);
    } else {
      toast.error("Unexpected error");
      console.error("Unknown error", err);
    }
  }

  setLoading(false);
};



  return (
    <div className="bg-zinc-100 p-8 rounded-lg shadow-lg sm:mx-auto md:mx-auto lg:mx-auto mx-2 max-w-md my-5 ring-2 ring-green-200">
      <h2 className="text-3xl font-bold mb-8 text-center text-zinc-700">Register</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        {/* Name */}
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Full Name"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="Email"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            placeholder="Phone Number"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="Password"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            placeholder="Confirm Password"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-green-600 text-white text-lg font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-green-600 hover:underline font-medium">
          Login
        </a>
      </p>
    </div>
  );
}
