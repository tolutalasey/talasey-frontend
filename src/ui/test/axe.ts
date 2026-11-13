import axe from 'axe-core';

export async function axeViolations(container: Element): Promise<axe.Result[]> {
  const { violations } = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  return violations;
}
