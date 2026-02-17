const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Connect to MongoDB (Same string as server.js)
// NOTE: Encode @ as %40 if your password has it!
mongoose.connect('mongodb+srv://admin:sitharam123@cluster0.ypikatd.mongodb.net/?appName=Cluster0')
  .then(() => console.log('✅ Connected to MongoDB for Seeding'))
  .catch(err => console.log(err));

const products = [
  {
    name: "Smartphone X Pro",
    price: 699,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff70?w=500&q=80"
  },
  {
    name: "Ultra Slim Laptop",
    price: 1200,
    category: "Computers",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80"
  },
  {
    name: "4K LED Smart TV",
    price: 850,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80"
  },
  {
    name: "Noise Cancelling Headphones",
    price: 199,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    name: "Smart Fitness Watch",
    price: 150,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 120,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b91a05c?w=500&q=80"
  }
];

const seedDB = async () => {
  await Product.deleteMany({}); // Clears old data
  await Product.insertMany(products); // Adds new data
  console.log("✅ Database Seeded Successfully!");
  mongoose.connection.close();
};

seedDB();