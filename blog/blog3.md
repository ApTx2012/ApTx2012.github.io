```markdown
# 常用前端小功能汇总（个人主页必备）
**发布时间**：2026-03-28 | **阅读时长**：4分钟 | **字数**：956字
在搭建个人主页的过程中，我整理了几个常用的前端小功能，这些功能简单实用，而且容易实现，不需要依赖第三方框架，新手也能轻松上手，非常适合用于个人主页、博客等小型网站。今天就来汇总一下这些小功能的实现方法，方便大家参考和使用。

第一个功能：鼠标跟随粒子效果。这个效果能让页面更具动态感，鼠标移动时会生成跟随的小粒子，慢慢消失，视觉效果很好，而且实现起来很简单，用canvas就能完成。核心逻辑是监听鼠标移动事件，每次移动时生成一个粒子对象，包含位置、大小、透明度、速度等属性，然后通过requestAnimationFrame循环渲染粒子，让粒子移动并逐渐消失。

核心代码片段：
```javascript
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];
// 监听鼠标移动事件
window.addEventListener('mousemove', e => {
  particles.push({
    x: e.x, y: e.y,
    size: Math.random() * 2 + 1,
    opacity: 1,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2
  });
});
// 渲染粒子
function renderParticle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.opacity > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.opacity -= 0.02;
    ctx.fillStyle = `rgba(120, 110, 220, ${p.opacity})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(renderParticle);
}
renderParticle();
```

第二个功能：本地存储留言板。这个功能可以让用户提交留言，并且留言会保存在本地（localStorage），刷新页面后留言不会丢失，适合个人主页的互动需求。核心逻辑是获取用户输入的昵称和留言内容，存储到localStorage中，页面加载时读取localStorage中的数据，渲染留言列表。

需要注意的是，localStorage存储的是字符串，所以需要用JSON.stringify()将留言数组转为字符串存储，读取时用JSON.parse()解析。另外，要做表单验证，确保昵称和留言内容不为空，提升用户体验。

第三个功能：访问计数。这个功能可以统计页面的访问次数，同样用localStorage实现，每次页面加载时，读取存储的计数，加1后再存储回去，然后显示在页面上。核心代码很简单：

```javascript
let count = localStorage.getItem('visit_count') || 0;
count = parseInt(count) + 1;
localStorage.setItem('visit_count', count);
document.getElementById('visitCount').innerText = count;
```

第四个功能：B站无登录播放。很多人想在个人主页嵌入B站视频，但不想让用户登录，这时候可以用B站官方的嵌入地址，拼接BV号就能实现无登录播放。核心是获取用户输入的BV号，拼接嵌入地址，插入到页面中即可，不需要额外的JS逻辑，非常简单。

第五个功能：明暗模式切换。这个功能前面提到过，用CSS变量控制样式，点击按钮切换body的类名，实现明暗模式的切换，并且用localStorage保存用户的选择，刷新页面后保持当前模式。

以上这几个小功能，都是个人主页非常实用的功能，而且实现起来都不复杂，不需要依赖第三方框架，新手可以直接套用代码，根据自己的需求调整样式和参数。这些功能不仅能提升个人主页的实用性，还能增强用户体验，让页面更具吸引力。后续我还会整理更多前端小功能，分享给大家。

```

```
