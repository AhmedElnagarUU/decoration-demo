import Image from "next/image";

interface ProjectCoverImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export function ProjectCoverImage({
  src,
  alt,
  className,
  fill,
  sizes,
  priority,
}: ProjectCoverImageProps) {
  if (src.startsWith("data:")) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${className ?? ""}`} />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      unoptimized={src.startsWith("blob:")}
    />
  );
}
