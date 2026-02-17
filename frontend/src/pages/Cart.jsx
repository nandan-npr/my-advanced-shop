import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Cart = () => {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    // 1. Check if user is logged in
    if (!user) {
      alert("Please login to place an order!");
      navigate('/login');
      return;
    }

    // 2. Prepare the order data
    const orderData = {
      user: user._id,
      orderItems: cart.map(item => ({
        product: item._id || item.id, // Handles both dummy and real IDs
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.quantity
      })),
      totalPrice: totalPrice
    };

    // 3. Send to Backend
    try {
      console.log("Sending Order Data:", orderData); // Debug log

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      await axios.post('http://localhost:5000/api/orders', orderData, config);
      
      // 4. Success
      alert("✅ Order Placed Successfully!");
      clearCart();
      navigate('/my-orders');
      
    } catch (error) {
      console.error("Checkout Error:", error);
      // Show the exact error from the backend if available
      const message = error.response?.data?.message || "Checkout failed. Check console.";
      alert(`❌ Error: ${message}`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
        <Link 
          to="/" 
          className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cart.map((item) => (
              <div key={item._id || item.id} className="flex items-center p-6 border-b border-gray-100 last:border-b-0">
                {/* Product Image */}
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                {/* Product Info */}
                <div className="ml-6 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-500 text-sm">Category: {item.category}</p>
                  <p className="text-orange-500 font-bold mt-1">${item.price}</p>
                </div>

                {/* Quantity & Remove */}
                <div className="text-right">
                  <p className="text-gray-600 mb-2">Qty: {item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item._id || item.id)}
                    className="text-red-500 text-sm hover:text-red-700 font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900 mb-6">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;