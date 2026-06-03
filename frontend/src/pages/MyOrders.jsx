import React, { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

const MyOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user) {
          const { data } = await axios.get(
            `http://localhost:5000/api/orders/${user._id}`
          );

          setOrders(data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <p className="text-lg font-bold text-orange-500">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        My Order History
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const totalPrice = Number(order.totalPrice || 0).toLocaleString(
              "en-IN"
            );

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="bg-gray-50 p-5 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Order ID</p>

                    <p className="font-mono text-gray-900 font-bold text-sm break-all">
                      {order._id}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm text-gray-500">Date</p>

                    <p className="text-gray-900 font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  {order.orderItems.map((item, index) => {
                    const itemPrice = Number(item.price || 0).toLocaleString(
                      "en-IN"
                    );

                    return (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-2xl bg-gray-100"
                          />

                          <div className="min-w-0">
                            <p className="text-gray-900 font-bold break-words">
                              {item.name}
                            </p>

                            <p className="text-gray-500 text-sm">
                              Qty: {item.qty}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-900 font-extrabold">
                          ₹{itemPrice}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gray-50 p-5 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <span
                    className={`w-fit px-4 py-2 rounded-full text-xs font-bold ${
                      order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending Payment"}
                  </span>

                  <p className="text-xl font-extrabold text-orange-600">
                    Total: ₹{totalPrice}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;