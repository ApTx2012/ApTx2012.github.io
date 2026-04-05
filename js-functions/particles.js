// 修复：简化粒子效果代码，解决canvas初始化失败问题
// 高级粒子背景（聚合消散效果，非简单跟随，兼容所有浏览器）
export function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  // 修复：避免窗口未完全加载时获取尺寸异常
  let canvasWidth = window.innerWidth || document.documentElement.clientWidth;
  let canvasHeight = window.innerHeight || document.documentElement.clientHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 粒子配置（优化参数，避免性能卡顿）
  const particleCount = 50; // 减少粒子数量，避免卡顿
  const particles = [];
  let mouse = { x: null, y: null, radius: 120 }; // 缩小鼠标影响范围，提升性能

  // 监听鼠标移动（粒子跟随+聚合）
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  // 监听窗口 resize，适配粒子尺寸（修复重复初始化问题）
  window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth || document.documentElement.clientWidth;
    canvasHeight = window.innerHeight || document.documentElement.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // 修复：避免重复调用initParticles，直接重置粒子
    resetParticles();
  });

  // 粒子类（简化属性，提升兼容性）
  class Particle {
    constructor() {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.size = Math.random() * 3 + 1; // 粒子大小随机
      this.speedX = Math.random() * 0.4 - 0.2; // 降低速度，避免杂乱
      this.speedY = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.2;
      // 修复：兼容getComputedStyle异常，新增默认颜色
      this.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color') || '#7c3aed';
    }

    // 更新粒子位置（跟随鼠标+边界反弹）
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // 边界反弹（简化逻辑）
      if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1;
      if (this.y < 0 || this.y > canvasHeight) this.speedY *= -1;

      // 鼠标影响（简化计算，提升性能）
      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          this.x += dx / 25;
          this.y += dy / 25;
        }
      }
    }

    // 绘制粒子（简化渐变，避免渲染异常）
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      // 简化渐变，避免部分浏览器不兼容
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.closePath();
    }
  }

  // 初始化粒子
  function init() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // 重置粒子（修复窗口resize时异常）
  function resetParticles() {
    init();
  }

  // 渲染粒子（简化循环，提升性能）
  function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  // 粒子连接线（简化逻辑，避免渲染卡顿）
  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 70) {
          ctx.beginPath();
          ctx.strokeStyle = `${this.color}${Math.floor((1 - distance / 70) * 20)}`;
          ctx.lineWidth = (1 - distance / 70) * 0.4;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }

  // 启动粒子效果
  init();
  animate();
}
