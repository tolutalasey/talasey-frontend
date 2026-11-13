import { describe, expect, it } from 'vitest';
import { toCssVariables } from './css';
import { tokens } from './tokens';

describe('toCssVariables', () => {
  const css = toCssVariables(tokens);

  it('wraps every token in :root', () => {
    expect(css.startsWith(':root {\n')).toBe(true);
    expect(css.trimEnd().endsWith('}')).toBe(true);
  });

  it('names variables group-name in kebab case', () => {
    expect(css).toContain('--color-brand600: #5E2378;');
    expect(css).toContain('--color-ink-muted: #4A4250;');
    expect(css).toContain('--focus-ring-width: 3px;');
  });

  it('emits one variable per token', () => {
    const count = Object.values(tokens).reduce(
      (total, group) => total + Object.keys(group).length,
      0,
    );
    expect(css.match(/^ {2}--/gm)).toHaveLength(count);
  });
});
