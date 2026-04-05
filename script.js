// 页面加载完成提示
console.log("✅ 蓝色个人网站（含博客）加载成功！");

// 平滑滚动（原有，适配博客页面跳转）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// 博客卡片 hover 动画增强（新增）
const blogCards = document.querySelectorAll('.blog-card');
blogCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px)';
    card.style.boxShadow = '0 5px 15px rgba(22, 93, 255, 0.12)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 2px 8px rgba(22, 93, 255, 0.08)';
  });
});

// 页面加载淡入效果（新增，提升体验）
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  let opacity = 0;
  const fadeIn = setInterval(() => {
    if (opacity >= 1) {
      clearInterval(fadeIn);
    }
    document.body.style.opacity = opacity;
    opacity += 0.1;
  }, 50);
});

// 导航栏滚动效果（新增）
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 12px rgba(22, 93, 255, 0.15)';
    navbar.style.background = 'var(--white)';
  } else {
    navbar.style.boxShadow = '0 2px 10px rgba(22, 93, 255, 0.1)';
    navbar.style.background = 'var(--white)';
  }
});
// -------------------------- 新增JS功能与小游戏调用 --------------------------
// 导入新增的JS功能和小游戏（确保所有导入路径正确，与文件实际位置一致）
import { calculateReadingTime, initCopyCode, initVisitCount, countBlogWords } from './js-functions/utils.js';
import { initGuessNumberGame } from './js-functions/mini-game.js';
import { initMessageBoard } from './js-functions/messageBoard.js'; // 新增留言板导入

// 页面加载完成后，初始化所有功能（包裹所有逻辑，避免全局作用域冲突）
window.addEventListener('load', () => {
    try {
        // 1. 初始化访问次数统计
        initVisitCount();

        // 2. 初始化代码块复制功能
        initCopyCode();

        // 3. 初始化博客阅读时长+字数统计（适配所有博客详情页，新增字数统计）
        const blogContent = document.querySelector('.blog-detail-content');
        if (blogContent) {
            const contentText = blogContent.innerText;
            const readingTime = calculateReadingTime(contentText);
            const wordCount = countBlogWords(contentText); // 新增字数统计
            const readingTimeElem = document.querySelector('.blog-detail-meta span:last-child');
            if (readingTimeElem) {
                // 显示阅读时长+字数，格式：阅读时长：X.X分钟 | 字数：XXX字
                readingTimeElem.innerText = `阅读时长：${readingTime}分钟 | 字数：${wordCount}字`;
            }
        }

        // 4. 初始化猜数字小游戏（主页显示入口）
        initGuessNumberGame();

        // 5. 初始化留言板功能（新增，主页显示）
        initMessageBoard();

        console.log("✅ 所有JS功能与小游戏加载成功！");
    } catch (error) {
        console.error("❌ 功能加载失败：", error);
    }
});
// -------------------------- JS功能与小游戏调用结束 --------------------------

// 补充：防止部分浏览器不支持module类型，添加降级提示（可选，提升兼容性）
if (typeof importScripts === 'function') {
    console.warn("当前环境可能不支持ES6模块，建议使用现代浏览器（Chrome、Edge、Firefox等）访问");
}