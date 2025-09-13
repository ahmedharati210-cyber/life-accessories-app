import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export interface SMSData {
  to: string;
  message: string;
}

export interface OrderConfirmationSMSData {
  orderNumber: string;
  customerName: string;
  total: number;
  area: string;
}

export interface AdminNotificationSMSData {
  orderNumber: string;
  customerName: string;
  total: number;
  riskScore: number;
}

export interface OrderStatusUpdateSMSData {
  orderNumber: string;
  customerName: string;
  status: string;
  statusText: string;
  trackingInfo?: string;
}

export class SMSService {
  private static instance: SMSService;
  private adminPhone: string;
  private fromPhone: string;

  constructor() {
    this.adminPhone = process.env.ADMIN_PHONE || '+218912345678';
    this.fromPhone = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
  }

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  private formatPhoneNumber(phone: string): string {
    // Convert Libyan phone number to international format
    if (phone.startsWith('09')) {
      return `+218${phone.substring(1)}`;
    }
    if (phone.startsWith('+218')) {
      return phone;
    }
    if (phone.startsWith('218')) {
      return `+${phone}`;
    }
    return phone;
  }

  private generateOrderConfirmationMessage(data: OrderConfirmationSMSData): string {
    return `مرحباً ${data.customerName}! تم استلام طلبك رقم ${data.orderNumber} بنجاح. المجموع: ${data.total.toFixed(2)} د.ل. منطقة التوصيل: ${data.area}. سنتواصل معك قريباً. شكراً لاختيارك Life Accessories!`;
  }

  private generateAdminNotificationMessage(data: AdminNotificationSMSData): string {
    const riskLevel = data.riskScore > 70 ? 'عالي' : data.riskScore > 40 ? 'متوسط' : 'منخفض';
    return `طلب جديد! رقم: ${data.orderNumber} - العميل: ${data.customerName} - المجموع: ${data.total.toFixed(2)} د.ل - مستوى المخاطر: ${riskLevel}`;
  }

  private generateStatusUpdateMessage(data: OrderStatusUpdateSMSData): string {
    let message = `مرحباً ${data.customerName}! تم تحديث حالة طلبك رقم ${data.orderNumber} إلى: ${data.statusText}`;
    
    if (data.trackingInfo) {
      message += ` رقم التتبع: ${data.trackingInfo}`;
    }
    
    message += ' شكراً لاختيارك Life Accessories!';
    
    return message;
  }

  async sendSMS(data: SMSData): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhoneNumber(data.to);
      
      const result = await client.messages.create({
        body: data.message,
        from: this.fromPhone,
        to: formattedPhone
      });

      console.log('SMS sent successfully:', result.sid);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  async sendOrderConfirmation(data: OrderConfirmationSMSData, customerPhone: string): Promise<boolean> {
    try {
      const message = this.generateOrderConfirmationMessage(data);
      return await this.sendSMS({
        to: customerPhone,
        message: message
      });
    } catch (error) {
      console.error('Error sending order confirmation SMS:', error);
      return false;
    }
  }

  async sendAdminNotification(data: AdminNotificationSMSData): Promise<boolean> {
    try {
      const message = this.generateAdminNotificationMessage(data);
      return await this.sendSMS({
        to: this.adminPhone,
        message: message
      });
    } catch (error) {
      console.error('Error sending admin notification SMS:', error);
      return false;
    }
  }

  async sendOrderStatusUpdate(data: OrderStatusUpdateSMSData, customerPhone: string): Promise<boolean> {
    try {
      const message = this.generateStatusUpdateMessage(data);
      return await this.sendSMS({
        to: customerPhone,
        message: message
      });
    } catch (error) {
      console.error('Error sending order status update SMS:', error);
      return false;
    }
  }
}

export const smsService = SMSService.getInstance();
