import { priceListData } from "../../data/PriceList";
import styles from './PriceList.module.css';


export default function PriceList() {
    return (
        <section className={styles.priceList}>
            <h2>Прайслист</h2>
            {priceListData.map((category) =>(
                <div key={category.id} className={styles.pricelistCategory}>
                    <h3>{category.title}</h3>
                    <table className={styles.pricelistTable}>
                        <thead>
                            <tr>
                                <th scope="col">Наименование</th>
                                <th scope="col">Объем</th>
                                <th scope="col">Стоимость, ₽</th>
                            </tr>
                        </thead>
                        <tbody>
                            {category.services.map((service) => (
                                <tr key={service.id}>
                                    <td>{service.name}</td>
                                    <td>{service.volume}</td>
                                    <td>{service.price.toLocaleString('ru-RU')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </section>
    );
}