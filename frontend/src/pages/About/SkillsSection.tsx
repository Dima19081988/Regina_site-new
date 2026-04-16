import styles from './AboutPage.module.css';

const SKILLS = [
  {
    name: 'Ботулинотерапия',
    experience: '10+ лет',
    description: 'Ботокс, Диспорт, Ксеомин, Лантокс. Коррекция мимических морщин, гипергидроз, бруксизм. Сертифицированный специалист Allergan и Merz.',
  },
  {
    name: 'Контурная пластика',
    experience: '10+ лет',
    description: 'Juvederm, Restylane, Radiesse, Belotero, Surgiderm, HAEQUEO, Glytone. Коррекция губ, скул, носогубных складок, овала лица.',
  },
  {
    name: 'Биоревитализация',
    experience: '10+ лет',
    description: 'Juvederm Hydrate, Restylane Vital, Viscoderm, IAL-system. Глубокое увлажнение и восстановление кожи.',
  },
  {
    name: 'Мезотерапия',
    experience: '10+ лет',
    description: 'Filorga, Meso-Wharton, Meso-Xanthin, Plasmolifting. Коктейли для лица, шеи, декольте и волос.',
  },
  {
    name: 'Химические пилинги',
    experience: '10+ лет',
    description: 'Линейки Enerpeel, Martinex. Поверхностные и срединные пилинги для коррекции акне, постакне, пигментации.',
  },
  {
    name: 'Аппаратная косметология',
    experience: '10+ лет',
    description: 'Лазерная косметология и дерматология. Коррекция сосудистых дефектов, пигментации, фотостарения.',
  },
  {
    name: 'Тредлифтинг',
    experience: '5+ лет',
    description: '3D-мезонити. Безоперационный лифтинг и моделирование овала лица.',
  },
  {
    name: 'Плазмолифтинг',
    experience: '5+ лет',
    description: 'Плазмолифтинг в косметологии и трихологии. Регенерация кожи и лечение выпадения волос.',
  },
];

const MEMBERSHIPS = [
  'Член Московского общества дерматовенерологов и косметологов им. А.И. Поспелова',
];

const SEMINARS = [
  'Академия Эстетической Медицины Allergan — Juvederm ULTRA, Surgiderm, Juvederm VOLUMA, Juvederm VOLBELLA, Ботокс',
  'Академия Эстетики Merz — Belotero, Radiesse, Ксеомин',
  'Компания Ipsen Pharma — Диспорт',
  'Компания Валлекс М — линейка Restylane',
  'Научно-образовательный центр ЭКСПЕРТ — Viscoderm, Enerpeel',
  'Европейская школа контурной пластики — HAEQUEO',
  'Компания М-Сити — Filorga (мезотерапия и биоревитализация)',
  'Компания Plasmolifting — плазмолифтинг в косметологии и трихологии',
  'Компания Beauty Expert — тредлифтинг, 3D-мезонити',
  'Группа компаний Martinex — химические пилинги при акне и постакне',
  'Компания Нике-Мед — Lantox, Aqualyx',
];

export default function SkillsSection() {
 return (
    <>
      <section className={styles.skillsSection}>
        <h2>Навыки и специализации</h2>
        <div className={styles.skillsGrid}>
          {SKILLS.map((skill, index) => (
            <div key={index} className={styles.skillCard}>
              <div className={styles.skillHeader}>
                <h3>{skill.name}</h3>
                <span className={styles.experienceBadge}>{skill.experience}</span>
              </div>
              <p className={styles.skillDescription}>{skill.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.bioSection}>
        <h2>Семинары и тренинги</h2>
        <ul className={styles.seminarsList}>
          {SEMINARS.map((item) => (
            <li> {item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.bioSection}>
        <h2>Членство в профессиональных организациях</h2>
        <ul className={styles.seminarsList}>
          {MEMBERSHIPS.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}