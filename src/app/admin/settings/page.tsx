'use client';

import { useState } from 'react';
import { 
  Save, 
  Upload, 
  Eye, 
  EyeOff,
  Globe,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'store', name: 'Store Info', icon: MapPin },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  const [settings, setSettings] = useState({
    general: {
      siteName: 'Life Accessories',
      siteDescription: 'Premium lifestyle accessories for the modern individual',
      siteUrl: 'https://lifeaccessories.com',
      adminEmail: 'lifeaccessoriesly@gmail.com',
      timezone: 'UTC-5',
      currency: 'USD',
      language: 'en',
    },
    store: {
      storeName: 'Life Accessories Store',
      address: 'طرابلس، ليبيا',
      city: 'طرابلس',
      state: 'طرابلس',
      zipCode: '00000',
      country: 'ليبيا',
      phone: '+218 91 990 0049',
      email: 'lifeaccessoriesly@gmail.com',
    },
    payment: {
      stripePublicKey: 'pk_test_...',
      stripeSecretKey: 'sk_test_...',
      paypalClientId: 'client_id_...',
      paypalSecret: 'secret_...',
      currency: 'USD',
      taxRate: 8.5,
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      lowStockAlerts: true,
      newCustomerAlerts: true,
      marketingEmails: false,
    },
    appearance: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      logo: '/images/logo.svg',
      favicon: '/favicon.ico',
      theme: 'light',
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      loginAttempts: 5,
      apiKey: 'sk_live_...',
    },
  });

  const handleInputChange = (section: string, field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // In real app, this would save to database
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site Name
          </label>
          <Input
            value={settings.general.siteName}
            onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site URL
          </label>
          <Input
            value={settings.general.siteUrl}
            onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Site Description
        </label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admin Email
          </label>
          <Input
            type="email"
            value={settings.general.adminEmail}
            onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="UTC-5">UTC-5 (EST)</option>
            <option value="UTC-8">UTC-8 (PST)</option>
            <option value="UTC+0">UTC+0 (GMT)</option>
            <option value="UTC+1">UTC+1 (CET)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStoreSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Name
          </label>
          <Input
            value={settings.store.storeName}
            onChange={(e) => handleInputChange('store', 'storeName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <Input
            value={settings.store.phone}
            onChange={(e) => handleInputChange('store', 'phone', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <Input
          value={settings.store.address}
          onChange={(e) => handleInputChange('store', 'address', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <Input
            value={settings.store.city}
            onChange={(e) => handleInputChange('store', 'city', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <Input
            value={settings.store.state}
            onChange={(e) => handleInputChange('store', 'state', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code
          </label>
          <Input
            value={settings.store.zipCode}
            onChange={(e) => handleInputChange('store', 'zipCode', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            value={settings.store.country}
            onChange={(e) => handleInputChange('store', 'country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            value={settings.store.email}
            onChange={(e) => handleInputChange('store', 'email', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <Shield className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Security Notice
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              Never share your API keys. These are sensitive credentials that should be kept secure.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Stripe Configuration</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Public Key
            </label>
            <Input
              value={settings.payment.stripePublicKey}
              onChange={(e) => handleInputChange('payment', 'stripePublicKey', e.target.value)}
              placeholder="pk_test_..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Key
            </label>
            <div className="relative">
              <Input
                type={showApiKey ? 'text' : 'password'}
                value={settings.payment.stripeSecretKey}
                onChange={(e) => handleInputChange('payment', 'stripeSecretKey', e.target.value)}
                placeholder="sk_test_..."
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">PayPal Configuration</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client ID
            </label>
            <Input
              value={settings.payment.paypalClientId}
              onChange={(e) => handleInputChange('payment', 'paypalClientId', e.target.value)}
              placeholder="client_id_..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret
            </label>
            <Input
              type="password"
              value={settings.payment.paypalSecret}
              onChange={(e) => handleInputChange('payment', 'paypalSecret', e.target.value)}
              placeholder="secret_..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax Rate (%)
          </label>
          <Input
            type="number"
            step="0.1"
            value={settings.payment.taxRate}
            onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={settings.payment.currency}
            onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
        <div className="space-y-3">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded"
            />
            <Input
              value={settings.appearance.primaryColor}
              onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Secondary Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={settings.appearance.secondaryColor}
              onChange={(e) => handleInputChange('appearance', 'secondaryColor', e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded"
            />
            <Input
              value={settings.appearance.secondaryColor}
              onChange={(e) => handleInputChange('appearance', 'secondaryColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Theme
          </label>
          <select
            value={settings.appearance.theme}
            onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo Upload
          </label>
          <Button variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Logo
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Authentication</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Timeout (minutes)
          </label>
          <Input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Min Length
          </label>
          <Input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          API Key
        </label>
        <div className="relative">
          <Input
            type={showApiKey ? 'text' : 'password'}
            value={settings.security.apiKey}
            onChange={(e) => handleInputChange('security', 'apiKey', e.target.value)}
            placeholder="sk_live_..."
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'store':
        return renderStoreSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'notifications':
        return renderNotificationsSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your store configuration and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name} Settings
              </h2>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
            {renderTabContent()}
          </Card>
        </div>
      </div>
    </div>
  );
}
