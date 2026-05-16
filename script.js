// ========== 1. 深浅色主题切换 ==========
const themeBtn = document.getElementById('themeBtn');
const htmlRoot = document.documentElement;

// 读取本地存储主题
function initTheme() {
  let localTheme = localStorage.getItem('siteTheme') || 'dark';
  htmlRoot.setAttribute('data-theme', localTheme);
  updateThemeIcon(localTheme);
}

function updateThemeIcon(theme) {
  let icon = theme === 'dark' ? 'fa-moon' : 'fa-sun';
  themeBtn.innerHTML = `<i class="fas ${icon}"></i>`;
}

themeBtn.addEventListener('click', () => {
  let nowTheme = htmlRoot.getAttribute('data-theme');
  let newTheme = nowTheme === 'dark' ? 'light' : 'dark';
  htmlRoot.setAttribute('data-theme', newTheme);
  localStorage.setItem('siteTheme', newTheme);
  updateThemeIcon(newTheme);
});

// ========== 2. 实时时钟 ==========
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('timeText').innerText = `${h}:${m}:${s}`;

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
  document.getElementById('dateText').innerText = `${year}-${month}-${day} 星期${week}`;
}
updateClock();
setInterval(updateClock, 1000);

// ========== 3. 粒子背景（自动适配深浅色） ==========
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
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
    // 自动跟随主题变色
    let color = getComputedStyle(document.documentElement).getPropertyValue('--particle-color');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createParticles() {
  for (let i = 0; i < 60; i++) particles.push(new Particle());
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
createParticles();
animateParticles();

// ========== 4. 平滑滚动跳转 ==========
function goSection(id) {
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
}

// ========== 5. 免费天气API 无需密钥 ==========
async function loadWeather() {
  const card = document.getElementById('weatherCard');
  try {
    // 苏州经纬度，自行修改
    let url = "https://api.open-meteo.com/v1/forecast?latitude=31.3&longitude=120.6&current_weather=true&hourly=temperature_2m,relativehumidity_2m&timezone=Asia/Shanghai";
    const res = await fetch(url);
    const data = await res.json();
    const w = data.current_weather;

    const weatherIcon = {
      0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',48:'🌫',
      51:'🌧',61:'🌦',63:'🌧',71:'❄️',80:'🌦'
    };
    let icon = weatherIcon[w.weathercode] || '🌤';

    card.innerHTML = `
      <div class="weather-icon">${icon}</div>
      <div>
        <p>实时温度：${w.temperature} °C</p>
        <p>风速：${w.windspeed} km/h</p>
        <p>空气湿度：${data.hourly.relativehumidity_2m[0]} %</p>
      </div>
    `;
  } catch (e) {
    card.innerHTML = `<p>天气数据加载失败，请稍后重试</p>`;
  }
}

// 初始化全部
window.onload = function(){
  initTheme();
  loadWeather();
}