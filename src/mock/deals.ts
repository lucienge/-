export type DealTag = '限時' | '熱銷' | '早鳥' | '免簽' | '保證出團';

export interface DealItem {
  id: string;
  title: string;
  image: string;
  price: number;
  destination: string;
  days: string;
  tags: DealTag[];
}

export interface HeroBanner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

export interface PromoTile {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
}

export interface SearchHistoryItem {
  id: string;
  keyword: string;
  period: string;
  price?: string;
}

export interface HotLimitedItem {
  id: string;
  image: string;
  title: string;
  originPrice: number;
  salePrice: number;
  endAt: string;
}

const scenic = (seed: number) =>
  `https://picsum.photos/seed/travel-${seed}/900/600`;

export const filterChips = [
  { key: 'home', label: '首頁' },
  { key: 'expo', label: '線上旅展', isNew: true },
  { key: 'theme', label: '活動主題' },
  { key: 'coupon', label: '折價券' },
];

export const heroBanners: HeroBanner[] = [
  {
    id: 'hero-1',
    image: scenic(1),
    title: '早鳥享優惠 ✈︎',
    subtitle: '歐洲賞楓中｜兩人同行最高折 8,000',
    cta: '立即搶購',
  },
  {
    id: 'hero-2',
    image: scenic(2),
    title: '東京自由行 4 日',
    subtitle: '含機加酒、迪士尼門票加購',
    cta: '看更多行程',
  },
  {
    id: 'hero-3',
    image: scenic(3),
    title: '北海道滑雪季',
    subtitle: '入住星野度假村｜纜車券超值配',
    cta: '了解方案',
  },
];

export const quickMenus = [
  { id: 'group', label: '團體旅遊', icon: '🧳' },
  { id: 'fit', label: '自由行', icon: '🗺️' },
  { id: 'flight', label: '機票', icon: '✈️' },
  { id: 'hotel', label: '訂房', icon: '🏨' },
];

export const promoTiles: PromoTile[] = [
  { id: 'promo-1', image: scenic(11), title: '東北賞楓之旅', subtitle: '指定日期第二人折 3,000' },
  { id: 'promo-2', image: scenic(12), title: '海島度假專區' },
  { id: 'promo-3', image: scenic(13), title: '小資自由行' },
  { id: 'promo-4', image: scenic(14), title: '親子樂園假期' },
  { id: 'promo-5', image: scenic(15), title: '歐洲經典 10 日' },
];

export const continueSearchItems: SearchHistoryItem[] = [
  { id: 'history-1', keyword: '九州溫泉 5 天', period: '11 月出發', price: 'NT$29,900 起' },
  { id: 'history-2', keyword: '沖繩親子自由行', period: '寒假限定', price: 'NT$19,900 起' },
  { id: 'history-3', keyword: '首爾追雪 4 天', period: '跨年檔期' },
  { id: 'history-4', keyword: '埃及古文明 10 天', period: '春節保證出團', price: 'NT$89,900 起' },
];

export const hotLimitedItems: HotLimitedItem[] = [
  {
    id: 'hot-1',
    image: scenic(21),
    title: '德奧童話城堡 9 日',
    originPrice: 39900,
    salePrice: 29900,
    endAt: '2026-12-31T23:59:59+08:00',
  },
  {
    id: 'hot-2',
    image: scenic(22),
    title: '北海道雪國列車 6 日',
    originPrice: 36900,
    salePrice: 28900,
    endAt: '2026-12-25T23:59:59+08:00',
  },
  {
    id: 'hot-3',
    image: scenic(23),
    title: '峇里島五星度假 5 日',
    originPrice: 32900,
    salePrice: 25900,
    endAt: '2026-12-20T23:59:59+08:00',
  },
];

const baseDeals: DealItem[] = [
  {
    id: 'deal-1',
    title: '富士山河口湖・溫泉美景 5 日',
    image: scenic(31),
    price: 29900,
    destination: '日本',
    days: '5 天 4 夜',
    tags: ['熱銷', '早鳥'],
  },
  {
    id: 'deal-2',
    title: '法瑞雙國・少女峰鐵道 10 日',
    image: scenic(32),
    price: 89900,
    destination: '歐洲',
    days: '10 天 8 夜',
    tags: ['限時', '保證出團'],
  },
  {
    id: 'deal-3',
    title: '土耳其熱氣球・番紅花城 8 日',
    image: scenic(33),
    price: 52900,
    destination: '中東',
    days: '8 天 7 夜',
    tags: ['免簽', '熱銷'],
  },
  {
    id: 'deal-4',
    title: '埃及金字塔・尼羅河遊輪 9 日',
    image: scenic(34),
    price: 69900,
    destination: '非洲',
    days: '9 天 7 夜',
    tags: ['限時'],
  },
  {
    id: 'deal-5',
    title: '首爾滑雪・樂天世界 5 日',
    image: scenic(35),
    price: 26900,
    destination: '韓國',
    days: '5 天 4 夜',
    tags: ['早鳥'],
  },
  {
    id: 'deal-6',
    title: '曼谷芭達雅・海灘渡假 6 日',
    image: scenic(36),
    price: 23900,
    destination: '泰國',
    days: '6 天 5 夜',
    tags: ['熱銷'],
  },
];

export const generateDealsPage = (page: number, size = 6): DealItem[] =>
  Array.from({ length: size }, (_, index) => {
    const source = baseDeals[index % baseDeals.length];
    const idSuffix = `${page}-${index + 1}`;
    return {
      ...source,
      id: `${source.id}-${idSuffix}`,
      image: scenic(31 + page * 10 + index),
      title: `${source.title}・${page + 1} 月精選`,
    };
  });
