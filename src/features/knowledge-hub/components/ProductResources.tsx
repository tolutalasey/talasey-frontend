import type { HubDocument, Video } from '../schemas';
import { DocumentCard } from './DocumentCard';
import styles from './KnowledgeHub.module.css';
import { VideoCard } from './VideoCard';

interface Props {
  documents: HubDocument[];
  videos: Video[];
}

// Downloads and videos on a product page, from the Knowledge Hub entries linked to it.
export function ProductResources({ documents, videos }: Props) {
  if (documents.length === 0 && videos.length === 0) return null;
  return (
    <section className={styles.panel} aria-labelledby="resources-title">
      <h2 id="resources-title">Downloads and videos</h2>
      <ul className={styles.documents}>
        {documents.map((entry) => (
          <DocumentCard key={entry.slug} document={entry} />
        ))}
        {videos.map((entry) => (
          <VideoCard key={entry.slug} video={entry} />
        ))}
      </ul>
    </section>
  );
}
