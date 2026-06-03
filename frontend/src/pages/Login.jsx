import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(email, password);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-sm w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Login to continue shopping.
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-full font-bold hover:bg-orange-600 transition"
        >
          Login
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 font-bold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;