import { env } from '@/lib/env';
import { PALETTES, paletteCss, paletteScript } from '../palettes';
import { PaletteSwitcher } from './PaletteSwitcher';

// Colour options to try on the test site. The live site never sends any of this.
export function PalettePreview() {
  if (env.APP_ENV === 'production') return null;
  return (
    <>
      <style>{paletteCss()}</style>
      <script dangerouslySetInnerHTML={{ __html: paletteScript() }} />
      <PaletteSwitcher palettes={PALETTES} />
    </>
  );
}
