import React, { useEffect, useState } from "react";
import axios from "axios";

import ProductCard from "../components/ProductCard";
import AIRecommendationAssistant from "../components/AIRecommendationAssistant";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");

        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center px-4">
        <div className="text-xl font-bold text-orange-500">
          Loading Products...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 mb-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold text-orange-500 uppercase tracking-wide mb-3">
            Smart Shopping Experience
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Discover products that match your style, budget, and needs.
          </h1>

          <p className="text-gray-600 mt-4 text-base sm:text-lg">
            Browse the latest collection and use the AI assistant to get faster
            product recommendations.
          </p>
        </div>
      </section>

      <AIRecommendationAssistant />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Our Latest Collection
          </h2>

          <p className="text-gray-500 mt-1">
            Explore products selected for your shopping needs.
          </p>
        </div>

        <p className="text-sm font-semibold text-gray-500">
          {products.length} products available
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-gray-600">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;