import { getCollections } from './database';

export interface SecurityCheck {
  isBlocked: boolean;
  reason?: string;
  riskScore: number; // 0-100, higher = more risky
}

export interface OrderSecurityData {
  ipAddress: string;
  userAgent: string;
  referer: string;
  customerName: string;
  customerPhone: string;
  orderTotal: number;
  timestamp: string;
}

/**
 * Check if an IP address should be blocked based on various security criteria
 */
export async function checkOrderSecurity(securityData: OrderSecurityData): Promise<SecurityCheck> {
  const { orders } = await getCollections();
  let riskScore = 0;
  const reasons: string[] = [];

  try {
    // Check for multiple orders from same IP in short time
    const recentOrders = await orders.find({
      ipAddress: securityData.ipAddress,
      createdAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Last 24 hours
      }
    }).toArray();

    if (recentOrders.length >= 5) {
      riskScore += 40;
      reasons.push('Multiple orders from same IP in 24h');
    } else if (recentOrders.length >= 3) {
      riskScore += 20;
      reasons.push('Several orders from same IP in 24h');
    }

    // Check for suspicious user agents
    const suspiciousUserAgents = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'java'
    ];
    
    const userAgentLower = securityData.userAgent.toLowerCase();
    if (suspiciousUserAgents.some(agent => userAgentLower.includes(agent))) {
      riskScore += 30;
      reasons.push('Suspicious user agent');
    }

    // Check for missing or generic user agent
    if (!securityData.userAgent || securityData.userAgent === 'unknown') {
      riskScore += 15;
      reasons.push('Missing user agent');
    }

    // Check for orders with same phone number from different IPs
    const phoneOrders = await orders.find({
      customerPhone: securityData.customerPhone,
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
      }
    }).toArray();

    const uniqueIps = new Set(phoneOrders.map(order => order.ipAddress));
    if (uniqueIps.size > 3) {
      riskScore += 25;
      reasons.push('Same phone used from multiple IPs');
    }

    // Check for very high order amounts (potential fraud)
    if (securityData.orderTotal > 1000) {
      riskScore += 10;
      reasons.push('High order amount');
    }

    // Check for orders with no referer (direct access)
    if (!securityData.referer || securityData.referer === 'unknown') {
      riskScore += 5;
      reasons.push('No referer information');
    }

    // Determine if should be blocked
    const isBlocked = riskScore >= 50; // Block if risk score is 50 or higher

    return {
      isBlocked,
      reason: reasons.length > 0 ? reasons.join(', ') : undefined,
      riskScore
    };

  } catch (error) {
    console.error('Error checking order security:', error);
    // If there's an error, allow the order but log it
    return {
      isBlocked: false,
      reason: 'Security check failed',
      riskScore: 10
    };
  }
}

/**
 * Get all blocked IP addresses
 */
export async function getBlockedIPs(): Promise<string[]> {
  const { orders } = await getCollections();
  
  try {
    // Get IPs with high risk scores (you could store this in a separate collection)
    const suspiciousOrders = await orders.find({
      riskScore: { $gte: 50 }
    }).toArray();

    return [...new Set(suspiciousOrders.map(order => order.ipAddress))];
  } catch (error) {
    console.error('Error getting blocked IPs:', error);
    return [];
  }
}

/**
 * Manually block an IP address
 */
export async function blockIP(ipAddress: string, reason: string): Promise<boolean> {
  // In a real implementation, you might want to store blocked IPs in a separate collection
  // For now, we'll just log it
  console.log(`IP ${ipAddress} blocked manually. Reason: ${reason}`);
  return true;
}

/**
 * Get order statistics for an IP address
 */
export async function getIPStats(ipAddress: string): Promise<{
  totalOrders: number;
  totalSpent: number;
  firstOrder: string | null;
  lastOrder: string | null;
  uniqueCustomers: number;
}> {
  const { orders } = await getCollections();
  
  try {
    const ipOrders = await orders.find({ ipAddress }).toArray();
    
    const totalOrders = ipOrders.length;
    const totalSpent = ipOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const firstOrder = ipOrders.length > 0 ? ipOrders[ipOrders.length - 1].createdAt : null;
    const lastOrder = ipOrders.length > 0 ? ipOrders[0].createdAt : null;
    const uniqueCustomers = new Set(ipOrders.map(order => order.customerPhone)).size;

    return {
      totalOrders,
      totalSpent,
      firstOrder,
      lastOrder,
      uniqueCustomers
    };
  } catch (error) {
    console.error('Error getting IP stats:', error);
    return {
      totalOrders: 0,
      totalSpent: 0,
      firstOrder: null,
      lastOrder: null,
      uniqueCustomers: 0
    };
  }
}
