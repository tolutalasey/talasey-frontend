import NextLink from 'next/link';
import type { PergolaPage } from '../loaders.server';

// On an add-on's page, such as a screen or heater: it is chosen on the pergola's own page.
export function PergolaAddOnLinks({ pages }: { pages: PergolaPage[] }) {
  return (
    <>
      <p>Choose this while you build your pergola, so everything fits and arrives together.</p>
      {pages.length > 0 ? (
        pages.map(({ builder, path }) => (
          <NextLink key={builder.slug} href={path} className="button">
            Build your {builder.range} pergola
          </NextLink>
        ))
      ) : (
        <NextLink href="/pergolas/" className="button">
          See our pergolas
        </NextLink>
      )}
    </>
  );
}
