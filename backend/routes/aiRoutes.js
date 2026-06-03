const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Helper function to find budget from user message
const getBudgetFromMessage = (message) => {
  const numbers = message.match(/\d+/g);

  if (!numbers) {
    return null;
  }

  return Number(numbers[0]);
};

// Helper function to find category from user message
const getCategoryFromMessage = (message) => {
  const lowerMessage = message.toLowerCase();

  const categories = [
    "electronics",
    "fashion",
    "shoes",
    "clothes",
    "mobile",
    "laptop",
    "watch",
    "headphones",
    "men",
    "women",
  ];

  const foundCategory = categories.find((category) =>
    lowerMessage.includes(category)
  );

  return foundCategory || null;
};

// AI Product Recommendation Route
router.post("/recommendations", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Please enter what you are looking for.",
      });
    }

    const budget = getBudgetFromMessage(message);
    const category = getCategoryFromMessage(message);

    let products = await Product.find();

    // Add recommendation score to each product
    let scoredProducts = products.map((product) => {
      let score = 0;
      let reason = [];

      const productName = product.name.toLowerCase();
      const productCategory = product.category.toLowerCase();

      // Category matching
      if (category) {
        if (
          productCategory.includes(category) ||
          productName.includes(category)
        ) {
          score += 5;
          reason.push(`matches your interest in ${category}`);
        }
      }

      // Budget matching
      if (budget) {
        if (product.price <= budget) {
          score += 4;
          reason.push(`fits your budget under ₹${budget}`);
        } else {
          score -= 2;
        }
      }

      // Keyword matching from user message
      const words = message.toLowerCase().split(" ");

      words.forEach((word) => {
        if (word.length > 2) {
          if (productName.includes(word) || productCategory.includes(word)) {
            score += 2;
          }
        }
      });

      return {
        product,
        score,
        reason,
      };
    });

    // Sort products by score
    scoredProducts.sort((a, b) => b.score - a.score);

    // Take only useful recommendations
    let recommendedProducts = scoredProducts
      .filter((item) => item.score > 0)
      .slice(0, 4)
      .map((item) => {
        return {
          ...item.product._doc,
          aiReason:
            item.reason.length > 0
              ? item.reason.join(" and ")
              : "recommended based on your request",
        };
      });

    // Fallback if no match found
    if (recommendedProducts.length === 0) {
      recommendedProducts = products.slice(0, 4).map((product) => {
        return {
          ...product._doc,
          aiReason: "popular product from our latest collection",
        };
      });
    }

    res.json({
      reply: "Here are the best products I found for you.",
      budget,
      category,
      recommendations: recommendedProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "AI recommendation failed",
      error: error.message,
    });
  }
});

module.exports = router;