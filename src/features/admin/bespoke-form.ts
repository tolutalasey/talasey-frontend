// The made-to-measure price set-up as staff see it on the pricing page, and back again.
export const SIZE_NAMES = ['W', 'H', 'D', 'L'] as const;
export type SizeName = (typeof SIZE_NAMES)[number];

export const ROUNDING = [
  { value: 'none', label: 'To the penny' },
  { value: 'nearest_1', label: 'To the nearest pound' },
  { value: 'up_1', label: 'Up to the next pound' },
  { value: 'up_5', label: 'Up to the next £5' },
  { value: 'up_10', label: 'Up to the next £10' },
] as const;

const SIZE_LABELS: Record<SizeName, string> = {
  W: 'Width',
  H: 'Height',
  D: 'Depth',
  L: 'Length',
};

export interface SizeRow {
  used: boolean;
  label: string;
  min: string;
  max: string;
  step: string;
}

export interface BespokeFormValues {
  unit: 'mm' | 'cm';
  rounding: (typeof ROUNDING)[number]['value'];
  minPrice: string;
  formula: string;
  sizes: Record<SizeName, SizeRow>;
  choices: string;
}

export interface BespokeConfig {
  unit: 'mm' | 'cm';
  formula: string;
  rounding: BespokeFormValues['rounding'];
  min_price?: number;
  dimensions: Partial<Record<SizeName, { label: string; min: number; max: number; step: number }>>;
  choices: { label: string; name: string; answers: { label: string; value: number }[] }[];
}

const CHOICE_LINE = /^(.+?)\s*\(([A-Z_]+)\)\s*:\s*(.+)$/;
const ANSWER = /^(.+?)\s*=\s*(-?\d+(?:\.\d+)?)$/;

const emptySize = (name: SizeName): SizeRow => ({
  used: false,
  label: SIZE_LABELS[name],
  min: '',
  max: '',
  step: '1',
});

export function formFromConfig(raw: unknown): BespokeFormValues {
  const config = (raw ?? {}) as Partial<BespokeConfig>;
  const sizes = Object.fromEntries(
    SIZE_NAMES.map((name) => {
      const size = config.dimensions?.[name];
      return [
        name,
        size
          ? {
              used: true,
              label: size.label,
              min: String(size.min),
              max: String(size.max),
              step: String(size.step),
            }
          : emptySize(name),
      ];
    }),
  ) as Record<SizeName, SizeRow>;
  return {
    unit: config.unit ?? 'mm',
    rounding: config.rounding ?? 'none',
    minPrice: config.min_price === undefined ? '' : String(config.min_price),
    formula: config.formula ?? '',
    sizes,
    choices: (config.choices ?? [])
      .map(
        (choice) =>
          `${choice.label} (${choice.name}): ${choice.answers
            .map((answer) => `${answer.label} = ${answer.value}`)
            .join(', ')}`,
      )
      .join('\n'),
  };
}

const field = (form: FormData, name: string) => String(form.get(name) ?? '').trim();

export function valuesFromForm(form: FormData): BespokeFormValues {
  const rounding = field(form, 'rounding');
  return {
    unit: field(form, 'unit') === 'cm' ? 'cm' : 'mm',
    rounding: (ROUNDING.find((option) => option.value === rounding)?.value ??
      'none') as BespokeFormValues['rounding'],
    minPrice: field(form, 'minPrice'),
    formula: String(form.get('formula') ?? '').trim(),
    choices: String(form.get('choices') ?? '').trim(),
    sizes: Object.fromEntries(
      SIZE_NAMES.map((name) => [
        name,
        {
          used: form.get(`size.${name}.used`) === 'on',
          label: field(form, `size.${name}.label`) || SIZE_LABELS[name],
          min: field(form, `size.${name}.min`),
          max: field(form, `size.${name}.max`),
          step: field(form, `size.${name}.step`) || '1',
        },
      ]),
    ) as Record<SizeName, SizeRow>,
  };
}

export function configFromValues(values: BespokeFormValues): {
  config: BespokeConfig;
  problems: string[];
} {
  const problems: string[] = [];
  const number = (text: string, what: string) => {
    const value = Number(text.replace(/[£,\s]/g, ''));
    if (text === '' || !Number.isFinite(value)) problems.push(`Enter ${what} as a number`);
    return value;
  };

  const dimensions: BespokeConfig['dimensions'] = {};
  for (const name of SIZE_NAMES) {
    const size = values.sizes[name];
    if (!size.used) continue;
    dimensions[name] = {
      label: size.label,
      min: number(size.min, `the smallest ${size.label.toLowerCase()}`),
      max: number(size.max, `the largest ${size.label.toLowerCase()}`),
      step: number(size.step, `the ${size.label.toLowerCase()} step`),
    };
  }

  const choices = values.choices
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = CHOICE_LINE.exec(line);
      if (!match) {
        problems.push(`Write the choice "${line}" like: Finish (FIN): Mild steel = 1, Corten = 2`);
        return null;
      }
      const [, label = '', name = '', list = ''] = match;
      const answers = list.split(',').map((entry) => {
        const answer = ANSWER.exec(entry.trim());
        if (!answer) problems.push(`In ${label}, write "${entry.trim()}" like: Corten = 2`);
        return { label: answer?.[1] ?? '', value: Number(answer?.[2] ?? 0) };
      });
      return { label, name, answers };
    })
    .filter((choice): choice is NonNullable<typeof choice> => choice !== null);

  return {
    problems,
    config: {
      unit: values.unit,
      formula: values.formula,
      rounding: values.rounding,
      ...(values.minPrice && { min_price: number(values.minPrice, 'the minimum price') }),
      dimensions,
      choices,
    },
  };
}

// The names a formula can use, for the help next to it.
export function formulaNames(config: BespokeConfig): string[] {
  return [...Object.keys(config.dimensions), ...config.choices.map((choice) => choice.name)];
}
