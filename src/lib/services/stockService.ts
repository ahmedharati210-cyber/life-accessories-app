import { getCollections } from '@/lib/database';
import { notificationService } from './notificationService';
import { ObjectId } from 'mongodb';

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  alertType: 'low_stock' | 'out_of_stock';
  timestamp: string;
}

export interface StockHistory {
  _id?: string;
  productId: string;
  productName: string;
  changeType: 'purchase' | 'restock' | 'adjustment' | 'return' | 'damage';
  quantityChange: number; // positive for increase, negative for decrease
  previousStock: number;
  newStock: number;
  reason?: string;
  orderId?: string;
  adminId?: string;
  timestamp: string;
}

export class StockService {
  private static readonly LOW_STOCK_THRESHOLD = 5;
  private static readonly OUT_OF_STOCK_THRESHOLD = 0;
  private static lastAlertCheck: string | null = null;

  /**
   * Check for low stock alerts and send notifications (only once per day)
   */
  static async checkLowStockAlerts(sendNotifications: boolean = false): Promise<StockAlert[]> {
    try {
      const { products } = await getCollections();
      const lowStockProducts = await products.find({
        inStock: true,
        stock: { $lte: this.LOW_STOCK_THRESHOLD }
      }).toArray();

      const alerts: StockAlert[] = [];

      for (const product of lowStockProducts) {
        const alertType = product.stock <= this.OUT_OF_STOCK_THRESHOLD ? 'out_of_stock' : 'low_stock';
        
        const alert: StockAlert = {
          productId: product._id.toString(),
          productName: product.name,
          currentStock: product.stock,
          threshold: this.LOW_STOCK_THRESHOLD,
          alertType,
          timestamp: new Date().toISOString()
        };

        alerts.push(alert);

        // Only send notifications if explicitly requested and not sent today
        if (sendNotifications && this.shouldSendAlert()) {
          await this.sendStockAlert(alert);
        }
      }

      // Update last check time if notifications were sent
      if (sendNotifications && alerts.length > 0) {
        this.lastAlertCheck = new Date().toISOString().split('T')[0]; // Store date only
      }

      return alerts;
    } catch (error) {
      console.error('Error checking low stock alerts:', error);
      return [];
    }
  }

  /**
   * Check if we should send alerts (only once per day)
   */
  private static shouldSendAlert(): boolean {
    const today = new Date().toISOString().split('T')[0];
    return this.lastAlertCheck !== today;
  }

  /**
   * Send stock alert notification to admin
   */
  private static async sendStockAlert(alert: StockAlert): Promise<void> {
    try {
      const alertMessage = alert.alertType === 'out_of_stock' 
        ? `🚨 المنتج "${alert.productName}" نفد من المخزون!`
        : `⚠️ المنتج "${alert.productName}" قليل المخزون (${alert.currentStock} قطع متبقية)`;

      // Send email notification
      await notificationService.sendAdminNotification({
        orderNumber: 'STOCK-ALERT',
        customerName: 'نظام إدارة المخزون',
        customerEmail: 'system@lifeaccessories.com',
        customerPhone: '+218000000000',
        items: [{
          name: alert.productName,
          quantity: alert.currentStock,
          unitPrice: 0,
          total: 0
        }],
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
        area: 'نظام إدارة المخزون',
        addressNote: alertMessage,
        orderDate: alert.timestamp,
        ipAddress: 'system',
        riskScore: 0
      });
    } catch (error) {
      console.error('Error sending stock alert:', error);
    }
  }

  /**
   * Update product stock and create history record
   */
  static async updateStock(
    productId: string,
    quantityChange: number,
    changeType: StockHistory['changeType'],
    reason?: string,
    orderId?: string,
    adminId?: string
  ): Promise<{ success: boolean; newStock?: number; error?: string }> {
    try {
      const { products } = await getCollections();
      const objectId = new ObjectId(productId);

      // Get current product
      const product = await products.findOne({ _id: objectId });
      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      const previousStock = product.stock || 0;
      const newStock = Math.max(0, previousStock + quantityChange);
      const inStock = newStock > 0;
      

      // Update product stock
      const updateResult = await products.updateOne(
        { _id: objectId },
        {
          $set: {
            stock: newStock,
            inStock: inStock,
            updatedAt: new Date().toISOString()
          }
        }
      );

      if (updateResult.modifiedCount === 0) {
        return { success: false, error: 'Failed to update stock' };
      }

      // Create stock history record
      await this.createStockHistory({
        productId,
        productName: product.name,
        changeType,
        quantityChange,
        previousStock,
        newStock,
        reason,
        orderId,
        adminId,
        timestamp: new Date().toISOString()
      });

      // Check for low stock alerts after update
      if (newStock <= this.LOW_STOCK_THRESHOLD) {
        await this.checkLowStockAlerts();
      }

      // Clear product cache to ensure frontend gets updated data
      try {
        const { cacheHelpers } = await import('@/lib/cache');
        cacheHelpers.invalidateProducts();
      } catch (error) {
        console.error('Error clearing product cache:', error);
      }

      return { success: true, newStock };
    } catch (error) {
      console.error('Error updating stock:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Create stock history record
   */
  static async createStockHistory(historyData: Omit<StockHistory, '_id'>): Promise<void> {
    try {
      const { stockHistory } = await getCollections();
      await stockHistory.insertOne(historyData);
    } catch (error) {
      console.error('Error creating stock history:', error);
    }
  }

  /**
   * Get stock history for a product
   */
  static async getStockHistory(productId: string, limit: number = 50): Promise<StockHistory[]> {
    try {
      const { stockHistory } = await getCollections();
      const results = await stockHistory
        .find({ productId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
      
      return results as unknown as StockHistory[];
    } catch (error) {
      console.error('Error getting stock history:', error);
      return [];
    }
  }

  /**
   * Get all stock history with pagination
   */
  static async getAllStockHistory(page: number = 1, limit: number = 50): Promise<{
    history: StockHistory[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const { stockHistory } = await getCollections();
      const skip = (page - 1) * limit;
      
      const [historyResults, total] = await Promise.all([
        stockHistory
          .find({})
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        stockHistory.countDocuments({})
      ]);

      const history = historyResults as unknown as StockHistory[];

      return {
        history,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error getting all stock history:', error);
      return { history: [], total: 0, page: 1, totalPages: 0 };
    }
  }

  /**
   * Validate stock availability for order items
   */
  static async validateStockAvailability(items: Array<{ id: string; quantity: number }>): Promise<{
    valid: boolean;
    unavailableItems: Array<{ id: string; name: string; requested: number; available: number }>;
  }> {
    try {
      const { products } = await getCollections();
      const unavailableItems: Array<{ id: string; name: string; requested: number; available: number }> = [];

      for (const item of items) {
        const product = await products.findOne({ _id: new ObjectId(item.id) });
        
        if (!product || !product.inStock || product.stock < item.quantity) {
          unavailableItems.push({
            id: item.id,
            name: product?.name || 'Unknown Product',
            requested: item.quantity,
            available: product?.stock || 0
          });
        }
      }

      return {
        valid: unavailableItems.length === 0,
        unavailableItems
      };
    } catch (error) {
      console.error('Error validating stock availability:', error);
      return { valid: false, unavailableItems: [] };
    }
  }

  /**
   * Process stock updates for confirmed order
   */
  static async processOrderStockUpdate(orderId: string, items: Array<{ id: string; quantity: number }>): Promise<void> {
    try {
      for (const item of items) {
        await this.updateStock(
          item.id,
          -item.quantity, // Negative for purchase (decrease stock)
          'purchase',
          `Order ${orderId} - Purchase`,
          orderId
        );
      }
    } catch (error) {
      console.error('Error processing order stock update:', error);
    }
  }

  /**
   * Manual stock adjustment
   */
  static async adjustStock(
    productId: string,
    newStock: number,
    reason: string,
    adminId: string
  ): Promise<{ success: boolean; newStock?: number; error?: string }> {
    try {
      const { products } = await getCollections();
      const objectId = new ObjectId(productId);

      const product = await products.findOne({ _id: objectId });
      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      const currentStock = product.stock || 0;
      const quantityChange = newStock - currentStock;
      
      const result = await this.updateStock(
        productId,
        quantityChange,
        'adjustment',
        reason,
        undefined,
        adminId
      );
      return result;
    } catch (error) {
      console.error('Error adjusting stock:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

