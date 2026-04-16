import type { Article } from '../../types';
import { biorevitalizaciyaArticles } from './biorevitalizaciya';
import { konturnyaPlastikaArticles } from './konturnaya-plastika';
import { botulotoksinyArticles } from './botulotoksiny';
import { apparatnayaArticles } from './apparatnaya';
import { mezoterapiyaArticles } from './mezoterapiya';
import { himicheskiePilingiArticles } from './himicheskie-pilingi';
import { placentoterapiyaArticles } from './placentoterapiya';

export const ARTICLES: Record<string, Article[]> = {
  'Биоревитализация': biorevitalizaciyaArticles,
  'Контурная пластика': konturnyaPlastikaArticles,
  'Ботулотоксины': botulotoksinyArticles,
  'Аппаратная косметология': apparatnayaArticles,
  'Мезотерапия': mezoterapiyaArticles,
  'Химические пилинги': himicheskiePilingiArticles,
  'Плацентотерапия': placentoterapiyaArticles,
  'Дефолт': [
    {
      title: 'Полезные советы по уходу за кожей',
      teaser: 'Базовый уход, который работает — очищение, увлажнение, защита от солнца.',
      slug: 'care-tips',
      content: `Правильный уход за кожей — основа красоты.

Очищение: дважды в день, мягкими средствами без SLS.
Увлажнение: на слегка влажную кожу, текстура по типу кожи.
SPF 30–50: каждый день, даже зимой.
Профессиональные процедуры: 1–2 раза в месяц.`,
    },
  ],
};