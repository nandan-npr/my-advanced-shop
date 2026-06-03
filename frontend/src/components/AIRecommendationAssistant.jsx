import React, { useState } from "react";
import axios from "axios";

import ProductCard from "./ProductCard";

const AIRecommendationAssistant = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (message.trim() === "") {
      alert("Please enter what you are looking for.");
      return;
    }

    try {
      setLoading(true);
      setReply("");
      setRecommendations([]);

      const response = await axios.post(
        "http://localhost:5000/api/ai/recommendations",
        {
          message: message,
        }
      );

      setReply(response.data.reply);
      setRecommendations(response.data.recommendations);
      setLoading(false);
    } catch (error) {
      console.error("AI Recommendation Error:", error);
      setReply("Sorry, I could not find recommendations right now.");
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-orange-100 shadow-sm p-5 sm:p-8 mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
        <div>
          <p className="text-sm font-bold text-orange-500 uppercase tracking-wide mb-2">
            AI Shopping Assistant
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Find the Right Product Faster
          </h2>

          <p className="text-gray-600 mt-2 max-w-2xl">
            Tell me what you want, your budget, or your category. I will suggest
            matching products.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Example: I want shoes under 2000"
          className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          onClick={handleAskAI}
          disabled={loading}
          className="bg-orange-500 text-white px-7 py-3 rounded-full font-bold hover:bg-orange-600 transition disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      {reply && (
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <p className="text-gray-800 font-semibold">{reply}</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-extrabold text-gray-900 mb-4">
            Recommended For You
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {recommendations.map((product) => (
              <div key={product._id} className="flex flex-col gap-3">
                <ProductCard product={product} />

                <div className="bg-green-50 border border-green-200 rounded-2xl p-3">
                  <p className="text-sm text-green-800">
                    <span className="font-bold">AI Reason:</span>{" "}
                    {product.aiReason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AIRecommendationAssistant;