'use client';

import { Card } from '@/components/ui/Card';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  TrendingUp,
  TrendingDown,
  Eye
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: string;
}

interface DatabaseOrder {
  _id?: string;
  id?: string;
  customerName?: string;
  customer?: string;
  total?: number;
  amount?: number;
  status?: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { name: 'Total Products', value: '0', change: '0%', changeType: 'positive' as const, icon: Package },
    { name: 'Total Orders', value: '0', change: '0%', changeType: 'positive' as const, icon: ShoppingCart },
    { name: 'Revenue', value: '$0', change: '0%', changeType: 'positive' as const, icon: DollarSign },
    { name: 'Customers', value: '0', change: '0%', changeType: 'positive' as const, icon: Users },
  ]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        const products = productsData.success ? productsData.data : [];
        
        // Fetch orders
        const ordersResponse = await fetch('/api/orders');
        const ordersData = await ordersResponse.json();
        const orders = ordersData.success ? ordersData.data : [];
        
        // Calculate stats
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: { total?: number }) => sum + (order.total || 0), 0);
        const totalCustomers = new Set(orders.map((order: { customerEmail?: string }) => order.customerEmail)).size;
        
        // Update stats
        setStats([
          { name: 'Total Products', value: totalProducts.toString(), change: '0%', changeType: 'positive' as const, icon: Package },
          { name: 'Total Orders', value: totalOrders.toString(), change: '0%', changeType: 'positive' as const, icon: ShoppingCart },
          { name: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, change: '0%', changeType: 'positive' as const, icon: DollarSign },
          { name: 'Customers', value: totalCustomers.toString(), change: '0%', changeType: 'positive' as const, icon: Users },
        ]);
        
        // Set recent orders (last 4) - transform to match Order interface
        setRecentOrders(orders.slice(0, 4).map((order: DatabaseOrder) => ({
          id: order.id || order._id?.toString() || 'N/A',
          customer: order.customerName || order.customer || 'Unknown Customer',
          amount: `$${order.total || order.amount || 0}`,
          status: order.status || 'pending',
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'
        })));
        
        // Set top products with real data (no sales data available yet)
        setTopProducts(products.slice(0, 4).map((product: { name: string }) => ({
          name: product.name,
          sales: 0, // No sales data available yet
          revenue: '$0' // No sales data available yet
        })));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                      ) : (
                        <TrendingDown className="h-4 w-4 flex-shrink-0 self-center" />
                      )}
                      <span className="sr-only">
                        {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                      </span>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts and tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <button className="text-sm text-blue-600 hover:text-blue-500">
              View all
            </button>
          </div>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <li key={order.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-500">
                        Order #{order.id} • {order.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {order.amount}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
            <button className="text-sm text-blue-600 hover:text-blue-500">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {product.revenue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-sm font-medium text-gray-900">Add Product</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingCart className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-sm font-medium text-gray-900">View Orders</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-sm font-medium text-gray-900">View Store</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-sm font-medium text-gray-900">Analytics</span>
          </button>
        </div>
      </Card>
    </>
  );
}
