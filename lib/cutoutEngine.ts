'use client';

/**
 * FitMix In-Browser AI Cutout Engine (Zero Tokens, 100% Local & Free)
 * Uses Neural Network segmentation with high-precision Flood-Fill Edge Chroma fallback.
 */

export interface CutoutProgressCallback {
  (progress: number, message: string): void;
}

export async function removeGarmentBackground(
  imageSource: string | File | Blob,
  onProgress?: CutoutProgressCallback,
  options?: { tolerance?: number }
): Promise<string> {
  const tolerance = options?.tolerance ?? 45;

  try {
    if (onProgress) onProgress(15, 'Loading In-Browser AI Model...');

    // Dynamically import @imgly/background-removal so it only runs in the browser client
    const { removeBackground } = await import('@imgly/background-removal');

    if (onProgress) onProgress(35, 'Analyzing garment contours & textures...');

    const blob = await removeBackground(imageSource, {
      progress: (key: string, current: number, total: number) => {
        if (total > 0 && onProgress) {
          const pct = Math.min(95, Math.round(35 + (current / total) * 55));
          onProgress(pct, `Isolating garment (${pct}%)...`);
        }
      },
      model: 'isnet_quint8',
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
        if (onProgress) onProgress(100, 'Transparent cutout ready!');
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.warn('Neural model notice, using High-Precision Flood-Fill Edge Cutout:', error);
    if (onProgress) onProgress(50, 'Isolating garment from background...');
    return await fallbackFloodFillCutout(imageSource, tolerance, onProgress);
  }
}

/**
 * High-Precision Flood-Fill & Perimeter Chroma Cutout Algorithm
 * Removes outer background cleanly while protecting white/light details inside the garment.
 */
export async function fallbackFloodFillCutout(
  imageSource: string | File | Blob,
  customTolerance: number = 45,
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
      const totalPixels = width * height;

      // Sample perimeter pixels to establish ambient background colors
      const perimeterColors: [number, number, number][] = [];
      const sampleStep = Math.max(1, Math.floor(Math.min(width, height) / 20));

      for (let x = 0; x < width; x += sampleStep) {
        // Top and bottom borders
        const topIdx = x * 4;
        const btmIdx = ((height - 1) * width + x) * 4;
        perimeterColors.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
        perimeterColors.push([data[btmIdx], data[btmIdx + 1], data[btmIdx + 2]]);
      }
      for (let y = 0; y < height; y += sampleStep) {
        // Left and right borders
        const leftIdx = (y * width) * 4;
        const rightIdx = (y * width + (width - 1)) * 4;
        perimeterColors.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
        perimeterColors.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
      }

      // Calculate average background color from perimeter
      let avgR = 0, avgG = 0, avgB = 0;
      perimeterColors.forEach(([r, g, b]) => {
        avgR += r;
        avgG += g;
        avgB += b;
      });
      avgR /= perimeterColors.length;
      avgG /= perimeterColors.length;
      avgB /= perimeterColors.length;

      // BFS Flood-Fill from all 4 borders inward
      const visited = new Uint8Array(totalPixels);
      const queue: number[] = [];

      // Seed all border pixels
      for (let x = 0; x < width; x++) {
        queue.push(x); // top row
        queue.push((height - 1) * width + x); // bottom row
      }
      for (let y = 1; y < height - 1; y++) {
        queue.push(y * width); // left column
        queue.push(y * width + width - 1); // right column
      }

      const tolerance = customTolerance;
      const featherRange = 20;

      let head = 0;
      while (head < queue.length) {
        const pIdx = queue[head++];
        if (visited[pIdx]) continue;
        visited[pIdx] = 1;

        const byteIdx = pIdx * 4;
        const r = data[byteIdx];
        const g = data[byteIdx + 1];
        const b = data[byteIdx + 2];

        // Euclidean distance from background color
        const dist = Math.sqrt(
          Math.pow(r - avgR, 2) +
          Math.pow(g - avgG, 2) +
          Math.pow(b - avgB, 2)
        );

        // Also check if near white/light grey studio backdrop (r,g,b > 210)
        const isNearWhiteBackdrop = (r > 215 && g > 215 && b > 215) && (Math.abs(r - g) < 25 && Math.abs(g - b) < 25);

        if (dist < tolerance || isNearWhiteBackdrop) {
          // Transparent
          data[byteIdx + 3] = 0;

          // Propagate to 4-connected neighbors
          const px = pIdx % width;
          const py = Math.floor(pIdx / width);

          if (px > 0 && !visited[pIdx - 1]) queue.push(pIdx - 1);
          if (px < width - 1 && !visited[pIdx + 1]) queue.push(pIdx + 1);
          if (py > 0 && !visited[pIdx - width]) queue.push(pIdx - width);
          if (py < height - 1 && !visited[pIdx + width]) queue.push(pIdx + width);
        } else if (dist < tolerance + featherRange) {
          // Feathered smooth edge
          data[byteIdx + 3] = Math.round(((dist - tolerance) / featherRange) * 255);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      if (onProgress) onProgress(100, 'Transparent cutout ready!');
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      if (typeof imageSource === 'string') resolve(imageSource);
      else reject(new Error('Failed to load image.'));
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = URL.createObjectURL(imageSource);
    }
  });
}
