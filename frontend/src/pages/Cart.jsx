import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to place an order!");
      navigate("/login");
      return;
    }

    const orderData = {
      user: user._id,
      orderItems: cart.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.quantity || 1,
      })),
      totalPrice: totalPrice,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axios.post("http://localhost:5000/api/orders", orderData, config);

      alert("✅ Order Placed Successfully!");
      clearCart();
      navigate("/my-orders");
    } catch (error) {
      console.error("Checkout Error:", error);

      const message =
        error.response?.data?.message || "Checkout failed. Check console.";

      alert(`❌ Error: ${message}`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Your Cart is Empty
          </h2>

          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything yet.
          </p>

          <Link
            to="/"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const formattedTotal = Number(totalPrice || 0).toLocaleString("en-IN");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {cart.map((item) => {
            const itemId = item._id || item.id;
            const price = Number(item.price || 0).toLocaleString("en-IN");

            return (
              <div
                key={itemId}
                className="p-5 sm:p-6 border-b border-gray-100 last:border-b-0 flex flex-col sm:flex-row gap-5 sm:items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-2xl bg-gray-100"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Category: {item.category}
                  </p>

                  <p className="text-orange-500 font-extrabold mt-2">
                    ₹{price}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                  <p className="text-gray-700 font-semibold">
                    Qty: {item.quantity || 1}
                  </p>

                  <button
                    onClick={() => removeFromCart(itemId)}
                    className="text-red-500 text-sm hover:text-red-700 font-bold transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-extrabold text-gray-900 mb-5">
            Order Summary
          </h2>

          <div className="flex justify-between mb-3 text-gray-600">
            <span>Subtotal</span>
            <span>₹{formattedTotal}</span>
          </div>

          <div className="flex justify-between mb-5 text-gray-600">
            <span>Shipping</span>
            <span className="font-semibold text-green-600">Free</span>
          </div>

          <div className="border-t border-gray-200 pt-5 flex justify-between font-extrabold text-xl text-gray-900 mb-6">
            <span>Total</span>
            <span>₹{formattedTotal}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-3 rounded-full font-bold hover:bg-green-700 transition shadow-sm"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;