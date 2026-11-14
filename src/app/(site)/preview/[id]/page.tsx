import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KeepScroll, PreviewPage, previewStyles } from '@/features/live-preview';
import { staffApi } from '@/features/staff';

export const metadata: Metadata = {
  title: 'Preview',
  robots: { index: false, follow: false },
};

// Staff only, drawn from what is being typed in the editor, so it renders on every request.
export const instant = false;

export default async function Preview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: preview } = await (
    await staffApi()
  ).GET('/content/documents/{id}/preview', { params: { path: { id } } });
  if (!preview) notFound();
  return (
    <>
      <PreviewPage type={preview.type} data={preview.data} />
      <p className={previewStyles.badge}>Draft preview</p>
      <KeepScroll id={id} />
    </>
  );
}
