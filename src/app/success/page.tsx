'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, ShoppingBag, Home, Package, MessageCircle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [orderDetails, setOrderDetails] = useState<{
    id: string;
    status: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
    customer: { name: string; phone: string; area: string };
    createdAt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders`);
        const data = await response.json();
        
        if (data.success) {
          const order = data.data.find((o: { _id?: string; id?: string }) => o.id === orderId || o._id === orderId);
          if (order) {
            setOrderDetails({
              id: order.id || order._id || orderId,
              status: order.status || 'pending',
              total: order.total || order.amount || 0,
              items: order.items || [],
              customer: {
                name: order.customerName || order.customer?.name || 'Unknown',
                phone: order.customerPhone || order.customer?.phone || 'Unknown',
                area: order.shippingAddress?.area || order.customer?.address?.area || 'Unknown'
              },
              createdAt: order.createdAt || new Date().toISOString()
            });
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-green-600">
              تم إرسال طلبك بنجاح!
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              شكراً لك على ثقتك بنا. سنتواصل معك قريباً لتأكيد الطلب
            </p>
            
            {orderId && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                رقم الطلب: {orderId}
              </Badge>
            )}
          </motion.div>

          {/* Order Details */}
          {orderDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    تفاصيل الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">معلومات العميل</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">الاسم:</span> {orderDetails.customer.name}</p>
                        <p><span className="text-muted-foreground">الهاتف:</span> {orderDetails.customer.phone}</p>
                        <p><span className="text-muted-foreground">المنطقة:</span> {orderDetails.customer.area}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">حالة الطلب</h4>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-muted-foreground">الحالة:</span> 
                          <Badge variant="warning" className="mr-2">قيد المراجعة</Badge>
                        </div>
                        <p><span className="text-muted-foreground">المجموع:</span> {orderDetails.total} د.ل</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">المنتجات المطلوبة</h4>
                    <div className="space-y-2">
                      {orderDetails.items.map((item, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm py-2 border-b last:border-b-0">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-medium">{item.price} د.ل</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-6"
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 text-blue-900">ماذا يحدث بعد ذلك؟</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• سنتواصل معك خلال 24 ساعة لتأكيد الطلب</p>
                  <p>• سيتم تجهيز طلبك وتوصيله خلال 2-3 أيام عمل</p>
                  <p>• يمكنك دفع المبلغ عند استلام الطلب</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-green-900">تواصل معنا</h3>
                <div className="text-sm text-green-800 space-y-3">
                  <p>هل لديك أي استفسارات حول طلبك؟ نحن هنا لمساعدتك!</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                      asChild
                    >
                      <a href="https://wa.me/218919900049" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 ml-2" />
                        واتساب: 0919900049
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                      asChild
                    >
                      <a href="tel:+218929900049">
                        <Phone className="w-4 h-4 ml-2" />
                        اتصال: 0929900049
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                      asChild
                    >
                      <a href="mailto:lifeaccessoriesly@gmail.com">
                        <Mail className="w-4 h-4 ml-2" />
                        البريد الإلكتروني
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/">
                  <Home className="w-5 h-5 ml-2" />
                  العودة للرئيسية
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5 ml-2" />
                  متابعة التسوق
                </Link>
              </Button>
              
              <Button asChild variant="secondary" size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Link 
                  href={`https://wa.me/218912345678?text=مرحباً، أريد الاستفسار عن طلبي رقم: ${orderId || 'غير محدد'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تواصل عبر واتساب
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
