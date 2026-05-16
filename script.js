// 控制台日志样式
function logSuccess(moduleName) {
  console.log(`%c ✅ ${moduleName} 加载成功`, 'color: #2ecc71; font-size: 14px; font-weight: bold;');
}
function logError(moduleName, msg = '未知异常') {
  console.log(`%c ❌ ${moduleName} 加载失败：${msg}`, 'color: #e74c3c; font-size: 14px; font-weight: bold;');
}

// ====================== 1. 主题切换模块 ======================
try {
  const themeBtn = document.getElementById('themeBtn');
  const htmlRoot = document.documentElement;

  function initTheme() {
    const t = localStorage.getItem('siteTheme') || 'dark';
    htmlRoot.setAttribute('data-theme', t);
    themeBtn.innerHTML = t === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  }
  initTheme();
  themeBtn.addEventListener('click', () => {
    const now = htmlRoot.getAttribute('data-theme');
    const next = now === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', next);
    localStorage.setItem('siteTheme', next);
    initTheme();
  });
  logSuccess('主题切换模块');
} catch (e) {
  logError('主题切换模块', e.message);
}

// ====================== 2. 实时时钟模块 ======================
try {
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
  logSuccess('实时时钟模块');
} catch (e) {
  logError('实时时钟模块', e.message);
}

// ====================== 3. 粒子背景模块 ======================
try {
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
  logSuccess('粒子背景模块');
} catch (e) {
  logError('粒子背景模块', e.message);
}

// ====================== 4. 页面滚动模块 ======================
try {
  function goSection(id) {
    document.querySelector(id).scrollIntoView({ behavior:'smooth' });
  }
  logSuccess('页面滚动模块');
} catch (e) {
  logError('页面滚动模块', e.message);
}

// ====================== 5. 天气数据模块 ======================
async function loadWeather() {
  try {
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=31.3&longitude=120.6&current_weather=true&hourly=temperature_2m,relativehumidity_2m&timezone=Asia/Shanghai');
    if(!r.ok) throw new Error('接口请求异常');
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
    logSuccess('天气数据模块');
  } catch (e) {
    logError('天气数据模块', e.message);
  }
}

// ====================== 6. 背景飞行旋转图片模块 ======================
try {
  const flyingContainer = document.getElementById('flyingImages');
  const images = ['img/bg1.jpg','img/bg2.jpg','img/bg3.jpg','img/bg4.jpg','img/bg5.jpg'];
  const flyingItems = [];
  let loadErrCount = 0;

  images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'flying-img';
    img.style.width = '180px';

    // 单张图片加载失败监听
    img.onerror = () => {
      loadErrCount++;
      logError('背景图片资源', `${src} 加载失败`);
    };
    
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

  function flyAnimate() {
    flyingItems.forEach(item => {
      item.x += item.speedX;
      item.y += item.speedY;
      item.rotate += item.rotateSpeed;
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

  if(loadErrCount === 0) logSuccess('背景飞行图片模块');
  else logError('背景飞行图片模块', `${loadErrCount}张图片缺失/加载失败`);
} catch (e) {
  logError('背景飞行图片模块', e.message);
}

// 网站运行时长模块
const siteLaunchDate = new Date('2024-05-27');

function updateUptime() {
  const now = new Date();
  const diff = now - siteLaunchDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  document.getElementById('uptimeText').innerText = `已运行 ${days}天 ${hours}时 ${minutes}分`;
}

updateUptime();
setInterval(updateUptime, 60000); // 每分钟更新
logSuccess('网站运行时长模块');

// ====================== 页面总入口 ======================
window.onload = () => {
  loadWeather();
  setTimeout(()=>{
    console.log('%c ============== 页面初始化完成 ==============', 'color:#9b59b6;font-weight:bold;');
  },300);
};