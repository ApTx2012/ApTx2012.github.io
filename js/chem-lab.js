// 化学实验室主逻辑
// 仿真初中化学实验

let chemCalc = null;
let expSim = null;
let currentExp = null;
let expRunning = false;
let expSpeed = 1;
let currentStep = 0;
let gasProduced = 0;

// 实验数据
const experiments = {
  "o2-kmno4": {
    name: "高锰酸钾制氧气",
    principle: "加热高锰酸钾生成锰酸钾、二氧化锰和氧气",
    equation: "2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑",
    safety: "1. 试管口略向下倾斜，防止冷凝水倒流\n2. 先撤导管再移酒精灯\n3. 导管深入集气瓶底部\n4. 用带火星木条验满",
    equipment: ["酒精灯", "试管", "铁架台", "导管", "水槽", "集气瓶", "棉花", "带火星木条"],
    reagents: [
      { id: "kmno4", name: "高锰酸钾", icon: "fa-vial", color: "#8B4513" },
      { id: "water", name: "水", icon: "fa-tint", color: "#87CEEB" }
    ],
    steps: [
      { text: "1. 检查装置气密性", duration: 1000 },
      { text: "2. 在试管中加入适量高锰酸钾", duration: 1500 },
      { text: "3. 在试管口塞一团棉花", duration: 1000 },
      { text: "4. 固定试管（口略向下）", duration: 1000 },
      { text: "5. 点燃酒精灯，开始加热", duration: 2000 },
      { text: "6. 收集氧气（向上排空气法）", duration: 3000 },
      { text: "7. 用带火星木条验满", duration: 1500 },
      { text: "8. 实验完成，整理器材", duration: 1000 }
    ]
  },
  "o2-h2o2": {
    name: "过氧化氢制氧气",
    principle: "过氧化氢在二氧化锰催化下分解生成水和氧气",
    equation: "2H₂O₂ → 2H₂O + O₂↑ (MnO₂催化)",
    safety: "1. 长颈漏斗末端浸入液面以下\n2. 锥形瓶口不要盖紧（放气）\n3. 二氧化锰不要直接接触眼睛",
    equipment: ["锥形瓶", "分液漏斗", "导管", "水槽", "集气瓶", "带火星木条", "二氧化锰"],
    reagents: [
      { id: "h2o2", name: "过氧化氢", icon: "fa-tint", color: "#E6E6FA" },
      { id: "mno2", name: "二氧化锰", icon: "fa-cube", color: "#2F4F4F" }
    ],
    steps: [
      { text: "1. 检查装置气密性", duration: 1000 },
      { text: "2. 在锥形瓶中加入二氧化锰", duration: 1200 },
      { text: "3. 通过分液漏斗加入过氧化氢", duration: 1500 },
      { text: "4. 观察气泡产生", duration: 2000 },
      { text: "5. 收集氧气", duration: 3000 },
      { text: "6. 用带火星木条验满", duration: 1500 }
    ]
  },
  "h2": {
    name: "锌粒制氢气",
    principle: "锌与稀硫酸反应生成硫酸锌和氢气",
    equation: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
    safety: "1. 点燃氢气前必须验纯！\n2. 检验纯度后方可实验\n3. 实验全程远离明火",
    equipment: ["试管", "铁架台", "酒精灯", "导管", "水槽", "小试管", "锌粒"],
    reagents: [
      { id: "zn", name: "锌粒", icon: "fa-cube", color: "#708090" },
      { id: "h2so4", name: "稀硫酸", icon: "fa-tint", color: "#98FB98" }
    ],
    steps: [
      { text: "1. 组装制氢装置", duration: 1200 },
      { text: "2. 加入锌粒", duration: 1000 },
      { text: "3. 倒入稀硫酸", duration: 1200 },
      { text: "4. 收集氢气验纯", duration: 2000 },
      { text: "5. 点燃氢气，观察燃烧", duration: 2500 }
    ]
  },
  "co2": {
    name: "石灰石制二氧化碳",
    principle: "碳酸钙与盐酸反应生成氯化钙、水和二氧化碳",
    equation: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑",
    safety: "1. 用向上排空气法收集\n2. 燃着的蜡烛由下而上放入\n3. 澄清石灰水变浑浊说明有CO₂",
    equipment: ["锥形瓶", "长颈漏斗", "导管", "集气瓶", "蜡烛", "石灰水", "石灰石"],
    reagents: [
      { id: "caco3", name: "石灰石", icon: "fa-cube", color: "#F5F5DC" },
      { id: "hcl", name: "稀盐酸", icon: "fa-tint", color: "#98FB98" }
    ],
    steps: [
      { text: "1. 组装制CO₂装置", duration: 1200 },
      { text: "2. 加入石灰石", duration: 1000 },
      { text: "3. 倒入稀盐酸", duration: 1200 },
      { text: "4. 收集CO₂（验满）", duration: 2500 },
      { text: "5. 将燃着的蜡烛放入集气瓶", duration: 2000 },
      { text: "6. 向石灰水中通入CO₂", duration: 2000 }
    ]
  },
  "fe-cuso4": {
    name: "铁置换铜实验",
    principle: "铁比铜活泼，能从硫酸铜溶液中置换出铜",
    equation: "Fe + CuSO₄ → FeSO₄ + Cu",
    safety: "1. 反应需要一定时间\n2. 观察铁钉表面变化\n3. 溶液颜色会变浅",
    equipment: ["试管", "铁钉", "烧杯", "镊子", "砂纸"],
    reagents: [
      { id: "cuso4", name: "硫酸铜溶液", icon: "fa-tint", color: "#1E90FF" },
      { id: "fe", name: "铁钉", icon: "fa-cube", color: "#708090" }
    ],
    steps: [
      { text: "1. 用砂纸打磨铁钉", duration: 1500 },
      { text: "2. 将铁钉放入试管", duration: 1000 },
      { text: "3. 倒入硫酸铜溶液", duration: 1200 },
      { text: "4. 观察现象（等待2分钟）", duration: 3000 },
      { text: "5. 取出铁钉观察表面", duration: 1500 }
    ]
  },
  "naoh-solution": {
    name: "配制NaOH溶液",
    principle: "用质量分数计算所需NaOH和水，溶解后得到指定浓度溶液",
    equation: "NaOH (固体) → NaOH (溶液)",
    safety: "1. NaOH有强腐蚀性！\n2. 不能直接用纸称量\n3. 溶解时放热，注意安全",
    equipment: ["烧杯", "玻璃棒", "托盘天平", "量筒", "药匙", "称量纸"],
    reagents: [
      { id: "naoh", name: "氢氧化钠", icon: "fa-cube", color: "#FFFFFF" },
      { id: "water", name: "蒸馏水", icon: "fa-tint", color: "#87CEEB" }
    ],
    steps: [
      { text: "1. 计算所需NaOH质量", duration: 1000 },
      { text: "2. 用天平称取NaOH（放烧杯中）", duration: 2000 },
      { text: "3. 用量筒量取水", duration: 1500 },
      { text: "4. 将水加入烧杯，搅拌溶解", duration: 2000 },
      { text: "5. 冷却后转移至容量瓶", duration: 1500 }
    ]
  },
  "naoh-hcl": {
    name: "酸碱中和反应",
    principle: "氢氧化钠与盐酸发生中和反应，生成氯化钠和水",
    equation: "NaOH + HCl → NaCl + H₂O",
    safety: "1. 滴加酚酞或pH试纸指示终点\n2. 最后溶液变为无色或中性",
    equipment: ["烧杯", "滴管", "玻璃棒", "pH试纸", "酚酞溶液"],
    reagents: [
      { id: "naoh", name: "NaOH溶液", icon: "fa-tint", color: "#FFFFFF" },
      { id: "hcl", name: "盐酸", icon: "fa-tint", color: "#98FB98" },
      { id: "phenol", name: "酚酞", icon: "fa-tint", color: "#FFB6C1" }
    ],
    steps: [
      { text: "1. 在烧杯中加入NaOH溶液", duration: 1000 },
      { text: "2. 滴加2滴酚酞", duration: 1000 },
      { text: "3. 溶液变为红色", duration: 800 },
      { text: "4. 逐滴加入稀盐酸", duration: 2500 },
      { text: "5. 滴加至溶液刚好无色", duration: 2000 },
      { text: "6. 用pH试纸验证中性", duration: 1500 }
    ]
  },
  "burn-condition": {
    name: "燃烧条件探究",
    principle: "燃烧需要同时满足：可燃物、氧气、达到着火点",
    equation: "燃烧 = 可燃物 + O₂ + 点火",
    safety: "1. 白磷有毒，操作小心\n2. 热水实验注意烫伤\n3. 远离易燃物品",
    equipment: ["烧杯", "热水", "白磷", "红磷", "铜片", "玻璃棒"],
    reagents: [
      { id: "white-p", name: "白磷", icon: "fa-circle", color: "#FFFFF0" },
      { id: "hot-water", name: "热水", icon: "fa-tint", color: "#87CEEB" }
    ],
    steps: [
      { text: "1. 向烧杯中加入热水", duration: 1000 },
      { text: "2. 放入一小块白磷（冷水）", duration: 1500 },
      { text: "3. 观察：白磷不燃烧（无O₂）", duration: 1500 },
      { text: "4. 用导管向水下吹气", duration: 2000 },
      { text: "5. 观察：白磷燃烧（与O₂接触）", duration: 2000 },
      { text: "6. 实验结论：燃烧需O₂", duration: 1000 }
    ]
  },
  "mg-burn": {
    name: "镁条燃烧",
    principle: "镁与氧气剧烈反应，生成白色氧化镁",
    equation: "2Mg + O₂ → 2MgO",
    safety: "1. 镁条燃烧发出强光，不要直视\n2. 用坩埚钳夹持\n3. 产物氧化镁是白色粉末",
    equipment: ["酒精灯", "坩埚钳", "石棉网", "燃烧匙"],
    reagents: [
      { id: "mg", name: "镁条", icon: "fa-cube", color: "#C0C0C0" },
      { id: "o2", name: "氧气", icon: "fa-wind", color: "#87CEEB" }
    ],
    steps: [
      { text: "1. 用砂纸打磨镁条", duration: 1000 },
      { text: "2. 点燃酒精灯", duration: 800 },
      { text: "3. 用坩埚钳夹持镁条", duration: 800 },
      { text: "4. 在火焰上点燃镁条", duration: 1500 },
      { text: "5. 观察剧烈燃烧，发出白光", duration: 2000 },
      { text: "6. 收集产物氧化镁", duration: 1000 }
    ]
  }
};

// Canvas 绘制
let canvas, ctx;

// 器材绘制函数
const drawEquipment = {
  beaker: (ctx, x, y, scale = 1) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = "#4fc3f7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-30, -40);
    ctx.lineTo(-30, 30);
    ctx.quadraticCurveTo(-30, 40, -20, 40);
    ctx.lineTo(20, 40);
    ctx.quadraticCurveTo(30, 40, 30, 30);
    ctx.lineTo(30, -40);
    ctx.stroke();
    ctx.restore();
  },
  testtube: (ctx, x, y, scale = 1, filled = false) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = "#4fc3f7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -50);
    ctx.lineTo(-8, 30);
    ctx.quadraticCurveTo(-8, 40, 0, 40);
    ctx.quadraticCurveTo(8, 40, 8, 30);
    ctx.lineTo(8, -50);
    ctx.stroke();
    if (filled) {
      ctx.fillStyle = "rgba(100, 150, 200, 0.5)";
      ctx.fillRect(-8, 10, 16, 20);
    }
    ctx.restore();
  },
  flask: (ctx, x, y, scale = 1) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = "#4fc3f7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-25, 40);
    ctx.quadraticCurveTo(-30, 40, -30, 30);
    ctx.lineTo(-30, 0);
    ctx.lineTo(-10, -30);
    ctx.lineTo(-10, -40);
    ctx.lineTo(10, -40);
    ctx.lineTo(10, -30);
    ctx.lineTo(30, 0);
    ctx.lineTo(30, 30);
    ctx.quadraticCurveTo(30, 40, 25, 40);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  },
  burner: (ctx, x, y, scale = 1, burning = false) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(-15, 10, 30, 25);
    ctx.fillStyle = "#795548";
    ctx.fillRect(-10, 5, 20, 8);
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(-8, -5, 16, 12);
    if (burning) {
      ctx.fillStyle = "#ff9800";
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.quadraticCurveTo(-10, -15, 0, -5);
      ctx.quadraticCurveTo(10, -15, 0, -25);
      ctx.fill();
      ctx.fillStyle = "#ffeb3b";
      ctx.beginPath();
      ctx.ellipse(0, -12, 4, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
  gasbubbles: (ctx, x, y, count = 5) => {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    for (let i = 0; i < count; i++) {
      const bx = x + Math.sin(Date.now() / 300 + i) * 10;
      const by = y - i * 15 - (Date.now() / 50) % 15;
      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
};

// 初始化
async function init() {
  canvas = document.getElementById("labCanvas");
  ctx = canvas.getContext("2d");

  // 尝试加载 WASM 模块
  try {
    const wasmModule = await import("../wasm-chem/pkg/wasm_chem.js");
    const initWasm = wasmModule.default;
    const wasmUrl = new URL("../wasm-chem/pkg/wasm_chem_bg.wasm", import.meta.url);
    await initWasm({ module_or_path: wasmUrl });
    const { ChemCalculator, ExperimentSimulator } = wasmModule;
    chemCalc = new ChemCalculator();
    expSim = new ExperimentSimulator();
    console.log("化学计算模块加载成功");
  } catch (e) {
    console.warn("WASM 模块加载失败，使用 JS 模拟", e);
  }

  document.getElementById("labLoading").classList.add("hidden");
  setupEventListeners();
  selectExperiment("o2-kmno4");
  drawLab();
}

// 设置事件监听
function setupEventListeners() {
  // 实验选择
  document.querySelectorAll(".exp-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".exp-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectExperiment(btn.dataset.exp);
    });
  });

  // 控制按钮
  document.getElementById("startExp").addEventListener("click", toggleExperiment);
  document.getElementById("resetExp").addEventListener("click", resetExperiment);
  document.getElementById("speedExp").addEventListener("click", cycleSpeed);

  // 弹窗关闭
  document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("resultModal").classList.remove("show");
  });
}

// 选择实验
function selectExperiment(expId) {
  currentExp = experiments[expId];
  if (!currentExp) return;

  // 更新信息面板
  document.getElementById("expPrinciple").textContent = currentExp.principle;
  document.getElementById("expSafetyTips").textContent = currentExp.safety;
  document.getElementById("expFormula").textContent = currentExp.equation;

  // 更新试剂库
  const reagentGrid = document.getElementById("reagentsGrid");
  reagentGrid.innerHTML = "";
  currentExp.reagents.forEach(r => {
    const item = document.createElement("div");
    item.className = "reagent-item";
    item.innerHTML = `<i class="fas ${r.icon}"></i><span>${r.name}</span>`;
    item.dataset.id = r.id;
    item.style.setProperty("--reagent-color", r.color);
    reagentGrid.appendChild(item);
  });

  // 重置状态
  currentStep = 0;
  gasProduced = 0;
  updateGasDisplay();
  updateSteps();
}

// 切换实验运行状态
function toggleExperiment() {
  if (expRunning) {
    stopExperiment();
  } else {
    startExperiment();
  }
}

function startExperiment() {
  if (!currentExp) return;
  expRunning = true;
  currentStep = 0;
  document.getElementById("startExp").classList.add("running");
  document.getElementById("startExp").innerHTML = '<i class="fas fa-pause"></i>';
  runSteps();
}

function stopExperiment() {
  expRunning = false;
  document.getElementById("startExp").classList.remove("running");
  document.getElementById("startExp").innerHTML = '<i class="fas fa-play"></i>';
}

function resetExperiment() {
  stopExperiment();
  currentStep = 0;
  gasProduced = 0;
  updateGasDisplay();
  updateSteps();
  drawLab();
}

function cycleSpeed() {
  expSpeed = expSpeed === 1 ? 2 : expSpeed === 2 ? 3 : 1;
  document.getElementById("speedExp").title = `速度: ${expSpeed}x`;
}

// 运行实验步骤
async function runSteps() {
  while (expRunning && currentStep < currentExp.steps.length) {
    const step = currentExp.steps[currentStep];
    updateSteps();

    // 模拟实验动画
    drawLabAnimation(currentStep);

    // 更新产气量
    if (currentExp.equation.includes("O₂")) {
      gasProduced += 0.5;
    } else if (currentExp.equation.includes("H₂")) {
      gasProduced += 0.3;
    } else if (currentExp.equation.includes("CO₂")) {
      gasProduced += 0.4;
    }
    updateGasDisplay();

    // 等待当前步骤完成
    await new Promise(resolve => setTimeout(resolve, step.duration / expSpeed));

    currentStep++;
    if (currentStep >= currentExp.steps.length) {
      expRunning = false;
      showResult();
    }
  }

  if (!expRunning) {
    document.getElementById("startExp").classList.remove("running");
    document.getElementById("startExp").innerHTML = '<i class="fas fa-play"></i>';
  }
}

// 更新步骤显示
function updateSteps() {
  const container = document.getElementById("actionSteps");
  container.innerHTML = "";

  currentExp.steps.forEach((step, i) => {
    const div = document.createElement("div");
    div.className = "step-item";
    if (i < currentStep) div.classList.add("completed");
    if (i === currentStep) div.classList.add("current");
    if (i > currentStep) div.classList.add("pending");
    div.textContent = step.text;
    container.appendChild(div);
  });
}

// 更新产气量显示
function updateGasDisplay() {
  document.getElementById("gasCount").textContent = gasProduced.toFixed(1);
}

// 显示结果弹窗
function showResult() {
  const modal = document.getElementById("resultModal");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  title.textContent = `${currentExp.name} - 实验完成`;
  body.innerHTML = `
    <p><strong>化学方程式：</strong>${currentExp.equation}</p>
    <p><strong>实验现象：</strong></p>
    <p>${getObservationText(currentExp.name)}</p>
    <p><strong>累计产气量：</strong>${gasProduced.toFixed(2)} L</p>
  `;

  modal.classList.add("show");
}

function getObservationText(expName) {
  const observations = {
    "高锰酸钾制氧气": "试管内有气泡产生，导管口有气体放出，带火星木条复燃，发出白光",
    "过氧化氢制氧气": "锥形瓶内产生大量气泡，气体导入水槽，集气瓶中收集到氧气",
    "锌粒制氢气": "锌粒表面有气泡产生，锌粒逐渐溶解，收集到氢气",
    "石灰石制二氧化碳": "石灰石表面有气泡产生，蜡烛由下而上熄灭，石灰水变浑浊",
    "铁置换铜实验": "铁钉表面附着一层红色铜，溶液颜色由蓝色变为浅绿色",
    "配制NaOH溶液": "NaOH溶解时放热，溶液温度升高，得到无色透明溶液",
    "酸碱中和反应": "酚酞变红色，逐滴加入盐酸后红色消失，溶液变为无色",
    "燃烧条件探究": "白磷在冷水中不燃烧，接触氧气后燃烧，发出淡黄色火焰",
    "镁条燃烧": "镁条燃烧发出耀眼白光，生成白色粉末状氧化镁"
  };
  return observations[expName] || "观察实验现象，记录实验结果";
}

// 绘制实验室场景
function drawLab() {
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制实验台
  ctx.fillStyle = "#2d2d44";
  ctx.fillRect(50, 350, 700, 120);
  ctx.strokeStyle = "#4a4a6a";
  ctx.strokeRect(50, 350, 700, 120);

  // 绘制标题
  if (currentExp) {
    ctx.fillStyle = "#888";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(currentExp.name, canvas.width / 2, 30);
  }
}

// 绘制实验动画
function drawLabAnimation(step) {
  drawLab();

  switch (currentExp.name) {
    case "高锰酸钾制氧气":
      drawKMnO4Exp(step);
      break;
    case "过氧化氢制氧气":
      drawH2O2Exp(step);
      break;
    case "锌粒制氢气":
      drawH2Exp(step);
      break;
    case "石灰石制二氧化碳":
      drawCO2Exp(step);
      break;
    default:
      drawGenericExp(step);
  }
}

function drawKMnO4Exp(step) {
  const x = canvas.width / 2 - 100;

  // 铁架台
  ctx.fillStyle = "#666";
  ctx.fillRect(x - 30, 200, 10, 200);
  ctx.fillRect(x + 120, 200, 10, 200);
  ctx.fillRect(x - 30, 195, 160, 10);

  // 试管
  if (step >= 1) {
    drawEquipment.testtube(ctx, x + 40, 280, 1, step >= 2);
  }

  // 酒精灯
  if (step >= 4) {
    drawEquipment.burner(ctx, x + 200, 360, 0.8, step >= 4);
  }

  // 导管
  if (step >= 5) {
    ctx.strokeStyle = "#4fc3f7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 48, 290);
    ctx.lineTo(x + 120, 290);
    ctx.lineTo(x + 120, 320);
    ctx.stroke();
  }

  // 气泡
  if (step >= 5) {
    drawEquipment.gasbubbles(ctx, x + 120, 320, 3);
  }

  // 水槽
  if (step >= 5) {
    ctx.fillStyle = "rgba(100, 150, 200, 0.3)";
    ctx.fillRect(x + 180, 380, 100, 50);
  }
}

function drawH2O2Exp(step) {
  const x = canvas.width / 2;

  // 锥形瓶
  if (step >= 2) {
    drawEquipment.flask(ctx, x - 80, 320, 1);
  }

  // 分液漏斗
  if (step >= 3) {
    ctx.fillStyle = "#4fc3f7";
    ctx.fillRect(x - 60, 250, 40, 60);
  }

  // 二氧化锰（催化剂）
  if (step >= 2) {
    ctx.fillStyle = "#2F4F4F";
    ctx.beginPath();
    ctx.arc(x - 70, 350, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 导管和气泡
  if (step >= 4) {
    ctx.strokeStyle = "#4fc3f7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 40, 320);
    ctx.lineTo(x + 20, 320);
    ctx.lineTo(x + 20, 360);
    ctx.stroke();
    drawEquipment.gasbubbles(ctx, x + 20, 360, 5);
  }
}

function drawH2Exp(step) {
  const x = canvas.width / 2;

  // 试管
  if (step >= 2) {
    drawEquipment.testtube(ctx, x, 280, 1, step >= 3);
  }

  // 锌粒
  if (step >= 2) {
    ctx.fillStyle = "#708090";
    ctx.beginPath();
    ctx.arc(x - 5, 320, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 气泡
  if (step >= 4) {
    drawEquipment.gasbubbles(ctx, x, 280, 3);
  }

  // 氢气燃烧火焰
  if (step >= 5) {
    ctx.fillStyle = "#ff9800";
    ctx.beginPath();
    ctx.moveTo(x + 60, 350);
    ctx.quadraticCurveTo(x + 50, 340, x + 60, 330);
    ctx.quadraticCurveTo(x + 70, 340, x + 60, 350);
    ctx.fill();
    ctx.fillStyle = "#ffeb3b";
    ctx.beginPath();
    ctx.ellipse(x + 60, 345, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCO2Exp(step) {
  const x = canvas.width / 2;

  // 锥形瓶
  if (step >= 2) {
    drawEquipment.flask(ctx, x - 100, 320, 1);
  }

  // 长颈漏斗
  if (step >= 3) {
    ctx.fillStyle = "#4fc3f7";
    ctx.fillRect(x - 90, 250, 30, 80);
  }

  // 石灰石
  if (step >= 2) {
    ctx.fillStyle = "#F5F5DC";
    ctx.beginPath();
    ctx.arc(x - 90, 360, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // 导管
  if (step >= 4) {
    ctx.strokeStyle = "#4fc3f7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 60, 320);
    ctx.lineTo(x + 40, 320);
    ctx.stroke();
  }

  // CO2气体流动
  if (step >= 4) {
    drawEquipment.gasbubbles(ctx, x + 40, 320, 3);
  }

  // 蜡烛
  if (step >= 5) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 80, 360, 10, 40);
    ctx.fillStyle = "#ff9800";
    ctx.beginPath();
    ctx.arc(x + 85, 355, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGenericExp(step) {
  ctx.fillStyle = "#4fc3f7";
  ctx.font = "18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`实验步骤 ${step + 1}: ${currentExp.steps[step]?.text || ""}`, canvas.width / 2, canvas.height / 2);
}

// 动画循环
function animationLoop() {
  if (expRunning) {
    drawLab();
  }
  requestAnimationFrame(animationLoop);
}

// 页面加载完成后初始化
window.addEventListener("load", () => {
  init();
  animationLoop();
});