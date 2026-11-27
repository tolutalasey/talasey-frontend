import type { HubDocument, Video } from '../schemas';
import { VideoPlayer } from '@/ui/VideoPlayer/VideoPlayer';
import { DocumentCard } from './DocumentCard';
import styles from './KnowledgeHub.module.css';
import { VideoCard } from './VideoCard';

interface Props {
  documents: HubDocument[];
  videos: Video[];
}

// Downloads and videos on a product page, from the Knowledge Hub entries linked to it. The first
// video plays on the page; any others are cards like the downloads.
export function ProductResources({ documents, videos }: Props) {
  if (documents.length === 0 && videos.length === 0) return null;
  const [featured, ...moreVideos] = videos;
  return (
    <section className={styles.panel} aria-labelledby="resources-title">
      <h2 id="resources-title">{featured ? 'Videos and downloads' : 'Downloads'}</h2>
      {featured && <VideoPlayer youtube={featured.youtube} title={featured.title} />}
      <ul className={styles.documents}>
        {documents.map((entry) => (
          <DocumentCard key={entry.slug} document={entry} />
        ))}
        {moreVideos.map((entry) => (
          <VideoCard key={entry.slug} video={entry} />
        ))}
      </ul>
    </section>
  );
}
