import { LanguagePack } from '../types';

export const ja: LanguagePack = {
  name: '日本語',
  flag: '🇯🇵',
  translations: {
    // ナビゲーション
    nav: {
      home: 'ホーム',
      blog: 'ブログ',
      weather: '天気',
      game: 'ゲーム',
      chemLab: '化学実験室',
      resources: 'リソース',
    },
    
    // ホーム
    home: {
      welcome: 'AxTps 小屋へようこそ',
      title: 'コード、音楽、光が好きな優しい小宇宙',
      subtitle: 'ブログ、天気、音楽のあるパーソナルスペース。',
      greeting: '私の小屋へようこそ。音楽を聴く、天気を確認する、おしゃべりする？',
    },
    
    // タグ
    tags: {
      optimistic: '楽観的',
      gentle: '優しい',
      easygoing: '気さく',
      quickWitted: '機転が利く',
      humorous: 'ユーモラス',
    },
    
    // カード
    cards: {
      blog: {
        title: 'ブログ',
        desc: '準備中',
      },
      weather: {
        title: '天気',
        desc: 'リアルタイム',
      },
      game2048: {
        title: '2048',
        desc: 'ゲーム',
      },
      chemLab: {
        title: '化学実験室',
        desc: 'シミュレーション',
      },
      resources: {
        title: 'リソース',
        desc: '画像ホスティング',
      },
    },
    
    // ボタン
    buttons: {
      go: '移動',
      reset: 'リセット',
      aiPlay: 'AI 自動プレイ',
      stopAi: '停止',
      back: 'ホームに戻る',
    },
    
    // ゲーム
    game: {
      score: 'スコア',
      gameOver: 'ゲームオーバー。リセットを押してください。',
      howToPlay: '方向キー / WASD で操作。',
      aiPlaying: 'AI がプレイ中...',
      aiStopped: '自動プレイ停止。',
      mobileTip: 'モバイルはスワイプ',
    },
    
    // 化学実験室
    chemLab: {
      title: '化学実験室',
      subtitle: '中学化学シミュレーションプラットフォーム',
      expList: '実験リスト',
      gasPrep: '気体調製',
      metalSolution: '金属と溶液',
      burnExplore: '燃焼',
      equipmentLib: '器具',
      reagentLib: '試薬',
      principle: '原理',
      safety: '安全注意',
      equation: '化学方程式',
      operation: '操作',
      gasProduced: '生成気体量',
    },
    
    // フッター
    footer: {
      about: 'について',
      aboutText: 'シンプルな情報と楽しいインタラクションのある温かいパーソナルホームページ。ここで楽しみを見つけられますように。',
    },
    
    // 共通
    common: {
      loading: '読み込み中...',
      error: 'エラー',
      retry: '再試行',
      confirm: '確認',
      cancel: 'キャンセル',
    },
  },
};
