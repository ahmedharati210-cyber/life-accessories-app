import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  area: string;
  addressNote?: string;
  orderDate: string;
}

export interface AdminNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  area: string;
  addressNote?: string;
  orderDate: string;
  ipAddress: string;
  riskScore: number;
}

export interface OrderStatusUpdateData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  statusText: string;
  trackingInfo?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export class EmailService {
  private static instance: EmailService;
  private adminEmail: string;

  constructor() {
    this.adminEmail = process.env.ADMIN_EMAIL || 'lifeaccessoriesly@gmail.com';
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private generateOrderConfirmationHTML(data: OrderConfirmationData): string {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد الطلب - ${data.orderNumber}</title>
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { padding: 12px; text-align: right; border-bottom: 1px solid #e9ecef; }
          .items-table th { background: #f8f9fa; font-weight: 600; }
          .total-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .total-final { font-size: 18px; font-weight: bold; color: #667eea; border-top: 2px solid #667eea; padding-top: 12px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
          .status-badge { display: inline-block; background: #28a745; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>شكراً لك على طلبك!</h1>
            <p>تم استلام طلبك بنجاح وسيتم معالجته قريباً</p>
          </div>
          
          <div class="content">
            <div class="order-info">
              <h2>تفاصيل الطلب</h2>
              <p><strong>رقم الطلب:</strong> ${data.orderNumber}</p>
              <p><strong>تاريخ الطلب:</strong> ${new Date(data.orderDate).toLocaleDateString('ar-SA')}</p>
              <p><strong>الحالة:</strong> <span class="status-badge">قيد المراجعة</span></p>
            </div>

            <h3>معلومات العميل</h3>
            <p><strong>الاسم:</strong> ${data.customerName}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.customerEmail}</p>
            <p><strong>رقم الهاتف:</strong> ${data.customerPhone}</p>
            <p><strong>منطقة التوصيل:</strong> ${data.area}</p>
            ${data.addressNote ? `<p><strong>ملاحظات العنوان:</strong> ${data.addressNote}</p>` : ''}

            <h3>تفاصيل الطلب</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)} د.ل</td>
                    <td>${item.total.toFixed(2)} د.ل</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-row">
                <span>المجموع الفرعي:</span>
                <span>${data.subtotal.toFixed(2)} د.ل</span>
              </div>
              <div class="total-row">
                <span>رسوم التوصيل:</span>
                <span>${data.deliveryFee > 0 ? data.deliveryFee.toFixed(2) + ' د.ل' : 'مجاني'}</span>
              </div>
              <div class="total-row total-final">
                <span>المجموع الكلي:</span>
                <span>${data.total.toFixed(2)} د.ل</span>
              </div>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4>ماذا يحدث بعد ذلك؟</h4>
              <ul>
                <li>سيتم مراجعة طلبك خلال 24 ساعة</li>
                <li>سيتم إرسال رسالة تأكيد إضافية عند بدء التحضير</li>
                <li>ستتلقى تحديثات حول حالة الطلب عبر البريد الإلكتروني</li>
                <li>سيتم التواصل معك عبر الهاتف قبل التوصيل</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>شكراً لاختيارك Life Accessories</p>
            <p>للاستفسارات، يرجى التواصل معنا عبر الهاتف أو البريد الإلكتروني</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminNotificationHTML(data: AdminNotificationData): string {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طلب جديد - ${data.orderNumber}</title>
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .risk-high { background: #f8d7da; border-color: #f5c6cb; }
          .risk-medium { background: #fff3cd; border-color: #ffeaa7; }
          .risk-low { background: #d4edda; border-color: #c3e6cb; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { padding: 12px; text-align: right; border-bottom: 1px solid #e9ecef; }
          .items-table th { background: #f8f9fa; font-weight: 600; }
          .total-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .total-final { font-size: 18px; font-weight: bold; color: #ff6b6b; border-top: 2px solid #ff6b6b; padding-top: 12px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
          .status-badge { display: inline-block; background: #ff6b6b; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>طلب جديد تم استلامه!</h1>
            <p>رقم الطلب: ${data.orderNumber}</p>
          </div>
          
          <div class="content">
            <div class="alert ${data.riskScore > 70 ? 'risk-high' : data.riskScore > 40 ? 'risk-medium' : 'risk-low'}">
              <h3>تنبيه الأمان</h3>
              <p><strong>نقاط المخاطر:</strong> ${data.riskScore}/100</p>
              <p><strong>IP Address:</strong> ${data.ipAddress}</p>
            </div>

            <div class="order-info">
              <h2>تفاصيل الطلب</h2>
              <p><strong>رقم الطلب:</strong> ${data.orderNumber}</p>
              <p><strong>تاريخ الطلب:</strong> ${new Date(data.orderDate).toLocaleDateString('ar-SA')}</p>
              <p><strong>الحالة:</strong> <span class="status-badge">جديد</span></p>
            </div>

            <h3>معلومات العميل</h3>
            <p><strong>الاسم:</strong> ${data.customerName}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.customerEmail}</p>
            <p><strong>رقم الهاتف:</strong> ${data.customerPhone}</p>
            <p><strong>منطقة التوصيل:</strong> ${data.area}</p>
            ${data.addressNote ? `<p><strong>ملاحظات العنوان:</strong> ${data.addressNote}</p>` : ''}

            <h3>تفاصيل الطلب</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)} د.ل</td>
                    <td>${item.total.toFixed(2)} د.ل</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-row">
                <span>المجموع الفرعي:</span>
                <span>${data.subtotal.toFixed(2)} د.ل</span>
              </div>
              <div class="total-row">
                <span>رسوم التوصيل:</span>
                <span>${data.deliveryFee > 0 ? data.deliveryFee.toFixed(2) + ' د.ل' : 'مجاني'}</span>
              </div>
              <div class="total-row total-final">
                <span>المجموع الكلي:</span>
                <span>${data.total.toFixed(2)} د.ل</span>
              </div>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4>إجراءات مطلوبة</h4>
              <ul>
                <li>مراجعة تفاصيل الطلب</li>
                <li>التحقق من توفر المنتجات</li>
                <li>التواصل مع العميل لتأكيد الطلب</li>
                <li>تحديث حالة الطلب في لوحة الإدارة</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>Life Accessories - لوحة الإدارة</p>
            <p>تم إرسال هذا الإشعار تلقائياً</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateStatusUpdateHTML(data: OrderStatusUpdateData): string {
    const statusColors = {
      'pending': '#ffc107',
      'confirmed': '#17a2b8',
      'shipped': '#007bff',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    };

    const statusTexts = {
      'pending': 'قيد المراجعة',
      'confirmed': 'تم التأكيد',
      'shipped': 'تم الشحن',
      'delivered': 'تم التسليم',
      'cancelled': 'تم الإلغاء'
    };

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تحديث حالة الطلب - ${data.orderNumber}</title>
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, ${statusColors[data.status as keyof typeof statusColors]} 0%, #6c757d 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .status-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .status-badge { display: inline-block; background: ${statusColors[data.status as keyof typeof statusColors]}; color: white; padding: 10px 20px; border-radius: 25px; font-size: 16px; font-weight: 600; margin: 10px 0; }
          .tracking-info { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>تحديث حالة الطلب</h1>
            <p>رقم الطلب: ${data.orderNumber}</p>
          </div>
          
          <div class="content">
            <div class="status-info">
              <h2>الحالة الجديدة</h2>
              <div class="status-badge">${statusTexts[data.status as keyof typeof statusTexts]}</div>
              <p>تم تحديث حالة طلبك إلى: <strong>${data.statusText}</strong></p>
            </div>

            ${data.trackingInfo ? `
              <div class="tracking-info">
                <h3>معلومات التتبع</h3>
                <p><strong>رقم التتبع:</strong> ${data.trackingInfo}</p>
                ${data.estimatedDelivery ? `<p><strong>التاريخ المتوقع للتسليم:</strong> ${data.estimatedDelivery}</p>` : ''}
              </div>
            ` : ''}

            ${data.notes ? `
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>ملاحظات إضافية</h3>
                <p>${data.notes}</p>
              </div>
            ` : ''}

            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>ماذا يحدث بعد ذلك؟</h3>
              ${data.status === 'confirmed' ? `
                <ul>
                  <li>سيتم تحضير طلبك قريباً</li>
                  <li>ستتلقى إشعاراً عند بدء الشحن</li>
                  <li>سيتم التواصل معك عبر الهاتف قبل التوصيل</li>
                </ul>
              ` : data.status === 'shipped' ? `
                <ul>
                  <li>تم شحن طلبك بنجاح</li>
                  <li>يمكنك تتبع شحنتك باستخدام رقم التتبع</li>
                  <li>سيتم التواصل معك عند وصول الشحنة</li>
                </ul>
              ` : data.status === 'delivered' ? `
                <ul>
                  <li>تم تسليم طلبك بنجاح</li>
                  <li>نأمل أن تكون راضياً عن منتجاتنا</li>
                  <li>نقدر تقييمك ومراجعتك لمنتجاتنا</li>
                </ul>
              ` : data.status === 'cancelled' ? `
                <ul>
                  <li>تم إلغاء طلبك</li>
                  <li>سيتم إرجاع المبلغ خلال 3-5 أيام عمل</li>
                  <li>للاستفسارات، يرجى التواصل معنا</li>
                </ul>
              ` : ''}
            </div>
          </div>

          <div class="footer">
            <p>شكراً لاختيارك Life Accessories</p>
            <p>للاستفسارات، يرجى التواصل معنا عبر الهاتف أو البريد الإلكتروني</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendOrderConfirmation(data: OrderConfirmationData): Promise<boolean> {
    try {
      if (!data.customerEmail) {
        console.log('No email provided for order confirmation');
        return false;
      }

      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [data.customerEmail],
        subject: `تأكيد الطلب - ${data.orderNumber}`,
        html: this.generateOrderConfirmationHTML(data),
      });

      console.log('Order confirmation email sent:', result);
      return true;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return false;
    }
  }

  async sendAdminNotification(data: AdminNotificationData): Promise<boolean> {
    try {
      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [this.adminEmail],
        subject: `طلب جديد - ${data.orderNumber} - ${data.customerName}`,
        html: this.generateAdminNotificationHTML(data),
      });

      console.log('Admin notification email sent:', result);
      return true;
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      return false;
    }
  }

  async sendOrderStatusUpdate(data: OrderStatusUpdateData): Promise<boolean> {
    try {
      if (!data.customerEmail) {
        console.log('No email provided for status update');
        return false;
      }

      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [data.customerEmail],
        subject: `تحديث حالة الطلب - ${data.orderNumber}`,
        html: this.generateStatusUpdateHTML(data),
      });

      console.log('Order status update email sent:', result);
      return true;
    } catch (error) {
      console.error('Error sending order status update email:', error);
      return false;
    }
  }
}

export const emailService = EmailService.getInstance();
