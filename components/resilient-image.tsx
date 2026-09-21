"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

type ResilientImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackLabel?: string;
};

export function getResilientImageState(src?: string | null, failedSrc?: string | null) {
  const imageSrc = src?.trim() || null;
  return { imageSrc, showFallback: !imageSrc || failedSrc === imageSrc };
}

export function ResilientImage({
  src,
  alt,
  fallbackLabel = "Image unavailable",
  className,
  ...props
}: ResilientImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const { imageSrc, showFallback } = getResilientImageState(src, failedSrc);

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={fallbackLabel}
        className={`flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 ${className || ""}`}
      >
        <ImageOff className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(imageSrc)}
    />
  );
}
