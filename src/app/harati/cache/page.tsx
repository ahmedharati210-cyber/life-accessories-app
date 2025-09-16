'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Trash2, RefreshCw, Database, Clock, HardDrive, Zap } from 'lucide-react';

interface CacheStats {
  total: number;
  valid: number;
  expired: number;
  keys: string[];
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  uptime: number;
}

export default function CacheManagementPage() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [warming, setWarming] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/cache');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching cache stats:', error);
    }
  };

  const clearCache = async (type: string = 'all') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/cache?type=${type}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        // Refresh stats after clearing
        await fetchStats();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const warmCache = async (type: string = 'all') => {
    setWarming(true);
    try {
      const response = await fetch(`/api/cache/warm?type=${type}`, {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        // Refresh stats after warming
        await fetchStats();
      }
    } catch (error) {
      console.error('Error warming cache:', error);
    } finally {
      setWarming(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cache Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage the application cache for optimal performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold">{stats?.total || 0}</p>
            </div>
            <Database className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valid Entries</p>
              <p className="text-2xl font-bold text-green-600">{stats?.valid || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expired Entries</p>
              <p className="text-2xl font-bold text-red-600">{stats?.expired || 0}</p>
            </div>
            <HardDrive className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
              <p className="text-2xl font-bold">{formatBytes(stats?.memoryUsage.heapUsed || 0)}</p>
            </div>
            <HardDrive className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cache Actions</h3>
          <div className="space-y-3">
            <Button
              onClick={() => warmCache('all')}
              disabled={warming}
              className="w-full justify-start"
              variant="default"
            >
              <Zap className="h-4 w-4 mr-2" />
              {warming ? 'Warming Cache...' : 'Warm All Cache'}
            </Button>
            
            <Button
              onClick={() => warmCache('products')}
              disabled={warming}
              className="w-full justify-start"
              variant="outline"
            >
              <Zap className="h-4 w-4 mr-2" />
              Warm Products Cache
            </Button>
            
            <Button
              onClick={() => warmCache('categories')}
              disabled={warming}
              className="w-full justify-start"
              variant="outline"
            >
              <Zap className="h-4 w-4 mr-2" />
              Warm Categories Cache
            </Button>
            
            <hr className="my-4" />
            
            <Button
              onClick={() => clearCache('products')}
              disabled={loading}
              className="w-full justify-start"
              variant="outline"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Products Cache
            </Button>
            
            <Button
              onClick={() => clearCache('categories')}
              disabled={loading}
              className="w-full justify-start"
              variant="outline"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Categories Cache
            </Button>
            
            <Button
              onClick={() => clearCache('all')}
              disabled={loading}
              className="w-full justify-start"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Cache
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Server Uptime:</span>
              <span className="text-sm font-medium">{formatUptime(stats?.uptime || 0)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">RSS Memory:</span>
              <span className="text-sm font-medium">{formatBytes(stats?.memoryUsage.rss || 0)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Heap Total:</span>
              <span className="text-sm font-medium">{formatBytes(stats?.memoryUsage.heapTotal || 0)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">External Memory:</span>
              <span className="text-sm font-medium">{formatBytes(stats?.memoryUsage.external || 0)}</span>
            </div>
          </div>
        </Card>
      </div>

      {stats?.keys && stats.keys.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Cache Keys</h3>
            <Button
              onClick={refreshStats}
              disabled={refreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {stats.keys.map((key, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {key}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
