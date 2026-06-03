import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import AIRecommendationAssistant from "../components/AIRecommendationAssistant";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Backend when page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Calling your backend API
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
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-bold text-orange-500">
          Loading Products...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AIRecommendationAssistant />

      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Our Latest Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;