import styles from './Homepage.module.css';
import TrendsSection from '../../components/TrendSection/TrendsSection';
import PromotionsSection from '../../components/Promotions/PromotionsSection';

export default function Homepage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h2></h2>
        <p></p>
      </section>
      <PromotionsSection />
      <TrendsSection />
    </div>
  );
}
