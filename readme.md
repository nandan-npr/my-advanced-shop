
ShopSmart - Full Stack E-Commerce Application

ShopSmart is a fully functional E-Commerce web application built using the MERN Stack (MongoDB, Express.js, React, Node.js). It features a complete shopping experience including product browsing, a dynamic shopping cart, user authentication, and order history management.

🚀 Features

* User Authentication: Secure Login and Registration system using JWT (JSON Web Tokens) and Bcrypt for password hashing.
* Product Catalog: Dynamic home page displaying products fetched from the database.
* Shopping Cart: Add items to cart.
    * Adjust quantities.
    * Real-time total price calculation.
    * Remove items.
    * Cart persistence (saves to LocalStorage).
* Checkout System: Integrated backend order processing that saves purchase details to the database.
* Order History: A dedicated "My Orders" dashboard where users can view their past purchases and payment status.
* Responsive Design: Styled with Tailwind CSS for a mobile-friendly interface.
* Backend API: RESTful API built with Node.js and Express to handle data requests.

🛠️ Tech Stack

Frontend
* React.js: Library for building the user interface.
* React Router DOM: For seamless page navigation.
* Tailwind CSS: For modern and responsive styling.
* Context API: For state management (Cart and User Auth).
* Axios: For making HTTP requests to the backend.

Backend
* Node.js: Runtime environment.
* Express.js:Web framework for the API.
* MongoDB & Mongoose: NoSQL database for storing users, products, and orders.
* BcryptJS: For secure password encryption.
* JsonWebToken (JWT): For secure user sessions.
* Cors: To handle cross-origin requests between frontend and backend.

📂 Project Structure

my-advanced-shop/
├── backend/                # Server-side code
│   ├── models/             # Database schemas (User, Product, Order)
│   ├── routes/             # API routes (Auth, Products, Orders)
│   ├── server.js           # Entry point for the backend
│   └── .env                # Environment variables (DB Connection)
│
└── frontend/               # Client-side code
├── src/
│   ├── components/     # Reusable components (Navbar, etc.)
│   ├── context/        # Global state (AuthContext, CartContext)
│   ├── pages/          # Page views (Home, Cart, Login, Register, MyOrders)
│   ├── App.jsx         # Main App component with Routes
│   └── main.jsx        # Entry point for React
└── index.css           # Tailwind imports


⚙️ Installation & Setup

Follow these steps to run the project locally on your machine.

1. Clone the Repository
git clone <your-github-repo-url>
cd my-advanced-shop

2. Backend Setup

Navigate to the backend folder and install dependencies:
cd backend
npm install

Configuration:
Create a .env file in the `backend` folder and add your MongoDB connection string:

env
MONGO_URI=your_mongodb_connection_string_here
PORT=5000

(Note: Replace `your_mongodb_connection_string_here` with your actual MongoDB Atlas URI)

Start the Server:
node server.js

You should see: "Server started on http://localhost:5000" and "MongoDB Connected Successfully!"

3. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:
cd frontend
npm install


Start the React App:
npm run dev


The app will launch at http://localhost:5173 (or similar).

🔌 API Endpoints

The backend exposes the following RESTful API endpoints:

| Method |    Endpoint      | Description                          |
| ---  | --- ---------------| -------------------------------------|
| GET  | /api/products`     | Fetch all products                   |
| POST | /api/auth/register | Register a new user                  |
| POST | /api/auth/login`   | Login user & get Token               |
| POST | /api/orders`       | Place a new order                    |
| GET  | /api/orders/:userId| Get order history for a specific user|
🔮 Future Improvements

* Payment Gateway: Integrate Stripe or PayPal for real payments.
* Admin Dashboard: Create a panel for admins to add/edit products.
* Product Search: Add a search bar to filter products.


Author: [Nandan Pruthvi Raj R]
License: MIT
