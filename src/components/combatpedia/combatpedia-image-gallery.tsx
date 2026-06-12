"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import type { WikipediaGalleryImage } from "@/lib/combatpedia/wikipedia-article";
import { cn } from "@/lib/utils";

export function CombatpediaImageGallery({
  images,
  title,
}: {
  images: WikipediaGalleryImage[];
  title: string;
}) {
  const [lightbox, setLightbox] = useState<WikipediaGalleryImage | null>(null);

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center text-sm text-zinc-500">
        No gallery images available for this article yet.
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold uppercase tracking-tight">
          {title} / Image gallery
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {images.length} images sourced from Wikipedia & Wikimedia Commons
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <button
            key={img.url}
            type="button"
            onClick={() => setLightbox(img)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700",
              "bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7b1113]"
            )}
          >
            <Image
              src={img.thumbUrl}
              alt={img.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 25vw"
              unoptimized
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
            </span>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative max-w-4xl w-full max-h-[85vh] aspect-video" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.url}
              alt={lightbox.title}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/80 max-w-lg text-center px-4">
            {lightbox.title}
          </p>
        </div>
      )}
    </>
  );
}
