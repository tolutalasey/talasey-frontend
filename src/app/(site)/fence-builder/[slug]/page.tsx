import { notFound, permanentRedirect } from 'next/navigation';
import { fenceBuilderPath, getFenceBuilder } from '@/features/fencing';

type Props = PageProps<'/fence-builder/[slug]'>;

export const instant = false;

// Each fence builder now sits on its board's product page, so old links go there.
export default async function OldFenceBuilder({ params }: Props) {
  const builder = await getFenceBuilder((await params).slug);
  if (!builder) notFound();
  permanentRedirect(fenceBuilderPath(builder));
}
