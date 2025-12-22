import BiographySection from './BiographySection';
import SkillsSection from './SkillsSection';
import CertificatesSection from '../../components/Certificates/CertificatesSection';
import styles from './AboutPage.module.css';

export default function AboutPage() {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>О себе</h1>
            <BiographySection />
            <SkillsSection />
            <CertificatesSection />
        </div>
    )
}
