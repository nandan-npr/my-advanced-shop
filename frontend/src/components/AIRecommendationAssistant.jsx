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
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-orange-100">
      <div className="text-center mb-6">
        <p className="text-sm font-semibold text-orange-500 mb-2">
          AI Shopping Assistant
        </p>

        <h2 className="text-2xl font-bold text-gray-800">
          Find the Right Product Faster
        </h2>

        <p className="text-gray-500 mt-2">
          Tell me what you want, your budget, or your category. I will suggest
          matching products.
        </p>
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
          className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      {reply && (
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-gray-700 font-medium">{reply}</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Recommended For You
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((product) => (
              <div key={product._id}>
                <ProductCard product={product} />

                <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    AI Reason: {product.aiReason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationAssistant;