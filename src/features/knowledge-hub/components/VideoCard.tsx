import Image from 'next/image';
import NextLink from 'next/link';
import { videoPath, videoStill } from '../paths';
import type { Video } from '../schemas';
import styles from './KnowledgeHub.module.css';

export function VideoCard({ video }: { video: Video }) {
  return (
    <li className={styles.card}>
      <div className={`${styles.cover} ${styles.play}`}>
        <Image
          src={videoStill(video)}
          alt=""
          width={480}
          height={360}
          sizes="(min-width: 64rem) 20vw, (min-width: 40rem) 33vw, 100vw"
        />
      </div>
      <p className={styles.kind}>Video</p>
      <h3 className={styles.cardTitle}>
        <NextLink href={videoPath(video)} className={styles.cardLink}>
          {video.title}
        </NextLink>
      </h3>
      <p className={styles.action} aria-hidden="true">
        Watch
      </p>
    </li>
  );
}
