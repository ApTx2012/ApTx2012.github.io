// 鼠标跟随粒子效果
export function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 窗口大小变化时重置画布
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let particles = [];
  window.addEventListener('mousemove', e => {
    particles.push({
      x: e.x, y: e.y,
      size: Math.random() * 2 + 1,
      opacity: 1,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    });
  });

  function renderParticle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.opacity > 0);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.opacity -= 0.02;
      // 适配明暗模式，粒子颜色变化
      const isLight = document.body.classList.contains('light-mode');
      const color = isLight ? 'rgba(90, 80, 200, ' : 'rgba(120, 110, 220, ';
      ctx.fillStyle = color + p.opacity + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(renderParticle);
  }
  renderParticle();
}

// 访问计数功能（本地存储，持久化）
export function initVisitCount() {
  let count = localStorage.getItem('visit_count') || 0;
  count = parseInt(count) + 1;
  localStorage.setItem('visit_count', count);
  // 显示在底部版权处
  const countElem = document.getElementById('visitCount');
  if (countElem) {
    countElem.innerText = count;
  }
}