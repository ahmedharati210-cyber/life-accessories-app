'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, ShoppingBag, Home, Package, MessageCircle, Phone, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import areasData from '@/data/areas.json';
import { Area } from '@/types';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const areas: Area[] = areasData as Area[];
  const [orderDetails, setOrderDetails] = useState<{
    id: string;
    orderNumber?: string;
    status: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
    customer: { name: string; phone: string; area: string };
    createdAt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get Arabic area name
  const getAreaName = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    return area?.name || areaId;
  };

  // Generate WhatsApp message with order details
  const generateWhatsAppMessage = () => {
    const orderNumber = orderDetails?.orderNumber || orderId || 'غير محدد';
    const customerName = orderDetails?.customer.name || 'غير محدد';
    const total = orderDetails?.total || 0;
    
    return `مرحباً، أريد الاستفسار عن طلبي:

📋 رقم الطلب: ${orderNumber}
👤 الاسم: ${customerName}
💰 المبلغ: ${total} د.ل

شكراً لكم`;
  };

  // Function to preview receipt
  const previewReceipt = () => {
    if (!orderDetails) return;
    
    const receiptContent = generateReceiptContent();
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(receiptContent);
      newWindow.document.close();
    }
  };

  // Function to generate receipt HTML content
  const generateReceiptContent = () => {
    if (!orderDetails) return '';

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>إيصال الطلب - ${orderDetails.orderNumber || orderId}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
            color: #333;
            direction: rtl;
          }
          .receipt {
            max-width: 400px;
            margin: 0 auto;
            border: 2px solid #10b981;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: bold;
          }
          .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 20px;
          }
          .section {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
          }
          .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .info-label {
            color: #6b7280;
            font-weight: 500;
          }
          .info-value {
            color: #1f2937;
            font-weight: 600;
          }
          .items-list {
            margin-top: 10px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .item:last-child {
            border-bottom: none;
          }
          .total {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
          }
          .status-badge {
            background: #fef3c7;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .footer {
            background: #f9fafb;
            padding: 15px 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
          }
          @media print {
            body { margin: 0; }
            .receipt { box-shadow: none; border: 1px solid #ccc; }
            .print-button { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print()">🖨️ طباعة</button>
        <div class="receipt">
          <div class="header">
            <h1>إيصال الطلب</h1>
            <p>Life Accessories </p>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">📋 معلومات الطلب</div>
              <div class="info-row">
                <span class="info-label">رقم الطلب:</span>
                <span class="info-value">${orderDetails.orderNumber || orderId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">تاريخ الطلب:</span>
                <span class="info-value">${new Date(orderDetails.createdAt).toLocaleDateString('ar-LY')}</span>
              </div>
              <div class="info-row">
                <span class="info-label">حالة الطلب:</span>
                <span class="info-value">
                  <span class="status-badge">قيد المراجعة</span>
                </span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">👤 معلومات العميل</div>
              <div class="info-row">
                <span class="info-label">الاسم:</span>
                <span class="info-value">${orderDetails.customer.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">الهاتف:</span>
                <span class="info-value">${orderDetails.customer.phone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">المنطقة:</span>
                <span class="info-value">${getAreaName(orderDetails.customer.area)}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">🛍️ المنتجات المطلوبة</div>
              <div class="items-list">
                ${orderDetails.items.map(item => `
                  <div class="item">
                    <span>${item.name} × ${item.quantity}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="total">
              <div class="total-row">
                <span>المجموع الكلي:</span>
                <span>${orderDetails.total} د.ل</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>شكراً لك على ثقتك بنا</p>
            <p>واتساب: 0919900049 | اتصال: 0929900049</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Function to generate and download receipt
  const downloadReceipt = () => {
    if (!orderDetails) return;

    const receiptContent = generateReceiptContent();

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${orderDetails.orderNumber || orderId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
            const orderDetails = {
              id: order.id || order._id || orderId,
              orderNumber: order.orderNumber,
              status: order.status || 'pending',
              total: order.total || order.amount || 0,
              items: order.items || [],
              customer: {
                name: order.customerName || order.customer?.name || 'Unknown',
                phone: order.customerPhone || order.customer?.phone || 'Unknown',
                area: order.shippingAddress?.area || order.customer?.address?.area || 'Unknown'
              },
              createdAt: order.createdAt || new Date().toISOString()
            };
            
            setOrderDetails(orderDetails);
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
    <div className="min-h-screen bg-muted/30 pt-16 sm:pt-20">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-green-600">
              تم إرسال طلبك بنجاح!
            </h1>
            
            <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-6">
              شكراً لك على ثقتك بنا. سنتواصل معك قريباً لتأكيد الطلب
            </p>
            
            <Badge variant="secondary" className="text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
              رقم الطلب: {orderDetails?.orderNumber || orderId || 'جاري التحميل...'}
            </Badge>
          </motion.div>

          {/* Order Details */}
          {orderDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="mb-6 sm:mb-8">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                    تفاصيل الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">معلومات العميل</h4>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <p><span className="text-muted-foreground">الاسم:</span> {orderDetails.customer.name}</p>
                        <p><span className="text-muted-foreground">الهاتف:</span> {orderDetails.customer.phone}</p>
                        <p><span className="text-muted-foreground">المنطقة:</span> {getAreaName(orderDetails.customer.area)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">حالة الطلب</h4>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <div className="flex items-center gap-2"><span className="text-muted-foreground">الحالة:</span> 
                          <Badge variant="warning" className="text-xs">قيد المراجعة</Badge>
                        </div>
                        <p><span className="text-muted-foreground">المجموع:</span> {orderDetails.total} د.ل</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">المنتجات المطلوبة</h4>
                    <div className="space-y-2">
                      {orderDetails.items.map((item, index: number) => (
                        <div key={index} className="flex justify-between items-center text-xs sm:text-sm py-2 border-b last:border-b-0">
                          <span className="flex-1 pr-2">{item.name} × {item.quantity}</span>
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
            className="text-center space-y-4 sm:space-y-6"
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-2 text-blue-900 text-sm sm:text-base">ماذا يحدث بعد ذلك؟</h3>
                <div className="text-xs sm:text-sm text-blue-800 space-y-1">
                  <p>• سنتواصل معك خلال 24 ساعة لتأكيد الطلب</p>
                  <p>• يمكنك دفع المبلغ عند استلام الطلب</p>
                </div>
              </CardContent>
            </Card>

            
            {/* Modern Contact & Action Section */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">هل تحتاج مساعدة؟</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      نحن هنا لمساعدتك في أي استفسار حول طلبك
                    </p>
                  </div>
                  

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button 
                      asChild 
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <a 
                        href={`https://wa.me/218919900049?text=${encodeURIComponent(generateWhatsAppMessage())}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 ml-2" />
                        واتساب: 0919900049
                      </a>
                    </Button>
                    
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg" 
                      className="border-green-300 text-green-700 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <a href="tel:+218929900049">
                        <Phone className="w-4 h-4 ml-2" />
                        اتصال: 0929900049
                      </a>
                    </Button>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-green-200">
                    {/* Receipt Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={previewReceipt}
                        variant="outline" 
                        size="lg" 
                        className="bg-white border-green-300 text-green-700 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <FileText className="w-4 h-4 ml-2" />
                        معاينة الإيصال
                      </Button>
                      
                      <Button 
                        onClick={downloadReceipt}
                        variant="outline" 
                        size="lg" 
                        className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Download className="w-4 h-4 ml-2" />
                        تحميل الإيصال
                      </Button>
                    </div>
                    
                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild variant="outline" size="lg" className="hover:bg-gray-50">
                        <Link href="/">
                          <Home className="w-4 h-4 ml-2" />
                          العودة للرئيسية
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" size="lg" className="hover:bg-gray-50">
                        <Link href="/products">
                          <ShoppingBag className="w-4 h-4 ml-2" />
                          متابعة التسوق
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
