import { PageBreadcrumbs } from '@/features/layout';
import { videoEmbed, videoPath } from '../paths';
import type { HubDocument, Video } from '../schemas';
import { VideoPlayer } from '@/ui/VideoPlayer/VideoPlayer';
import { DocumentCard } from './DocumentCard';
import styles from './KnowledgeHub.module.css';
import { VideoCard } from './VideoCard';

interface Props {
  video: Video;
  documents: HubDocument[];
  more: Video[];
}

export function VideoPage({ video, documents, more }: Props) {
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Knowledge Hub', path: '/knowledge-hub/' },
          { name: 'Videos', path: '/videos/' },
          { name: video.title, path: videoPath(video) },
        ]}
      />
      <header className={styles.header}>
        <h1>{video.title}</h1>
        {video.summary && <p className={styles.intro}>{video.summary}</p>}
      </header>
      <VideoPlayer youtube={video.youtube} title={video.title} />
      {documents.length > 0 && (
        <section className={styles.panel} aria-labelledby="documents-title">
          <h2 id="documents-title">Documents for the same products</h2>
          <ul className={styles.documents}>
            {documents.map((entry) => (
              <DocumentCard key={entry.slug} document={entry} />
            ))}
          </ul>
        </section>
      )}
      {more.length > 0 && (
        <section className={styles.panel} aria-labelledby="more-title">
          <h2 id="more-title">More videos</h2>
          <ul className={styles.videos}>
            {more.map((entry) => (
              <VideoCard key={entry.slug} video={entry} />
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
