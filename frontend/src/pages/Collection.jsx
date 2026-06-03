import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { motion } from 'framer-motion';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = category === 'All' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === category.toLowerCase());

  const categories = ['All', 'Electronics', 'Clothing', 'Shoes'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-primary mb-4">Our Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our meticulously curated selection of premium goods, crafted to elevate your everyday experience.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button 
              key={cat} 
              type="button" 
              onClick={() => setCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                category === cat 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-muted">
                <div className="aspect-[4/5] bg-muted rounded-xl mb-4" />
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-muted rounded w-1/4" />
                  <div className="h-8 w-8 bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-primary mb-2">No products found</h3>
            <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
