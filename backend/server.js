const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ CONNECT TO MONGODB
// Uses your specific credentials and a 30-second timeout
mongoose.connect('mongodb+srv://admin:sitharam123@cluster0.ypikatd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    serverSelectionTimeoutMS: 30000 // Waits 30 seconds before timing out
})
.then(() => console.log('✅ MongoDB Connected Successfully!'))
.catch(err => {
    console.log('❌ Connection Error:', err.message);
    console.log('👉 Hint: If this is a timeout, try using a Mobile Hotspot instead of WiFi.');
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Server is Ready!');
});

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});