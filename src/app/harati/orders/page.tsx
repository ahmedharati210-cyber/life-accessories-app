'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface DatabaseOrder {
  _id?: string;
  id?: string;
  orderNumber?: string;
  customerName?: string;
  customer?: string;
  customerEmail?: string;
  customerPhone?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total?: number;
  amount?: number;
  status?: string;
  createdAt?: string;
  shippingAddress?: {
    street: string;
    city: string;
    area?: string;
    postalCode: string;
  };
  // Security data
  ipAddress?: string;
  userAgent?: string;
  riskScore?: number;
  securityReason?: string;
}

interface Order {
  _id?: string;
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    area?: string;
    postalCode: string;
  };
  // Security data
  ipAddress?: string;
  userAgent?: string;
  riskScore?: number;
  securityReason?: string;
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck },
  completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'confirmation' | 'status_update' | 'admin_alert'>('confirmation');
  const [newStatus, setNewStatus] = useState<string>('');
  const [trackingInfo, setTrackingInfo] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        const data = await response.json();
        
        if (data.success) {
          // Transform database orders to match Order interface
          const transformedOrders = data.data.map((order: DatabaseOrder) => {
            
            return {
              id: order.id || order._id?.toString() || `order-${Date.now()}-${Math.random()}`,
              orderNumber: order.orderNumber || order.id || order._id?.toString() || `ORD-${Date.now()}`,
              customer: {
                name: order.customerName || order.customer || 'Unknown Customer',
                email: order.customerEmail || 'unknown@example.com',
                phone: order.customerPhone || '+1 (555) 000-0000'
              },
              items: order.items || [{
                name: 'Sample Item',
                quantity: 1,
                price: order.total || order.amount || 0,
                image: '/images/products/placeholder.svg'
              }],
              total: order.total || order.amount || 0,
              status: order.status || 'pending',
              createdAt: order.createdAt || new Date().toISOString(),
              shippingAddress: order.shippingAddress || {
                street: '123 Main St',
                city: 'Unknown City',
                area: 'Unknown Area',
                postalCode: '00000'
              },
              // Security data
              ipAddress: order.ipAddress,
              userAgent: order.userAgent,
              riskScore: order.riskScore,
              securityReason: order.securityReason
            };
          });
          
          setOrders(transformedOrders);
        } else {
          console.error('Failed to fetch orders:', data.error);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sendNotification = async () => {
    if (!selectedOrder) return;

    setIsSendingNotification(true);
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          type: notificationType,
          status: newStatus || selectedOrder.status,
          trackingInfo: trackingInfo,
          estimatedDelivery: estimatedDelivery,
          notes: notes
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Notification sent successfully!');
        // Clear form fields
        setTrackingInfo('');
        setEstimatedDelivery('');
        setNotes('');
        setNewStatus('');
      } else {
        alert('Failed to send notification: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification');
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          trackingInfo: trackingInfo,
          estimatedDelivery: estimatedDelivery,
          notes: notes
        }),
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' } : order
        ));
        // Clear form fields
        setTrackingInfo('');
        setEstimatedDelivery('');
        setNotes('');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          trackingInfo: trackingInfo,
          estimatedDelivery: estimatedDelivery,
          notes: notes
        }),
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' } : order
        ));
        // Clear form fields
        setTrackingInfo('');
        setEstimatedDelivery('');
        setNotes('');
        alert('Order status updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to update order status: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? config.icon : Clock;
  };

  const getStatusColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    return config ? config.color : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage customer orders and track fulfillment
            </p>
          </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders, customers, or order numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
                </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
                </Button>
          </div>
        </div>
            </Card>

      {/* Orders table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {order.id}
                        </div>
                </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="relative h-8 w-8">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {order.status}
                        </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-mono text-xs">
                        {order.ipAddress || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={order.riskScore && order.riskScore >= 50 ? 'destructive' : 
                                order.riskScore && order.riskScore >= 30 ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {order.riskScore || 0}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            try {
                              setSelectedOrder(order);
                            } catch (error) {
                              console.error('Error opening order details:', error);
                              alert('Error opening order details. Please try again.');
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty state */}
      {filteredOrders.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters.'
              : 'Orders will appear here when customers make purchases.'
            }
          </p>
        </Card>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setSelectedOrder(null)} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Details - {selectedOrder.orderNumber}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                        {/* Customer Info */}
                        <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.area}</p>
                    <p>{selectedOrder.shippingAddress.postalCode}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Purchased Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <Image
                              src={item.image || '/images/products/placeholder.svg'}
                              alt={item.name}
                              fill
                              className="object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/products/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm text-gray-500">Unit Price: ${item.price.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No items found for this order</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                        {/* Notification Controls */}
                        <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Notifications
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Notification Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Type
                      </label>
                      <select
                        value={notificationType}
                        onChange={(e) => setNotificationType(e.target.value as 'confirmation' | 'status_update' | 'admin_alert')}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="confirmation">Order Confirmation</option>
                        <option value="status_update">Status Update</option>
                        <option value="admin_alert">Admin Alert</option>
                      </select>
                    </div>

                    {/* Status Selection for Status Updates */}
                    {notificationType === 'status_update' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Status
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    )}

                    {/* Tracking Info */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tracking Information (Optional)
                      </label>
                      <input
                        type="text"
                        value={trackingInfo}
                        onChange={(e) => setTrackingInfo(e.target.value)}
                        placeholder="Enter tracking number or info"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Estimated Delivery */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Delivery (Optional)
                      </label>
                      <input
                        type="text"
                        value={estimatedDelivery}
                        onChange={(e) => setEstimatedDelivery(e.target.value)}
                        placeholder="e.g., 2-3 business days"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter any additional notes for the customer"
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Send Button */}
                    <div className="flex gap-2">
                      <Button
                        onClick={sendNotification}
                        disabled={isSendingNotification}
                        className="flex-1"
                      >
                        {isSendingNotification ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Notification
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => {
                          if (newStatus && selectedOrder) {
                            handleStatusChange(selectedOrder.id, newStatus);
                          }
                        }}
                        disabled={!newStatus || isSendingNotification}
                        variant="outline"
                      >
                        Update Status
                      </Button>
                    </div>

                    {/* Notification Info */}
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Email:</strong> {selectedOrder.customer.email ? 'Will be sent' : 'No email provided'} | 
                        <strong> SMS:</strong> <span className="text-gray-500">Disabled</span>
                      </p>
                    </div>
                  </div>
                </div>
                      </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}