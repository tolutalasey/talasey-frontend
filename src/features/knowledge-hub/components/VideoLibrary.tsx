import { PageBreadcrumbs } from '@/features/layout';
import type { Video } from '../schemas';
import styles from './KnowledgeHub.module.css';
import { VideoCard } from './VideoCard';

export function VideoLibrary({ videos }: { videos: Video[] }) {
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Knowledge Hub', path: '/knowledge-hub/' },
          { name: 'Videos', path: '/videos/' },
        ]}
      />
      <header className={styles.header}>
        <h1>Videos</h1>
        <p className={styles.intro}>
          How to install, clean and get the best from our products, from our technical trainers.
        </p>
      </header>
      <section className={styles.panel} aria-label="All videos">
        <ul className={styles.videos}>
          {videos.map((video) => (
            <VideoCard key={video.slug} video={video} />
          ))}
        </ul>
      </section>
    </article>
  );
}
