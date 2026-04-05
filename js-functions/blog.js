// 引入marked.js（CDN方式，解析MD语法，无需本地下载）
if (!window.marked) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  script.onload = initBlog;
  document.head.appendChild(script);
} else {
  initBlog();
}

// 初始化博客列表+MD博客接入（读取本地MD文件，适配主页）
export function initBlog() {
  const blogList = document.getElementById('blogList');
  const blogDetail = document.getElementById('blogDetail');
  const blogDetailContent = document.getElementById('blogDetailContent');
  if (!blogList || !blogDetail || !blogDetailContent || !window.marked) return;

  // 1. 博客列表数据（与3个MD文件一一对应，配置MD文件路径）
  const blogs = [
    {
      title: '我的个人主页搭建记录',
      time: '2026-04-05',
      readingTime: '3',
      wordCount: '826',
      desc: '记录个人主页从0到1的搭建过程，融合磨砂玻璃风格、明暗切换、各类功能模块，打造属于自己的酷炫主页。',
      mdPath: './blog/blog1.md' // MD文件路径（根目录/blog/对应文件）
    },
    {
      title: '前端磨砂玻璃效果实现技巧',
      time: '2026-04-01',
      readingTime: '5',
      wordCount: '1238',
      desc: '分享磨砂玻璃（毛玻璃）效果的CSS实现方法，适配明暗模式，兼容不同浏览器，让页面更具高级感。',
      mdPath: './blog/blog2.md'
    },
    {
      title: '常用前端小功能汇总（个人主页必备）',
      time: '2026-03-28',
      readingTime: '4',
      wordCount: '956',
      desc: '汇总个人主页中用到的前端小功能：鼠标粒子、明暗切换、本地存储、B站无登录播放等，附详细实现代码。',
      mdPath: './blog/blog3.md'
    }
  ];

  // 2. 渲染博客列表（原有样式不变，与主页适配）
  blogList.innerHTML = blogs.map((blog, index) => `
    ${blog.title}发布时间：${blog.time}阅读时长：${blog.readingTime}分钟字数：${blog.wordCount}字${blog.desc}
  `).join('');

  // 3. 加载MD博客详情（点击卡片调用，解析MD并渲染）
  window.loadBlogDetail = async (index) => {
    const blog = blogs[index];
    if (!blog) return;

    try {
      // 读取MD文件内容
      const response = await fetch(blog.mdPath);
      if (!response.ok) throw new Error('MD文件加载失败');
      const mdContent = await response.text();

      // 用marked解析MD为HTML，渲染到详情页
      const htmlContent = marked.parse(mdContent);
      blogDetailContent.innerHTML = htmlContent;

      // 显示详情页，隐藏列表（与原有页面逻辑一致）
      blogDetail.style.display = 'block';
      document.getElementById('blogList').style.display = 'none';
    } catch (error) {
      blogDetailContent.innerHTML = `博客加载失败，请刷新页面重试！`;
      blogDetail.style.display = 'block';
    }
  };

  // 4. 返回博客列表（与主页原有返回按钮绑定）
  window.hideBlogDetail = () => {
    blogDetail.style.display = 'none';
    document.getElementById('blogList').style.display = 'flex';
    blogDetailContent.innerHTML = ''; // 清空详情页内容
  };
}

// 暴露hideBlogDetail方法，供主页返回按钮调用
window.hideBlogDetail = () => {
  const blogDetail = document.getElementById('blogDetail');
  const blogList = document.getElementById('blogList');
  if (blogDetail && blogList) {
    blogDetail.style.display = 'none';
    blogList.style.display = 'flex';
    document.getElementById('blogDetailContent').innerHTML = '';
  }
};