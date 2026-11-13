import { Table } from '@/ui';
import NextLink from 'next/link';
import type { SkuProblem } from '../types';

export function SkuChecks({ problems }: { problems: SkuProblem[] }) {
  if (problems.length === 0) return <p>Every SKU passes the checks.</p>;
  return (
    <Table caption={`${problems.length} things to fix`}>
      <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Problem</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((problem) => (
          <tr key={`${problem.productId}-${problem.variantId ?? ''}-${problem.rule}`}>
            <th scope="row">
              <NextLink href={`/admin/products/${problem.productId}/`}>
                {problem.productTitle}
              </NextLink>
            </th>
            <td>{problem.message}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
