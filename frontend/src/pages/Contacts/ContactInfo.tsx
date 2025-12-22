import styles from './ContactsPage.module.css';

const CONTACTS = {
    phone: '+7 985 232 29 54',
    whatsapp: '+7 985 232 29 54',
    telegram: '',
    address: [
        'ООО Пластика С, Королёв, ул.Строителей, д.4',
        'Королёв, ул.Пионерская, д.30',
        'Москва, ул.Чичерина, д.12',
        'Москва, ул.Садовническая, д.5',
    ],
    schedule: [
        'Пн–Пт: 10:00–21:00',
        'Сб: 10:00–18:00',
    ]
};

export default function ContactInfo() {
    return (
        <section className={styles.contactSection}>
            <div className={styles.contactGrid}>
                <div className={styles.contactColumn}>
                    <h2>Связаться со мной</h2>
                    <div className={styles.contactItem}>
                        <div className={styles.icon}>📞</div>
                        <div>
                            <h3>Телефон</h3>
                            <a href={`tel:${CONTACTS.phone.replace(/\D/g, '')}`}>{CONTACTS.phone}</a>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <div className={styles.icon}>💬</div>
                        <div>
                            <h3>WhatsApp / Telegram</h3>
                            <a href={`https://wa.me/${CONTACTS.whatsapp.replace(/\D/g, '')}`} target="_blank">
                                {CONTACTS.whatsapp}
                            </a>
                            <br />
                            <a href={`https://t.me/${CONTACTS.telegram}`} target="_blank">
                                @{CONTACTS.telegram}
                            </a>
                        </div>
                    </div>
                </div>
                <div className={styles.contactColumn}>
                    <h2>Информация</h2>
                    <div className={styles.contactItem}>
                        <div className={styles.icon}>📍</div>
                        <div>
                            <h3>Адрес</h3>
                            {CONTACTS.address.map((address, index) => (
                                <p key={index}>{address}</p>
                            ))}
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <div className={styles.icon}>🕒</div>
                        <div>
                            <h3>Время работы</h3>
                            {CONTACTS.schedule.map((time, index) => (
                                <p key={index}>{time}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}