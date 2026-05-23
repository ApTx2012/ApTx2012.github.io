// 控制台日志样式
function logSuccess(moduleName) {
  console.log(`%c ✅ ${moduleName} 加载成功`, 'color: #2ecc71; font-size: 14px; font-weight: bold;');
}
function logError(moduleName, msg = '未知异常') {
  console.log(`%c ❌ ${moduleName} 加载失败：${msg}`, 'color: #e74c3c; font-size: 14px; font-weight: bold;');
}

function getPerformanceMode() {
  const saved = localStorage.getItem('sitePerformanceMode');
  if (saved === 'low' || saved === 'medium' || saved === 'high') {
    return saved;
  }
  if (window.sitePerformanceMode === 'low' || window.sitePerformanceMode === 'medium' || window.sitePerformanceMode === 'high') {
    return window.sitePerformanceMode;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = navigator.connection || {};
  const saveData = connection.saveData;
  const effectiveType = connection.effectiveType || '';
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;

  if (reducedMotion || saveData || ['slow-2g', '2g'].includes(effectiveType) || memory < 2 || cores < 2) {
    return 'low';
  }
  if (memory >= 8 && cores >= 4 && !['slow-2g', '2g'].includes(effectiveType)) {
    return 'high';
  }
  return 'medium';
}

function getPerformanceLabel(mode) {
  return mode === 'high' ? '高' : mode === 'medium' ? '中' : '低';
}

function getNextPerformanceMode(mode) {
  return mode === 'low' ? 'medium' : mode === 'medium' ? 'high' : 'low';
}

let sitePerformanceMode = getPerformanceMode();
console.log(`%c 🔧 性能模式：${sitePerformanceMode}`, 'color:#3498db; font-size: 13px;');

function updatePerformanceButton() {
  const perfBtn = document.getElementById('perfBtn');
  if (perfBtn) {
    perfBtn.innerText = `性能：${getPerformanceLabel(sitePerformanceMode)}`;
  }
}

function setPerformanceMode(mode) {
  sitePerformanceMode = mode;
  localStorage.setItem('sitePerformanceMode', mode);
  updatePerformanceButton();
  window.location.reload();
}

try{
  const loadBox = document.getElementById('loadingBox');
  if (loadBox) {
    window.addEventListener('load',()=>{
      setTimeout(()=>loadBox.classList.add('hide'),500);
    });
  }
  logSuccess('页面加载动画模块');
}catch(e){
  logError('页面加载动画模块',e.message);
}

(function() {
  const perfBtn = document.getElementById('perfBtn');
  if (perfBtn) {
    updatePerformanceButton();
    perfBtn.addEventListener('click', () => setPerformanceMode(getNextPerformanceMode(sitePerformanceMode)));
  }
})();

try{
  const backTop = document.getElementById('backTop');
  if (backTop) {
    let scrollRAF = null;
    function handleScroll() {
      if (window.scrollY > 300) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    }
    window.addEventListener('scroll', () => {
      if (scrollRAF) return;
      scrollRAF = requestAnimationFrame(() => {
        handleScroll();
        scrollRAF = null;
      });
    }, { passive: true });
    backTop.addEventListener('click',()=>{
      window.scrollTo({top:0,behavior:'smooth'});
    });
  }
  logSuccess('回到顶部模块');
}catch(e){
  logError('回到顶部模块',e.message);
}

// ====================== 1. 主题切换模块 ======================
try {
  const themeBtn = document.getElementById('themeBtn');
  const htmlRoot = document.documentElement;

  function initTheme() {
    const t = localStorage.getItem('siteTheme') || 'dark';
    htmlRoot.setAttribute('data-theme', t);
    if (themeBtn) {
      themeBtn.innerHTML = t === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
  }
  initTheme();
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const now = htmlRoot.getAttribute('data-theme');
      const next = now === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', next);
      localStorage.setItem('siteTheme', next);
      initTheme();
    });
  }
  logSuccess('主题切换模块');
} catch (e) {
  logError('主题切换模块', e.message);
}

// ====================== 2. 实时时钟模块 ======================
try {
  const timeText = document.getElementById('timeText');
  const dateText = document.getElementById('dateText');
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,0);
    const m = String(now.getMinutes()).padStart(2,0);
    const s = String(now.getSeconds()).padStart(2,0);
    if (timeText) timeText.innerText = `${h}:${m}:${s}`;
    const w = ['日','一','二','三','四','五','六'][now.getDay()];
    if (dateText) dateText.innerText = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,0)}-${String(now.getDate()).padStart(2,0)} 星期${w}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
  logSuccess('实时时钟模块');
} catch (e) {
  logError('实时时钟模块', e.message);
}

// ====================== 3. WebGL 装饰背景模块 ======================
try {
  const webglCanvas = document.getElementById('webglCanvas');

  if (!webglCanvas) {
    logError('WebGL 装饰背景模块', '未找到 webglCanvas 元素');
  } else if (sitePerformanceMode !== 'high') {
    webglCanvas.style.display = 'none';
    logSuccess('WebGL 装饰背景模块（非高配跳过）');
  } else {
    const gl = webglCanvas.getContext('webgl');

    if (gl) {
      function resizeWebgl() {
        webglCanvas.width = webglCanvas.clientWidth;
        webglCanvas.height = webglCanvas.clientHeight;
        gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
      }
      resizeWebgl();
      window.addEventListener('resize', resizeWebgl);

      const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;

      const fragmentShaderSource = `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;
        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution - 0.5;
          uv.x *= u_resolution.x / u_resolution.y;
          float r = length(uv);
          float angle = atan(uv.y, uv.x) + u_time * 0.4;
          float wave = 0.5 + 0.5 * cos(angle * 3.0 - u_time * 2.0);
          float glow = 0.05 / (r + 0.02);
          vec3 color = mix(vec3(0.03,0.08,0.18), vec3(0.15,0.35,0.82), wave);
          gl_FragColor = vec4(color + glow * vec3(0.4,0.7,1.0), 1.0);
        }
      `;

      function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error(gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      }

      function createProgram(vs, fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error(gl.getProgramInfoLog(program));
          gl.deleteProgram(program);
          return null;
        }
        return program;
      }

      const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
      const program = createProgram(vertexShader, fragmentShader);

      if (!vertexShader || !fragmentShader || !program) {
        logError('WebGL 装饰背景模块', 'WebGL shader/program 初始化失败');
        return;
      }

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1
      ]), gl.STATIC_DRAW);

      const aPosition = gl.getAttribLocation(program, 'a_position');
      const uTime = gl.getUniformLocation(program, 'u_time');
      const uResolution = gl.getUniformLocation(program, 'u_resolution');

      gl.useProgram(program);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      let startTime = performance.now();
      let webglRAFId = null;
      let webglVisible = true;

      // 页面可见性检测：不可见时暂停渲染
      document.addEventListener('visibilitychange', () => {
        webglVisible = !document.hidden;
        if (webglVisible && webglRAFId === null) {
          webglStartTime = performance.now();
          renderWebgl();
        }
      });

      let webglStartTime = startTime;

      function renderWebgl() {
        if (!webglVisible) {
          webglRAFId = null;
          return;
        }
        const time = (performance.now() - webglStartTime) * 0.001;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTime, time);
        gl.uniform2f(uResolution, webglCanvas.width, webglCanvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        webglRAFId = requestAnimationFrame(renderWebgl);
      }
      renderWebgl();
      logSuccess('WebGL 装饰背景模块');
    } else {
      logError('WebGL 装饰背景模块', '浏览器不支持 WebGL');
    }
  }
} catch (e) {
  logError('WebGL 装饰背景模块', e.message);
}

// ====================== 4. 页面滚动模块 ======================
try {
  window.goSection = function(id) {
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior:'smooth' });
    }
  };
  logSuccess('页面滚动模块');
} catch (e) {
  logError('页面滚动模块', e.message);
}

// ====================== 5. 天气数据模块 ======================
async function loadWeather() {
  try {
    const weatherCard = document.getElementById('weatherCard');
    const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=31.3&longitude=120.6&current_weather=true&hourly=temperature_2m,relativehumidity_2m&timezone=Asia/Shanghai');
    if(!r.ok) throw new Error('接口请求异常');
    const d = await r.json();
    const w = d.current_weather;
    const icon = {0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',61:'🌦'}[w.weathercode]||'🌤';
    if (weatherCard) {
      weatherCard.innerHTML = `
        <div class="weather-icon">${icon}</div>
        <div>
          <p>温度：${w.temperature}°C</p>
          <p>湿度：${d.hourly.relativehumidity_2m[0]}%</p>
        </div>
      `;
    }
    logSuccess('天气数据模块');
  } catch (e) {
    logError('天气数据模块', e.message);
  }
}

// ====================== 6. 背景飞行旋转图片模块 ======================
try {
  const flyingContainer = document.getElementById('flyingImages');
  const allImages = ['img/bg1.jpg','img/bg2.jpg','img/bg3.jpg','img/bg4.jpg','img/bg5.jpg'];
  let flyingItems = [];
  let loadErrCount = 0;
  const imageCount = sitePerformanceMode === 'high' ? 5 : 0;

  if (!flyingContainer) {
    logError('背景飞行图片模块', '未找到 flyingImages 元素');
  } else if (imageCount === 0) {
    flyingContainer.style.display = 'none';
    logSuccess('背景飞行图片模块（低配跳过）');
  } else {
    const selectedImages = allImages.slice(0, imageCount);
    const speedFactor = sitePerformanceMode === 'high' ? 1.2 : 0.7;

    selectedImages.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'flying-img';
      img.style.width = '180px';

      img.onerror = () => {
        loadErrCount++;
        logError('背景图片资源', `${src} 加载失败`);
      };

      const item = {
        el: img,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speedX: (Math.random() - 0.5) * speedFactor,
        speedY: (Math.random() - 0.5) * speedFactor,
        rotate: Math.random() * 360,
        rotateSpeed: (Math.random() - 0.5) * 0.8
      };
      flyingContainer.appendChild(img);
      flyingItems.push(item);
    });

    let flyRAF = null;
    let flyVisible = true;

    document.addEventListener('visibilitychange', () => {
      flyVisible = !document.hidden;
      if (flyVisible && flyRAF === null) {
        flyAnimate();
      }
    });

    function flyAnimate() {
      if (!flyVisible) {
        flyRAF = null;
        return;
      }
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
      flyRAF = requestAnimationFrame(flyAnimate);
    }
    flyAnimate();

    if(loadErrCount === 0) logSuccess('背景飞行图片模块');
    else logError('背景飞行图片模块', `${loadErrCount}张图片缺失/加载失败`);
  }
} catch (e) {
  logError('背景飞行图片模块', e.message);
}

// 网站运行时长模块
const siteLaunchDate = new Date('2024-05-27');

const uptimeText = document.getElementById('uptimeText');
function updateUptime() {
  const now = new Date();
  const diff = now - siteLaunchDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (uptimeText) {
    uptimeText.innerText = `已运行 ${days}天 ${hours}时 ${minutes}分`;
  }
}

updateUptime();
setInterval(updateUptime, 60000); // 每分钟更新
logSuccess('网站运行时长模块');

// ==================== 网易云歌单播放器 ====================
try {
  const musicIframe = document.getElementById('musicIframe');
  const musicBox = document.getElementById('neteaseMusic');
  const musicToggle = document.getElementById('musicToggle');

  // ==================== 在这里填你的 歌单ID ====================
  const PLAYLIST_ID = "9110196326"; // 把这里改成你的歌单ID

  if (musicIframe) {
    musicIframe.src = `https://music.163.com/outchain/player?type=0&id=${PLAYLIST_ID}&auto=1&height=430`;
    musicIframe.onload = () => logSuccess('网易云歌单播放器');
    musicIframe.onerror = () => logError('网易云歌单播放器', '加载失败');
  }

  if (musicToggle && musicBox) {
    let isOpen = true;
    musicToggle.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        musicBox.classList.remove('close');
        musicToggle.innerText = '收起';
      } else {
        musicBox.classList.add('close');
        musicToggle.innerText = '展开';
      }
    });
  }

} catch (err) {
  logError('网易云歌单播放器', err.message);
}

// ====================== 页面总入口 ======================
window.addEventListener('load', () => {
  loadWeather();
  setTimeout(()=>{
    console.log('%c ============== 页面初始化完成 ==============', 'color:#9b59b6;font-weight:bold;');
  },300);
});