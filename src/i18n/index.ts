import { Language, LanguageConfig, Translations } from './types';
import { zh } from './locales/zh';
import { en } from './locales/en';
import { ja } from './locales/ja';

class LanguageManager {
  private currentLang: Language = 'zh';
  private config: LanguageConfig = { zh, en, ja };
  private listeners: Set<() => void> = new Set();

  constructor() {
    // 从 localStorage 读取保存的语言设置
    const saved = localStorage.getItem('site-language') as Language;
    if (saved && this.config[saved]) {
      this.currentLang = saved;
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('zh')) {
        this.currentLang = 'zh';
      } else if (browserLang.startsWith('ja')) {
        this.currentLang = 'ja';
      } else {
        this.currentLang = 'en';
      }
    }
  }

  // 获取当前语言
  getCurrentLang(): Language {
    return this.currentLang;
  }

  // 获取所有可用语言
  getAvailableLangs(): { code: Language; name: string; flag: string }[] {
    return Object.entries(this.config).map(([code, pack]) => ({
      code: code as Language,
      name: pack.name,
      flag: pack.flag,
    }));
  }

  // 切换语言
  setLanguage(lang: Language): void {
    if (this.config[lang]) {
      this.currentLang = lang;
      localStorage.setItem('site-language', lang);
      this.notifyListeners();
    }
  }

  // 获取翻译文本
  t(key: string): string {
    const keys = key.split('.');
    let value: Translations | string = this.config[this.currentLang].translations;

    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = value[k];
      } else {
        return key; // 找不到翻译，返回 key
      }
    }

    return typeof value === 'string' ? value : key;
  }

  // 订阅语言变化
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // 通知所有订阅者
  private notifyListeners(): void {
    this.listeners.forEach((cb) => cb());
  }

  // 初始化页面翻译
  initPageTranslation(): void {
    this.translatePage();
    this.createLanguageSwitcher();
  }

  // 翻译页面元素
  private translatePage(): void {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const translation = this.t(key);
        if (el.hasAttribute('placeholder')) {
          el.setAttribute('placeholder', translation);
        } else {
          el.textContent = translation;
        }
      }
    });
  }

  // 创建语言切换器
  private createLanguageSwitcher(): void {
    // 检查是否已存在
    if (document.getElementById('lang-switcher')) return;

    const switcher = document.createElement('div');
    switcher.id = 'lang-switcher';
    switcher.className = 'lang-switcher';
    switcher.innerHTML = `
      <button class="lang-btn" id="lang-btn">
        <span class="lang-flag">${this.config[this.currentLang].flag}</span>
        <span class="lang-name">${this.config[this.currentLang].name}</span>
      </button>
      <div class="lang-dropdown" id="lang-dropdown">
        ${this.getAvailableLangs()
          .map(
            (lang) => `
          <div class="lang-option" data-lang="${lang.code}">
            <span class="lang-flag">${lang.flag}</span>
            <span class="lang-name">${lang.name}</span>
          </div>
        `
          )
          .join('')}
      </div>
    `;

    // 添加到页面（放在主题切换按钮旁边）
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.parentNode?.insertBefore(switcher, themeBtn.nextSibling);
    } else {
      document.body.appendChild(switcher);
    }

    // 绑定事件
    const btn = switcher.querySelector('#lang-btn');
    const dropdown = switcher.querySelector('#lang-dropdown');

    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown?.classList.toggle('show');
    });

    // 语言选项点击
    switcher.querySelectorAll('.lang-option').forEach((option) => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang') as Language;
        this.setLanguage(lang);
        this.updateSwitcherUI();
        dropdown?.classList.remove('show');
      });
    });

    // 点击外部关闭
    document.addEventListener('click', () => {
      dropdown?.classList.remove('show');
    });
  }

  // 更新切换器 UI
  private updateSwitcherUI(): void {
    const btn = document.querySelector('#lang-btn');
    if (btn) {
      const flag = btn.querySelector('.lang-flag');
      const name = btn.querySelector('.lang-name');
      if (flag) flag.textContent = this.config[this.currentLang].flag;
      if (name) name.textContent = this.config[this.currentLang].name;
    }
    this.translatePage();
  }
}

// 导出单例
export const i18n = new LanguageManager();

// 辅助函数
export const t = (key: string): string => i18n.t(key);
