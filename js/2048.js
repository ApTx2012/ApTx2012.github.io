import init, { Game } from "../wasm-2048/pkg/wasm_2048.js";

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
let boardEl;
let scoreEl;
let statusEl;
let tileEls = [];

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
    game.restart();
    renderBoard();
  });

  header.appendChild(scoreEl);
  header.appendChild(button);
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
  help.textContent = "按方向键或 WASD 进行操作。";
  root.appendChild(help);

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

start2048();
