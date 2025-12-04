export interface Trend {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  link?: string;
}

export const trends: Trend[] = [
  {
    id: '1',
    slug: 'biorevitalizatsia',
    title: 'Биоревитализация',
    shortDescription: '',
    fullDescription: '',
  },

  {
    id: '2',
    slug: 'fillers',
    title: 'Филлеры',
    shortDescription: '',
    fullDescription: '',
  },

  {
    id: '3',
    slug: 'botulotoksin',
    title: 'Ботулотоксины',
    shortDescription: '',
    fullDescription: '',
  },

  {
    id: '4',
    slug: 'mesoterapia',
    title: 'Мезотерапия',
    shortDescription: '',
    fullDescription: '',
  },
];
