import Image from 'next/image';
import type { HubDocument } from '../schemas';
import styles from './KnowledgeHub.module.css';

export function DocumentCard({ document }: { document: HubDocument }) {
  return (
    <li className={styles.card}>
      <div className={styles.cover}>
        {document.thumbnail ? (
          <Image
            src={document.thumbnail.src}
            alt=""
            width={document.thumbnail.width}
            height={document.thumbnail.height}
            sizes="(min-width: 64rem) 20vw, (min-width: 40rem) 33vw, 100vw"
          />
        ) : (
          <span className={styles.coverBlank} aria-hidden="true">
            PDF
          </span>
        )}
      </div>
      <p className={styles.kind}>{document.kind}</p>
      <h3 className={styles.cardTitle}>
        <a href={document.file} className={styles.cardLink} target="_blank" rel="noreferrer">
          {document.title}
        </a>
      </h3>
      <p className={styles.action} aria-hidden="true">
        Download PDF
      </p>
    </li>
  );
}
