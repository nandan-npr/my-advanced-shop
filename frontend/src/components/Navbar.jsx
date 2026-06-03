import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-16 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-orange-500 hover:text-orange-600 transition"
          >
            ShopSmart
          </Link>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <Link
              to="/"
              className="text-sm font-semibold text-gray-700 hover:text-orange-500 transition"
            >
              Home
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center text-sm font-semibold text-gray-700 hover:text-orange-500 transition"
            >
              <span>Cart</span>

              {cart.length > 0 && (
                <span className="ml-2 min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-orders"
                  className="text-sm font-semibold text-gray-700 hover:text-orange-500 transition"
                >
                  My Orders
                </Link>

                <span className="hidden md:inline text-sm font-medium text-gray-500">
                  Hi, {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;