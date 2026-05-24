// 多语言系统类型定义

export type Language = 'zh' | 'en' | 'ja';

export interface Translations {
  [key: string]: string | Translations;
}

export interface LanguagePack {
  name: string;
  flag: string;
  translations: Translations;
}

export type LanguageConfig = {
  [K in Language]: LanguagePack;
};
