// 多语言系统 - 编译后的 JavaScript 版本

class LanguageManager {
  constructor() {
    this.currentLang = 'zh';
    this.config = {
      zh: {
        name: '简体中文',
        flag: '🇨🇳',
        translations: {
          nav: { home: '首页', blog: '博客', weather: '天气', game: '游戏', chemLab: '化学实验室', resources: '资源站' },
          home: {
            welcome: '欢迎来到 AxTps 小屋',
            title: '这里是喜欢代码、音乐与光影的温柔小宇宙',
            subtitle: '一个既有博客小屋，又有天气与音乐氛围的个人空间。',
            greeting: '欢迎来到我的小屋，今天你想听歌、看天气，还是聊点故事？',
          },
          tags: { optimistic: '乐观开朗', gentle: '温柔体贴', easygoing: '随和亲切', quickWitted: '才思敏捷', humorous: '风趣幽默' },
          cards: {
            blog: { title: '博客', desc: '即将上线' },
            weather: { title: '天气', desc: '实时查询' },
            game2048: { title: '2048', desc: '游戏' },
            resources: { title: '资源站', desc: '图床 / 资源收藏' },
          },
          buttons: { go: '前往', reset: '重置游戏', aiPlay: 'AI 自动玩', stopAi: '停止 AI', back: '返回主页' },
          game: { score: '得分', gameOver: '游戏结束，按重置继续。', howToPlay: '使用方向键 / WASD 控制。', aiPlaying: 'AI 正在游戏中...', aiStopped: '已停止自动玩。', mobileTip: '手机可滑动屏幕' },
          chemLab: { title: '化学实验室', subtitle: '初中化学仿真实验平台', expList: '实验列表', gasPrep: '气体制备', metalSolution: '金属与溶液', burnExplore: '燃烧与探究', equipmentLib: '器材库', reagentLib: '试剂库', principle: '实验原理', safety: '安全提示', equation: '化学方程式', operation: '实验操作', gasProduced: '产气量' },
          footer: { about: '关于', aboutText: '这是一个以温暖氛围为主的个人主页，既有简洁信息，也有轻松互动。愿你在这里找到一点好心情。' },
          common: { loading: '加载中...', error: '出错了', retry: '重试', confirm: '确定', cancel: '取消' },
        },
      },
      en: {
        name: 'English',
        flag: '🇺🇸',
        translations: {
          nav: { home: 'Home', blog: 'Blog', weather: 'Weather', game: 'Game', chemLab: 'Chemistry Lab', resources: 'Resources' },
          home: {
            welcome: "Welcome to AxTps' Hut",
            title: 'A gentle universe of code, music, and light',
            subtitle: 'A personal space with blog, weather, and music atmosphere.',
            greeting: 'Welcome to my hut. Would you like to listen to music, check the weather, or chat?',
          },
          tags: { optimistic: 'Optimistic', gentle: 'Gentle', easygoing: 'Easygoing', quickWitted: 'Quick-witted', humorous: 'Humorous' },
          cards: {
            blog: { title: 'Blog', desc: 'Coming Soon' },
            weather: { title: 'Weather', desc: 'Real-time' },
            game2048: { title: '2048', desc: 'Game' },
            resources: { title: 'Resources', desc: 'Image Hosting' },
          },
          buttons: { go: 'Go', reset: 'Reset Game', aiPlay: 'AI Auto Play', stopAi: 'Stop AI', back: 'Back to Home' },
          game: { score: 'Score', gameOver: 'Game Over. Press reset to continue.', howToPlay: 'Use arrow keys / WASD to play.', aiPlaying: 'AI is playing...', aiStopped: 'Auto play stopped.', mobileTip: 'Swipe on mobile' },
          chemLab: { title: 'Chemistry Lab', subtitle: 'Middle School Chemistry Simulation', expList: 'Experiments', gasPrep: 'Gas Preparation', metalSolution: 'Metal & Solution', burnExplore: 'Combustion', equipmentLib: 'Equipment', reagentLib: 'Reagents', principle: 'Principle', safety: 'Safety Tips', equation: 'Chemical Equation', operation: 'Operations', gasProduced: 'Gas Produced' },
          footer: { about: 'About', aboutText: 'A warm personal homepage with simple info and fun interactions. Hope you find some joy here.' },
          common: { loading: 'Loading...', error: 'Error', retry: 'Retry', confirm: 'Confirm', cancel: 'Cancel' },
        },
      },
      ja: {
        name: '日本語',
        flag: '🇯🇵',
        translations: {
          nav: { home: 'ホーム', blog: 'ブログ', weather: '天気', game: 'ゲーム', chemLab: '化学実験室', resources: 'リソース' },
          home: {
            welcome: 'AxTps 小屋へようこそ',
            title: 'コード、音楽、光が好きな優しい小宇宙',
            subtitle: 'ブログ、天気、音楽のあるパーソナルスペース。',
            greeting: '私の小屋へようこそ。音楽を聴く、天気を確認する、おしゃべりする？',
          },
          tags: { optimistic: '楽観的', gentle: '優しい', easygoing: '気さく', quickWitted: '機転が利く', humorous: 'ユーモラス' },
          cards: {
            blog: { title: 'ブログ', desc: '準備中' },
            weather: { title: '天気', desc: 'リアルタイム' },
            game2048: { title: '2048', desc: 'ゲーム' },
            resources: { title: 'リソース', desc: '画像ホスティング' },
          },
          buttons: { go: '移動', reset: 'リセット', aiPlay: 'AI 自動プレイ', stopAi: '停止', back: 'ホームに戻る' },
          game: { score: 'スコア', gameOver: 'ゲームオーバー。リセットを押してください。', howToPlay: '方向キー / WASD で操作。', aiPlaying: 'AI がプレイ中...', aiStopped: '自動プレイ停止。', mobileTip: 'モバイルはスワイプ' },
          chemLab: { title: '化学実験室', subtitle: '中学化学シミュレーションプラットフォーム', expList: '実験リスト', gasPrep: '気体調製', metalSolution: '金属と溶液', burnExplore: '燃焼', equipmentLib: '器具', reagentLib: '試薬', principle: '原理', safety: '安全注意', equation: '化学方程式', operation: '操作', gasProduced: '生成気体量' },
          footer: { about: 'について', aboutText: 'シンプルな情報と楽しいインタラクションのある温かいパーソナルホームページ。ここで楽しみを見つけられますように。' },
          common: { loading: '読み込み中...', error: 'エラー', retry: '再試行', confirm: '確認', cancel: 'キャンセル' },
        },
      },
    };
    this.listeners = new Set();

    const saved = localStorage.getItem('site-language');
    if (saved && this.config[saved]) {
      this.currentLang = saved;
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('zh')) this.currentLang = 'zh';
      else if (browserLang.startsWith('ja')) this.currentLang = 'ja';
      else this.currentLang = 'en';
    }
  }

  getCurrentLang() {
    return this.currentLang;
  }

  getAvailableLangs() {
    return Object.entries(this.config).map(([code, pack]) => ({ code, name: pack.name, flag: pack.flag }));
  }

  setLanguage(lang) {
    if (this.config[lang]) {
      this.currentLang = lang;
      localStorage.setItem('site-language', lang);
      this.notifyListeners();
    }
  }

  t(key) {
    const keys = key.split('.');
    let value = this.config[this.currentLang].translations;
    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = value[k];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }

  initPageTranslation() {
    this.translatePage();
    this.createLanguageSwitcher();
  }

  translatePage() {
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

  createLanguageSwitcher() {
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

    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.parentNode?.insertBefore(switcher, themeBtn.nextSibling);
    } else {
      document.body.appendChild(switcher);
    }

    const btn = switcher.querySelector('#lang-btn');
    const dropdown = switcher.querySelector('#lang-dropdown');

    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown?.classList.toggle('show');
    });

    switcher.querySelectorAll('.lang-option').forEach((option) => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        this.setLanguage(lang);
        this.updateSwitcherUI();
        dropdown?.classList.remove('show');
      });
    });

    document.addEventListener('click', () => {
      dropdown?.classList.remove('show');
    });
  }

  updateSwitcherUI() {
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

export const i18n = new LanguageManager();
export const t = (key) => i18n.t(key);
