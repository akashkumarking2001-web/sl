/**
 * Compress an image file before upload
 * Reduces file size while maintaining acceptable quality
 */

export interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
    fileType?: string;
}

export const compressImage = async (
    file: File,
    options: CompressionOptions = {}
): Promise<File> => {
    const {
        maxSizeMB = 1,
        maxWidthOrHeight = 1920,
        quality = 0.8,
        fileType = 'image/jpeg',
    } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidthOrHeight) {
                        height = (height * maxWidthOrHeight) / width;
                        width = maxWidthOrHeight;
                    }
                } else {
                    if (height > maxWidthOrHeight) {
                        width = (width * maxWidthOrHeight) / height;
                        height = maxWidthOrHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                // Draw image with better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with compression
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Compression failed'));
                            return;
                        }

                        // Check if compressed size is acceptable
                        const compressedSizeMB = blob.size / 1024 / 1024;

                        if (compressedSizeMB > maxSizeMB && quality > 0.1) {
                            // Try again with lower quality
                            compressImage(file, {
                                ...options,
                                quality: quality - 0.1,
                            })
                                .then(resolve)
                                .catch(reject);
                            return;
                        }

                        const compressedFile = new File([blob], file.name, {
                            type: fileType,
                            lastModified: Date.now(),
                        });

                        console.log(
                            `Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(
                                compressedFile.size /
                                1024 /
                                1024
                            ).toFixed(2)}MB`
                        );

                        resolve(compressedFile);
                    },
                    fileType,
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Batch compress multiple images
 */
export const compressImages = async (
    files: File[],
    options: CompressionOptions = {}
): Promise<File[]> => {
    const compressionPromises = files.map((file) => compressImage(file, options));
    return Promise.all(compressionPromises);
};

/**
 * Get image dimensions without loading the full image
 */
export const getImageDimensions = (
    file: File
): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Generate a blur placeholder data URL
 */
export const generateBlurPlaceholder = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                // Create tiny 10x10 blur placeholder
                canvas.width = 10;
                canvas.height = 10;

                ctx.drawImage(img, 0, 0, 10, 10);

                resolve(canvas.toDataURL('image/jpeg', 0.5));
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
};
