import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Service } from "../../../types";
import { getServiceBySlug } from "../../../api/servicesApi";
import styles from './ServiceDetailsPage.module.css';

export default function ServiceDetailsPage() {
    const { slug } = useParams<{ slug: string }>();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        const load = async () => {
            try {
                const data = await getServiceBySlug(slug);
                setService(data);
            } catch (error) {
                console.error(error);
                setError('Не удалось загрузить услугу');
            } finally {
                setLoading(false);
            }
        };
        load()
    }, [slug])

    if (loading) return <div className={styles.state}>Загрузка...</div>;
    if (error || !service) return <div className={styles.state}>{error || 'Услуга не найдена'}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.breadcrumbs}>
                <Link to='/services'>← Все услуги</Link>
            </div>

            <div className={styles.layout}>
                {service.image_url && (
                    <div className={styles.imageWrapper}>
                        <img src={service.image_url} alt={service.title} className={styles.image} />
                    </div>
                )}

                <div className={styles.info}>
                    <h1 className={styles.title}>{service.title}</h1>

                    {service.base_price && (
                        <div className={styles.priceBlock}>
                            <div className={styles.priceMain}>
                                от {service.base_price.toLocaleString('ru-RU')} ₽
                            </div>
                            {service.price_note && (
                                <div className={styles.priceNote}>{service.price_note}</div>
                            )}
                        </div>
                    )}

                    {service.long_description && (
                        <div className={styles.description}>
                            {service.long_description.split('\n').map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <a href="/contacts#appointment" className={styles.buttonPrimary}>
                            Записаться на приём
                        </a>
                        <a href="/contacts" className={styles.buttonSecondary}>
                            Задать вопрос
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}