'use client';

import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';

interface SharedAttachmentsProps {
  form: UseFormReturn<any>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  isPremium?: boolean;
}

export function SharedAttachments({
  form,
  handleImageUpload,
  removeImage,
  isPremium = false,
}: SharedAttachmentsProps) {
  const images = form.watch('images') || [];
  const limit = isPremium ? 10 : 1;
  const isLimitReached = images.length >= limit;

  return (
    <div className="space-y-4 pt-8">
      <div className="flex items-center justify-between">
        <Label className="text-gray-500 font-normal uppercase tracking-wider text-xs">Attachments / Pictures</Label>
        <div className="flex items-center gap-3">
            {!isPremium && isLimitReached && (
                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/20 animate-pulse">
                    Premium: Add up to 10 images
                </span>
            )}
            <span className="text-xs text-gray-400">{images.length} / {limit} added</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image: string, index: number) => (
          <div key={index} className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-50">
            <img
              src={image}
              alt={`Attachment ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        
        {!isLimitReached ? (
            <label className="cursor-pointer aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 hover:border-primary/50 transition-all text-muted-foreground hover:text-primary group">
                <ImagePlus className="h-6 w-6 mb-2 text-gray-400 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-medium uppercase tracking-tight">Add Picture</span>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                />
            </label>
        ) : (
            <div className="aspect-square border-2 border-dotted border-gray-100 rounded-lg flex flex-col items-center justify-center bg-gray-50/50 grayscale opacity-60 cursor-not-allowed">
                <ImagePlus className="h-6 w-6 mb-2 text-gray-300" />
                <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400 text-center px-2">Limit Reached</span>
            </div>
        )}
      </div>
    </div>
  );
}
