import styles from './ArticleModal.module.css';

interface ArticleModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

export default function ArticleModal({ title, content, onClose }: ArticleModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.content}>
          {content.split('\n').map((line, i) =>
            line.trim() === '' ? (
              <br key={i} />
            ) : (
              <p key={i}>{line}</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}