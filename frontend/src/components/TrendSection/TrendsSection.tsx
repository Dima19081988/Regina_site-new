import { Link } from 'react-router-dom';
import { trends } from '../../data/Trends';
import { motion } from 'framer-motion';
import styles from './TrendsSection.module.css';

export default function TrendsSection() {
  return (
    <section className={styles.trends}>
      <h2>Популярное в косметологии</h2>
      <div className={styles.trendsGrid}>
        {trends.map((trend, index) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
              delay: index * 0.1,
              duration: 0.5,
              ease: 'easeOut',
            }}
          >
            <Link to={`/trends/${trend.slug}`} key={trend.id} className={styles.trendCard}>
              <img
                src={trend.image}
                alt={trend.title}
                className={styles.trendImage}
              />
              <h3>{trend.title}</h3>
              <p>{trend.shortDescription}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
