export interface Category {
  id: number;
  title: string;
  img_url: string;
  order: number;
  created_at: string;
  language: string[];
  en_title?: string;
  en_img_url?: string;
  de_title?: string;
  de_img_url?: string;
  jp_title?: string;
  jp_img_url?: string;
}

export interface Broadcasting {
  id: number;
  title: string;
  channel: string;
  frequency: string;
  img_url: string;
  order: number;
  created_at: string;
  language: string[];
}
