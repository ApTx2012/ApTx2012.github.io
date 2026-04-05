// 初始化博客列表（可自行添加更多博客）
export function initBlog() {
  const blogList = document.getElementById('blogList');
  if (!blogList) return;

  // 模拟博客数据（可替换为真实博客内容）
  const blogs = [
    {
      title: '我的个人主页搭建记录',
      time: '2026-04-05',
      readingTime: '3',
      wordCount: '800',
      desc: '记录个人主页从0到1的搭建过程，融合磨砂玻璃风格、明暗切换、各类功能模块，打造属于自己的酷炫主页。'
    },
    {
      title: '前端磨砂玻璃效果实现技巧',
      time: '2026-04-01',
      readingTime: '5',
      wordCount: '1200',
      desc: '分享磨砂玻璃（毛玻璃）效果的CSS实现方法，适配明暗模式，兼容不同浏览器，让页面更具高级感。'
    },
    {
      title: '常用前端小功能汇总',
      time: '2026-03-28',
      readingTime: '4',
      wordCount: '950',
      desc: '汇总个人主页中用到的前端小功能：鼠标粒子、明暗切换、本地存储、B站无登录播放等，附详细实现代码。'
    }
  ];

  // 渲染博客列表
  blogList.innerHTML = blogs.map(blog => `
    <div class="blog-card">
      <h3>${blog.title}</h3>
      <div class="blog-meta">
        <span>发布时间：${blog.time}</span>
        <span>阅读时长：${blog.readingTime}分钟</span>
        <span>字数：${blog.wordCount}字</span>
      </div>
      <div class="blog-desc">${blog.desc}</div>
    </div>
  `).join('');

  // 博客卡片点击事件（可扩展为跳转到博客详情页）
  const blogCards = document.querySelectorAll('.blog-card');
  blogCards.forEach(card => {
    card.addEventListener('click', () => {
      alert('点击进入博客详情页（可自行扩展详情页逻辑）');
    });
  });
}