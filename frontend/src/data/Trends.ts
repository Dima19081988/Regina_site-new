export interface Trend {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  link?: string;
  image: string;
}

export const trends: Trend[] = [
  {
    id: '1',
    slug: 'biorevitalizatsia',
    title: 'Биоревитализация',
    shortDescription: '',
    fullDescription: '',
    image: 'https://storage.yandexcloud.net/assets-regina-site/images/trends/biorevitalization.jpg',
  },

  {
    id: '2',
    slug: 'fillers',
    title: 'Контурная пластика',
    shortDescription: '',
    fullDescription: '',
    image: 'https://storage.yandexcloud.net/assets-regina-site/images/trends/fillers.jpg',
  },

  {
    id: '3',
    slug: 'botulotoksin',
    title: 'Ботулотоксины',
    shortDescription: '',
    fullDescription: '',
    image: 'https://storage.yandexcloud.net/assets-regina-site/images/trends/botoks.jpg',
  },

  {
    id: '4',
    slug: 'machine_cosmetology',
    title: 'Аппаратная косметология',
    shortDescription: '',
    fullDescription: '',
    image: 'https://storage.yandexcloud.net/assets-regina-site/images/trends/machines.jpg',
  },
];
