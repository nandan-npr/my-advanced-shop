import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">About Aura</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Redefining elegance for the modern individual. We believe in quality, craftsmanship, and timeless design.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000" 
              alt="Our Story" 
              className="rounded-2xl shadow-2xl object-cover w-full h-[400px]"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Founded in 2026, Aura began with a simple mission: to create premium essentials that elevate everyday life. We carefully source the finest materials and partner with skilled artisans to bring you pieces that stand the test of time.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every item in our collection is thoughtfully designed to blend functionality with uncompromising style. Welcome to the new standard of elegance.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-primary text-white rounded-3xl p-12 text-center shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-6">Our Core Values</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Quality</h3>
              <p className="text-white/70">Uncompromising standards in every detail, stitch, and seam.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Sustainability</h3>
              <p className="text-white/70">Mindful creation processes that respect our planet and people.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-accent">Timelessness</h3>
              <p className="text-white/70">Designs that outlast trends, becoming staples in your journey.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
