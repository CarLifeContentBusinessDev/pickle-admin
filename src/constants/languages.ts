// 언어 코드, 라벨, 컬럼명 등 국가/언어 관련 공통 상수
export const LANGUAGES = [
  { value: 'ko', label: '한국 (ko)' },
  { value: 'en', label: '북미 (en)' },
  { value: 'de', label: '독일 (de)' },
  { value: 'jp', label: '일본 (jp)' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['value'];

export const LANG_COLUMN_MAP = {
  ko: { title: 'title', img_url: 'img_url' },
  en: { title: 'en_title', img_url: 'en_img_url' },
  de: { title: 'de_title', img_url: 'de_img_url' },
  jp: { title: 'jp_title', img_url: 'jp_img_url' },
} as const;
