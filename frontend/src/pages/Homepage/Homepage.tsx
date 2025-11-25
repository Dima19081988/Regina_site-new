import styles from './Homepage.module.css';

export default function Homepage() {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h2>Добро пожаловать!</h2>
                <p>Профессиональный уход за кожей и инъекционные методики в Москве.</p>
            </section>
        </div>
    );
}