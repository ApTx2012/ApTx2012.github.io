// 高级粒子背景（聚合消散效果，非简单跟随）
export function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 粒子配置（高级参数，控制效果）
  const particleCount = 80;
  const particles = [];
  let mouse = { x: null, y: null, radius: 150 }; // 鼠标影响范围

  // 监听鼠标移动（粒子跟随+聚合）
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  // 监听窗口 resize，适配粒子尺寸
  window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    initParticles(); // 重新初始化粒子
  });

  // 粒子类（高级属性：速度、大小、透明度、聚合倾向）
  class Particle {
    constructor() {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.size = Math.random() * 3 + 1; // 粒子大小随机
      this.speedX = Math.random() * 0.5 - 0.25; // 水平速度
      this.speedY = Math.random() * 0.5 - 0.25; // 垂直速度
      this.opacity = Math.random() * 0.5 + 0.2; // 透明度随机
      this.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    }

    // 更新粒子位置（跟随鼠标+边界反弹）
    update() {
      // 粒子自然移动
      this.x += this.speedX;
      this.y += this.speedY;

      // 边界反弹
      if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1;
      if (this.y < 0 || this.y > canvasHeight) this.speedY *= -1;

      // 鼠标影响（粒子向鼠标聚合）
      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          // 向鼠标方向移动，距离越近速度越快
          this.x += dx / 20;
          this.y += dy / 20;
        }
      }
    }

    // 绘制粒子（圆形+渐变）
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      // 粒子渐变效果
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.closePath();
    }
  }

  // 初始化粒子
  function init() {
    particles.length = 0; // 清空原有粒子
    for (let i = 0; i< particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // 渲染粒子（循环更新+绘制）
  function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    // 粒子之间绘制连接线（高级效果，增强层次感）
    connectParticles();
    requestAnimationFrame(animate);
  }

  // 粒子连接线（距离近的粒子之间显示细线）
  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // 距离小于80时，绘制连接线
        if (distance < 80) {
          ctx.beginPath();
          ctx.strokeStyle = `${particles[a].color}${Math.floor((1 - distance / 80) * 20)}`; // 距离越近线越粗
          ctx.lineWidth = (1 - distance / 80) * 0.5;
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
