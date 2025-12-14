import styles from './Homepage.module.css';
import TrendsSection from '../../components/TrendSection/TrendsSection';

export default function Homepage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h2></h2>
        <p></p>
      </section>
      <TrendsSection />
    </div>
  );
}
