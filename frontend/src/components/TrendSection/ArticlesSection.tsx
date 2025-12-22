import styles from './TrendDetailPage.module.css';

interface ArticlesSectionProps {
    category: string;
}

const ARTICLES = {
    'Ботулотоксины': [
        {
            title: 'Ботулотоксины: мифы и правда',
            teaser: 'botox-myths', 
            content: '', 
            slug: '',
            isOpen: false,
        },

        {
            title: 'Ботокс vs Диспорт: что выбрать?', 
            teaser: 'botox-vs-disport',
            content: '', 
            slug: '',
            isOpen: false,
        },
    ],

    'Биоревитализация': [
        {
            title: 'Биоревитализация: когда и как делать', 
            teaser: 'biorevitalization-guide',
            content: '', 
            slug: '',
            isOpen: false,
        },
    ],

    'Дефолт': [
        {
            title: 'Полезные советы по уходу', 
            teaser: 'care-tips',
            content: '', 
            slug: '',
            isOpen: false,
        },
    ]
};

export default function ArticlesSection({ category }: ArticlesSectionProps) {
    const articles = ARTICLES[category as keyof typeof ARTICLES] || ARTICLES['Дефолт'];

    return (
        <section className={styles.articlesSection}>
            <h2>🔍 Полезные материалы</h2>
            <div className={styles.articlesGrid}>
                {articles.map((article, index) => (
                    <div key={index} className={styles.articleCard}>
                        <h3>{article.title}</h3>
                        <a 
                            href="#" 
                            className={styles.readMore} 
                            onClick={(e) => e.preventDefault()}
                            // TODO: открыть модалку с статьёй
                        >
                            Читать подробнее →
                        </a>
                        <p className={styles.articleTeaser}>{article.teaser}</p>
                        <span className={styles.comingSoon}>Скоро в блоге</span>
                    </div>
                ))}
            </div>
        </section>
    );
}