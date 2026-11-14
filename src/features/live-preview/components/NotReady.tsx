import styles from './Preview.module.css';

// Shown in place of the page while a required field is still empty.
export function NotReady({ problems }: { problems: string[] }) {
  return (
    <div className={`container ${styles.notReady}`}>
      <p className={styles.eyebrow}>Preview</p>
      <h1>{problems.length > 0 ? 'Almost there' : 'No page to show'}</h1>
      {problems.length > 0 ? (
        <>
          <p>Fill these in and the page appears here.</p>
          <ul>
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>This kind of content has no page of its own to show.</p>
      )}
    </div>
  );
}
