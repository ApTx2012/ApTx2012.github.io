import init, { Game, AI } from "../wasm-2048/pkg/wasm_2048.js";

const tileClass = (value) => {
  if (value === 0) return "tile-empty";
  if (value <= 8) return `tile-${value}`;
  if (value <= 64) return "tile-32";
  if (value <= 256) return "tile-128";
  if (value <= 1024) return "tile-256";
  return "tile-512";
};

const keyMap = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
  a: "left",
  d: "right",
  w: "up",
  s: "down",
  A: "left",
  D: "right",
  W: "up",
  S: "down",
};

let game;
let ai;
let boardEl;
let scoreEl;
let statusEl;
let tileEls = [];
let autoPlayInterval = null;

// ===== 秘技代码检测 =====
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowLeft", "ArrowRight", "ArrowRight", "b", "a", "b", "a"];
let konamiIndex = 0;
let konamiTriggered = false;
let confettiInterval = null;

function triggerKonamiCelebration() {
  if (konamiTriggered) return;
  konamiTriggered = true;

  // 创建彩色方块庆祝动画
  const colors = ["#d678ff", "#82d9ff", "#ffd8f8", "#ff6b6b", "#4ecdc4", "#ffe66d"];
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;overflow:hidden;";
  document.body.appendChild(container);

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 12 + 6;
    const x = Math.random() * window.innerWidth;
    const delay = Math.random() * 2;
    confetti.style.cssText = `
      position:absolute;
      left:${x}px;
      top:-20px;
      width:${size}px;
      height:${size}px;
      background:${color};
      border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      animation: confettiFall ${2 + Math.random() * 2}s ease-out ${delay}s forwards;
    `;
    container.appendChild(confetti);
  }

  // 添加动画关键帧
  if (!document.getElementById("konami-style")) {
    const style = document.createElement("style");
    style.id = "konami-style";
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // 显示提示文字
  const msg = document.createElement("div");
  msg.style.cssText = `
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    font-size:48px;
    font-weight:bold;
    color:#d678ff;
    text-shadow:0 0 20px #d678ff, 0 0 40px #82d9ff;
    z-index:100000;
    animation: konamiPulse 0.5s ease-in-out infinite alternate;
    font-family:sans-serif;
  `;
  msg.textContent = "🎮 秘技成功！🎮";
  document.body.appendChild(msg);

  // 触发胜利
  if (game) {
    game.win_game();
    renderBoard();
  }

  // 3秒后移除庆祝效果
  setTimeout(() => {
    container.remove();
    msg.remove();
    konamiTriggered = false;
  }, 5000);
}

function checkKonami(key) {
  if (konamiTriggered) return;
  if (KONAMI[konamiIndex] === key) {
    konamiIndex++;
    if (konamiIndex === KONAMI.length) {
      konamiIndex = 0;
      triggerKonamiCelebration();
    }
  } else {
    konamiIndex = (key === KONAMI[0]) ? 1 : 0;
  }
}

function renderBoard() {
  const board = game.board();
  for (let i = 0; i < 16; i++) {
    const value = Number(board[i]);
    const el = tileEls[i];
    el.textContent = value === 0 ? "" : value;
    el.className = `tile ${tileClass(value)}`;
  }
  scoreEl.textContent = `得分：${game.score()}`;
  statusEl.textContent = game.is_over() ? "游戏结束，按重置继续。" : "使用方向键 / WASD 控制。";
}

function setupGame() {
  game = new Game();
  const root = document.getElementById("game2048-root");
  root.innerHTML = "";

  const header = document.createElement("div");
  header.className = "game-header";
  scoreEl = document.createElement("div");
  scoreEl.className = "game-score";
  statusEl = document.createElement("div");
  statusEl.className = "game-status";

  const button = document.createElement("button");
  button.className = "game-reset";
  button.textContent = "重置游戏";
  button.addEventListener("click", () => {
    stopAutoPlay();
    game.restart();
    renderBoard();
  });

  // AI 自动玩按钮
  const aiButton = document.createElement("button");
  aiButton.className = "game-reset";
  aiButton.style.marginLeft = "10px";
  aiButton.textContent = "AI 自动玩";
  aiButton.addEventListener("click", () => {
    if (autoPlayInterval) {
      stopAutoPlay();
      aiButton.textContent = "AI 自动玩";
      statusEl.textContent = "已停止自动玩。";
    } else {
      startAutoPlay();
      aiButton.textContent = "停止 AI";
      statusEl.textContent = "AI 正在游戏中...";
    }
  });

  header.appendChild(scoreEl);
  header.appendChild(button);
  header.appendChild(aiButton);
  root.appendChild(header);

  boardEl = document.createElement("div");
  boardEl.className = "game-board";
  tileEls = [];
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement("div");
    tile.className = "tile tile-empty";
    tileEls.push(tile);
    boardEl.appendChild(tile);
  }
  root.appendChild(boardEl);

  const help = document.createElement("div");
  help.className = "game-help";
  help.innerHTML = "按方向键或 WASD 进行操作。<br><span style='font-size:12px;opacity:0.7'>手机可滑动屏幕</span>";
  root.appendChild(help);

  // 添加触摸滑动支持
  let touchStartX = 0;
  let touchStartY = 0;
  boardEl.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  boardEl.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < 30) return; // 移动距离太短，忽略

    if (absDx > absDy) {
      game.move_dir(dx > 0 ? "right" : "left");
    } else {
      game.move_dir(dy > 0 ? "down" : "up");
    }
    renderBoard();
  }, { passive: true });

  renderBoard();
}

const wasmUrl = new URL("../wasm-2048/pkg/wasm_2048_bg.wasm", import.meta.url);

async function start2048() {
  const root = document.getElementById("game2048-root");

  // file:// 协议检测
  if (window.location.protocol === "file:") {
    root.innerHTML = `
      <div class="game-error">
        当前页面通过 <strong>file://</strong> 协议打开，浏览器不允许直接加载 WASM 模块。<br>
        请使用本地 HTTP 服务访问：<br>
        <code>cd d:\\Project\\ApTx2012.github.io</code><br>
        <code>python -m http.server 8080</code><br>
        然后访问 <code>http://localhost:8080/game2048.html</code>
      </div>
    `;
    root.classList.add("game-error");
    console.error("2048: WASM 无法通过 file:// 协议加载");
    return;
  }

  // WASM 加载超时保护
  const timeout = setTimeout(() => {
    if (!game) {
      root.innerHTML = `<div class="game-error">WASM 加载超时，请检查网络或刷新重试。</div>`;
      root.classList.add("game-error");
      console.error("2048: WASM 加载超时");
    }
  }, 10000);

  try {
    console.log("2048: 开始加载 WASM 模块...");
    await init({ module_or_path: wasmUrl });
    console.log("2048: WASM 模块加载成功");
    clearTimeout(timeout);
    setupGame();
    window.addEventListener("keydown", (event) => {
      // 检查秘技代码（使用原始按键码，与 WASD 方向操作分离）
      checkKonami(event.key);

      const dir = keyMap[event.key];
      if (!dir || !game) return;

      event.preventDefault();
      const moved = game.move_dir(dir);
      if (moved) {
        renderBoard();
      }
    });
  } catch (err) {
    clearTimeout(timeout);
    console.error("WASM 2048 加载失败：", err);
    root.innerHTML = `
      <div class="game-error">
        游戏加载失败：${err.message || err}<br>
        请确保通过 HTTP 服务访问，并检查浏览器控制台错误。
      </div>
    `;
    root.classList.add("game-error");
  }
}

// AI 自动玩功能
function startAutoPlay() {
  if (!ai) {
    ai = new AI();
  }
  
  autoPlayInterval = setInterval(() => {
    if (game.is_over()) {
      stopAutoPlay();
      statusEl.textContent = "AI 游戏结束！得分：" + game.score();
      return;
    }
    
    const board = game.board();
    const boardArray = [];
    for (let i = 0; i < 16; i++) {
      boardArray.push(Number(board[i]));
    }
    
    const bestMove = ai.get_best_move(boardArray);
    const moved = game.move_dir(bestMove);
    
    if (moved) {
      renderBoard();
    }
  }, 200); // 每 200ms 走一步
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}

start2048();
