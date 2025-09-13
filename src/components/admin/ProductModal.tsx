'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Star, Edit } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from './ImageUpload';
import { AdminProduct, ProductVariant, ProductOption, CustomerReview } from '@/types';

interface ProductModalProps {
  product?: AdminProduct | null;
  onClose: () => void;
  onSave: (product: AdminProduct) => void;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState<AdminProduct>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    featured: false,
    inStock: true,
    stock: 0,
    images: [],
    tags: [],
    hasVariants: false,
    variants: [],
    options: [],
    customerReviews: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'reviews'>('basic');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleInputChange = (field: keyof AdminProduct, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Option management functions
  const addSizeOption = () => {
    const newOption: ProductOption = {
      id: `size-${Date.now()}`,
      name: 'Size',
      nameEn: 'Size',
      values: [
        { id: 'size-6', name: '6', nameEn: '6' },
        { id: 'size-6.5', name: '6.5', nameEn: '6.5' },
        { id: 'size-7', name: '7', nameEn: '7' },
        { id: 'size-7.5', name: '7.5', nameEn: '7.5' },
        { id: 'size-8', name: '8', nameEn: '8' },
        { id: 'size-8.5', name: '8.5', nameEn: '8.5' },
        { id: 'size-9', name: '9', nameEn: '9' },
        { id: 'size-9.5', name: '9.5', nameEn: '9.5' },
        { id: 'size-10', name: '10', nameEn: '10' },
      ]
    };
    setFormData(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption]
    }));
  };

  const addColorOption = () => {
    const newOption: ProductOption = {
      id: `color-${Date.now()}`,
      name: 'Color',
      nameEn: 'Color',
      values: [
        { id: 'color-gold', name: 'Gold', nameEn: 'Gold' },
        { id: 'color-silver', name: 'Silver', nameEn: 'Silver' },
        { id: 'color-rose-gold', name: 'Rose Gold', nameEn: 'Rose Gold' },
        { id: 'color-platinum', name: 'Platinum', nameEn: 'Platinum' },
      ]
    };
    setFormData(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption]
    }));
  };

  const removeOption = (optionId: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.filter(o => o.id !== optionId) || []
    }));
  };

  // Update option name
  const updateOptionName = (optionId: string, field: 'name' | 'nameEn', value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.map(option => 
        option.id === optionId 
          ? { ...option, [field]: value }
          : option
      ) || []
    }));
  };

  // Add new value to option
  const addOptionValue = (optionId: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.map(option => 
        option.id === optionId 
          ? { 
              ...option, 
              values: [...option.values, { 
                id: `value-${Date.now()}`, 
                name: 'قيمة جديدة', 
                nameEn: 'New Value' 
              }]
            }
          : option
      ) || []
    }));
  };

  // Update option value
  const updateOptionValue = (optionId: string, valueId: string, field: 'name' | 'nameEn', newValue: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.map(option => 
        option.id === optionId 
          ? {
              ...option,
              values: option.values.map(value => 
                value.id === valueId 
                  ? { ...value, [field]: newValue }
                  : value
              )
            }
          : option
      ) || []
    }));
  };

  // Remove option value
  const removeOptionValue = (optionId: string, valueId: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.map(option => 
        option.id === optionId 
          ? {
              ...option,
              values: option.values.filter(value => value.id !== valueId)
            }
          : option
      ) || []
    }));
  };

  // Variant management functions
  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `variant-${Date.now()}`,
      name: '',
      nameEn: '',
      price: formData.price,
      inStock: true,
      stock: 0,
      options: {}
    };
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant]
    }));
  };

  const updateVariant = (variantId: string, updates: Partial<ProductVariant>) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.map(v => 
        v.id === variantId ? { ...v, ...updates } : v
      ) || []
    }));
  };

  const removeVariant = (variantId: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.filter(v => v.id !== variantId) || []
    }));
  };

  // Generate all possible variants from options
  const generateVariantsFromOptions = () => {
    if (!formData.options || formData.options.length === 0) return;

    const optionValues = formData.options.map(option => option.values);
    const combinations = generateCombinations(optionValues);
    
    const newVariants = combinations.map((combination, index) => {
      const options: Record<string, string> = {};
      formData.options?.forEach((option, optionIndex) => {
        options[option.id] = combination[optionIndex].id;
      });

      return {
        id: `variant-${Date.now()}-${index}`,
        name: combination.map(v => v.name).join(' - '),
        nameEn: combination.map(v => v.nameEn).join(' - '),
        price: formData.price,
        inStock: true,
        stock: 0,
        options
      } as ProductVariant;
    });

    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  // Helper function to generate all combinations
  const generateCombinations = (arrays: { id: string; name: string; nameEn: string }[][]): { id: string; name: string; nameEn: string }[][] => {
    if (arrays.length === 0) return [[]];
    if (arrays.length === 1) return arrays[0].map(item => [item]);
    
    const result: { id: string; name: string; nameEn: string }[][] = [];
    const firstArray = arrays[0];
    const restCombinations = generateCombinations(arrays.slice(1));
    
    for (const item of firstArray) {
      for (const combination of restCombinations) {
        result.push([item, ...combination]);
      }
    }
    
    return result;
  };

  // Review management functions
  const addReview = () => {
    const newReview: CustomerReview = {
      id: `review-${Date.now()}`,
      productId: formData.id || '',
      customerName: '',
      rating: 5,
      title: '',
      comment: '',
      isVerified: false,
      isApproved: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      helpful: 0
    };
    setFormData(prev => ({
      ...prev,
      customerReviews: [...(prev.customerReviews || []), newReview]
    }));
  };

  const updateReview = (reviewId: string, updates: Partial<CustomerReview>) => {
    setFormData(prev => ({
      ...prev,
      customerReviews: prev.customerReviews?.map(r => 
        r.id === reviewId ? { ...r, ...updates } : r
      ) || []
    }));
  };

  const removeReview = (reviewId: string) => {
    setFormData(prev => ({
      ...prev,
      customerReviews: prev.customerReviews?.filter(r => r.id !== reviewId) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Debug: Log what we're about to save
      console.log('💾 ProductModal - Saving product data:', {
        name: formData.name,
        hasVariants: formData.hasVariants,
        variants: formData.variants?.length || 0,
        options: formData.options?.length || 0,
        optionsData: formData.options
      });

      // In real app, this would validate and save to database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave(formData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'basic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Basic Information
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('variants')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'variants'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Variants & Options
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Customer Reviews
              </button>
            </nav>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug *
                      </label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder="product-slug"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        URL-friendly version of the product name (e.g., &quot;gold-ring&quot;)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter product description"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pricing & Status */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Pricing & Status</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price *
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Original Price
                        </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice ?? ''}
                      onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.stock || 0}
                        onChange={(e) => {
                          const stock = parseInt(e.target.value) || 0;
                          handleInputChange('stock', stock);
                          // Auto-update inStock based on stock quantity
                          handleInputChange('inStock', stock > 0);
                        }}
                        placeholder="0"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the number of items available in stock
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => handleInputChange('featured', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Featured product</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={(e) => handleInputChange('inStock', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">In stock</span>
                      </label>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 h-3 w-3 text-blue-600 hover:text-blue-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                  
                  {/* Image Upload */}
                  <ImageUpload
                    onImageUploaded={handleImageUpload}
                    folder="products"
                    className="mb-4"
                  />

                  {/* Current Images */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group h-24">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Variants Tab */}
            {activeTab === 'variants' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.hasVariants || false}
                        onChange={(e) => handleInputChange('hasVariants', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable variants for this product</span>
                    </label>
                  </div>
                </div>

                {/* Product Options */}
                {formData.hasVariants && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-gray-900">Product Options</h4>
                      <div className="flex gap-2">
                        <Button type="button" onClick={addSizeOption} size="sm" variant="outline">
                          Add Size Options
                        </Button>
                        <Button type="button" onClick={addColorOption} size="sm" variant="outline">
                          Add Color Options
                        </Button>
                      </div>
                    </div>

                    {/* Quick Guide */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-2">💡 How to set up variants for rings:</h5>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Click &quot;Add Size Options&quot; to add ring sizes (6, 6.5, 7, etc.)</li>
                        <li>Click &quot;Add Color Options&quot; to add colors (Gold, Silver, etc.)</li>
                        <li>Click &quot;Generate All Variants&quot; to create all size/color combinations</li>
                        <li>Edit each variant to set specific prices and stock levels</li>
                      </ol>
                    </div>

                    {formData.options?.map((option) => (
                      <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <Input
                              value={option.name}
                              onChange={(e) => updateOptionName(option.id, 'name', e.target.value)}
                              placeholder="Option name (Arabic)"
                              className="text-sm"
                            />
                            <Input
                              value={option.nameEn}
                              onChange={(e) => updateOptionName(option.id, 'nameEn', e.target.value)}
                              placeholder="Option name (English)"
                              className="text-sm"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(option.id)}
                            className="ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h6 className="text-sm font-medium text-gray-700">Values:</h6>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOptionValue(option.id)}
                              className="text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Value
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            {option.values.map((value) => (
                              <div key={value.id} className="flex items-center gap-2">
                                <Input
                                  value={value.name}
                                  onChange={(e) => updateOptionValue(option.id, value.id, 'name', e.target.value)}
                                  placeholder="Value (Arabic)"
                                  className="text-sm flex-1"
                                />
                                <Input
                                  value={value.nameEn}
                                  onChange={(e) => updateOptionValue(option.id, value.id, 'nameEn', e.target.value)}
                                  placeholder="Value (English)"
                                  className="text-sm flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOptionValue(option.id, value.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formData.hasVariants && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button type="button" onClick={addVariant} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Variant
                      </Button>
                      {formData.options && formData.options.length > 0 && (
                        <Button 
                          type="button" 
                          onClick={generateVariantsFromOptions} 
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Generate All Variants
                        </Button>
                      )}
                    </div>

                    {formData.variants?.map((variant) => (
                      <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Variant: {variant.name || 'Unnamed'}</h4>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVariant(variant.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Variant Name
                            </label>
                            <Input
                              value={variant.name}
                              onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                              placeholder="e.g., Small, Red, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price Override
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              value={variant.price ?? ''}
                              onChange={(e) => updateVariant(variant.id, { price: parseFloat(e.target.value) || 0 })}
                              placeholder="Leave empty to use base price"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Stock
                            </label>
                            <Input
                              type="number"
                              min="0"
                              value={variant.stock}
                              onChange={(e) => updateVariant(variant.id, { 
                                stock: parseInt(e.target.value) || 0,
                                inStock: (parseInt(e.target.value) || 0) > 0
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
                  <Button type="button" onClick={addReview} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Review
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.customerReviews?.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.customerName}</span>
                          {review.isVerified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeReview(review.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                      <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={review.isApproved}
                            onChange={(e) => updateReview(review.id, { isApproved: e.target.checked })}
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-1">Approved</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={review.isVerified}
                            onChange={(e) => updateReview(review.id, { isVerified: e.target.checked })}
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-1">Verified</span>
                        </label>
                      </div>
                    </div>
                  ))}
                  
                  {(!formData.customerReviews || formData.customerReviews.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No customer reviews yet</p>
                      <p className="text-sm">Add reviews manually or they will appear when customers submit them</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}