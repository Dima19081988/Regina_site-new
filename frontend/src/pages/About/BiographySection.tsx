import styles from './AboutPage.module.css';

const BIOGRAPHY = [
  {
    period: '2011',
    title: 'Первый МГМУ им. И.М. Сеченова',
    description: 'Окончила университет по специальности «Лечебное дело».',
  },
  {
    period: '2012',
    title: 'Дерматовенерология',
    description: 'Первый МГМУ им. И.М. Сеченова, факультет послевузовского профессионального образования врачей, специальность «Дерматовенерология».',
  },
  {
    period: '2012',
    title: 'Косметология',
    description: 'Российский Университет Дружбы Народов, кафедра эстетической медицины, специальность «Косметология».',
  },
  {
    period: '2009',
    title: 'Медицинский массаж',
    description: 'УМЦ Российской ассоциации по спортивной медицине, специальность «Медицинский массаж».',
  },
  {
    period: '2012',
    title: 'Микроимплантаты в косметологии',
    description: 'РУДН, дополнительный курс «Применение микроимплантатов в косметологии и эстетической медицине».',
  },
  {
    period: '2012',
    title: 'Ботулинотерапия',
    description: 'РУДН, дополнительный курс «Применение препаратов токсина ботулизма в косметологии и эстетической медицине».',
  },
  {
    period: '2013',
    title: 'Лазерная косметология',
    description: 'Государственный научный центр лазерной медицины ФМБА, специализация «Лазерная косметология и дерматология».',
  },
];

export default function BiographySection() {
  return (
    <section className={styles.bioSection}>
      <h2>Образование и квалификация</h2>
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