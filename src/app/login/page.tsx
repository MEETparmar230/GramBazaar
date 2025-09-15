"use client"

import { loginSchema } from "@/lib/validations/login";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState<boolean>(false)


  const handleLogin = async () => {
    setLoading(true)
    const validation = loginSchema.safeParse({ email, password })

    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false)
      return;
    }

    try {
      await axios.post('/api/login', {
        email,
        password,
      });
      toast.success("Login successful!");
      window.location.href = "/";
    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Request failed")
        console.error("Axios Error:", err.response?.data)
      }

      else if (err instanceof Error) {
        toast.error(err.message)
        console.error("General error:", err.message)
      }
      else {
        toast.error("Unexpected error")
        console.error("Unknown error", err)
      }
    }
    setLoading(false)
  };


  return (
    <div className="flex items-center justify-center  my-5 md:my-10 ">
      <div className="bg-zinc-100 p-8 rounded-lg shadow-lg w-full max-w-md mx-4 ring-2 ring-green-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-zinc-700">Login</h2>
        <form action="" onSubmit={(e) => {
          e.preventDefault();
          handleLogin()
        }}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })) }}
              placeholder="Email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
    errors.email ? "border-red-500" : "border-gray-300"
  }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-3">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })) }}
              placeholder="Password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
    errors.password ? "border-red-500" : "border-gray-300"
  }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-3">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white text-lg font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>


  );
}
