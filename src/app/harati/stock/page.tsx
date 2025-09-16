'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  History,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { StockAlert, StockHistory } from '@/lib/services/stockService';
import { AdminProduct } from '@/types';

export default function StockPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustingStock, setAdjustingStock] = useState<string | null>(null);
  const [adjustForm, setAdjustForm] = useState({
    productId: '',
    newStock: 0,
    reason: ''
  });

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: Package },
    { id: 'alerts', name: 'تنبيهات المخزون', icon: AlertTriangle },
    { id: 'history', name: 'تاريخ المخزون', icon: History },
    { id: 'adjust', name: 'تعديل المخزون', icon: Settings },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch alerts
      const alertsResponse = await fetch('/api/admin/stock?type=alerts');
      const alertsData = await alertsResponse.json();
      if (alertsData.success) {
        setAlerts(alertsData.alerts);
      }

      // Fetch history
      const historyResponse = await fetch('/api/admin/stock?type=history&limit=20');
      const historyData = await historyResponse.json();
      if (historyData.success) {
        setHistory(historyData.history);
      }

      // Fetch products
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      if (productsData.success && productsData.data) {
        // Ensure all products have stock field
        const productsWithStock = productsData.data.map((product: AdminProduct) => ({
          ...product,
          stock: product.stock || 0,
          inStock: product.inStock !== undefined ? product.inStock : (product.stock || 0) > 0
        }));
        setProducts(productsWithStock);
      } else {
        console.error('Failed to fetch products:', productsData);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustForm.productId || adjustForm.reason.trim() === '') return;

    setAdjustingStock(adjustForm.productId);
    try {
      const response = await fetch('/api/admin/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: adjustForm.productId,
          newStock: adjustForm.newStock,
          reason: adjustForm.reason,
          adminId: 'admin' // In real app, get from auth context
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`تم تحديث المخزون بنجاح. المخزون الجديد: ${result.newStock}`);
        setAdjustForm({ productId: '', newStock: 0, reason: '' });
        fetchData(); // Refresh data
      } else {
        alert(`خطأ: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('حدث خطأ أثناء تحديث المخزون');
    } finally {
      setAdjustingStock(null);
    }
  };

  const getChangeTypeText = (type: string) => {
    const types = {
      purchase: 'شراء',
      restock: 'إعادة تخزين',
      adjustment: 'تعديل',
      return: 'إرجاع',
      damage: 'تلف'
    };
    return types[type as keyof typeof types] || type;
  };

  const getChangeTypeColor = (type: string) => {
    const colors = {
      purchase: 'text-red-600',
      restock: 'text-green-600',
      adjustment: 'text-blue-600',
      return: 'text-purple-600',
      damage: 'text-orange-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-gray-900">{products?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">متوفر</p>
              <p className="text-2xl font-bold text-gray-900">
                {products?.filter(p => p.inStock).length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">نفد المخزون</p>
              <p className="text-2xl font-bold text-gray-900">
                {products?.filter(p => !p.inStock).length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">تنبيهات المخزون</p>
              <p className="text-2xl font-bold text-gray-900">{alerts?.length || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Products */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">منتجات قليلة المخزون</h3>
          <Button onClick={fetchData} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {products
            ?.filter(p => p.inStock && p.stock <= 5)
            .slice(0, 10)
            .map(product => (
              <div key={product._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">المخزون: {product.stock} قطعة</p>
                </div>
                <span className="text-yellow-600 font-medium">قليل المخزون</span>
              </div>
            )) || (
              <div className="text-center py-4 text-gray-500">
                لا توجد منتجات قليلة المخزون
              </div>
            )}
        </div>
      </Card>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">تنبيهات المخزون</h3>
        <Button onClick={fetchData} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {alerts?.length === 0 ? (
        <Card className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">لا توجد تنبيهات مخزون حالياً</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts?.map((alert, index) => (
            <Card key={index} className={`p-4 ${alert.alertType === 'out_of_stock' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{alert.productName}</p>
                  <p className="text-sm text-gray-600">
                    المخزون الحالي: {alert.currentStock} قطعة
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    alert.alertType === 'out_of_stock' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.alertType === 'out_of_stock' ? 'نفد المخزون' : 'قليل المخزون'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">تاريخ المخزون</h3>
        <Button onClick={fetchData} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {history?.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            لا يوجد تاريخ مخزون متاح
          </div>
        ) : (
          history?.map((record, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{record.productName}</p>
                  <p className="text-sm text-gray-600">
                    {record.previousStock} → {record.newStock} قطعة
                  </p>
                  {record.reason && (
                    <p className="text-sm text-gray-500">السبب: {record.reason}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${getChangeTypeColor(record.changeType)}`}>
                    {getChangeTypeText(record.changeType)}
                  </span>
                  <p className="text-xs text-gray-500">
                    {new Date(record.timestamp).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderAdjust = () => (
    <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">تعديل المخزون</h3>
            <Button onClick={fetchData} size="sm" variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        
        <form onSubmit={handleStockAdjustment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر المنتج
            </label>
            <select
              value={adjustForm.productId}
              onChange={(e) => {
                const product = products?.find(p => p._id === e.target.value);
                setAdjustForm({
                  ...adjustForm,
                  productId: e.target.value,
                  newStock: product?.stock || 0
                });
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            >
              <option value="">
                {loading ? 'جاري التحميل...' : products?.length === 0 ? 'لا توجد منتجات' : 'اختر منتج'}
              </option>
              {products?.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} (المخزون الحالي: {product.stock || 0})
                </option>
              ))}
            </select>
            {products?.length === 0 && !loading && (
              <p className="text-sm text-red-600 mt-1">
                لا توجد منتجات متاحة.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الكمية الجديدة
            </label>
            <Input
              type="number"
              min="0"
              value={adjustForm.newStock}
              onChange={(e) => setAdjustForm({ ...adjustForm, newStock: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سبب التعديل
            </label>
            <Input
              value={adjustForm.reason}
              onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
              placeholder="مثال: إعادة تخزين، تعديل يدوي، إلخ"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={adjustingStock === adjustForm.productId}
            className="w-full"
          >
            {adjustingStock === adjustForm.productId ? 'جاري التحديث...' : 'تحديث المخزون'}
          </Button>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المخزون</h1>
          <p className="text-gray-600">تتبع وإدارة مخزون المنتجات</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'adjust' && renderAdjust()}
      </div>
    </div>
  );
}
