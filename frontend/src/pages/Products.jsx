import React, { useEffect, useState } from "react";
import axios from "axios";

import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [detectedData, setDetectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");

      setProducts(response.data);
      setDisplayProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const finalProducts = displayProducts.filter((product) => {
    const productName = product.name ? product.name.toLowerCase() : "";
    const productCategory = product.category
      ? product.category.toLowerCase()
      : "";
    const lowerSearch = searchText.toLowerCase();

    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    const matchesSearch =
      productName.includes(lowerSearch) || productCategory.includes(lowerSearch);

    return matchesCategory && matchesSearch;
  });

  const handleAISearch = async () => {
    if (aiQuery.trim() === "") {
      alert("Please enter what you want to search.");
      return;
    }

    try {
      setAiLoading(true);
      setAiReply("");
      setDetectedData(null);
      setActiveCategory("All");
      setSearchText("");

      const response = await axios.post(
        "http://localhost:5000/api/ai/smart-search",
        {
          query: aiQuery,
        }
      );

      setDisplayProducts(response.data.products);
      setAiReply(response.data.reply);
      setDetectedData(response.data.detected);
      setAiLoading(false);
    } catch (error) {
      console.error("AI Smart Search Error:", error);

      const message =
        error.response?.data?.message ||
        "Aura AI could not complete the search.";

      setAiReply(message);
      setAiLoading(false);
    }
  };

  const handleResetSearch = () => {
    setDisplayProducts(products);
    setAiQuery("");
    setAiReply("");
    setDetectedData(null);
    setSearchText("");
    setActiveCategory("All");
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#050505]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin mx-auto"></div>
          <p className="mt-5 text-[#d4af37] font-black">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#050505]">
      <section className="page-shell py-12">
        <div className="rounded-[2.5rem] border border-[#d4af37]/20 bg-[#0b0b0f] p-8 sm:p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/10 blur-[100px] rounded-full"></div>

          <div className="relative z-10">
            <p className="text-sm font-black text-[#d4af37] uppercase tracking-[0.25em] mb-3">
              Aura Collection
            </p>

            <h1 className="text-4xl sm:text-6xl font-black text-white">
              Find products smarter.
            </h1>

            <p className="text-white/50 mt-4 max-w-2xl">
              Use normal filters or ask Aura AI using simple words like “laptop
              under 50000”, “cheapest shoes”, or “premium electronics”.
            </p>
          </div>
        </div>

        {/* AI SMART SEARCH */}
        <div className="rounded-[2rem] border border-[#d4af37]/25 bg-[#0b0b0f] p-6 sm:p-8 mb-10 shadow-2xl shadow-black/40">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
            <div>
              <p className="text-sm text-[#d4af37] font-black uppercase tracking-[0.25em] mb-2">
                Phase 3 AI Smart Search
              </p>

              <h2 className="text-3xl font-black text-white">
                Search like you talk.
              </h2>

              <p className="text-white/45 mt-2 max-w-2xl">
                Aura AI understands budget, category, price preference, and
                keywords from your search.
              </p>
            </div>

            <button
              onClick={handleResetSearch}
              className="px-5 py-3 rounded-full border border-white/10 text-white/70 font-bold hover:bg-white hover:text-black transition"
            >
              Reset Products
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Example: show me laptop under 50000"
              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />

            <button
              onClick={handleAISearch}
              disabled={aiLoading}
              className="px-8 py-4 rounded-2xl gold-gradient text-black font-black hover:scale-[1.02] transition disabled:opacity-60"
            >
              {aiLoading ? "Searching..." : "Search with Aura AI"}
            </button>
          </div>

          {aiReply && (
            <div className="mt-6 rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/10 p-5">
              <p className="text-white font-bold">{aiReply}</p>
            </div>
          )}

          {detectedData && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-white/35 text-xs font-bold uppercase">
                  Category
                </p>
                <p className="text-[#d4af37] font-black mt-1">
                  {detectedData.category || "Any"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-white/35 text-xs font-bold uppercase">
                  Max Price
                </p>
                <p className="text-[#d4af37] font-black mt-1">
                  {detectedData.maxPrice
                    ? `₹${Number(detectedData.maxPrice).toLocaleString(
                        "en-IN"
                      )}`
                    : "Any"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-white/35 text-xs font-bold uppercase">
                  Min Price
                </p>
                <p className="text-[#d4af37] font-black mt-1">
                  {detectedData.minPrice
                    ? `₹${Number(detectedData.minPrice).toLocaleString(
                        "en-IN"
                      )}`
                    : "Any"}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-white/35 text-xs font-bold uppercase">
                  Sort
                </p>
                <p className="text-[#d4af37] font-black mt-1">
                  {detectedData.sortType}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* NORMAL FILTERS */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-white">Shop Products</h2>

            <p className="text-white/45 mt-2">
              {finalProducts.length} products found
            </p>
          </div>

          <div className="w-full lg:w-96">
            <input
              type="text"
              placeholder="Filter visible products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-black transition ${
                activeCategory === category
                  ? "gold-gradient text-black"
                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {finalProducts.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
            <h3 className="text-2xl font-black text-white">
              No products found
            </h3>

            <p className="text-white/50 mt-2">
              Try a different AI search or reset products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 items-stretch">
            {finalProducts.map((product) => (
              <div key={product._id} className="flex flex-col gap-3">
                <ProductCard product={product} />

                {product.aiReason && (
                  <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
                    <p className="text-sm text-green-200">
                      <span className="font-black">AI Match:</span>{" "}
                      {product.aiReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;