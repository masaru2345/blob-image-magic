
export interface ImageDimensions {
  width: number;
  height: number;
}

// Get image dimensions
export const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

// Resize image on canvas
export const resizeImage = (
  imgSrc: string,
  targetWidth: number,
  targetHeight: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Draw the image with smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/png');
      
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for resizing'));
      URL.revokeObjectURL(img.src);
    };
    
    // Set crossOrigin to anonymous to prevent CORS issues
    img.crossOrigin = "anonymous";
    img.src = imgSrc;
  });
};

// Compress image - fixed to properly handle image loading
export const compressImage = (
  imgSrc: string,
  format: 'webp' | 'jpeg' | 'avif',
  quality: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Set image loading handlers
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image at original size
        ctx.drawImage(img, 0, 0);
        
        // Convert quality from 0-100 to 0-1
        const normalizedQuality = quality / 100;
        
        // Generate compressed image with proper mime type
        const mimeType = `image/${format}`;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          mimeType,
          normalizedQuality
        );
      } catch (error) {
        console.error("Canvas operation error:", error);
        reject(new Error('Error during image processing'));
      } finally {
        URL.revokeObjectURL(img.src);
      }
    };
    
    img.onerror = () => {
      console.error("Image loading failed for:", imgSrc);
      reject(new Error('Failed to load image for compression'));
      URL.revokeObjectURL(img.src);
    };
    
    // Set crossOrigin to anonymous to prevent CORS issues
    img.crossOrigin = "anonymous";
    
    // Set image source last (after setting up all handlers)
    img.src = imgSrc;
  });
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Download the processed image
export const downloadImage = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Add some animations to CSS classes
export const addAnimationClass = (baseClass: string, animationClass: string): string => {
  return `${baseClass} ${animationClass}`;
};
