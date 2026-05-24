import { LanguagePack } from '../types';

export const zh: LanguagePack = {
  name: '简体中文',
  flag: '🇨🇳',
  translations: {
    // 导航
    nav: {
      home: '首页',
      blog: '博客',
      weather: '天气',
      game: '游戏',
      chemLab: '化学实验室',
      resources: '资源站',
    },
    
    // 主页
    home: {
      welcome: '欢迎来到 AxTps 小屋',
      title: '这里是喜欢代码、音乐与光影的温柔小宇宙',
      subtitle: '一个既有博客小屋，又有天气与音乐氛围的个人空间。',
      greeting: '欢迎来到我的小屋，今天你想听歌、看天气，还是聊点故事？',
    },
    
    // 个人标签
    tags: {
      optimistic: '乐观开朗',
      gentle: '温柔体贴',
      easygoing: '随和亲切',
      quickWitted: '才思敏捷',
      humorous: '风趣幽默',
    },
    
    // 功能卡片
    cards: {
      blog: {
        title: '博客',
        desc: '即将上线',
      },
      weather: {
        title: '天气',
        desc: '实时查询',
      },
      game2048: {
        title: '2048',
        desc: '游戏',
      },
      chemLab: {
        title: '化学实验室',
        desc: '仿真实验',
      },
      resources: {
        title: '资源站',
        desc: '图床 / 资源收藏',
      },
    },
    
    // 按钮
    buttons: {
      go: '前往',
      reset: '重置游戏',
      aiPlay: 'AI 自动玩',
      stopAi: '停止 AI',
      back: '返回主页',
    },
    
    // 游戏
    game: {
      score: '得分',
      gameOver: '游戏结束，按重置继续。',
      howToPlay: '使用方向键 / WASD 控制。',
      aiPlaying: 'AI 正在游戏中...',
      aiStopped: '已停止自动玩。',
      mobileTip: '手机可滑动屏幕',
    },
    
    // 化学实验室
    chemLab: {
      title: '化学实验室',
      subtitle: '初中化学仿真实验平台',
      expList: '实验列表',
      gasPrep: '气体制备',
      metalSolution: '金属与溶液',
      burnExplore: '燃烧与探究',
      equipmentLib: '器材库',
      reagentLib: '试剂库',
      principle: '实验原理',
      safety: '安全提示',
      equation: '化学方程式',
      operation: '实验操作',
      gasProduced: '产气量',
    },
    
    // 页脚
    footer: {
      about: '关于',
      aboutText: '这是一个以温暖氛围为主的个人主页，既有简洁信息，也有轻松互动。愿你在这里找到一点好心情。',
    },
    
    // 通用
    common: {
      loading: '加载中...',
      error: '出错了',
      retry: '重试',
      confirm: '确定',
      cancel: '取消',
    },
  },
};
