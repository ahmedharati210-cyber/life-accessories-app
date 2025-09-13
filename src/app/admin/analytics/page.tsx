'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface DatabaseOrder {
  _id?: string;
  id?: string;
  total?: number;
  amount?: number;
  customerEmail?: string;
  customerName?: string;
  customer?: string;
  status?: string;
  createdAt?: string;
}

interface DatabaseProduct {
  _id?: string;
  id?: string;
  name: string;
}

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    conversionRate: number;
    revenueChange: number;
    ordersChange: number;
    customersChange: number;
    conversionChange: number;
  };
  salesData: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
    growth: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: string;
    time: string;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // Fetch real data from APIs
        const [productsResponse, ordersResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);
        
        const productsData = await productsResponse.json();
        const ordersData = await ordersResponse.json();
        
        const products = productsData.success ? productsData.data : [];
        const orders = ordersData.success ? ordersData.data : [];
        
        // Calculate analytics from real data
        const totalRevenue = orders.reduce((sum: number, order: DatabaseOrder) => sum + (order.total || 0), 0);
        const totalOrders = orders.length;
        const totalCustomers = new Set(orders.map((order: DatabaseOrder) => order.customerEmail)).size;
        
        // Create analytics data from real database data
        
        const analyticsData: AnalyticsData = {
          overview: {
            totalRevenue,
            totalOrders,
            totalCustomers,
            conversionRate: totalOrders > 0 ? (totalOrders / Math.max(totalCustomers, 1)) * 100 : 0,
            revenueChange: 0, // No historical data available yet
            ordersChange: 0, // No historical data available yet
            customersChange: 0, // No historical data available yet
            conversionChange: 0, // No historical data available yet
          },
          salesData: totalOrders > 0 ? [
            // Show current month data only
            { 
              month: new Date().toLocaleDateString('en-US', { month: 'short' }), 
              revenue: totalRevenue, 
              orders: totalOrders 
            }
          ] : [],
          topProducts: products.slice(0, 5).map((product: DatabaseProduct) => ({
            name: product.name,
            sales: 0, // No sales data available yet
            revenue: 0, // No sales data available yet
            growth: 0, // No growth data available yet
          })),
          recentOrders: orders.slice(0, 5).map((order: DatabaseOrder) => ({
            id: order.id || order._id || 'N/A',
            customer: order.customerName || order.customer || 'Unknown',
            amount: order.total || order.amount || 0,
            status: order.status || 'pending',
            time: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A',
          })),
          trafficSources: [], // No traffic data available yet
        };
        
        setAnalyticsData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? TrendingUp : TrendingDown;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل التحليلات...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your store&apos;s performance and insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(analyticsData.overview.totalRevenue)}
                  </div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor(analyticsData.overview.revenueChange)}`}>
                    {(() => {
                      const Icon = getChangeIcon(analyticsData.overview.revenueChange);
                      return <Icon className="h-4 w-4 flex-shrink-0 self-center" />;
                    })()}
                    <span className="sr-only">
                      {analyticsData.overview.revenueChange >= 0 ? 'Increased' : 'Decreased'} by
                    </span>
                    {formatPercentage(analyticsData.overview.revenueChange)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Orders
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {analyticsData.overview.totalOrders}
                  </div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor(analyticsData.overview.ordersChange)}`}>
                    {(() => {
                      const Icon = getChangeIcon(analyticsData.overview.ordersChange);
                      return <Icon className="h-4 w-4 flex-shrink-0 self-center" />;
                    })()}
                    <span className="sr-only">
                      {analyticsData.overview.ordersChange >= 0 ? 'Increased' : 'Decreased'} by
                    </span>
                    {formatPercentage(analyticsData.overview.ordersChange)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Customers
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {analyticsData.overview.totalCustomers}
                  </div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor(analyticsData.overview.customersChange)}`}>
                    {(() => {
                      const Icon = getChangeIcon(analyticsData.overview.customersChange);
                      return <Icon className="h-4 w-4 flex-shrink-0 self-center" />;
                    })()}
                    <span className="sr-only">
                      {analyticsData.overview.customersChange >= 0 ? 'Increased' : 'Decreased'} by
                    </span>
                    {formatPercentage(analyticsData.overview.customersChange)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Conversion Rate
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {analyticsData.overview.conversionRate}%
                  </div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor(analyticsData.overview.conversionChange)}`}>
                    {(() => {
                      const Icon = getChangeIcon(analyticsData.overview.conversionChange);
                      return <Icon className="h-4 w-4 flex-shrink-0 self-center" />;
                    })()}
                    <span className="sr-only">
                      {analyticsData.overview.conversionChange >= 0 ? 'Increased' : 'Decreased'} by
                    </span>
                    {formatPercentage(analyticsData.overview.conversionChange)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and detailed analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
            <div className="flex space-x-2">
              <Button
                variant={selectedMetric === 'revenue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('revenue')}
              >
                Revenue
              </Button>
              <Button
                variant={selectedMetric === 'orders' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('orders')}
              >
                Orders
              </Button>
            </div>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {analyticsData.salesData.length > 0 ? (
              analyticsData.salesData.map((data) => {
                const maxValue = Math.max(...analyticsData.salesData.map(d => selectedMetric === 'revenue' ? d.revenue : d.orders));
                const currentValue = selectedMetric === 'revenue' ? data.revenue : data.orders;
                const height = maxValue > 0 ? (currentValue / maxValue) * 200 : 0;
                
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{
                        height: `${height}px`,
                      }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <p className="text-gray-500">No sales data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
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
                    {formatCurrency(product.revenue)}
                  </p>
                  <p className={`text-xs ${getChangeColor(product.growth)}`}>
                    {formatPercentage(product.growth)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Additional analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {analyticsData.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.customer}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.amount)}
                  </p>
                  <Badge className={`text-xs ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {analyticsData.trafficSources.length > 0 ? (
              analyticsData.trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {source.source}
                    </span>
                    <span className="text-sm text-gray-500">
                      {source.visitors} visitors
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {source.percentage}% of total traffic
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No traffic data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Order Value</span>
              <span className="text-sm font-medium text-gray-900">
                {analyticsData.overview.totalOrders > 0 
                  ? formatCurrency(analyticsData.overview.totalRevenue / analyticsData.overview.totalOrders)
                  : '$0.00'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Returning Customers</span>
              <span className="text-sm font-medium text-gray-900">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cart Abandonment</span>
              <span className="text-sm font-medium text-gray-900">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mobile Traffic</span>
              <span className="text-sm font-medium text-gray-900">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Page Load Time</span>
              <span className="text-sm font-medium text-gray-900">0.0s</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
