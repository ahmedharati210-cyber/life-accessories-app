'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from './ImageUpload';
import { AdminCategory } from '@/types';

interface CategoryModalProps {
  category?: AdminCategory | null;
  onClose: () => void;
  onSave: (category: AdminCategory) => Promise<void>;
}

export function CategoryModal({ category, onClose, onSave }: CategoryModalProps) {
  const [formData, setFormData] = useState<AdminCategory>({
    name: '',
    slug: '',
    description: '',
    image: '',
    featured: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData(category);
    }
  }, [category]);

  const handleInputChange = (field: keyof AdminCategory, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the parent's save function which handles the actual API call
      await onSave(formData);
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {category ? 'Edit Category' : 'Add New Category'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter category name"
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
                    placeholder="category-slug"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter category description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured category</span>
                  </label>
                </div>
              </div>

              {/* Category Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Category Image</h3>
                
                {/* Current Image */}
                {formData.image && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Image
                    </label>
                    <div className="relative h-48">
                      <Image
                        src={formData.image}
                        alt="Category preview"
                        fill
                        className="object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Image
                  </label>
                  <ImageUpload
                    onImageUploaded={handleImageUpload}
                    folder="categories"
                    className="mb-4"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
