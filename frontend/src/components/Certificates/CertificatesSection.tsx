import { useState } from "react";
import { CERTIFICATES_CATEGORIES } from "../../data/Certificates";
import styles from './CertificatesSection.module.css';

export default function CertificatesSection() {
    const [selectedCertIndex, setSelectedCertIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState(0);

    const allCertificates = CERTIFICATES_CATEGORIES.flatMap(cat => cat.certificates);

    const currentCategory = CERTIFICATES_CATEGORIES[activeCategory];
    const currentCategoryIndex = CERTIFICATES_CATEGORIES.findIndex(cat => cat.category === currentCategory.category);

    const handleCertClick = (certIndex: number) => {
        setSelectedCertIndex(currentCategoryIndex * 100 + certIndex);
    };

    const closeModal = () => setSelectedCertIndex(null);

    return (
        <section className={styles.certificatesSection}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>🏆 Сертификаты по направлениям</h2>
                <div className={styles.categoryTabs}>
                    {CERTIFICATES_CATEGORIES.map((category, index) => (
                        <button
                            key={category.category}
                            className={`${styles.tab} ${activeCategory === index ? styles.activeTab : ''}`}
                            onClick={() => setActiveCategory(index)}
                        >
                            {category.category} ({category.certificates.length})
                        </button>
                    ))}
                </div>

                <div className={styles.certificatesGrid}>
                    {currentCategory.certificates.map((cert, certIndex) => (
                        <div
                            key={cert.id}
                            className={styles.certCard}
                            onClick={() => handleCertClick(certIndex)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleCertClick(certIndex);
                                }
                            }}
                        >
                            <div className={styles.certImageWrapper}>
                                <img 
                                    src={cert.image}
                                    alt={`${cert.title} сертификат`}
                                    className={styles.certImage}
                                    loading="lazy"
                                />
                                <div className={styles.certOverlay}>
                                    <span className={styles.viewPdf}>📄 PDF</span>
                                </div>
                            </div>
                            <div className={styles.certInfo}>
                                <h3>{cert.title}</h3>
                                <div className={styles.certMeta}>
                                    <span>{cert.year}</span>
                                    <span>{cert.issuer}</span>
                                </div>
                            </div>            
                        </div>
                    ))}
                </div>

                {/* PDF Viewer модалка */}
                {selectedCertIndex !== null && (
                    <div className={styles.pdfModal} onClick={closeModal}>
                        <div className={styles.pdfViewer} onClick={(e) => e.stopPropagation()}>
                            <button
                                className={styles.closeModal}
                                onClick={closeModal}
                                aria-label="Закрыть просмотр сертификата"
                            >
                                ×
                            </button>

                            <iframe
                                src={allCertificates[selectedCertIndex]?.pdfUrl || ''}
                                className={styles.pdfIframe}
                                title={`Сертификат ${allCertificates[selectedCertIndex]?.title}`}
                                loading="lazy"
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}