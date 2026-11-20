export interface Builder {
  name: string;
  summary: string;
  path: string;
  image: string;
  // Starts of words that mean a shopper is after this builder, such as "fenc" for fence or fencing.
  topics: string[];
}

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

// The builders a search is about: any word in it that starts with one of a builder's topics.
export function buildersFor(query: string, builders: Builder[]): Builder[] {
  const asked = words(query);
  return builders.filter((builder) =>
    asked.some((word) => builder.topics.some((topic) => word.startsWith(topic))),
  );
}
