const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

const cleanText = (text) => {
  return text.toLowerCase().trim();
};

const getNumbersFromText = (text) => {
  const numbers = text.match(/\d+/g);

  if (!numbers) {
    return [];
  }

  return numbers.map((number) => Number(number));
};

const getPriceFilter = (message) => {
  const lowerMessage = cleanText(message);
  const numbers = getNumbersFromText(lowerMessage);

  if (numbers.length === 0) {
    return {
      maxPrice: null,
      minPrice: null,
    };
  }

  const price = numbers[0];

  const maxWords = [
    "under",
    "below",
    "less than",
    "within",
    "budget",
    "maximum",
    "max",
  ];

  const minWords = ["above", "over", "more than", "minimum", "min"];

  const hasMaxWord = maxWords.some((word) => lowerMessage.includes(word));
  const hasMinWord = minWords.some((word) => lowerMessage.includes(word));

  if (hasMinWord) {
    return {
      maxPrice: null,
      minPrice: price,
    };
  }

  if (hasMaxWord) {
    return {
      maxPrice: price,
      minPrice: null,
    };
  }

  return {
    maxPrice: price,
    minPrice: null,
  };
};

const getSortType = (message) => {
  const lowerMessage = cleanText(message);

  if (
    lowerMessage.includes("cheapest") ||
    lowerMessage.includes("low to high") ||
    lowerMessage.includes("lowest") ||
    lowerMessage.includes("budget")
  ) {
    return "priceLowToHigh";
  }

  if (
    lowerMessage.includes("expensive") ||
    lowerMessage.includes("high to low") ||
    lowerMessage.includes("highest") ||
    lowerMessage.includes("premium")
  ) {
    return "priceHighToLow";
  }

  return "relevance";
};

const getSearchWords = (message) => {
  const stopWords = [
    "show",
    "me",
    "i",
    "want",
    "need",
    "suggest",
    "recommend",
    "product",
    "products",
    "for",
    "with",
    "and",
    "or",
    "under",
    "below",
    "above",
    "over",
    "less",
    "than",
    "more",
    "within",
    "budget",
    "cheap",
    "cheapest",
    "premium",
    "best",
    "good",
    "buy",
    "please",
  ];

  return cleanText(message)
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length > 2)
    .filter((word) => !stopWords.includes(word))
    .filter((word) => !/^\d+$/.test(word));
};

const getSynonyms = () => {
  return {
    laptop: ["laptop", "computer", "pc", "notebook"],
    mobile: ["mobile", "phone", "smartphone", "android", "iphone"],
    electronics: ["electronics", "gadget", "gadgets", "device", "devices"],
    shoes: ["shoes", "shoe", "sneaker", "sneakers", "footwear"],
    fashion: ["fashion", "clothes", "clothing", "wear", "shirt", "tshirt"],
    watch: ["watch", "smartwatch", "clock"],
    headphones: ["headphones", "earphones", "earbuds", "headset"],
    bag: ["bag", "backpack", "bags"],
  };
};

const getMatchedCategory = (message, products) => {
  const lowerMessage = cleanText(message);
  const synonyms = getSynonyms();

  const productCategories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
        .map((category) => category.toLowerCase())
    ),
  ];

  const directCategory = productCategories.find((category) => {
    return lowerMessage.includes(category);
  });

  if (directCategory) {
    return directCategory;
  }

  for (const mainCategory in synonyms) {
    const words = synonyms[mainCategory];

    const matched = words.some((word) => lowerMessage.includes(word));

    if (matched) {
      return mainCategory;
    }
  }

  return null;
};

const calculateScore = (product, searchData) => {
  let score = 0;
  const reasons = [];

  const productName = product.name ? product.name.toLowerCase() : "";
  const productCategory = product.category ? product.category.toLowerCase() : "";
  const productPrice = Number(product.price || 0);

  const {
    searchWords,
    matchedCategory,
    maxPrice,
    minPrice,
    originalMessage,
  } = searchData;

  if (matchedCategory) {
    if (
      productName.includes(matchedCategory) ||
      productCategory.includes(matchedCategory)
    ) {
      score += 8;
      reasons.push(`matches ${matchedCategory}`);
    }
  }

  searchWords.forEach((word) => {
    if (productName.includes(word)) {
      score += 5;
    }

    if (productCategory.includes(word)) {
      score += 4;
    }
  });

  if (maxPrice) {
    if (productPrice <= maxPrice) {
      score += 6;
      reasons.push(`fits under ₹${maxPrice}`);
    } else {
      score -= 5;
    }
  }

  if (minPrice) {
    if (productPrice >= minPrice) {
      score += 5;
      reasons.push(`matches above ₹${minPrice}`);
    } else {
      score -= 4;
    }
  }

  if (cleanText(originalMessage).includes("premium")) {
    score += productPrice > 1000 ? 2 : 0;
  }

  if (cleanText(originalMessage).includes("cheap")) {
    score += productPrice <= 2000 ? 2 : 0;
  }

  return {
    score,
    reasons,
  };
};

const sortProducts = (products, sortType) => {
  if (sortType === "priceLowToHigh") {
    return products.sort((a, b) => a.price - b.price);
  }

  if (sortType === "priceHighToLow") {
    return products.sort((a, b) => b.price - a.price);
  }

  return products.sort((a, b) => b.aiScore - a.aiScore);
};

// Existing AI recommendation route
router.post("/recommendations", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Please enter what you are looking for.",
      });
    }

    const products = await Product.find();

    const { maxPrice } = getPriceFilter(message);
    const searchWords = getSearchWords(message);
    const matchedCategory = getMatchedCategory(message, products);
    const sortType = getSortType(message);

    const scoredProducts = products.map((product) => {
      const result = calculateScore(product, {
        searchWords,
        matchedCategory,
        maxPrice,
        minPrice: null,
        originalMessage: message,
      });

      return {
        ...product.toObject(),
        aiScore: result.score,
        aiReason:
          result.reasons.length > 0
            ? result.reasons.join(" and ")
            : "recommended based on your request",
      };
    });

    let recommendedProducts = scoredProducts
      .filter((product) => product.aiScore > 0)
      .slice(0, 4);

    recommendedProducts = sortProducts(recommendedProducts, sortType);

    if (recommendedProducts.length === 0) {
      recommendedProducts = products.slice(0, 4).map((product) => ({
        ...product.toObject(),
        aiReason: "popular product from the Aura collection",
      }));
    }

    res.json({
      reply: "Here are the best products I found for you.",
      recommendations: recommendedProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "AI recommendation failed",
      error: error.message,
    });
  }
});

// New Phase 3 AI Smart Search route
router.post("/smart-search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Please enter a search query.",
      });
    }

    const products = await Product.find();

    const { maxPrice, minPrice } = getPriceFilter(query);
    const searchWords = getSearchWords(query);
    const matchedCategory = getMatchedCategory(query, products);
    const sortType = getSortType(query);

    const scoredProducts = products.map((product) => {
      const result = calculateScore(product, {
        searchWords,
        matchedCategory,
        maxPrice,
        minPrice,
        originalMessage: query,
      });

      return {
        ...product.toObject(),
        aiScore: result.score,
        aiReason:
          result.reasons.length > 0
            ? result.reasons.join(" and ")
            : "matched with your search intent",
      };
    });

    let smartResults = scoredProducts.filter((product) => product.aiScore > 0);

    smartResults = sortProducts(smartResults, sortType);

    if (smartResults.length === 0) {
      smartResults = scoredProducts
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 8);
    }

    const finalResults = smartResults.slice(0, 12);

    let reply = "Aura AI found products matching your search.";

    if (finalResults.length === 0) {
      reply = "Aura AI could not find matching products.";
    }

    if (maxPrice) {
      reply = `Aura AI found products under ₹${maxPrice}.`;
    }

    if (minPrice) {
      reply = `Aura AI found products above ₹${minPrice}.`;
    }

    if (matchedCategory) {
      reply = `Aura AI found ${matchedCategory} products for you.`;
    }

    res.json({
      reply,
      query,
      detected: {
        category: matchedCategory,
        maxPrice,
        minPrice,
        sortType,
        keywords: searchWords,
      },
      products: finalResults,
    });
  } catch (error) {
    res.status(500).json({
      message: "AI smart search failed.",
      error: error.message,
    });
  }
});

module.exports = router;