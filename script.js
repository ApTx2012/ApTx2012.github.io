// 修复：简化导入逻辑，避免本地打开跨域/解析错误
// 若后续需要启用对应功能，直接取消注释即可，当前默认保留核心高级效果
// import { initTheme } from './js-functions/theme.js';
// import { initBlog } from './js-functions/blog.js';
// import { initWeather } from './js-functions/weather.js';
// import { initMessageBoard } from './js-functions/messageBoard.js';
import { initParticles } from './js-functions/particles.js';
// import { initVideoPlayer } from './js-functions/videoPlayer.js';

// 修复：新增hideBlogDetail函数（原缺失，导致博客详情页无法关闭）
window.hideBlogDetail = function() {
  const blogDetail = document.getElementById('blogDetail');
  if (blogDetail) {
    blogDetail.style.display = 'none';
  }
}

// 页面加载动画（简化逻辑，避免卡顿）
window.addEventListener('DOMContentLoaded', () => {
  const loading = document.querySelector('.loading');
  // 缩短加载时间，避免误以为页面卡死
  setTimeout(() => {
    loading.style.opacity = 0;
    setTimeout(() => {
      loading.style.display = 'none';
      // 加载完成后，触发文字渐显动画
      initFadeIn();
    }, 300);
  }, 500);

  // 初始化核心高级效果（粒子背景必启用，其他功能可按需启用）
  initTheme();
  initParticles(); // 高级粒子背景（核心效果，已修复）
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
// 实时时钟功能
function updateClock() {
    const now = new Date();
    // 时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('currentTime').innerText = `${hours}:${minutes}:${seconds}`;
    // 日期
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    document.getElementById('currentDate').innerText = `${year}年${month}月${day}日`;
}
updateClock(); // 初始化
setInterval(updateClock, 1000); // 每秒更新