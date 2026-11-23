// The assistant often writes a list straight under a line of text. The page formatting needs a
// blank line before a list, so one is added.
export function withListBreaks(text: string): string {
  return text
    .replace(/([^\n])\n(\s*[-*•]\s)/g, '$1\n\n$2')
    .replace(/(\n[-*•][^\n]*)\n(?![-*•\s])/g, '$1\n\n');
}
