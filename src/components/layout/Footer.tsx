import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Mail, 
  Phone, 
  Heart,
  Sparkles,
  MessageCircle,
  Instagram,
  Facebook
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-purple-50 to-pink-50 border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
                  <span className="font-luxury-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Life Accessories
                  </span>
            </div>
            <p className="text-muted-foreground max-w-md mx-auto text-lg font-elegant">
              حيث تلتقي الأناقة بالجودة. اكتشف عالم المجوهرات والإكسسوارات الفاخرة
            </p>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Icons on top */}
            <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/50 hover:bg-white/80"
                asChild
              >
                <a href="https://www.facebook.com/LifeAccessoriesly" target="_blank" rel="noopener noreferrer" title="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/50 hover:bg-white/80"
                asChild
              >
                <a href="https://www.instagram.com/lifeaccessoriesly?igsh=MXczMmI2cXNyNHlzbw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/50 hover:bg-white/80"
                asChild
              >
                <a href="https://wa.me/218919900049" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/50 hover:bg-white/80"
                asChild
              >
                <a href="mailto:lifeaccessoriesly@gmail.com" title="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/50 hover:bg-white/80"
                asChild
              >
                <a href="tel:+218929900049" title="Call">
                  <Phone className="h-5 w-5" />
                </a>
              </Button>
            </div>
            {/* Text below icons */}
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                <p>طرابلس، ليبيا</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>0919900049 • 0929900049</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-purple-600 transition-colors">
              الرئيسية
            </Link>
            <Link href="/products" className="text-muted-foreground hover:text-purple-600 transition-colors">
              المنتجات
            </Link>
            <Link href="/categories" className="text-muted-foreground hover:text-purple-600 transition-colors">
              الفئات
            </Link>
            <Link href="/bag" className="text-muted-foreground hover:text-purple-600 transition-colors">
              سلة التسوق
            </Link>
          </div>

          {/* Special Message */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <span className="font-semibold text-purple-700">مصنوع بحب في ليبيا</span>
            </div>
            <p className="text-sm text-muted-foreground">
              كل قطعة مجوهرات تحمل قصة فريدة من التراث الليبي الأصيل
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-purple-200/50 mt-12 pt-8">
          <div className="grid grid-cols-3 items-center gap-4">
            <div></div>
            <p className="text-sm text-muted-foreground text-center">
              © {currentYear} Life Accessories. جميع الحقوق محفوظة.
            </p>
            <p className="text-sm text-muted-foreground text-right">
              Created by <span className="font-bold text-purple-600">Harati</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
