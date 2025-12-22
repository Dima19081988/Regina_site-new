import { Link } from "react-router-dom";
import styles from './PromotionsSection.module.css';

const PROMOTIONS = [
    {
        id: 'new-client',
        title: 'Первый визит',
        discount: '-50%',
        description: 'Биоревитализация или мезотерапия',
        oldPrice: '12 000 ₽',
        newPrice: '6 000 ₽',
        validUntil: '31 декабря',
        buttonText: 'Подробнее'
    },

    {
        id: 'botox-pack',
        title: 'Ботулотоксины',
        discount: '250 ₽/ед',
        description: 'Ботокс, Ксеомин, Релатокс',
        oldPrice: '350 ₽/ед',
        newPrice: '250 ₽/ед',
        validUntil: '25 декабря',
        buttonText: 'Подробнее'
    },
    {
        id: 'combo',
        title: 'Комплекс',
        discount: '-30%',
        description: 'Ботокс + филлеры',
        oldPrice: '25 000 ₽',
        newPrice: '17 500 ₽',
        validUntil: '15 января',
        buttonText: 'Подробнее'
    }
];

export default function PromotionsSection() {
    return (
        <section className={styles.promotionsSection}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>🔥 Специальные предложения</h2>
                <div className={styles.promotionsGrid}>
                    {PROMOTIONS.map((promo) => (
                        <div key={promo.id} className={styles.promoCard}>
                            <div className={styles.promoBadge}>{promo.discount}</div>
                            <h3 className={styles.promoTitle}>{promo.title}</h3>
                            <p className={styles.promoDescription}>{promo.description}</p>
                            <div className={styles.priceContainer}>
                                <div className={styles.oldPrice}>{promo.oldPrice}</div>
                                <div className={styles.newPrice}>{promo.newPrice}</div>
                            </div>
                            <div className={styles.validUntil}>
                                До {promo.validUntil}
                            </div>
                            <Link
                                to="/contacts"
                                className={styles.promoButton}
                            >
                                {promo.buttonText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}