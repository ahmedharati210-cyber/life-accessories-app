'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useBag } from '@/contexts/BagContext';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Home, 
  Grid3X3, 
  Package, 
  Sparkles
} from 'lucide-react';
import Image from 'next/image';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const { totalItems, isLoaded } = useBag();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { 
      name: 'الرئيسية', 
      href: '/', 
      icon: Home,
      description: 'الصفحة الرئيسية'
    },
    { 
      name: 'المنتجات', 
      href: '/products', 
      icon: Package,
      description: 'جميع المنتجات'
    },
    { 
      name: 'الفئات', 
      href: '/categories', 
      icon: Grid3X3,
      description: 'تصفح الفئات'
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'gradient-primary backdrop-blur-xl shadow-2xl border-b border-white/20' 
          : 'gradient-primary backdrop-blur-xl border-b border-white/20'
      }`}
    >
      {/* Consistent glassmorphism background */}
      <div className="w-full">
        <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="group flex items-center space-x-3 space-x-reverse"
            >
              <div className="transition-transform duration-300 hover:scale-105 hover:rotate-1">
                <Image 
                  src="/images/logo-main.png" 
                  alt="Life Accessories"
                  className={`transition-all duration-500 ${
                    isScrolled ? 'h-12 w-auto' : 'h-10 w-auto'
                  } drop-shadow-lg`}
                  width={190}
                  height={60}
                  priority
                />
              </div>
              
              {!isScrolled && (
                <div className="hidden sm:block">
                  <h1 className="font-luxury-bold text-2xl text-white drop-shadow-lg">
                    Life Accessories
                  </h1>
                  <p className="font-elegant text-sm text-white/80 -mt-1">
                  حيث تلتقي الأناقة بالجودة
                  </p>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setIsHovered(item.name)}
                  onMouseLeave={() => setIsHovered(null)}
                  className="relative transform transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <Button
                    variant="ghost"
                    asChild
                    className={`group relative px-6 py-3 h-14 rounded-2xl transition-all duration-300 overflow-hidden ${
                      active
                        ? isScrolled
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                        : isScrolled
                          ? 'text-white/90 hover:bg-white/20 hover:text-white'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Link href={item.href} className="flex items-center space-x-3 space-x-reverse">
                      <Icon className={`w-5 h-5 transition-all duration-300 ${
                        active ? 'scale-110' : 'group-hover:scale-110'
                      }`} />
                      <span className="font-elegant-medium text-base whitespace-nowrap">
                        {item.name}
                      </span>
                    </Link>
                  </Button>
                  
                  {/* Tooltip */}
                  {isHovered === item.name && !active && (
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-10 opacity-0 animate-in fade-in-0 zoom-in-95 duration-200">
                        <div                         className={`px-3 py-2 rounded-lg text-sm font-elegant-medium whitespace-nowrap ${
                          isScrolled 
                            ? 'bg-white/90 text-gray-900 shadow-xl backdrop-blur-sm' 
                            : 'bg-white/90 text-gray-900 shadow-xl backdrop-blur-sm'
                        }`}>
                          {item.description}
                          <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${
                            isScrolled ? 'bg-white/90' : 'bg-white/90'
                          }`} />
                        </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side - Actions */}
          <div className="flex items-center justify-center space-x-3 space-x-reverse">
            {/* Shopping Bag Button */}
            <div className="transform transition-transform duration-300 hover:scale-105 hover:rotate-2 active:scale-95">
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className={`relative w-12 h-12 rounded-2xl transition-all duration-300 group ${
                  isScrolled 
                    ? 'hover:bg-white/20 text-white/80 hover:text-white' 
                    : 'hover:bg-white/20 text-white/80 hover:text-white'
                }`}
              >
                <Link href="/bag">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  {isLoaded && totalItems > 0 && (
                    <div className="animate-in zoom-in-0 duration-300">
                      <Badge 
                        className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-white shadow-lg"
                      >
                        {totalItems > 99 ? '99+' : totalItems}
                      </Badge>
                    </div>
                  )}
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden transform transition-transform duration-300 hover:scale-105 active:scale-95">
              <Button
                variant="ghost"
                size="icon"
                className={`w-12 h-12 rounded-2xl transition-all duration-300 group ${
                  isScrolled 
                    ? 'hover:bg-white/20 text-white/80 hover:text-white' 
                    : 'hover:bg-white/20 text-white/80 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className={`transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="overflow-hidden lg:hidden animate-in fade-in-0 slide-in-from-top-4 duration-300">
              <div className={`py-6 space-y-3 border-t ${
                isScrolled 
                  ? 'border-white/20 bg-white/10 backdrop-blur-2xl' 
                  : 'border-white/20 bg-white/10 backdrop-blur-2xl'
              }`}>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <div
                      key={item.name}
                      className="transform transition-transform duration-300 hover:translate-x-1"
                    >
                      <Button
                        variant="ghost"
                        asChild
                        className={`w-full justify-start h-16 gap-4 text-right transition-all duration-300 rounded-2xl ${
                          active
                            ? isScrolled
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : 'bg-white/20 text-white shadow-lg'
                            : isScrolled
                              ? 'text-white/90 hover:bg-white/10 hover:text-white'
                              : 'text-white/90 hover:bg-white/10 hover:text-white'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href={item.href} className="flex items-center gap-4 w-full">
                          <Icon className="w-6 h-6" />
                          <div className="flex-1 text-right">
                            <span className="font-elegant-medium text-lg block">
                              {item.name}
                            </span>
                            <span className={`text-sm ${
                              isScrolled ? 'text-white/70' : 'text-white/70'
                            }`}>
                              {item.description}
                            </span>
                          </div>
                          {active && (
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                          )}
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
          </div>
        )}
        </div>
      </div>
    </header>
  );
}
