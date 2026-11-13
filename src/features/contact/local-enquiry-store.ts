import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Enquiry, EnquiryPhoto } from './enquiry';
import type { EnquiryStore } from './enquiry-store';

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

// Each enquiry in its own folder: enquiry.json and the photos as photo-1.jpg and so on. Names
// sent by the browser are never used as paths.
export class LocalEnquiryStore implements EnquiryStore {
  readonly name = 'local folder';

  constructor(
    private readonly directory: string,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async save(enquiry: Enquiry, photos: EnquiryPhoto[]): Promise<{ id: string }> {
    const receivedAt = this.now();
    const id = `${receivedAt.toISOString().slice(0, 10)}-${randomUUID().slice(0, 8)}`;
    const folder = join(this.directory, id);
    await mkdir(folder, { recursive: true });
    const saved = await Promise.all(
      photos.map(async (photo, index) => {
        const file = `photo-${index + 1}.${EXTENSIONS[photo.type] ?? 'img'}`;
        await writeFile(join(folder, file), photo.bytes);
        return { file, originalName: photo.name, type: photo.type, bytes: photo.bytes.length };
      }),
    );
    await writeFile(
      join(folder, 'enquiry.json'),
      JSON.stringify(
        { id, receivedAt: receivedAt.toISOString(), ...enquiry, photos: saved },
        null,
        2,
      ),
    );
    return { id };
  }
}
