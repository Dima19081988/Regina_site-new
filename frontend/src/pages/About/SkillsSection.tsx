import styles from './AboutPage.module.css';

const SKILLS = [
  { name: 'Ботулинотерапия', experience: '5+ лет', description: 'повышения квалификации, владею методами' },
  { name: 'Контурная пластика', experience: '4+ года', description: 'повышения квалификации, владею методами' },
  { name: 'Биоревитализация', experience: '5+ лет', description: 'повышения квалификации, владею методами' },
  { name: 'Мезотерапия', experience: '4+ года', description: 'повышения квалификации, владею методами' },
  { name: 'Химические пилинги', experience: '3+ года', description: 'повышения квалификации, владею методами' },
  { name: 'Аппаратная косметология', experience: '3+ года', description: 'повышения квалификации, владею методами' }
];

export default function SkillsSection() {
    return (
        <section className={styles.skillsSection}>
            <h2>Навыки и умения</h2>
            <div className={styles.skillsGrid}>
                {SKILLS.map((skill, index) => (
                    <div key={index} className={styles.skillCard}>
                        <div className={styles.skillHeader}>
                            <h3>{skill.name}</h3>
                            <span className={styles.experienceBadge}>{skill.experience}</span>
                        </div>
                        <p className={styles.skillDescription}>
                            {skill.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}