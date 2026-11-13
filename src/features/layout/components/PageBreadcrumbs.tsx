import { Breadcrumbs } from '@/ui/Breadcrumbs/Breadcrumbs';
import { JsonLd } from '@/lib/JsonLd';
import { breadcrumbJsonLd, type BreadcrumbItem } from '@/lib/seo';

// Every page below the homepage shows its trail and gives search engines the same trail as
// BreadcrumbList data (PRD section 6).
export function PageBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <Breadcrumbs items={items.map((item) => ({ label: item.name, href: item.path }))} />
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}
