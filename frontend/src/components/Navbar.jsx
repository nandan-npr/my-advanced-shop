import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition">
          ShopSmart
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-orange-500 font-medium transition">
            Home
          </Link>

          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative text-gray-600 hover:text-orange-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Conditional Login/Logout Button */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-800 font-semibold hidden sm:block">Hi, {user.name}</span>
              
              {/* My Orders Link */}
              <Link to="/my-orders" className="text-sm text-gray-600 hover:text-orange-500 font-medium">
                My Orders
              </Link>

              <button 
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;