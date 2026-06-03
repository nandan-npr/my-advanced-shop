import React from "react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const price = Number(product.price || 0).toLocaleString("en-IN");

  return (
    <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
      <div className="w-full h-52 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-2">
          {product.category}
        </p>

        <h3 className="text-lg font-bold text-gray-900 min-h-14">
          {product.name}
        </h3>

        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <span className="text-xl font-extrabold text-gray-900">
            ₹{price}
          </span>

          <button
            onClick={() => addToCart(product)}
            className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition active:scale-95"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;