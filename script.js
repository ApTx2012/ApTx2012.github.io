// 主题切换
const themeBtn = document.getElementById('themeBtn');
const htmlRoot = document.documentElement;

function initTheme() {
  const t = localStorage.getItem('siteTheme') || 'dark';
  htmlRoot.setAttribute('data-theme', t);
  themeBtn.innerHTML = t === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}
themeBtn.addEventListener('click', () => {
  const now = htmlRoot.getAttribute('data-theme');
  const next = now === 'dark' ? 'light' : 'dark';
  htmlRoot.setAttribute('data-theme', next);
  localStorage.setItem('siteTheme', next);
  initTheme();
});

// 时钟
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,0);
  const m = String(now.getMinutes()).padStart(2,0);
  const s = String(now.getSeconds()).padStart(2,0);
  document.getElementById('timeText').innerText = `${h}:${m}:${s}`;
  const w = ['日','一','二','三','四','五','六'][now.getDay()];
  document.getElementById('dateText').innerText = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,0)}-${String(now.getDate()).padStart(2,0)} 星期${w}`;
}
updateClock();
setInterval(updateClock, 1000);

// 粒子
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
const particles = Array.from({length:60},()=>new Particle());
function animParticle() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{p.update();p.draw();});
  requestAnimationFrame(animParticle);
}
animParticle();

// 滚动
function goSection(id) {
  document.querySelector(id).scrollIntoView({ behavior:'smooth' });
}

// 天气
async function loadWeather() {
  try {
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=31.3&longitude=120.6&current_weather=true&hourly=temperature_2m,relativehumidity_2m&timezone=Asia/Shanghai');
    const d = await r.json();
    const w = d.current_weather;
    const icon = {0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',61:'🌦'}[w.weathercode]||'🌤';
    document.getElementById('weatherCard').innerHTML = `
      <div class="weather-icon">${icon}</div>
      <div>
        <p>温度：${w.temperature}°C</p>
        <p>湿度：${d.hourly.relativehumidity_2m[0]}%</p>
      </div>
    `;
  } catch(e){}
}

// ==============================================
// 🔥 真正能飞、能旋转、绝对可见的背景图片
// ==============================================
const flyingContainer = document.getElementById('flyingImages');

// 本地图片
const images = [
  'img/bg1.jpg',
  'img/bg2.jpg',
  'img/bg3.jpg',
  'img/bg4.jpg',
  'img/bg5.jpg'
];

const flyingItems = [];

// 创建图片
images.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.className = 'flying-img';
  img.style.width = '180px';
  
  const item = {
    el: img,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    speedX: (Math.random() - 0.5) * 1.2,
    speedY: (Math.random() - 0.5) * 1.2,
    rotate: Math.random() * 360,
    rotateSpeed: (Math.random() - 0.5) * 0.8
  };
  
  flyingContainer.appendChild(img);
  flyingItems.push(item);
});

// 动画循环
function flyAnimate() {
  flyingItems.forEach(item => {
    item.x += item.speedX;
    item.y += item.speedY;
    item.rotate += item.rotateSpeed;

    // 出界重置
    if (item.x < -200) item.x = window.innerWidth + 100;
    if (item.x > window.innerWidth + 200) item.x = -100;
    if (item.y < -200) item.y = window.innerHeight + 100;
    if (item.y > window.innerHeight + 200) item.y = -100;

    item.el.style.left = item.x + 'px';
    item.el.style.top = item.y + 'px';
    item.el.style.transform = `rotate(${item.rotate}deg)`;
  });
  requestAnimationFrame(flyAnimate);
}
flyAnimate();

// 启动
window.onload = () => {
  initTheme();
  loadWeather();
};