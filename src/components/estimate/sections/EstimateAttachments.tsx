'use client';

import Image from 'next/image';
import { Trash2, PlusCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';

interface EstimateAttachmentsProps {
  form: UseFormReturn<any>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export function EstimateAttachments({
  form,
  handleImageUpload,
  removeImage,
}: EstimateAttachmentsProps) {
  const images = form.watch('images') || [];

  return (
    <div className="space-y-4">
      <Label className="text-gray-500 font-normal">Estimate Pictures / Attachments</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img: string, idx: number) => (
          <div
            key={idx}
            className="relative group aspect-square border rounded-md overflow-hidden bg-gray-50"
          >
            <Image src={img} alt={`Attachment ${idx + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
          <PlusCircle className="h-6 w-6 text-gray-400" />
          <span className="text-xs mt-1 text-gray-500">Add Picture</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>
    </div>
  );
}
