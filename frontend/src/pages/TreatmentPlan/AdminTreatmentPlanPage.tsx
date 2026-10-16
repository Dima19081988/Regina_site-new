import { useState } from 'react';
import styles from './AdminTreatmentPlanPage.module.css';
import './TreatmentPlan.print.css';

type PlanItem = {
  id: string;
  procedure: string;
  preparation: string;
  count: string;
  interval: string;
  intervalUnit: 'days' | 'weeks';
  zone: string;
};

function createItem(): PlanItem {
  return {
    id: crypto.randomUUID(),
    procedure: '',
    preparation: '',
    count: '',
    interval: '',
    intervalUnit: 'weeks',
    zone: '',
  };
}

function plural(
  value: number,
  one: string,
  few: string,
  many: string
): string {
  const lastTwo = value % 100;
  const lastOne = value % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (lastOne === 1) return one;
  if (lastOne >= 2 && lastOne <= 4) return few;

  return many;
}

function formatDate(value: string): string {
  const [year, month, day] = value.split('-');
  return `${day}.${month}.${year}`;
}

function getToday(): string {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export default function AdminTreatmentPlanPage() {
    const [items, setItems] = useState<PlanItem[]>(() => [createItem()]);
    const [date, setDate] = useState(getToday);
    const [recommendations, setRecommendations] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [contacts, setContacts] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [pdfError, setPdfError] = useState(''); 

    function updateItem(
        id: string,
        field: keyof Omit<PlanItem, 'id' | 'intervalUnit'>,
        value: string
    ) {
        setItems((current) => 
            current.map((item) => 
                item.id === id ? {...item, [field]: value } : item
            )
        )
        setShowPreview(false);
    }

    function updateUnit(id: string, value: PlanItem['intervalUnit']) {
        setItems((current) =>
        current.map((item) =>
            item.id === id ? { ...item, intervalUnit: value } : item
        )
        );
        setShowPreview(false);
    }

    function removeItem(id: string) {
        setItems((current) => current.filter((item) => item.id !== id));
        setShowPreview(false);
    }

      function resetForm() {
        if (!window.confirm('Очистить план? Введённые данные будут удалены.')) {
        return;
        }

        setItems([createItem()]);
        setDate(getToday());
        setRecommendations('');
        setSpecialist('');
        setContacts('');
        setShowPreview(false);
    }
  async function downloadPdf() {
    if (pdfLoading) return;

    setPdfLoading(true);
    setPdfError('');

    const data = {
      date,
      items: items.map((item) => ({ ...item })),
      recommendations,
      specialist,
      contacts,
    };

    let objectUrl: string | undefined;

    try {
      const [{ pdf }, { default: TreatmentPlanPdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./TreatmentPlanPdf'),
      ]);

      const blob = await pdf(
        <TreatmentPlanPdf data={data} />
      ).toBlob();

      objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `Regina-plan-${data.date}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Ошибка формирования PDF:', error);
      setPdfError(
        'Не удалось сформировать PDF. Проверьте наличие файлов шрифтов.'
      );
    } finally {
      if (objectUrl) {
        const url = objectUrl;
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }

      setPdfLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <p className={styles.notice}>
        Не указывайте ФИО, телефон пациента, диагноз или сведения об
        анамнезе. План не сохраняется на сервере. После обновления
        страницы введённые данные исчезнут.
      </p>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          setShowPreview(true);
        }}
        onChange={() => setShowPreview(false)}
      >
        <label className={styles.field}>
          Дата составления
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

        {items.map((item, index) => (
          <fieldset key={item.id} className={styles.item}>
            <legend>Процедура {index + 1}</legend>

            <div className={styles.grid}>
              <label className={styles.field}>
                Наименование процедуры
                <input
                  value={item.procedure}
                  onChange={(event) =>
                    updateItem(item.id, 'procedure', event.target.value)
                  }
                  placeholder="Например, биоревитализация"
                  maxLength={160}
                  pattern=".*\S.*"
                  title="Введите название процедуры"
                  required
                />
              </label>

              <label className={styles.field}>
                Препарат — необязательно
                <input
                  value={item.preparation}
                  onChange={(event) =>
                    updateItem(item.id, 'preparation', event.target.value)
                  }
                  maxLength={160}
                />
              </label>

              <label className={styles.field}>
                Количество процедур
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={item.count}
                  onChange={(event) =>
                    updateItem(item.id, 'count', event.target.value)
                  }
                  required
                />
              </label>

              <label className={styles.field}>
                Зона проведения — необязательно
                <input
                  value={item.zone}
                  onChange={(event) =>
                    updateItem(item.id, 'zone', event.target.value)
                  }
                  maxLength={120}
                />
              </label>

              {Number(item.count) > 1 && (
                <>
                  <label className={styles.field}>
                    Интервал между процедурами
                    <input
                      type="number"
                      min="1"
                      max="365"
                      step="1"
                      value={item.interval}
                      onChange={(event) =>
                        updateItem(item.id, 'interval', event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    Единица интервала
                    <select
                      value={item.intervalUnit}
                      onChange={(event) =>
                        updateUnit(
                          item.id,
                          event.target.value === 'days' ? 'days' : 'weeks'
                        )
                      }
                    >
                      <option value="days">Дни</option>
                      <option value="weeks">Недели</option>
                    </select>
                  </label>
                </>
              )}
            </div>

            {items.length > 1 && (
              <button
                type="button"
                className={styles.secondary}
                onClick={() => removeItem(item.id)}
              >
                Удалить процедуру
              </button>
            )}
          </fieldset>
        ))}

        <button
          type="button"
          className={styles.secondary}
          onClick={() => {
            setItems((current) => [...current, createItem()]);
            setShowPreview(false);
          }}
        >
          + Добавить процедуру
        </button>

        <label className={styles.field}>
          Дополнительные рекомендации — необязательно
          <textarea
            rows={4}
            value={recommendations}
            onChange={(event) => setRecommendations(event.target.value)}
            maxLength={2000}
          />
        </label>

        <div className={styles.grid}>
          <label className={styles.field}>
            Специалист — необязательно
            <input
              value={specialist}
              onChange={(event) => setSpecialist(event.target.value)}
              maxLength={120}
            />
          </label>

          <label className={styles.field}>
            Контакты специалиста для записи — необязательно
            <input
              value={contacts}
              onChange={(event) => setContacts(event.target.value)}
              maxLength={200}
            />
          </label>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.primary}>
            Сформировать предпросмотр
          </button>

          <button
            type="button"
            className={styles.secondary}
            onClick={resetForm}
          >
            Очистить форму
          </button>
        </div>
      </form>

      {showPreview && (
        <section className={styles.previewSection}>
          <div className={styles.previewToolbar}>
            <h2>Предпросмотр</h2>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => window.print()}
              >
                Печать
              </button>

              <button
                type="button"
                className={styles.primary}
                onClick={downloadPdf}
                disabled={pdfLoading}
                aria-busy={pdfLoading}
              >
                {pdfLoading ? 'Формируем PDF…' : 'Скачать PDF'}
              </button>
            </div>
          </div>

          {pdfError && (
            <p className={styles.error} role="alert">
              {pdfError}
            </p>
          )}
          
          <article id="treatment-plan-document" className={styles.document}>
            <header className={styles.documentHeader}>
              <div className={styles.brand}>REGINA</div>
              <h2>Индивидуальный план процедур</h2>
              <p>Дата составления: {formatDate(date)}</p>
            </header>

            <ol className={styles.planList}>
              {items.map((item) => {
                const count = Number(item.count);
                const interval = Number(item.interval);

                const intervalLabel =
                  item.intervalUnit === 'days'
                    ? plural(interval, 'день', 'дня', 'дней')
                    : plural(interval, 'неделя', 'недели', 'недель');

                return (
                  <li key={item.id}>
                    <h3>{item.procedure.trim()}</h3>

                    {item.preparation.trim() && (
                      <p>Препарат: {item.preparation.trim()}</p>
                    )}

                    {item.zone.trim() && (
                      <p>Зона проведения: {item.zone.trim()}</p>
                    )}

                    <p>
                      Курс: {count}{' '}
                      {plural(count, 'процедура', 'процедуры', 'процедур')}.
                    </p>

                    {count > 1 && (
                      <p>
                        Интервал между процедурами: {interval}{' '}
                        {intervalLabel}.
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>

            {recommendations.trim() && (
              <section className={styles.recommendations}>
                <h3>Дополнительные рекомендации</h3>
                <p>{recommendations.trim()}</p>
              </section>
            )}

            <footer className={styles.documentFooter}>
              <p>
                План может корректироваться специалистом по результатам
                осмотра и реакции на процедуры.
              </p>

              {specialist.trim() && (
                <p>Специалист: {specialist.trim()}</p>
              )}

              {contacts.trim() && (
                <p>Контакты для записи: {contacts.trim()}</p>
              )}
            </footer>
          </article>
        </section>
      )}
    </div>
  );
}
