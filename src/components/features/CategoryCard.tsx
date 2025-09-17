'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CategoryImage } from '@/components/ui/CloudinaryImage';
import { 
  Gem, Clock, ShoppingBag, Footprints, Sparkles, Droplets 
} from 'lucide-react';
import { encodeSlug } from '@/lib/slug';

interface CategoryCardProps {
  category: Category;
  productCount?: number;
}

const iconMap = {
  gem: Gem,
  clock: Clock,
  bag: ShoppingBag,
  'shoe-prints': Footprints,
  sparkles: Sparkles,
  droplets: Droplets,
} as const;

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Gem;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
        <Link href={`/category/${encodeSlug(category.slug)}`}>
          <div className="relative">
            {/* Category Image */}
            <div className="aspect-[4/3] relative overflow-hidden">
              <CategoryImage
                src={category.image}
                alt={category.name}
                className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                priority={false}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Icon */}
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {IconComponent && (
                    <IconComponent className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              
              {/* Product Count Badge */}
              {productCount !== undefined && (
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {productCount} منتج
                  </Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {category.description}
                </p>
                
                {/* Explore Button */}
                <div className="pt-2">
                  <span className="text-sm font-medium text-primary group-hover:underline">
                    استكشف المجموعة →
                  </span>
                </div>
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}
