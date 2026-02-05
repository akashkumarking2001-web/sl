import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    blurDataURL?: string;
    priority?: boolean;
    onLoad?: () => void;
    onError?: () => void;
}

export const OptimizedImage = ({
    src,
    alt,
    className,
    blurDataURL,
    priority = false,
    onLoad,
    onError,
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(priority ? src : null);

    useEffect(() => {
        if (!priority && !imageSrc) {
            // Lazy load: Use Intersection Observer
            const img = new Image();
            img.src = src;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setImageSrc(src);
                            observer.disconnect();
                        }
                    });
                },
                { rootMargin: '50px' } // Start loading 50px before visible
            );

            const element = document.getElementById(`img-${src}`);
            if (element) {
                observer.observe(element);
            }

            return () => observer.disconnect();
        }
    }, [src, priority, imageSrc]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    // Fallback image for errors
    const fallbackSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';

    return (
        <div
            id={`img-${src}`}
            className={cn('relative overflow-hidden bg-muted/20', className)}
        >
            {/* Blur placeholder */}
            {blurDataURL && !isLoaded && !hasError && (
                <img
                    src={blurDataURL}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 transition-opacity duration-300"
                />
            )}

            {/* Loading skeleton */}
            {!isLoaded && !hasError && !blurDataURL && (
                <div className="absolute inset-0 bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20 animate-pulse" />
            )}

            {/* Actual image */}
            {imageSrc && !hasError && (
                <img
                    src={imageSrc}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'w-full h-full object-cover transition-opacity duration-300',
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                />
            )}

            {/* Error fallback */}
            {hasError && (
                <img
                    src={fallbackSrc}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            )}
        </div>
    );
};

export default OptimizedImage;
