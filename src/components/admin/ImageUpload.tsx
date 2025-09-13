'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Upload, X, Check } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ onImageUploaded, folder = 'products', className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const { imageUrl } = await response.json();
        setUploadedImages(prev => [...prev, imageUrl]);
        onImageUploaded(imageUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Upload Images</h3>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload images'}
            </span>
            <span className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </span>
          </label>
        </div>

        {uploadedImages.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Uploaded Images:</h4>
            <div className="grid grid-cols-2 gap-2">
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} className="relative group h-24">
                  <img
                    src={imageUrl}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
