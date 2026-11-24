import type { SearchRecord } from '@/features/search';

export interface LeadOrder {
  hits: SearchRecord[];
  // How many products match a lead name exactly, such as the two main pergolas.
  exact: number;
}

// Puts the products a range leads with first: exact name matches, in the order given, then names
// that contain a lead word, then everything else as it was.
export function leadOrder(hits: SearchRecord[], leadWith: string[] = []): LeadOrder {
  if (leadWith.length === 0) return { hits, exact: 0 };
  const words = leadWith.map((word) => word.toLowerCase());
  const rank = (record: SearchRecord) => {
    const title = record.title.toLowerCase();
    const exact = words.indexOf(title);
    if (exact >= 0) return exact;
    const partly = words.findIndex((word) => title.includes(word));
    return partly >= 0 ? words.length + partly : 2 * words.length;
  };
  const ranked = hits
    .map((record, index) => ({ record, index, rank: rank(record) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index);
  return {
    hits: ranked.map(({ record }) => record),
    exact: ranked.filter(({ rank: value }) => value < words.length).length,
  };
}
