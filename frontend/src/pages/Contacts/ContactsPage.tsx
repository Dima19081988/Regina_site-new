import ContactInfo from "./ContactInfo";
import styles from './ContactsPage.module.css';

export default function ContactsPage() {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>Контакты</h1>
            <ContactInfo />
        </div>
    );
}