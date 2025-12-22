import { useState } from 'react';
import styles from './TrendDetailPage.module.css';

interface FAQSectionProps {
    category: string;
}

const FAQS = {
    'Ботулинотерапия': [
        { q: 'Больно ли делать ботокс?', a: 'Процедура почти безболезненная. Используется тонкая игла и анестезирующий крем.' },
        { q: 'Сколько держится эффект?', a: '4-8 месяцев в зависимости от препарата и индивидуальных особенностей.' },
    ],

    'Биоревитализация': [
        { q: 'Есть ли отеки после биоревитализации?', a: 'Легкий отек возможен 1-2 дня, проходит самостоятельно.' },
    ],
};

export default function FAQSection({ category }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const faqs = FAQS[category as keyof typeof FAQS] || [];

    return (
        <section className={styles.faqSection}>
            <h2>❓ Часто задаваемые вопросы</h2>
            <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                    <div key={index} className={styles.faqItem}>
                        <button
                            className={styles.faqQuestion}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            {faq.q}
                            <span className={`${styles.arrow} ${openIndex === index ? styles.rotated : ''}`}>
                                ▼
                            </span>
                        </button>
                        {openIndex === index && (
                            <div className={styles.faqAnswer}>{faq.a}</div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}