// What was typed into a form, so a page rendered without JavaScript can put it back.
export function typedValues(form: FormData, names: string[]): Record<string, string> {
  return Object.fromEntries(
    names.flatMap((name) => {
      const value = form.get(name);
      return typeof value === 'string' ? [[name, value]] : [];
    }),
  );
}
