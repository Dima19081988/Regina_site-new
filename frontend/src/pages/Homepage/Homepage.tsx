import styles from './Homepage.module.css';
import TrendsSection from '../../components/TrendSection/TrendsSection';
import PromotionsSection from '../../components/Promotions/PromotionsSection';

export default function Homepage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <img
          src="/images/bg-public.jpg"
          alt="Регина Кузнецова — косметолог"
          className={styles.heroImage}
        />
      </section>
      <PromotionsSection />
      <TrendsSection />
    </div>
  );
}
