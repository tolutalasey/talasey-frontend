import { describe, expect, it } from 'vitest';
import { configFromValues, formFromConfig, valuesFromForm } from './bespoke-form';

const planter = {
  unit: 'mm' as const,
  formula: 'W * D / 1000 + FIN',
  rounding: 'up_1' as const,
  min_price: 120,
  dimensions: {
    W: { label: 'Width', min: 400, max: 2400, step: 1 },
    D: { label: 'Depth', min: 300, max: 2400, step: 10 },
  },
  choices: [
    {
      label: 'Finish',
      name: 'FIN',
      answers: [
        { label: 'Mild steel', value: 1 },
        { label: 'Corten', value: 2.5 },
      ],
    },
  ],
};

function formOf(values: Record<string, string>) {
  const form = new FormData();
  for (const [name, value] of Object.entries(values)) form.set(name, value);
  return form;
}

describe('made-to-measure pricing form', () => {
  it('shows a saved set-up and reads it back unchanged', () => {
    const values = formFromConfig(planter);
    expect(values.choices).toBe('Finish (FIN): Mild steel = 1, Corten = 2.5');
    expect(values.sizes.H.used).toBe(false);
    expect(configFromValues(values)).toEqual({ config: planter, problems: [] });
  });

  it('reads what staff typed, including sizes they ticked', () => {
    const values = valuesFromForm(
      formOf({
        unit: 'cm',
        rounding: 'up_5',
        minPrice: '£99',
        formula: 'H * 2',
        choices: '',
        'size.H.used': 'on',
        'size.H.label': 'Height',
        'size.H.min': '30',
        'size.H.max': '100',
        'size.W.min': '999',
      }),
    );
    expect(configFromValues(values)).toEqual({
      problems: [],
      config: {
        unit: 'cm',
        formula: 'H * 2',
        rounding: 'up_5',
        min_price: 99,
        dimensions: { H: { label: 'Height', min: 30, max: 100, step: 1 } },
        choices: [],
      },
    });
  });

  it('says how to fix a choice or a size it cannot read', () => {
    const values = formFromConfig(planter);
    values.choices = 'Finish: Mild steel, Corten';
    values.sizes.W.max = 'big';
    expect(configFromValues(values).problems).toEqual([
      'Enter the largest width as a number',
      'Write the choice "Finish: Mild steel, Corten" like: Finish (FIN): Mild steel = 1, Corten = 2',
    ]);
  });
});
