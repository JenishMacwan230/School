"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: number;
  image: string;
}

export default function MasonryGallery({
  images,
  isAdmin,
  onDelete,
}: {
  images: GalleryItem[];
  isAdmin: boolean;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      {images.map((img) => (
        <motion.div
          key={img.id}
          className="relative mb-4 break-inside-avoid"
          whileHover={{ scale: 1.03 }}
        >
          <Image
            src={img.image}
            alt="Sports Gallery"
            width={600}
            height={400}
            className="w-full rounded-xl shadow-lg"
          />

          {isAdmin && (
  <button
    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1 rounded-md shadow"
    onClick={() => onDelete(img.id)}
  >
    🗑 Delete
  </button>
)}

        </motion.div>
      ))}
    </div>
  );
}
