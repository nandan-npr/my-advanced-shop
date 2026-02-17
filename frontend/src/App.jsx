import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';

// Import Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders'; // Import the new My Orders page

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Main Content Area */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-orders" element={<MyOrders />} /> {/* Add this route */}
      </Routes>
    </div>
  );
}

export default App;