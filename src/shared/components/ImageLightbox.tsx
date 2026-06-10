"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, images.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 transition-colors hover:text-white"
        aria-label="Close"
      >
        <X className="h-8 w-8" />
      </button>

      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIndex((i) => i - 1);
          }}
          className="absolute left-4 text-white/80 transition-colors hover:text-white"
          aria-label="Previous"
        >
          <ChevronLeft className="h-10 w-10" />
        </button>
      )}

      <div className="relative h-[80vh] w-[90vw] max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[index]}
          alt={`Image ${index + 1}`}
          fill
          className="object-contain"
          sizes="90vw"
        />
      </div>

      {index < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIndex((i) => i + 1);
          }}
          className="absolute right-4 text-white/80 transition-colors hover:text-white"
          aria-label="Next"
        >
          <ChevronRight className="h-10 w-10" />
        </button>
      )}
    </div>
  );
}
