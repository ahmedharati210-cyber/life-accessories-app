'use client';

import { motion } from 'framer-motion';
import { Sparkles, Truck, Shield } from 'lucide-react';
import { LazyMotion } from '@/components/ui/LazyMotion';
import { HeroImage } from '@/components/ui/CloudinaryImage';
import { getAnimationChunk, AnimationChunk } from '@/lib/animationLoader';
import { useState, useEffect } from 'react';

export function Hero() {
  const [animations, setAnimations] = useState<AnimationChunk | null>(null);

  // Load animations lazily
  useEffect(() => {
    getAnimationChunk('hero').then(setAnimations);
  }, []);

  // Show loading state while animations are loading
  if (!animations) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
        <div className="absolute inset-0 top-0">
          <HeroImage 
            src="/images/hero-jewelry.jpeg" 
            alt="Life Accessories Jewelry Collection"
            className="w-full h-full brightness-75 contrast-125 saturate-110"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="animate-pulse">
            <div className="w-48 h-48 bg-white/20 rounded-full mx-auto mb-8"></div>
            <div className="h-16 bg-white/20 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-6 bg-white/20 rounded w-3/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2 mx-auto mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
      {/* Hero Background Image */}
      <div className="absolute inset-0 top-0">
        <HeroImage 
          src="/images/hero-jewelry.jpeg" 
          alt="Life Accessories Jewelry Collection"
          className="w-full h-full brightness-75 contrast-125 saturate-110"
          priority={true}
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
        {/* Additional enhancement overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <LazyMotion
          variants={animations.fadeInUp}
          initial={false}
          animate="visible"
          className="max-w-4xl mx-auto"
          style={animations.performanceProps?.style as React.CSSProperties}
          threshold={0.1}
        >
          <motion.div
            variants={animations.scaleIn}
            className="mb-8 flex justify-center"
          >
            <motion.img 
              src="/images/logo.png" 
              alt="Life Accessories Logo" 
              className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
              whileHover={{ 
                scale: 1.05,
                rotate: 2,
                transition: animations.luxuryTransitions?.smooth || { duration: 0.3 }
              }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-luxury-bold mb-6 leading-tight"
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  ...(animations.luxuryTransitions?.elegant || {}),
                  delay: 0.2
                }
              }
            }}
          >
            Life Accessories
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed font-elegant"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  ...(animations.luxuryTransitions?.smooth || {}),
                  delay: 0.4
                }
              }
            }}
          >
            اكتشف أحدث الإكسسوارات الأنيقة والعصرية. جودة عالية، أسعار مناسبة، وتوصيل سريع
          </motion.p>
        </LazyMotion>
        
        {/* Features */}
        <LazyMotion
          variants={animations.staggerContainer}
          initial={false}
          animate="visible"
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          threshold={0.2}
        >
          {[
            { icon: Truck, title: "توصيل سريع", desc: "توصيل مجاني للطلبات الكبيرة" },
            { icon: Shield, title: "دفع آمن", desc: "دفع عند الاستلام" },
            { icon: Sparkles, title: "جودة عالية", desc: "منتجات أصلية ومضمونة" }
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={animations.staggerItem}
                className="text-center group"
              whileHover={{ 
                y: -8,
                transition: animations.luxuryTransitions?.swift || { duration: 0.2 }
              }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: animations.luxuryTransitions?.smooth || { duration: 0.3 }
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.desc}</p>
              </motion.div>
            );
          })}
        </LazyMotion>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          ...(animations.luxuryTransitions?.smooth || {}),
          delay: 1.2
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut",
            type: "tween"
          }}
        >
          <motion.div
            animate={{ 
              y: [0, 12, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
