import PriceList from '../../../components/PriceList/PriceList';

export default function AdminPricePage() {
  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text)' }}>Прайслист</h1>
      <PriceList />
      {/* Позже сюда добавить: */}
      {/* <button className="add-button">Редактировать прайс</button> */}
    </div>
  );
}
