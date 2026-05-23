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

function renderBoard() {
  const board = Array.from(game.board(), (x) => Number(x));
  boardEl.innerHTML = "";
  board.forEach((value) => {
    const tile = document.createElement("div");
    tile.className = `tile ${tileClass(value)}`;
    tile.textContent = value === 0 ? "" : value;
    boardEl.appendChild(tile);
  });
  scoreEl.textContent = `得分：${game.score()}`;
  statusEl.textContent = game.is_over() ? "游戏结束，按重置继续。" : "使用方向键 / WASD 控制。";
}

function setupGame() {
  game = Game.new();
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
  try {
    await init(wasmUrl);
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
    console.error("WASM 2048 加载失败：", err);
    if (root) {
      root.innerHTML = "游戏加载失败。请确保通过 HTTP 服务访问，并检查浏览器控制台错误。";
      root.classList.add("game-error");
    }
  }
}

start2048();
