// 导入所有功能模块
import { initTheme } from './js-functions/theme.js';
import { initBlog } from './js-functions/blog.js';
import { initWeather } from './js-functions/weather.js';
import { initMessageBoard } from './js-functions/messageBoard.js';
import { initParticles } from './js-functions/particles.js';
import { initVideoPlayer } from './js-functions/videoPlayer.js';

// 页面加载动画
window.addEventListener('DOMContentLoaded', () => {
  const loading = document.querySelector('.loading');
  // 模拟加载（实际可根据接口加载情况调整）
  setTimeout(() => {
    loading.style.opacity = 0;
    setTimeout(() => {
      loading.style.display = 'none';
      // 加载完成后，触发文字渐显动画
      initFadeIn();
    }, 500);
  }, 800);

  // 初始化所有功能
  initTheme();
  initParticles(); // 高级粒子背景
  initBlog();
  initWeather();
  initMessageBoard();
  initVideoPlayer();

  // 初始化导航锚点跳转（平滑滚动，高级交互）
  initNavAnchor();
});

// 文字渐显动画（页面加载后触发）
function initFadeIn() {
  const fadeElements = document.querySelectorAll('.profile-card, .feature-card, .blog-card, .section-title');
  fadeElements.forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.animationDelay = `${index * 0.1}s`;
  });
}

// 导航锚点平滑滚动（高级交互）
function initNavAnchor() {
  const navLinks = document.querySelectorAll('.nav-item a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // 适配导航栏高度
          behavior: 'smooth'
        });
      }
    });
  });
}
