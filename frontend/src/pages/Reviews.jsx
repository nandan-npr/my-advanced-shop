import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Verified Buyer",
    content: "Absolutely love the quality of the products. The shipping was fast and the packaging felt premium.",
    rating: 5,
    avatar: "AJ"
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Tech Enthusiast",
    content: "The Smartphone X Pro exceeded my expectations. Sleek design and incredible performance.",
    rating: 5,
    avatar: "SW"
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Regular Customer",
    content: "Aura is my go-to for minimalist essentials. Everything they make is so well-crafted.",
    rating: 4,
    avatar: "MC"
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Verified Buyer",
    content: "The minimalist backpack is perfect for work. Lightweight yet very durable.",
    rating: 5,
    avatar: "ED"
  },
  {
    id: 5,
    name: "Robert Smith",
    role: "Verified Buyer",
    content: "Great customer service and even better products. Highly recommended!",
    rating: 5,
    avatar: "RS"
  },
  {
    id: 6,
    name: "Jessica Taylor",
    role: "Design Critic",
    content: "The aesthetic of the website and the products is top-notch. Truly a premium experience.",
    rating: 5,
    avatar: "JT"
  }
];

const Reviews = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-primary mb-4"
          >
            Customer Reviews
          </motion.h1>
          <p className="text-muted-foreground text-lg">See what our community has to say about their Aura experience.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-premium border border-muted relative overflow-hidden group hover:border-accent/30 transition-all"
            >
              <Quote className="absolute -top-4 -right-4 w-24 h-24 text-muted/20 rotate-12 group-hover:text-accent/10 transition-colors" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < review.rating ? "fill-accent text-accent" : "text-muted"} 
                  />
                ))}
              </div>

              <p className="text-primary/80 mb-8 relative z-10 italic">"{review.content}"</p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-primary">{review.name}</h4>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-primary text-white rounded-3xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Have an experience to share?</h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">We value your feedback and would love to hear about your latest purchase.</p>
          <button className="bg-accent text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition shadow-lg shadow-accent/20">
            Write a Review
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Reviews;
