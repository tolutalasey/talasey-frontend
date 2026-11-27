import styles from './VideoPlayer.module.css';

const ID = /^[\w-]{11}$/;

// The video's id from a YouTube address (watch, share or embed links) or the id itself.
export function youtubeId(address: string | null | undefined): string | null {
  const value = address?.trim() ?? '';
  if (ID.test(value)) return value;
  const match = /(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/.exec(value);
  return match?.[1] ?? null;
}

export function VideoPlayer({ youtube, title }: { youtube: string; title: string }) {
  return (
    <div className={styles.player}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtube}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
