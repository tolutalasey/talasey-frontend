import { SplitPanel } from '@/ui/SplitPanel/SplitPanel';
import NextLink from 'next/link';
import { seasonPhoto } from '../brand';
import type { SeasonalBlock as Block } from '../content';

export function SeasonalBlock({ block }: { block: Block }) {
  return (
    <SplitPanel id="season-title" eyebrow="This season" heading={block.heading} photo={seasonPhoto}>
      <p>{block.text}</p>
      <p>
        <NextLink href={block.action.href} className="button-on-dark">
          {block.action.label}
        </NextLink>
      </p>
    </SplitPanel>
  );
}
