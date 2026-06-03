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

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  const getOrderDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN");
  };

  const getShortOrderId = (id) => {
    if (!id) {
      return "ORDER";
    }

    return id.toString().slice(-8).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin mx-auto"></div>
          <p className="mt-5 text-[#d4af37] font-black">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#050505]">
      <div className="page-shell py-12">
        <div className="mb-8">
          <p className="text-[#d4af37] text-sm font-black uppercase tracking-[0.25em] mb-3">
            Order History
          </p>

          <h1 className="text-4xl sm:text-5xl font-black">My Orders</h1>

          <p className="text-white/50 mt-3">
            View your placed orders, delivery details, payment status, and order
            confirmation.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-[2.5rem] border border-[#d4af37]/20 bg-[#0b0b0f] p-10 text-center">
            <h2 className="text-3xl font-black">No orders yet</h2>

            <p className="text-white/50 mt-3">
              Your placed orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const shippingAddress = order.shippingAddress || {};
              const hasShippingAddress =
                shippingAddress.fullName &&
                shippingAddress.phone &&
                shippingAddress.address &&
                shippingAddress.city &&
                shippingAddress.state &&
                shippingAddress.pincode;

              const paymentMethod =
                order.paymentMethod || "Not available for this order";

              const paymentStatus =
                order.paymentStatus ||
                (order.isPaid ? "Paid" : "Not available");

              const orderStatus = order.orderStatus || "Placed";

              const totalPrice = formatPrice(order.totalPrice);

              return (
                <div
                  key={order._id}
                  className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0b0b0f] shadow-2xl shadow-black/40"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-[#d4af37] text-xs font-black uppercase tracking-widest">
                        Order ID
                      </p>

                      <p className="font-mono text-white text-sm break-all mt-2">
                        #{getShortOrderId(order._id)}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                      <div>
                        <p className="text-white/35 text-xs font-bold uppercase">
                          Date
                        </p>

                        <p className="text-white font-bold">
                          {getOrderDate(order.createdAt)}
                        </p>
                      </div>

                      <span className="w-fit px-5 py-2 rounded-full text-xs font-black bg-green-400/10 text-green-300 border border-green-400/20">
                        {orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Delivery and Payment */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border-b border-white/10">
                    <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                      <p className="text-[#d4af37] font-black mb-4">
                        Delivery Details
                      </p>

                      {hasShippingAddress ? (
                        <div className="space-y-2">
                          <p className="text-white font-black">
                            {shippingAddress.fullName}
                          </p>

                          <p className="text-white/60">
                            Phone:{" "}
                            <span className="text-white">
                              {shippingAddress.phone}
                            </span>
                          </p>

                          <p className="text-white/60 leading-relaxed">
                            {shippingAddress.address}
                          </p>

                          <p className="text-white/60">
                            {shippingAddress.city}, {shippingAddress.state} -{" "}
                            {shippingAddress.pincode}
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
                          <p className="text-yellow-200 font-bold">
                            Delivery details not available.
                          </p>

                          <p className="text-white/45 text-sm mt-2">
                            This order was probably placed before the checkout
                            address form was added.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                      <p className="text-[#d4af37] font-black mb-4">
                        Payment Details
                      </p>

                      <div className="space-y-3">
                        <p className="text-white/60">
                          Method:{" "}
                          <span className="text-white font-bold">
                            {paymentMethod}
                          </span>
                        </p>

                        <p className="text-white/60">
                          Status:{" "}
                          <span
                            className={
                              paymentStatus === "Paid"
                                ? "text-green-300 font-bold"
                                : "text-yellow-300 font-bold"
                            }
                          >
                            {paymentStatus}
                          </span>
                        </p>

                        <p className="text-white/60">
                          Order Status:{" "}
                          <span className="text-green-300 font-bold">
                            {orderStatus}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="p-6 space-y-4">
                    {order.orderItems.map((item, index) => {
                      const itemPrice = formatPrice(item.price);
                      const itemTotal = formatPrice(
                        Number(item.price || 0) * Number(item.qty || 1)
                      );

                      return (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-white/5 border border-white/10 p-4"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-2xl bg-black"
                            />

                            <div className="min-w-0">
                              <p className="text-white font-black break-words">
                                {item.name}
                              </p>

                              <p className="text-white/45 text-sm mt-1">
                                Qty: {item.qty || 1}
                              </p>

                              <p className="text-white/35 text-sm">
                                Single Price: ₹{itemPrice}
                              </p>
                            </div>
                          </div>

                          <p className="text-[#d4af37] font-black text-xl">
                            ₹{itemTotal}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Confirmation message */}
                  {order.confirmationMessage ? (
                    <div className="mx-6 mb-6 rounded-3xl bg-green-400/10 border border-green-400/20 p-5">
                      <p className="text-green-300 font-black">
                        Confirmation Message
                      </p>

                      <p className="text-white/70 mt-2">
                        {order.confirmationMessage}
                      </p>
                    </div>
                  ) : (
                    <div className="mx-6 mb-6 rounded-3xl bg-yellow-400/10 border border-yellow-400/20 p-5">
                      <p className="text-yellow-200 font-black">
                        Confirmation message not available.
                      </p>

                      <p className="text-white/45 mt-2 text-sm">
                        New orders placed from the checkout page will show a
                        generated confirmation message here.
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-white/45">
                      Thank you for shopping with Aura Shop.
                    </p>

                    <p className="text-2xl font-black">
                      Total:{" "}
                      <span className="text-[#d4af37]">₹{totalPrice}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;