import styles from './AboutPage.module.css';

const BIOGRAPHY = [
    {
        period: '',
        title: '',
        description: '',
    },
    {
        period: '',
        title: '',
        description: '',
    },

    {
        period: '',
        title: '',
        description: '',
    },
];

export default function BiographySection() {
    return (
        <section className={styles.bioSection}>
            <h2>Профессиональный путь</h2>
            <div className={styles.timeline}>
                {BIOGRAPHY.map((item, index) => (
                    <div key={index} className={styles.timelineItem}>
                        <div className={styles.period}>{item.period}</div>
                        <div className={styles.event}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}