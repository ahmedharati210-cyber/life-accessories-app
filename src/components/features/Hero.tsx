'use client';

import { motion } from 'framer-motion';
import { Sparkles, Truck, Shield } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
      {/* Hero Background Image */}
      <div className="absolute inset-0 top-0">
        <img 
          src="/images/hero-jewelry.jpeg" 
          alt="Life Accessories Jewelry Collection"
          className="w-full h-full object-cover brightness-75 contrast-125 saturate-110"
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
        {/* Additional enhancement overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />
      </div>
      
      {/* Background Pattern - Removed missing pattern.svg */}
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <img 
              src="/images/logo.png" 
              alt="Life Accessories Logo" 
              className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
            />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-luxury-bold mb-6 leading-tight">
            Life Accessories
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed font-elegant">
            اكتشف أحدث الإكسسوارات الأنيقة والعصرية. جودة عالية، أسعار مناسبة، وتوصيل سريع
          </p>
          
        </motion.div>
        
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">توصيل سريع</h3>
            <p className="text-white/80">توصيل مجاني للطلبات الكبيرة</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">دفع آمن</h3>
            <p className="text-white/80">دفع عند الاستلام</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">جودة عالية</h3>
            <p className="text-white/80">منتجات أصلية ومضمونة</p>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
