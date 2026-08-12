'use client';

/**
 * FitMix In-Browser AI Cutout Engine (Zero Tokens, 100% Local & Free)
 * Uses WebAssembly Neural Network segmentation with Canvas Alpha-feathering fallback.
 */

export interface CutoutProgressCallback {
  (progress: number, message: string): void;
}

export async function removeGarmentBackground(
  imageSource: string | File | Blob,
  onProgress?: CutoutProgressCallback
): Promise<string> {
  try {
    if (onProgress) onProgress(15, 'Loading In-Browser AI Model...');

    // Dynamically import @imgly/background-removal so it only runs on the client
    const { removeBackground } = await import('@imgly/background-removal');

    if (onProgress) onProgress(35, 'Analyzing garment contours & fabric textures...');

    const blob = await removeBackground(imageSource, {
      progress: (key: string, current: number, total: number) => {
        if (total > 0 && onProgress) {
          const pct = Math.min(95, Math.round(35 + (current / total) * 55));
          onProgress(pct, `Isolating garment (${pct}%)...`);
        }
      },
      model: 'isnet_quint8', // fast quantized neural model for mobile and desktop
      output: {
        format: 'image/png',
        quality: 0.95
      }
    });

    if (onProgress) onProgress(95, 'Refining edge transparency...');

    // Convert Blob to Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (onProgress) onProgress(100, 'Cutout ready!');
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.warn('In-Browser Neural model notice, falling back to smart Canvas Edge Segmentation:', error);
    if (onProgress) onProgress(50, 'Refining contours with Canvas Segmentation...');
    return await fallbackCanvasCutout(imageSource, onProgress);
  }
}

/**
 * Intelligent Canvas-based fallback edge & chroma cutout algorithm
 * Used when WebAssembly isn't available or for ultra-fast local isolation.
 */
async function fallbackCanvasCutout(
  imageSource: string | File | Blob,
  onProgress?: CutoutProgressCallback
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(img.src);
        return;
      }

      // Max dimension 1200 for clean performance
      const maxDim = 1200;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Sample background color from corners
      const cornerPixels = [
        [0, 0],
        [width - 1, 0],
        [0, height - 1],
        [width - 1, height - 1],
        [Math.floor(width / 2), 0],
        [0, Math.floor(height / 2)],
        [width - 1, Math.floor(height / 2)],
      ];

      let bgR = 0, bgG = 0, bgB = 0;
      cornerPixels.forEach(([x, y]) => {
        const idx = (y * width + x) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      bgR /= cornerPixels.length;
      bgG /= cornerPixels.length;
      bgB /= cornerPixels.length;

      // Alpha mask based on distance to background color
      const threshold = 40;
      const featherRange = 25;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance
        const dist = Math.sqrt(
          Math.pow(r - bgR, 2) +
          Math.pow(g - bgG, 2) +
          Math.pow(b - bgB, 2)
        );

        if (dist < threshold) {
          data[i + 3] = 0; // Transparent
        } else if (dist < threshold + featherRange) {
          // Feathered smooth edge
          data[i + 3] = Math.round(((dist - threshold) / featherRange) * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      if (onProgress) onProgress(100, 'Cutout ready!');
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      if (typeof imageSource === 'string') resolve(imageSource);
      else reject(new Error('Failed to load image for cutout.'));
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = URL.createObjectURL(imageSource);
    }
  });
}
