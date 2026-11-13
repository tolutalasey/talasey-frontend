import type { Tokens } from './tokens';

function kebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function toCssVariables(tokens: Tokens): string {
  const lines = Object.entries(tokens).flatMap(([group, values]) =>
    Object.entries(values).map(([name, value]) => `  --${kebab(group)}-${kebab(name)}: ${value};`),
  );
  return `:root {\n${lines.join('\n')}\n}\n`;
}
