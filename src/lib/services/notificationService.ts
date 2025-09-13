import { emailService, OrderConfirmationData, AdminNotificationData, OrderStatusUpdateData } from './emailService';
import { smsService, OrderConfirmationSMSData, AdminNotificationSMSData, OrderStatusUpdateSMSData } from './smsService';

export interface NotificationResult {
  emailSent: boolean;
  smsSent: boolean;
  success: boolean;
  errors: string[];
}

export interface OrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
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
  ipAddress?: string;
  riskScore?: number;
}

export interface OrderStatusNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  status: string;
  statusText: string;
  trackingInfo?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export class NotificationService {
  private static instance: NotificationService;
  private smsEnabled: boolean;

  constructor() {
    // SMS is disabled by default - set to true in environment to enable
    this.smsEnabled = process.env.SMS_NOTIFICATIONS_ENABLED === 'true';
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendOrderConfirmation(data: OrderNotificationData): Promise<NotificationResult> {
    const result: NotificationResult = {
      emailSent: false,
      smsSent: false,
      success: false,
      errors: []
    };

    try {
      // Send email notification if email is provided
      if (data.customerEmail) {
        const emailData: OrderConfirmationData = {
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          items: data.items,
          subtotal: data.subtotal,
          deliveryFee: data.deliveryFee,
          total: data.total,
          area: data.area,
          addressNote: data.addressNote,
          orderDate: data.orderDate
        };

        result.emailSent = await emailService.sendOrderConfirmation(emailData);
        if (!result.emailSent) {
          result.errors.push('Failed to send confirmation email');
        }
      }

      // Send SMS notification (only if enabled)
      if (this.smsEnabled) {
        const smsData: OrderConfirmationSMSData = {
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          total: data.total,
          area: data.area
        };

        result.smsSent = await smsService.sendOrderConfirmation(smsData, data.customerPhone);
        if (!result.smsSent) {
          result.errors.push('Failed to send confirmation SMS');
        }
      } else {
        console.log('SMS notifications disabled - skipping SMS for order confirmation');
      }

      result.success = result.emailSent || result.smsSent;
    } catch (error) {
      result.errors.push(`Error sending order confirmation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  async sendAdminNotification(data: OrderNotificationData): Promise<NotificationResult> {
    const result: NotificationResult = {
      emailSent: false,
      smsSent: false,
      success: false,
      errors: []
    };

    try {
      // Send email notification to admin
      const emailData: AdminNotificationData = {
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail || 'No email provided',
        customerPhone: data.customerPhone,
        items: data.items,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        total: data.total,
        area: data.area,
        addressNote: data.addressNote,
        orderDate: data.orderDate,
        ipAddress: data.ipAddress || 'Unknown',
        riskScore: data.riskScore || 0
      };

      result.emailSent = await emailService.sendAdminNotification(emailData);
      if (!result.emailSent) {
        result.errors.push('Failed to send admin notification email');
      }

      // Send SMS notification to admin (only if enabled)
      if (this.smsEnabled) {
        const smsData: AdminNotificationSMSData = {
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          total: data.total,
          riskScore: data.riskScore || 0
        };

        result.smsSent = await smsService.sendAdminNotification(smsData);
        if (!result.smsSent) {
          result.errors.push('Failed to send admin notification SMS');
        }
      } else {
        console.log('SMS notifications disabled - skipping admin SMS notification');
      }

      result.success = result.emailSent || result.smsSent;
    } catch (error) {
      result.errors.push(`Error sending admin notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  async sendOrderStatusUpdate(data: OrderStatusNotificationData): Promise<NotificationResult> {
    const result: NotificationResult = {
      emailSent: false,
      smsSent: false,
      success: false,
      errors: []
    };

    try {
      // Send email notification if email is provided
      if (data.customerEmail) {
        const emailData: OrderStatusUpdateData = {
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          status: data.status,
          statusText: data.statusText,
          trackingInfo: data.trackingInfo,
          estimatedDelivery: data.estimatedDelivery,
          notes: data.notes
        };

        result.emailSent = await emailService.sendOrderStatusUpdate(emailData);
        if (!result.emailSent) {
          result.errors.push('Failed to send status update email');
        }
      }

      // Send SMS notification (only if enabled)
      if (this.smsEnabled) {
        const smsData: OrderStatusUpdateSMSData = {
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          status: data.status,
          statusText: data.statusText,
          trackingInfo: data.trackingInfo
        };

        result.smsSent = await smsService.sendOrderStatusUpdate(smsData, data.customerPhone);
        if (!result.smsSent) {
          result.errors.push('Failed to send status update SMS');
        }
      } else {
        console.log('SMS notifications disabled - skipping status update SMS');
      }

      result.success = result.emailSent || result.smsSent;
    } catch (error) {
      result.errors.push(`Error sending status update: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  async sendOrderNotifications(data: OrderNotificationData): Promise<{
    customerNotification: NotificationResult;
    adminNotification: NotificationResult;
  }> {
    // Send notifications in parallel
    const [customerNotification, adminNotification] = await Promise.all([
      this.sendOrderConfirmation(data),
      this.sendAdminNotification(data)
    ]);

    return {
      customerNotification,
      adminNotification
    };
  }
}

export const notificationService = NotificationService.getInstance();
