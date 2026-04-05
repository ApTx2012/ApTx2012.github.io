// 导入所有功能模块
import { initWeather } from './js-functions/weather.js';
import { initBilibili } from './js-functions/bilibiliPlayer.js';
import { initMessageBoard } from './js-functions/messageBoard.js';
import { initBlog } from './js-functions/blog.js';
import { initVisitCount, initParticles } from './js-functions/utils.js';

// 页面加载完成后初始化所有功能
window.addEventListener('load', () => {
  try {
    // 初始化鼠标粒子
    initParticles();
    // 初始化明暗切换（默认深色模式）
    initThemeToggle();
    // 初始化访问计数
    initVisitCount();
    // 初始化博客
    initBlog();
    // 初始化苏州天气
    initWeather();
    // 初始化B站播放器
    initBilibili();
    // 初始化留言板
    initMessageBoard();

    console.log('✅ 所有功能加载成功！');
  } catch (error) {
    console.error('❌ 功能加载失败：', error);
  }
});

// 明暗切换功能
function initThemeToggle() {
  const toggleBtn = document.querySelector('.theme-toggle');
  // 读取本地存储的主题模式，无则默认深色
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  // 切换主题
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
  });

  // 暴露全局切换方法（防止按钮点击失效）
  window.toggleTheme = () => {
    document.body.classList.toggle('light-mode');
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
  };
}