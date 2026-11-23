const LONGEST_SIDE = 1568;
const THUMB_SIDE = 320;
const QUALITY = 0.85;

export interface ChosenPhoto {
  blob: Blob;
  // A small copy to show in the conversation.
  thumb: string;
}

function draw(source: ImageBitmap, longest: number): HTMLCanvasElement {
  const scale = Math.min(1, longest / Math.max(source.width, source.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);
  canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// Shrinks a photo in the browser and makes it a plain JPEG, so it uploads quickly and carries
// no location or camera details.
export async function preparePhoto(file: File): Promise<ChosenPhoto> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    const full = draw(bitmap, LONGEST_SIDE);
    const blob = await new Promise<Blob>((resolve, reject) =>
      full.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('No photo'))),
        'image/jpeg',
        QUALITY,
      ),
    );
    const thumb = draw(bitmap, THUMB_SIDE).toDataURL('image/jpeg', 0.7);
    return { blob, thumb };
  } finally {
    bitmap.close();
  }
}

export async function uploadPhoto(blob: Blob): Promise<string | null> {
  const form = new FormData();
  form.set('photo', blob, 'photo.jpg');
  const response = await fetch('/api/assistant/photos/', { method: 'POST', body: form });
  if (!response.ok) return null;
  const body = (await response.json()) as { photoId?: string };
  return body.photoId ?? null;
}
