'use client';

import { useState } from 'react';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

type Props = {
  images: { imageUrl: string }[];
};

export default function ProductGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] w-full bg-muted rounded-md">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2 mt-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            onMouseOver={() => setSelectedImage(index)}
            aria-label={`Thumbnail ${index + 1}`}
            className={`overflow-hidden rounded-md border transition ${
              selectedImage === index
                ? 'border-red-500 ring-2 ring-red-300'
                : 'border-gray-200'
            }`}
          >
            <Image
              src={img.imageUrl}
              alt={`Thumbnail ${index + 1}`}
              width={64}
              height={64}
              className="object-cover w-16 h-16"
            />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom */}
      <div className="w-full">
        <Zoom>
          <div className="relative w-full h-[400px] bg-white rounded-md border">
            <Image
              src={images[selectedImage].imageUrl}
              alt={`Selected product image`}
              fill
              sizes="90vw"
              className="object-contain p-4"
              priority
            />
          </div>
        </Zoom>
      </div>
    </div>
  );
}
