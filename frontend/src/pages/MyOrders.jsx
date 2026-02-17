import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user) {
          const { data } = await axios.get(`http://localhost:5000/api/orders/${user._id}`);
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

  if (loading) return <div className="text-center py-20">Loading your orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Order History</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-gray-800 font-bold text-sm">{order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-gray-800 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="ml-4">
                        <p className="text-gray-800 font-medium">{item.name}</p>
                        <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="text-gray-800 font-bold">${item.price}</p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.isPaid ? "Paid" : "Pending Payment"}
                </span>
                <p className="text-xl font-bold text-orange-600">Total: ${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;