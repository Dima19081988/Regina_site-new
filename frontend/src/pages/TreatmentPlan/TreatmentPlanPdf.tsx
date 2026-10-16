import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';

Font.register({
  family: 'PlanOpenSans',
  fonts: [
    {
      src: `${import.meta.env.BASE_URL}fonts/OpenSans-Regular.ttf`,
      fontWeight: 400,
      fontStyle: 'normal',
    },
    {
      src: `${import.meta.env.BASE_URL}fonts/OpenSans-Bold.ttf`,
      fontWeight: 700,
      fontStyle: 'normal',
    },
  ],
});

export type TreatmentPlanPdfData = {
  date: string;
  recommendations: string;
  specialist: string;
  contacts: string;
  items: Array<{
    id: string;
    procedure: string;
    preparation: string;
    count: string;
    interval: string;
    intervalUnit: 'days' | 'weeks';
    zone: string;
  }>;
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'PlanOpenSans',
    fontSize: 11,
    lineHeight: 1.5,
    paddingTop: 65,
    paddingBottom: 65,
    paddingHorizontal: 65,
    color: '#332a24',
  },
  frame: {
    position: 'absolute',
    top: 42,
    left: 42,
    width: 511,
    height: 758,
    borderWidth: 1,
    borderColor: '#b99880',
  },
  header: {
    textAlign: 'center',
    paddingBottom: 18,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ded1c4',
  },
  brand: {
    fontSize: 24,
    letterSpacing: 5,
    color: '#8c6952',
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 8,
  },
  date: {
    fontSize: 10,
  },
  item: {
    marginBottom: 16,
  },
  itemTitle: {
    fontWeight: 700,
    marginBottom: 5,
  },
  line: {
    marginLeft: 16,
    marginBottom: 3,
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: 6,
  },
  recommendations: {
    marginTop: 6,
    marginBottom: 18,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ded1c4',
    fontSize: 9,
  },
  footerLine: {
    marginBottom: 4,
  },
});

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

export default function TreatmentPlanPdf({
  data,
}: {
  data: TreatmentPlanPdfData;
}) {
  return (
    <Document
      title="Индивидуальный план процедур"
      author="Regina"
      language="ru-RU"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.frame} fixed />

        <View style={styles.header} wrap={false}>
          <Text style={styles.brand}>REGINA</Text>
          <Text style={styles.title}>
            Индивидуальный план процедур
          </Text>
          <Text style={styles.date}>
            Дата составления: {formatDate(data.date)}
          </Text>
        </View>

        {data.items.map((item, index) => {
          const count = Number(item.count);
          const interval = Number(item.interval);

          const intervalLabel =
            item.intervalUnit === 'days'
              ? plural(interval, 'день', 'дня', 'дней')
              : plural(interval, 'неделя', 'недели', 'недель');

          return (
            <View key={item.id} style={styles.item} wrap={false}>
              <Text style={styles.itemTitle}>
                {index + 1}. {item.procedure.trim()}
              </Text>

              {item.preparation.trim() && (
                <Text style={styles.line}>
                  Препарат: {item.preparation.trim()}
                </Text>
              )}

              {item.zone.trim() && (
                <Text style={styles.line}>
                  Зона проведения: {item.zone.trim()}
                </Text>
              )}

              <Text style={styles.line}>
                Курс: {count}{' '}
                {plural(count, 'процедура', 'процедуры', 'процедур')}.
              </Text>

              {count > 1 && (
                <Text style={styles.line}>
                  Интервал между процедурами: {interval}{' '}
                  {intervalLabel}.
                </Text>
              )}
            </View>
          );
        })}

        {data.recommendations.trim() && (
          <View style={styles.recommendations}>
            <Text style={styles.sectionTitle} minPresenceAhead={30}>
              Дополнительные рекомендации
            </Text>
            <Text>{data.recommendations.trim()}</Text>
          </View>
        )}

        <View style={styles.footer} wrap={false}>
          <Text style={styles.footerLine}>
            План может корректироваться специалистом по результатам
            осмотра и реакции на процедуры.
          </Text>

          {data.specialist.trim() && (
            <Text style={styles.footerLine}>
              Специалист: {data.specialist.trim()}
            </Text>
          )}

          {data.contacts.trim() && (
            <Text style={styles.footerLine}>
              Контакты для записи: {data.contacts.trim()}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}