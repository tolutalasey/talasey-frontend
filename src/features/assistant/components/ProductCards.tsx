'use client';

import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { AssistantProductCard } from '@/api-client';
import { BagIcon, CheckIcon } from '@/ui/icons';
import { addToBagFromChat } from '../actions';
import styles from './Assistant.module.css';

function AddButton({ add }: { add: NonNullable<AssistantProductCard['add']> }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [added, setAdded] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const addIt = () =>
    start(async () => {
      const result = await addToBagFromChat(add.variantId, add.quantity);
      setProblem(result.message);
      if (!result.added) return;
      setAdded(true);
      router.push('/basket/', { scroll: false });
    });

  return (
    <>
      <button type="button" className={styles.cardAdd} onClick={addIt} disabled={pending || added}>
        {added ? <CheckIcon width={16} height={16} /> : <BagIcon width={16} height={16} />}
        {added ? 'Added' : pending ? 'Adding…' : add.label}
      </button>
      {problem && (
        <p className={styles.cardProblem} role="alert">
          {problem}
        </p>
      )}
    </>
  );
}

// The products the assistant recommends, each with a link and, when ready, Add to bag.
export function ProductCards({ products }: { products: AssistantProductCard[] }) {
  return (
    <ul className={styles.cards}>
      {products.map((product) => (
        <li key={`${product.handle}-${product.choice ?? ''}`} className={styles.card}>
          <div className={styles.cardPhoto}>
            {product.image && (
              <Image src={product.image} alt="" fill sizes="72px" className={styles.cardImage} />
            )}
          </div>
          <div className={styles.cardBody}>
            <NextLink href={product.href} className={styles.cardTitle}>
              {product.title}
            </NextLink>
            {product.choice && <span className={styles.cardChoice}>{product.choice}</span>}
            <span className={styles.cardMeta}>
              {product.price && <strong>{product.price}</strong>}
              <span>{product.stock}</span>
            </span>
            <span className={styles.cardActions}>
              {product.add ? (
                <AddButton add={product.add} />
              ) : (
                <NextLink href={product.href} className={styles.cardView}>
                  Choose options
                </NextLink>
              )}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
