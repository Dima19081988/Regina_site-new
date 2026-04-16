import { useState } from 'react';
import type { Article } from '../../types';
import { ARTICLES } from '../../data/articles';
import ArticleModal from './ArticleModal';
import styles from './TrendDetailPage.module.css';

interface ArticlesSectionProps {
  category: string;
}

export default function ArticlesSection({ category }: ArticlesSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const articles = ARTICLES[category] || ARTICLES['Дефолт'];

  return (
    <section className={styles.articlesSection}>
      <h2>🔍 Полезные материалы</h2>
      <div className={styles.articlesGrid}>
        {articles.map((article, index) => (
          <div key={index} className={styles.articleCard}>
            <h3>{article.title}</h3>
            <p className={styles.articleTeaser}>{article.teaser}</p>
            {article.content ? (
              <button
                className={styles.readMore}
                onClick={() => setSelectedArticle(article)}
              >
                Читать подробнее →
              </button>
            ) : (
              <span className={styles.comingSoon}>Скоро в блоге</span>
            )}
          </div>
        ))}
      </div>

      {selectedArticle && (
        <ArticleModal
          title={selectedArticle.title}
          content={selectedArticle.content}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </section>
  );
}