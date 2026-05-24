// 化学实验室主逻辑
// 仿真初中化学实验 - 支持拖拽交互

let chemCalc = null;
let expSim = null;
let currentExp = null;
let currentExpId = "o2-kmno4";
let expRunning = false;
let expSpeed = 1;
let currentStep = 0;
let gasProduced = 0;

// 拖拽交互变量
let canvasItems = [];      // Canvas 上的器材列表
let draggedItem = null;    // 当前拖拽的器材
let selectedItem = null;   // 选中的器材
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let dragSource = null;     // 'canvas' 或 'sidebar'
let dragActive = false;    // 是否已绑定 document 级拖拽监听

// 试剂颜色表
const REAGENT_COLORS = {
  kmno4: "#8B008B",
  h2o2: "#E6E6FA",
  mno2: "#2F4F4F",
  zn: "#708090",
  h2so4: "#98FB98",
  caco3: "#F5F5DC",
  hcl: "#98FB98",
  cuso4: "#1E90FF",
  fe: "#708090",
  naoh: "#FFFFFF",
  water: "#87CEEB",
  phenol: "#FFB6C1"
};

// 倾倒交互状态
const POUR_DIAL_RADIUS = 32;
const POUR_PROXIMITY = 75;
const POUR_DIAL_ARC_START = -Math.PI * 0.78;
const POUR_DIAL_ARC_SPAN = Math.PI * 0.56;

let pourState = {
  active: false,
  bottle: null,
  target: null,
  dialCenter: { x: 0, y: 0 },
  dialAngle: 0,
  dialDragging: false
};

const TUBE_ENDPOINT_HIT = 14;
const TUBE_BODY_HIT = 12;
const TUBE_SNAP_RADIUS = 30;

let tubeDragPart = null;
let tubeBodyOrigin = null;

// 器材类型定义（width/height 用于点击检测与边界限制）
const EQUIPMENT_TYPES = {
  beaker: { name: '烧杯', width: 74, height: 95 },
  testtube: { name: '试管', width: 24, height: 110 },
  flask: { name: '锥形瓶', width: 70, height: 100 },
  burner: { name: '酒精灯', width: 44, height: 75 },
  ironstand: { name: '铁架台', width: 90, height: 200 },
  tube: { name: '导管', width: 120, height: 80 },
  gastank: { name: '集气瓶', width: 60, height: 110 },
  gasjar: { name: '集气瓶', width: 60, height: 110 },
  trough: { name: '水槽', width: 140, height: 70 },
  splint: { name: '带火星木条', width: 56, height: 20 },
  reagentBottle: { name: '试剂瓶', width: 36, height: 58 },
  separatory: { name: '分液漏斗', width: 30, height: 100 }
};

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
      { text: "6. 倒置集气瓶放入水槽排水法收集（或正置向上排空气法）", duration: 3000 },
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

// 各实验初始器材布局（仅摆放，不预填试剂、不点燃、不自动连接）
const EXPERIMENT_SCENES = {
  "o2-kmno4": [
    { type: "testtube", x: 240, y: 200 },
    { type: "burner", x: 240, y: 350 },
    { type: "trough", x: 490, y: 305 },
    { type: "gastank", x: 630, y: 255 },
    { type: "splint", x: 660, y: 385 },
    { type: "tube", x: 365, y: 255 }
  ],
  "o2-h2o2": [
    { type: "flask", x: 230, y: 285 },
    { type: "separatory", x: 230, y: 175 },
    { type: "trough", x: 490, y: 305 },
    { type: "gastank", x: 630, y: 255 },
    { type: "splint", x: 660, y: 385 },
    { type: "tube", x: 380, y: 275 }
  ],
  "h2": [
    { type: "testtube", x: 270, y: 215 },
    { type: "burner", x: 270, y: 355 },
    { type: "trough", x: 510, y: 300 },
    { type: "gastank", x: 640, y: 255 },
    { type: "tube", x: 395, y: 260 }
  ],
  "co2": [
    { type: "flask", x: 250, y: 290 },
    { type: "separatory", x: 250, y: 180 },
    { type: "gastank", x: 520, y: 265 },
    { type: "tube", x: 390, y: 275 }
  ],
  "fe-cuso4": [
    { type: "testtube", x: 300, y: 245 },
    { type: "beaker", x: 480, y: 275 }
  ],
  "naoh-solution": [
    { type: "beaker", x: 290, y: 265 },
    { type: "beaker", x: 470, y: 265 }
  ],
  "naoh-hcl": [
    { type: "beaker", x: 400, y: 275 }
  ],
  "burn-condition": [
    { type: "beaker", x: 350, y: 275 },
    { type: "trough", x: 550, y: 305 },
    { type: "tube", x: 450, y: 285 }
  ],
  "mg-burn": [
    { type: "burner", x: 400, y: 320 },
    { type: "beaker", x: 400, y: 215 }
  ]
};

// Canvas 绘制
let canvas, ctx;

// 器材绘制函数 - 精细版
const drawEquipment = {
  // 烧杯 - 带刻度和液体
  beaker: (ctx, x, y, scale = 1, liquidLevel = 0, liquidColor = null) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // 玻璃厚度
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(200, 230, 255, 0.8)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 烧杯主体 - 圆底
    ctx.beginPath();
    ctx.moveTo(-35, -50);
    ctx.lineTo(-35, 25);
    ctx.quadraticCurveTo(-35, 45, -15, 45);
    ctx.lineTo(15, 45);
    ctx.quadraticCurveTo(35, 45, 35, 25);
    ctx.lineTo(35, -50);
    ctx.stroke();

    // 烧杯口 - 加厚边缘
    ctx.beginPath();
    ctx.ellipse(0, -50, 37, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(200, 230, 255, 0.1)";
    ctx.fill();

    // 倾倒嘴
    ctx.beginPath();
    ctx.moveTo(35, -50);
    ctx.quadraticCurveTo(42, -52, 40, -45);
    ctx.stroke();

    // 刻度线
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(150, 200, 255, 0.5)";
    for (let i = 1; i <= 4; i++) {
      const ly = -30 + i * 15;
      ctx.beginPath();
      ctx.moveTo(-25, ly);
      ctx.lineTo(-15, ly);
      ctx.stroke();
    }

    // 液体
    if (liquidLevel > 0 && liquidColor) {
      ctx.fillStyle = liquidColor;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      const liquidY = 40 - liquidLevel * 70;
      ctx.moveTo(-33, liquidY);
      ctx.lineTo(-33, 25);
      ctx.quadraticCurveTo(-33, 43, -15, 43);
      ctx.lineTo(15, 43);
      ctx.quadraticCurveTo(33, 43, 33, 25);
      ctx.lineTo(33, liquidY);
      ctx.quadraticCurveTo(0, liquidY + 5, -33, liquidY);
      ctx.fill();
      ctx.globalAlpha = 1;

      // 液体表面
      ctx.strokeStyle = liquidColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, liquidY, 33, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 高光
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-28, -40);
    ctx.lineTo(-28, 20);
    ctx.stroke();

    ctx.restore();
  },

  // 试管 - 精细版（liquidLevel: 0~1）
  testtube: (ctx, x, y, scale = 1, liquidLevel = 0, liquidColor = "#8B4513") => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(200, 230, 255, 0.8)";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(-10, -60);
    ctx.lineTo(-10, 35);
    ctx.quadraticCurveTo(-10, 50, 0, 50);
    ctx.quadraticCurveTo(10, 50, 10, 35);
    ctx.lineTo(10, -60);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, -60, 12, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(200, 230, 255, 0.1)";
    ctx.fill();

    if (liquidLevel > 0) {
      const level = Math.min(1, liquidLevel);
      const liquidTop = 48 - level * 38;
      ctx.fillStyle = liquidColor;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(-8, liquidTop);
      ctx.lineTo(-8, 35);
      ctx.quadraticCurveTo(-8, 48, 0, 48);
      ctx.quadraticCurveTo(8, 48, 8, 35);
      ctx.lineTo(8, liquidTop);
      ctx.quadraticCurveTo(0, liquidTop + 2, -8, liquidTop);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.strokeStyle = liquidColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, liquidTop, 8, 3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, -50);
    ctx.lineTo(-5, 30);
    ctx.stroke();

    ctx.restore();
  },

  // 锥形瓶 - 精细版
  flask: (ctx, x, y, scale = 1, liquidLevel = 0, liquidColor = null) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(200, 230, 255, 0.8)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 瓶身轮廓
    ctx.beginPath();
    ctx.moveTo(-30, 50);
    ctx.quadraticCurveTo(-35, 50, -35, 40);
    ctx.lineTo(-35, 10);
    ctx.quadraticCurveTo(-35, -5, -20, -20);
    ctx.lineTo(-15, -35);
    ctx.lineTo(-15, -50);
    ctx.lineTo(15, -50);
    ctx.lineTo(15, -35);
    ctx.lineTo(20, -20);
    ctx.quadraticCurveTo(35, -5, 35, 10);
    ctx.lineTo(35, 40);
    ctx.quadraticCurveTo(35, 50, 30, 50);
    ctx.closePath();
    ctx.stroke();

    // 瓶口
    ctx.beginPath();
    ctx.ellipse(0, -50, 17, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(200, 230, 255, 0.1)";
    ctx.fill();

    // 液体
    if (liquidLevel > 0 && liquidColor) {
      ctx.fillStyle = liquidColor;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      const liquidY = 45 - liquidLevel * 80;
      ctx.moveTo(-33, liquidY);
      ctx.lineTo(-33, 40);
      ctx.quadraticCurveTo(-33, 48, -30, 48);
      ctx.lineTo(30, 48);
      ctx.quadraticCurveTo(33, 48, 33, 40);
      ctx.lineTo(33, liquidY);

      // 根据液位高度调整形状
      if (liquidY > 10) {
        ctx.quadraticCurveTo(0, liquidY + 8, -33, liquidY);
      } else {
        ctx.lineTo(18, -20);
        ctx.lineTo(15, -35);
        ctx.lineTo(-15, -35);
        ctx.lineTo(-18, -20);
        ctx.lineTo(-33, liquidY);
      }
      ctx.fill();
      ctx.globalAlpha = 1;

      // 液面
      ctx.strokeStyle = liquidColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (liquidY > 10) {
        ctx.ellipse(0, liquidY, 33, 7, 0, 0, Math.PI * 2);
      } else {
        ctx.ellipse(0, liquidY, 25, 6, 0, 0, Math.PI * 2);
      }
      ctx.stroke();
    }

    // 高光
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-25, 30);
    ctx.quadraticCurveTo(-25, 0, -15, -15);
    ctx.lineTo(-12, -30);
    ctx.stroke();

    ctx.restore();
  },

  // 酒精灯 - 精细版
  burner: (ctx, x, y, scale = 1, burning = false) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // 灯座
    const gradient = ctx.createLinearGradient(-20, 10, 20, 50);
    gradient.addColorStop(0, "#5d4037");
    gradient.addColorStop(0.5, "#795548");
    gradient.addColorStop(1, "#4e342e");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(-20, 50);
    ctx.lineTo(-20, 15);
    ctx.quadraticCurveTo(-20, 10, -15, 10);
    ctx.lineTo(15, 10);
    ctx.quadraticCurveTo(20, 10, 20, 15);
    ctx.lineTo(20, 50);
    ctx.quadraticCurveTo(20, 55, 15, 55);
    ctx.lineTo(-15, 55);
    ctx.quadraticCurveTo(-20, 55, -20, 50);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#3e2723";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 灯座高光
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-15, 20);
    ctx.lineTo(-15, 45);
    ctx.stroke();

    // 灯颈
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(-12, 0, 24, 12);
    ctx.strokeStyle = "#3e2723";
    ctx.strokeRect(-12, 0, 24, 12);

    // 灯芯管
    ctx.fillStyle = "#424242";
    ctx.fillRect(-6, -15, 12, 18);
    ctx.strokeStyle = "#212121";
    ctx.strokeRect(-6, -15, 12, 18);

    // 灯芯
    ctx.fillStyle = "#d7ccc8";
    ctx.fillRect(-3, -22, 6, 10);

    // 火焰
    if (burning) {
      // 外焰
      const flameGradient = ctx.createRadialGradient(0, -35, 0, 0, -35, 20);
      flameGradient.addColorStop(0, "#ffeb3b");
      flameGradient.addColorStop(0.3, "#ff9800");
      flameGradient.addColorStop(0.7, "#ff5722");
      flameGradient.addColorStop(1, "rgba(255, 87, 34, 0)");
      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.quadraticCurveTo(-15, -35, -8, -50);
      ctx.quadraticCurveTo(0, -60, 8, -50);
      ctx.quadraticCurveTo(15, -35, 0, -22);
      ctx.fill();

      // 内焰
      const innerGradient = ctx.createRadialGradient(0, -35, 0, 0, -35, 10);
      innerGradient.addColorStop(0, "#fff9c4");
      innerGradient.addColorStop(0.5, "#ffeb3b");
      innerGradient.addColorStop(1, "rgba(255, 235, 59, 0)");
      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.ellipse(0, -38, 6, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // 火焰闪烁效果
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(0, -45 + Math.sin(Date.now() / 100) * 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  // 气泡动画 - 增强版
  gasbubbles: (ctx, x, y, count = 5, color = "rgba(255, 255, 255, 0.7)") => {
    ctx.save();
    const time = Date.now() / 200;

    for (let i = 0; i < count; i++) {
      const offset = i * 1.5;
      const bx = x + Math.sin(time + offset) * 8;
      const by = y - i * 15 - (time * 20) % 60;
      const size = 3 + Math.sin(time * 2 + i) * 1.5;
      const alpha = 0.3 + Math.sin(time + i) * 0.3;

      // 气泡主体
      ctx.fillStyle = color.replace("0.7", alpha.toFixed(2));
      ctx.beginPath();
      ctx.arc(bx, by, size, 0, Math.PI * 2);
      ctx.fill();

      // 高光
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha + 0.2})`;
      ctx.beginPath();
      ctx.arc(bx - size * 0.3, by - size * 0.3, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
};

// 铁架台绘制
function drawIronStand(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // 底座
  const baseGradient = ctx.createLinearGradient(-40, 180, 40, 200);
  baseGradient.addColorStop(0, "#4a4a4a");
  baseGradient.addColorStop(0.5, "#666666");
  baseGradient.addColorStop(1, "#4a4a4a");
  ctx.fillStyle = baseGradient;
  ctx.fillRect(-45, 180, 90, 20);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.strokeRect(-45, 180, 90, 20);

  // 立杆
  const poleGradient = ctx.createLinearGradient(-5, 0, 5, 0);
  poleGradient.addColorStop(0, "#555");
  poleGradient.addColorStop(0.5, "#777");
  poleGradient.addColorStop(1, "#555");
  ctx.fillStyle = poleGradient;
  ctx.fillRect(-5, 0, 10, 180);
  ctx.strokeStyle = "#444";
  ctx.strokeRect(-5, 0, 10, 180);

  // 横杆夹
  ctx.fillStyle = "#666";
  ctx.fillRect(-25, 60, 20, 15);
  ctx.strokeStyle = "#444";
  ctx.strokeRect(-25, 60, 20, 15);

  // 横杆
  const barGradient = ctx.createLinearGradient(0, 65, 80, 70);
  barGradient.addColorStop(0, "#666");
  barGradient.addColorStop(0.5, "#888");
  barGradient.addColorStop(1, "#666");
  ctx.fillStyle = barGradient;
  ctx.fillRect(-5, 65, 85, 8);
  ctx.strokeStyle = "#444";
  ctx.strokeRect(-5, 65, 85, 8);

  ctx.restore();
}

// 集气瓶绘制（支持旋转与排水法入水）
function drawGasJar(ctx, x, y, scale = 1, state = {}) {
  const filled = !!(state.filled || state.collecting);
  const rotation = state.rotation || 0;
  const inWater = !!state.inWater;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(200, 230, 255, 0.8)";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(-30, -60);
  ctx.lineTo(-30, 40);
  ctx.quadraticCurveTo(-30, 50, -20, 50);
  ctx.lineTo(20, 50);
  ctx.quadraticCurveTo(30, 50, 30, 40);
  ctx.lineTo(30, -60);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, -60, 32, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(200, 230, 255, 0.1)";
  ctx.fill();

  if (filled) {
    ctx.fillStyle = "rgba(180, 220, 255, 0.55)";
    ctx.beginPath();
    ctx.moveTo(-28, -55);
    ctx.lineTo(-28, -10);
    ctx.quadraticCurveTo(-28, -5, -20, -5);
    ctx.lineTo(20, -5);
    ctx.quadraticCurveTo(28, -5, 28, -10);
    ctx.lineTo(28, -55);
    ctx.quadraticCurveTo(0, -50, -28, -55);
    ctx.fill();
  }

  if (inWater) {
    ctx.fillStyle = "rgba(100, 150, 200, 0.45)";
    ctx.fillRect(-34, 38, 68, 18);
    ctx.strokeStyle = "rgba(135, 206, 235, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-34, 38);
    ctx.lineTo(34, 38);
    ctx.stroke();
  }

  ctx.restore();
}

// 水槽绘制
function drawWaterTrough(ctx, x, y, scale = 1, state = {}) {
  const waterLevel = state.waterLevel ?? 0.65;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(200, 230, 255, 0.75)";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-65, -15);
  ctx.lineTo(-65, 35);
  ctx.lineTo(65, 35);
  ctx.lineTo(65, -15);
  ctx.stroke();

  const waterTop = 35 - waterLevel * 45;
  ctx.fillStyle = "rgba(100, 150, 200, 0.45)";
  ctx.fillRect(-63, waterTop, 126, 35 - waterTop);

  ctx.strokeStyle = "rgba(135, 206, 235, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-63, waterTop);
  ctx.lineTo(63, waterTop);
  ctx.stroke();

  ctx.restore();
}

// 导管绘制（可拉长、双端连接）
function drawFlexibleTube(ctx, item) {
  const s = item.state || {};
  const sx = s.startX ?? item.x - 40;
  const sy = s.startY ?? item.y;
  const ex = s.endX ?? item.x + 40;
  const ey = s.endY ?? item.y;
  const midX = (sx + ex) / 2;
  const midY = (sy + ey) / 2;
  const len = Math.hypot(ex - sx, ey - sy);
  const sag = Math.min(35, len * 0.12 + 8);

  ctx.strokeStyle = "rgba(200, 230, 255, 0.88)";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo(midX, midY + sag, ex, ey);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo(midX, midY + sag, ex, ey);
  ctx.stroke();

  if (s.flowing) {
    ctx.strokeStyle = "rgba(180, 230, 255, 0.55)";
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(midX, midY + sag, ex, ey);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawTubeEndpoint(ctx, sx, sy, s.startAttach, item === selectedItem);
  drawTubeEndpoint(ctx, ex, ey, s.endAttach, item === selectedItem);
}

function drawTubeEndpoint(ctx, x, y, attached, showHandle) {
  ctx.fillStyle = attached ? "rgba(46, 204, 113, 0.85)" : "rgba(214, 136, 255, 0.75)";
  ctx.beginPath();
  ctx.arc(x, y, showHandle ? 9 : 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const nx = x1 + t * dx;
  const ny = y1 + t * dy;
  return Math.hypot(px - nx, py - ny);
}

function updateTubeCenter(item) {
  const s = item.state;
  if (!s) return;
  item.x = (s.startX + s.endX) / 2;
  item.y = (s.startY + s.endY) / 2;
}

function getAttachPointPosition(attach) {
  if (!attach) return null;
  const target = canvasItems.find(i => i.id === attach.targetId);
  if (!target) return null;

  if (attach.targetType === "testtube") {
    if (attach.attachPoint === "inside") return { x: target.x, y: target.y - 38 };
    return { x: target.x, y: target.y - 55 };
  }
  if (attach.targetType === "trough") {
    const wl = target.state?.waterLevel ?? 0.65;
    return { x: target.x, y: target.y + 35 - wl * 45 };
  }
  if (attach.targetType === "beaker" && isWaterContainer(target)) {
    const level = target.state?.liquidLevel ?? 0.5;
    return { x: target.x, y: target.y + 20 - level * 50 };
  }
  if (isGasJar(target)) {
    return getGasJarMouthPos(target);
  }
  if (target.type === "flask") {
    return { x: target.x, y: target.y - 52 };
  }
  return { x: target.x, y: target.y };
}

function getConnectionPoints() {
  const points = [];

  canvasItems.forEach(item => {
    if (item.type === "testtube") {
      points.push({
        x: item.x, y: item.y - 55,
        attach: { targetId: item.id, targetType: "testtube", attachPoint: "mouth" }
      });
      points.push({
        x: item.x, y: item.y - 38,
        attach: { targetId: item.id, targetType: "testtube", attachPoint: "inside" }
      });
    }
    if (item.type === "trough") {
      const wl = item.state?.waterLevel ?? 0.65;
      points.push({
        x: item.x, y: item.y + 35 - wl * 45,
        attach: { targetId: item.id, targetType: "trough", attachPoint: "water" }
      });
    }
    if (item.type === "beaker" && isWaterContainer(item)) {
      const level = item.state?.liquidLevel ?? 0.5;
      points.push({
        x: item.x, y: item.y + 20 - level * 50,
        attach: { targetId: item.id, targetType: "beaker", attachPoint: "water" }
      });
    }
    if (isGasJar(item)) {
      const mouth = getGasJarMouthPos(item);
      points.push({
        x: mouth.x, y: mouth.y,
        attach: { targetId: item.id, targetType: "gasjar", attachPoint: "mouth" }
      });
    }
    if (item.type === "flask") {
      points.push({
        x: item.x, y: item.y - 52,
        attach: { targetId: item.id, targetType: "flask", attachPoint: "mouth" }
      });
    }
  });

  return points;
}

function findSnapPoint(x, y) {
  let best = null;
  let bestDist = TUBE_SNAP_RADIUS;

  getConnectionPoints().forEach(pt => {
    const dist = Math.hypot(x - pt.x, y - pt.y);
    if (dist < bestDist) {
      best = pt;
      bestDist = dist;
    }
  });

  return best;
}

function getTubeInteraction(x, y) {
  for (let i = canvasItems.length - 1; i >= 0; i--) {
    const item = canvasItems[i];
    if (item.type !== "tube" || !item.state) continue;

    const { startX, startY, endX, endY } = item.state;
    if (Math.hypot(x - startX, y - startY) <= TUBE_ENDPOINT_HIT) {
      return { item, index: i, part: "start" };
    }
    if (Math.hypot(x - endX, y - endY) <= TUBE_ENDPOINT_HIT) {
      return { item, index: i, part: "end" };
    }
    if (distanceToSegment(x, y, startX, startY, endX, endY) <= TUBE_BODY_HIT) {
      return { item, index: i, part: "body" };
    }
  }
  return null;
}

function clampTubeEndpoint(x, y) {
  return {
    x: Math.max(10, Math.min(canvas.width - 10, x)),
    y: Math.max(10, Math.min(canvas.height - 10, y))
  };
}

function finalizeTubeConnections(tube) {
  if (!tube?.state) return;

  const snapStart = findSnapPoint(tube.state.startX, tube.state.startY);
  const snapEnd = findSnapPoint(tube.state.endX, tube.state.endY);

  if (snapStart) {
    tube.state.startX = snapStart.x;
    tube.state.startY = snapStart.y;
    tube.state.startAttach = snapStart.attach;
  } else {
    tube.state.startAttach = null;
  }

  if (snapEnd) {
    tube.state.endX = snapEnd.x;
    tube.state.endY = snapEnd.y;
    tube.state.endAttach = snapEnd.attach;
  } else {
    tube.state.endAttach = null;
  }

  updateTubeCenter(tube);
  updateTubeFlowState();

  if (tube.state.startAttach && tube.state.endAttach) {
    showToast("导管两端已连接");
  } else if (tube.state.startAttach || tube.state.endAttach) {
    showToast("导管已接入");
  }
}

function updateAttachedTubes(movedItem) {
  canvasItems.filter(i => i.type === "tube").forEach(tube => {
    const s = tube.state;
    if (!s) return;

    if (s.startAttach?.targetId === movedItem.id) {
      const pt = getAttachPointPosition(s.startAttach);
      if (pt) {
        s.startX = pt.x;
        s.startY = pt.y;
      }
    }
    if (s.endAttach?.targetId === movedItem.id) {
      const pt = getAttachPointPosition(s.endAttach);
      if (pt) {
        s.endX = pt.x;
        s.endY = pt.y;
      }
    }
    updateTubeCenter(tube);
  });
}

function tubeConnectsTesttubeAndWater(tube) {
  const s = tube.state;
  if (!s?.startAttach || !s?.endAttach) return false;

  const types = [s.startAttach.targetType, s.endAttach.targetType];
  const hasTube = types.includes("testtube");
  const hasWater = types.includes("trough") || types.includes("beaker");
  return hasTube && hasWater;
}

function updateTubeFlowState() {
  const hasReaction = canvasItems.some(i => i.type === "testtube" && i.state?.reacting);

  canvasItems.filter(i => i.type === "tube").forEach(tube => {
    tube.state = tube.state || {};
    tube.state.flowing = hasReaction && (tube.state.startAttach || tube.state.endAttach);
  });
}

// 带火星木条绘制
function drawSplint(ctx, x, y, scale = 1, state = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.strokeStyle = "#8B4513";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-25, 0);
  ctx.lineTo(22, 0);
  ctx.stroke();

  if (state.relit) {
    const gradient = ctx.createRadialGradient(28, 0, 0, 28, 0, 14);
    gradient.addColorStop(0, "#fff9c4");
    gradient.addColorStop(0.4, "#ffeb3b");
    gradient.addColorStop(1, "#ff5722");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(28, -14);
    ctx.quadraticCurveTo(38, 0, 28, 14);
    ctx.quadraticCurveTo(18, 0, 28, -14);
    ctx.fill();
  } else {
    ctx.fillStyle = "#ff5722";
    ctx.beginPath();
    ctx.arc(24, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffeb3b";
    ctx.beginPath();
    ctx.arc(25, -1, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 试剂小瓶绘制
function drawReagentBottle(ctx, x, y, state = {}) {
  const tilt = state.tilt || 0;
  const color = state.reagentColor || "#87CEEB";
  const remaining = state.remaining ?? 1;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);

  ctx.strokeStyle = "rgba(200, 230, 255, 0.85)";
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-12, -18);
  ctx.lineTo(-12, 14);
  ctx.lineTo(12, 14);
  ctx.lineTo(12, -18);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = "#666";
  ctx.fillRect(-5, -24, 10, 5);

  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  const liquidH = Math.max(2, remaining * 26);
  ctx.fillRect(-10, 14 - liquidH, 20, liquidH);
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-8, -12);
  ctx.lineTo(-8, 10);
  ctx.stroke();

  if (state.pouring && remaining > 0.02) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(0, 28);
    ctx.stroke();
  }

  ctx.restore();

  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(state.reagentName || "试剂", x, y + 32);
}

function drawPourDial() {
  if (!pourState.active) return;

  const cx = pourState.dialCenter.x;
  const cy = pourState.dialCenter.y;
  const r = POUR_DIAL_RADIUS;
  const progress = pourState.dialAngle / POUR_DIAL_ARC_SPAN;
  const knobAngle = POUR_DIAL_ARC_START + pourState.dialAngle;
  const knobX = cx + Math.cos(knobAngle) * r;
  const knobY = cy + Math.sin(knobAngle) * r;

  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.arc(cx, cy, r + 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, r, POUR_DIAL_ARC_START, POUR_DIAL_ARC_START + POUR_DIAL_ARC_SPAN);
  ctx.stroke();

  ctx.strokeStyle = "#d678ff";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, POUR_DIAL_ARC_START, knobAngle);
  ctx.stroke();

  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(214, 120, 255, 0.6)";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(knobX, knobY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(knobX, knobY);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = "11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("旋转控制倒入量", cx, cy + r + 22);
  ctx.fillText(`${Math.round(progress * 100)}%`, cx, cy + 5);
}

function drawPourStream() {
  if (!pourState.active || pourState.dialAngle <= 0.02) return;

  const bottle = pourState.bottle;
  const target = pourState.target;
  if (!bottle || !target) return;

  const mouth = getContainerMouthPos(target);
  const bx = bottle.x + Math.sin(bottle.state?.tilt || 0) * 14;
  const by = bottle.y + Math.cos(bottle.state?.tilt || 0) * 14 + 10;

  ctx.strokeStyle = bottle.state.reagentColor || "#87CEEB";
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.65;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.quadraticCurveTo((bx + mouth.x) / 2, (by + mouth.y) / 2 - 20, mouth.x, mouth.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

// 分液漏斗绘制
function drawSeparatoryFunnel(ctx, x, y, scale = 1, liquidLevel = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(200, 230, 255, 0.8)";
  ctx.beginPath();
  ctx.moveTo(-8, -80);
  ctx.lineTo(-8, -30);
  ctx.quadraticCurveTo(-15, -10, -5, 20);
  ctx.lineTo(-3, 50);
  ctx.lineTo(3, 50);
  ctx.lineTo(5, 20);
  ctx.quadraticCurveTo(15, -10, 8, -30);
  ctx.lineTo(8, -80);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, -80, 12, 4, 0, 0, Math.PI * 2);
  ctx.stroke();

  if (liquidLevel > 0) {
    ctx.fillStyle = "rgba(200, 230, 255, 0.5)";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    const ly = -20 + (1 - liquidLevel) * 30;
    ctx.moveTo(-6, ly);
    ctx.lineTo(-6, 20);
    ctx.quadraticCurveTo(-10, 25, -3, 48);
    ctx.lineTo(3, 48);
    ctx.quadraticCurveTo(10, 25, 6, 20);
    ctx.lineTo(6, ly);
    ctx.quadraticCurveTo(0, ly + 3, -6, ly);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

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
  document.getElementById("rotateItem").addEventListener("click", rotateSelectedItem);

  // 弹窗关闭
  document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("resultModal").classList.remove("show");
  });

  // Canvas 拖拽事件
  setupCanvasDragEvents();
}

// Canvas 拖拽事件设置
function setupCanvasDragEvents() {
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("dblclick", handleDoubleClick);
  canvas.addEventListener("contextmenu", handleContextMenu);

  // 器材库点击选择
  document.querySelectorAll(".material-item").forEach(item => {
    item.addEventListener("dragstart", (e) => e.preventDefault());
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      document.querySelectorAll(".material-item").forEach(i => i.classList.remove("selected"));
      item.classList.add("selected");

      dragSource = "sidebar";
      draggedItem = { type: item.dataset.type, isNew: true };

      showToast(`已选择 ${item.querySelector("span").textContent}，请在实验台上点击放置`);
    });
  });

  // 试剂库事件委托（动态生成）
  document.getElementById("reagentsGrid").addEventListener("click", handleReagentClick);
}

function beginDragTracking() {
  if (dragActive) return;
  dragActive = true;
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  canvas.style.cursor = "grabbing";
}

function endDragTracking() {
  if (!dragActive) return;
  dragActive = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  canvas.style.cursor = "default";
}

function handleReagentClick(e) {
  const item = e.target.closest(".reagent-item");
  if (!item) return;

  e.preventDefault();
  canvasItems = canvasItems.filter(i => i.type !== "reagentBottle");
  resetPourState();

  const reagentId = item.dataset.id;
  const name = item.querySelector("span").textContent;
  const color = REAGENT_COLORS[reagentId] || "#87CEEB";

  const bottle = {
    type: "reagentBottle",
    x: canvas.width / 2,
    y: canvas.height / 2 - 30,
    id: Date.now(),
    state: {
      reagentId,
      reagentName: name,
      reagentColor: color,
      tilt: 0,
      remaining: 1,
      pouring: false
    }
  };

  canvasItems.push(bottle);
  selectedItem = bottle;
  showToast(`已取出 ${name}，拖动试剂瓶靠近试管/烧杯`);
}

function isPourableContainer(item) {
  return item && (item.type === "testtube" || item.type === "beaker" || item.type === "flask");
}

function getContainerMouthPos(container) {
  if (container.type === "testtube") return { x: container.x, y: container.y - 58 };
  if (container.type === "beaker") return { x: container.x, y: container.y - 48 };
  if (container.type === "flask") return { x: container.x, y: container.y - 52 };
  return { x: container.x, y: container.y };
}

function findPourTarget(bottle) {
  let best = null;
  let bestDist = POUR_PROXIMITY;

  canvasItems.forEach(item => {
    if (!isPourableContainer(item)) return;
    const mouth = getContainerMouthPos(item);
    const dist = Math.hypot(bottle.x - mouth.x, bottle.y - mouth.y);
    if (dist < bestDist) {
      best = item;
      bestDist = dist;
    }
  });

  return best;
}

function resetPourState() {
  pourState.active = false;
  pourState.bottle = null;
  pourState.target = null;
  pourState.dialAngle = 0;
  pourState.dialDragging = false;
}

function updatePourProximity(bottle) {
  if (!bottle || bottle.type !== "reagentBottle") return;

  const target = findPourTarget(bottle);
  bottle.state = bottle.state || {};

  if (target) {
    const mouth = getContainerMouthPos(target);
    const dx = mouth.x - bottle.x;
    const dy = mouth.y - bottle.y;
    bottle.state.tilt = Math.atan2(dy, dx) + Math.PI / 2;
    bottle.state.pouring = true;
    bottle.state.pourTargetId = target.id;

    pourState.active = true;
    pourState.bottle = bottle;
    pourState.target = target;
    pourState.dialCenter = { x: bottle.x + 62, y: bottle.y - 10 };
  } else {
    bottle.state.tilt = 0;
    bottle.state.pouring = false;
    bottle.state.pourTargetId = null;
    if (pourState.bottle === bottle) {
      resetPourState();
    }
  }
}

function isPointOnPourDial(x, y) {
  if (!pourState.active) return false;
  const cx = pourState.dialCenter.x;
  const cy = pourState.dialCenter.y;
  const dist = Math.hypot(x - cx, y - cy);
  if (dist <= POUR_DIAL_RADIUS + 18) return true;

  const knobAngle = POUR_DIAL_ARC_START + pourState.dialAngle;
  const knobX = cx + Math.cos(knobAngle) * POUR_DIAL_RADIUS;
  const knobY = cy + Math.sin(knobAngle) * POUR_DIAL_RADIUS;
  return Math.hypot(x - knobX, y - knobY) < 14;
}

function getDialAngleFromMouse(x, y) {
  const dx = x - pourState.dialCenter.x;
  const dy = y - pourState.dialCenter.y;
  let angle = Math.atan2(dy, dx) - POUR_DIAL_ARC_START;
  if (angle < 0) angle = 0;
  if (angle > POUR_DIAL_ARC_SPAN) angle = POUR_DIAL_ARC_SPAN;
  return angle;
}

function applyPourFromDial(angle) {
  pourState.dialAngle = angle;
  const bottle = pourState.bottle;
  const target = pourState.target;
  if (!bottle || !target) return;

  const ratio = angle / POUR_DIAL_ARC_SPAN;

  target.state = target.state || {};
  target.state.liquidLevel = Math.min(0.92, ratio * 0.85);
  target.state.liquidColor = bottle.state.reagentColor;
  target.state.reagentId = bottle.state.reagentId;
  target.state.filled = target.state.liquidLevel > 0.05;

  bottle.state.remaining = Math.max(0, 1 - ratio);
  bottle.state.pouring = ratio > 0.01;
}

function containerHasLiquid(item) {
  return (item.state?.liquidLevel || 0) > 0.05 || item.state?.filled;
}

// 获取鼠标在 Canvas 中的位置（含 CSS 缩放换算）
function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

function isGasJar(item) {
  return item.type === "gastank" || item.type === "gasjar";
}

function isWaterContainer(item) {
  return item.type === "trough" ||
    (item.type === "beaker" && (item.state?.hasWater || item.state?.liquidLevel > 0));
}

function itemsOverlap(a, b) {
  const ta = EQUIPMENT_TYPES[a.type];
  const tb = EQUIPMENT_TYPES[b.type];
  if (!ta || !tb) return false;
  return Math.abs(a.x - b.x) < (ta.width + tb.width) * 0.45 &&
    Math.abs(a.y - b.y) < (ta.height + tb.height) * 0.45;
}

function rotateGasJar(item) {
  if (!isGasJar(item)) return;
  item.state = item.state || {};
  item.state.rotation = item.state.rotation === Math.PI ? 0 : Math.PI;
  const method = item.state.rotation ? "排水法（倒置）" : "向上排空气法（正置）";
  showToast(`集气瓶已旋转：${method}`);
  checkGasJarInWater(item);
}

function rotateSelectedItem() {
  if (!selectedItem || !isGasJar(selectedItem)) {
    showToast("请先选中集气瓶");
    return;
  }
  rotateGasJar(selectedItem);
}

function checkGasJarInWater(jar = null) {
  const jars = jar ? [jar] : canvasItems.filter(isGasJar);

  jars.forEach(item => {
    item.state = item.state || {};
    if (item.state.rotation !== Math.PI) {
      item.state.inWater = false;
      return;
    }

    const trough = canvasItems.find(t => isWaterContainer(t));
    if (trough && itemsOverlap(item, trough)) {
      const wasInWater = !!item.state.inWater;
      item.state.inWater = true;
      item.x = trough.x;
      item.y = trough.y - 38;
      if (!wasInWater) {
        showToast("集气瓶已倒置放入水槽（排水法）");
      }
    } else {
      item.state.inWater = false;
    }
  });
}

function getDrawPriority(item) {
  if (item.type === "trough") return 0;
  if (item.type === "beaker" && item.state?.liquidLevel > 0) return 0;
  if (isGasJar(item) && item.state?.inWater) return 2;
  if (item.type === "reagentBottle") return 3;
  return 1;
}

function createPlacedItem(type, x, y) {
  const item = { type, x, y, id: Date.now(), state: {} };
  if (type === "trough") {
    item.state = { hasWater: true, waterLevel: 0.65 };
  }
  if (type === "splint") {
    item.state = { ember: true };
  }
  if (type === "tube") {
    item.state = {
      startX: x - 50,
      startY: y - 10,
      endX: x + 50,
      endY: y + 10,
      startAttach: null,
      endAttach: null,
      flowing: false
    };
  }
  return item;
}

function experimentUsesSplint() {
  return !!currentExp?.equipment?.some(e => e.includes("带火星木条"));
}

function jarHasOxygen(jar) {
  return !!(jar.state?.filled || jar.state?.collecting || gasProduced >= 0.3);
}

function getGasJarMouthPos(jar) {
  const mouthOffset = jar.state?.rotation === Math.PI ? 52 : -52;
  return { x: jar.x, y: jar.y + mouthOffset };
}

function isSplintNearJarMouth(splint, jar) {
  const mouth = getGasJarMouthPos(jar);
  return Math.abs(splint.x - mouth.x) < 45 && Math.abs(splint.y - mouth.y) < 40;
}

function checkSplintVerification() {
  if (!experimentUsesSplint()) return;

  canvasItems.filter(i => i.type === "splint").forEach(splint => {
    splint.state = splint.state || {};
    if (splint.state.relit) return;

    canvasItems.filter(isGasJar).forEach(jar => {
      if (!isSplintNearJarMouth(splint, jar)) return;

      if (jarHasOxygen(jar)) {
        splint.state.relit = true;
        jar.state = jar.state || {};
        jar.state.verified = true;
        showToast("带火星木条复燃，氧气已验满！");
      } else {
        showToast("集气瓶内氧气不足，木条火星熄灭");
      }
    });
  });
}

function clampItemPosition(item) {
  const type = EQUIPMENT_TYPES[item.type];
  if (!type) return;
  item.x = Math.max(type.width / 2, Math.min(canvas.width - type.width / 2, item.x));
  item.y = Math.max(type.height / 2, Math.min(canvas.height - type.height / 2, item.y));
}

// 检查点击是否在器材上
function getItemAtPos(x, y) {
  const tubeHit = getTubeInteraction(x, y);
  if (tubeHit) return tubeHit;

  for (let i = canvasItems.length - 1; i >= 0; i--) {
    const item = canvasItems[i];
    if (item.type === "tube") continue;
    const type = EQUIPMENT_TYPES[item.type];
    if (type) {
      const halfW = type.width / 2;
      const halfH = type.height / 2;
      if (x >= item.x - halfW && x <= item.x + halfW &&
          y >= item.y - halfH && y <= item.y + halfH) {
        return { item, index: i };
      }
    }
  }
  return null;
}

// 鼠标按下
function handleMouseDown(e) {
  if (e.button !== 0) return;

  const pos = getMousePos(e);

  if (pourState.active && isPointOnPourDial(pos.x, pos.y)) {
    pourState.dialDragging = true;
    pourState.dialAngle = getDialAngleFromMouse(pos.x, pos.y);
    applyPourFromDial(pourState.dialAngle);
    beginDragTracking();
    return;
  }

  const clicked = getItemAtPos(pos.x, pos.y);

  if (clicked) {
    const item = clicked.item;

    if (item.type === "tube" && clicked.part) {
      selectedItem = item;
      dragSource = "canvas";
      draggedItem = item;
      tubeDragPart = clicked.part;
      isDragging = true;

      if (clicked.part === "body") {
        tubeBodyOrigin = {
          startX: item.state.startX,
          startY: item.state.startY,
          endX: item.state.endX,
          endY: item.state.endY,
          mx: pos.x,
          my: pos.y
        };
      } else {
        tubeBodyOrigin = null;
      }

      beginDragTracking();
      return;
    }

    if (item.type === "burner") {
      const burnerY = item.y - 25;
      if (Math.abs(pos.y - burnerY) < 20 && Math.abs(pos.x - item.x) < 15) {
        item.state = item.state || {};
        item.state.burning = !item.state.burning;
        checkReactions();
        return;
      }
    }

    dragSource = "canvas";
    draggedItem = item;
    selectedItem = item;
    dragOffset.x = pos.x - item.x;
    dragOffset.y = pos.y - item.y;
    isDragging = true;
    beginDragTracking();
  } else if (draggedItem && draggedItem.isNew) {
    const newItem = createPlacedItem(draggedItem.type, pos.x, pos.y);
    clampItemPosition(newItem);
    canvasItems.push(newItem);
    draggedItem = newItem;
    selectedItem = newItem;
    dragOffset.x = 0;
    dragOffset.y = 0;
    draggedItem.isNew = false;
    isDragging = true;
    beginDragTracking();
    checkStepCompletion();
  } else {
    selectedItem = null;
  }
}

// 检查反应条件
function checkReactions() {
  canvasItems.forEach(item => {
    if (item.type === "burner" && item.state?.burning) {
      const testTube = canvasItems.find(other =>
        other.type === "testtube" &&
        Math.abs(other.x - item.x) < 50 &&
        other.y < item.y &&
        item.y - other.y < 100
      );

      if (testTube && containerHasLiquid(testTube)) {
        testTube.state.reacting = true;

        if (testTube.state.liquidColor === "#8B008B") {
          gasProduced += 0.1;
          updateGasDisplay();
          collectOxygenInJar();
          updateTubeFlowState();
        }
      }
    }
  });
}

function collectOxygenInJar() {
  const hasReaction = canvasItems.some(i => i.type === "testtube" && i.state?.reacting);

  canvasItems.filter(isGasJar).forEach(jar => {
    jar.state = jar.state || {};

    if (jar.state.inWater && jar.state.rotation === Math.PI && hasReaction) {
      jar.state.collecting = true;
      jar.state.filled = true;
    } else if (!jar.state.rotation && hasReaction) {
      jar.state.collecting = true;
      jar.state.filled = true;
    }
  });
}

// 鼠标移动
function handleMouseMove(e) {
  const pos = getMousePos(e);

  if (pourState.dialDragging) {
    const angle = getDialAngleFromMouse(pos.x, pos.y);
    applyPourFromDial(angle);
    return;
  }

  if (!isDragging || !draggedItem) return;

  if (draggedItem.type === "tube" && tubeDragPart) {
    const s = draggedItem.state;
    if (tubeDragPart === "start") {
      const p = clampTubeEndpoint(pos.x, pos.y);
      s.startX = p.x;
      s.startY = p.y;
      s.startAttach = null;
    } else if (tubeDragPart === "end") {
      const p = clampTubeEndpoint(pos.x, pos.y);
      s.endX = p.x;
      s.endY = p.y;
      s.endAttach = null;
    } else if (tubeDragPart === "body" && tubeBodyOrigin) {
      const dx = pos.x - tubeBodyOrigin.mx;
      const dy = pos.y - tubeBodyOrigin.my;
      s.startX = tubeBodyOrigin.startX + dx;
      s.startY = tubeBodyOrigin.startY + dy;
      s.endX = tubeBodyOrigin.endX + dx;
      s.endY = tubeBodyOrigin.endY + dy;
      s.startAttach = null;
      s.endAttach = null;
    }
    updateTubeCenter(draggedItem);
    return;
  }

  draggedItem.x = pos.x - dragOffset.x;
  draggedItem.y = pos.y - dragOffset.y;
  clampItemPosition(draggedItem);

  if (draggedItem.type !== "tube" && draggedItem.type !== "reagentBottle") {
    updateAttachedTubes(draggedItem);
  }

  if (draggedItem.type === "reagentBottle") {
    updatePourProximity(draggedItem);
  }
}

// 鼠标释放
function handleMouseUp(e) {
  if (pourState.dialDragging) {
    pourState.dialDragging = false;
    endDragTracking();
    checkReactions();
    checkStepCompletion();
    return;
  }

  if (!isDragging) return;

  isDragging = false;
  endDragTracking();

  if (draggedItem?.type === "tube" && tubeDragPart) {
    finalizeTubeConnections(draggedItem);
    tubeDragPart = null;
    tubeBodyOrigin = null;
  } else if (draggedItem && draggedItem.type !== "tube" && draggedItem.type !== "reagentBottle") {
    updateAttachedTubes(draggedItem);
  }

  if (draggedItem?.type === "reagentBottle") {
    updatePourProximity(draggedItem);
  }

  if (dragSource === "sidebar") {
    document.querySelectorAll(".material-item").forEach(i => i.classList.remove("selected"));
  }

  draggedItem = null;
  dragSource = null;
  tubeDragPart = null;
  tubeBodyOrigin = null;
  checkGasJarInWater();
  checkSplintVerification();
  checkStepCompletion();
}

function handleDoubleClick(e) {
  const pos = getMousePos(e);
  const clicked = getItemAtPos(pos.x, pos.y);
  if (!clicked || !isGasJar(clicked.item)) return;
  selectedItem = clicked.item;
  rotateGasJar(clicked.item);
}

// 右键删除器材
function handleContextMenu(e) {
  e.preventDefault();
  const pos = getMousePos(e);
  const clicked = getItemAtPos(pos.x, pos.y);
  if (!clicked) return;

  canvasItems.splice(clicked.index, 1);
  if (selectedItem === clicked.item) {
    selectedItem = null;
  }
  showToast("已删除器材");
  checkStepCompletion();
}

// 选择实验
function selectExperiment(expId) {
  currentExpId = expId;
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

  // 重置并自动摆放器材
  currentStep = 0;
  gasProduced = 0;
  setupExperimentScene(expId);
  updateGasDisplay();
  updateSteps();
  showToast(`已摆放「${currentExp.name}」器材，请按步骤手动操作`);
}

// 切换实验运行状态 - 改为检查实验
function toggleExperiment() {
  checkStepCompletion();
}

function startExperiment() {
  // 手动模式下不需要自动开始
  checkStepCompletion();
}

function stopExperiment() {
  // 手动模式下不需要停止
}

function setupExperimentScene(expId) {
  const layout = EXPERIMENT_SCENES[expId];
  canvasItems = [];
  selectedItem = null;
  draggedItem = null;
  tubeDragPart = null;
  tubeBodyOrigin = null;
  resetPourState();

  if (!layout) return;

  layout.forEach((cfg, i) => {
    const item = createPlacedItem(cfg.type, cfg.x, cfg.y);
    item.id = Date.now() + i * 137;
    if (cfg.state) {
      item.state = { ...item.state, ...cfg.state };
    }
    canvasItems.push(item);
  });

  updateTubeFlowState();
}

function resetExperiment() {
  stopExperiment();
  currentStep = 0;
  gasProduced = 0;
  selectedItem = null;
  draggedItem = null;
  isDragging = false;
  dragSource = null;
  tubeDragPart = null;
  tubeBodyOrigin = null;
  endDragTracking();
  document.querySelectorAll(".material-item").forEach(i => i.classList.remove("selected"));
  if (currentExpId) {
    setupExperimentScene(currentExpId);
  } else {
    canvasItems = [];
    resetPourState();
  }
  updateGasDisplay();
  updateSteps();
  drawLab();
}

function cycleSpeed() {
  expSpeed = expSpeed === 1 ? 2 : expSpeed === 2 ? 3 : 1;
  document.getElementById("speedExp").title = `速度: ${expSpeed}x`;
}

// 检查实验步骤完成情况
function checkStepCompletion() {
  if (!currentExp) return;

  // 根据当前实验和已放置的器材检查步骤
  const requiredEquipment = currentExp.equipment;
  const placedTypes = canvasItems.map(item => item.type);

  // 检查是否放置了所需器材
  let completedSteps = 0;
  currentExp.steps.forEach((step, index) => {
    // 简化版：检查关键词匹配
    const stepText = step.text;
    if (stepText.includes("酒精灯") && placedTypes.includes("burner")) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if (stepText.includes("试管") && placedTypes.includes("testtube")) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if ((stepText.includes("加入") || stepText.includes("倒入")) &&
        canvasItems.some(i => isPourableContainer(i) && (i.state?.liquidLevel || 0) > 0.1)) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if (stepText.includes("锥形瓶") && placedTypes.includes("flask")) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if (stepText.includes("导管") && placedTypes.includes("tube")) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if (stepText.includes("导管") &&
        canvasItems.some(t => t.type === "tube" && t.state?.startAttach && t.state?.endAttach)) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if ((stepText.includes("气密性") || stepText.includes("装置")) &&
        canvasItems.some(t => t.type === "tube" && tubeConnectsTesttubeAndWater(t))) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if (stepText.includes("集气瓶") && (placedTypes.includes("gastank") || placedTypes.includes("gasjar"))) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if (stepText.includes("水槽") && (placedTypes.includes("trough") || canvasItems.some(isWaterContainer))) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if ((stepText.includes("排水") || stepText.includes("倒置")) &&
        canvasItems.some(i => isGasJar(i) && i.state?.rotation === Math.PI && i.state?.inWater)) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if (stepText.includes("向上排空气") &&
        canvasItems.some(i => isGasJar(i) && !i.state?.rotation)) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
    if ((stepText.includes("验满") || stepText.includes("木条")) &&
        canvasItems.some(i => i.type === "splint" && i.state?.relit)) {
      completedSteps = Math.max(completedSteps, index + 1);
    }
  });

  currentStep = completedSteps;
  updateSteps();

  // 检查是否完成所有步骤
  if (currentStep >= currentExp.steps.length) {
    showResult();
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

// 显示提示消息
function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 12px 24px;
    color: var(--text-color);
    font-size: 14px;
    z-index: 10000;
    backdrop-filter: blur(10px);
    animation: fadeInOut 2s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    20% { opacity: 1; transform: translateX(-50%) translateY(0); }
    80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  }
`;
document.head.appendChild(style);

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

  // 绘制用户放置的器材（水槽在下，入水集气瓶在上）
  [...canvasItems]
    .sort((a, b) => getDrawPriority(a) - getDrawPriority(b))
    .forEach(item => {
      drawCanvasItem(item);
    });

  // 绘制选中框（导管用端点手柄，不画外框）
  if (selectedItem && selectedItem.type !== "tube") {
    const type = EQUIPMENT_TYPES[selectedItem.type];
    if (type) {
      ctx.strokeStyle = "#d678ff";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        selectedItem.x - type.width / 2 - 5,
        selectedItem.y - type.height / 2 - 5,
        type.width + 10,
        type.height + 10
      );
      ctx.setLineDash([]);
    }
  }

  // 绘制标题
  if (currentExp) {
    ctx.fillStyle = "#888";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(currentExp.name, canvas.width / 2, 30);
  }
  
  // 绘制操作提示
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("拖导管紫/绿端点接入试管或水槽 | 拖中间移动整根导管", canvas.width / 2, canvas.height - 20);

  drawPourStream();
  drawPourDial();
}

// 绘制 Canvas 上的单个器材
function drawCanvasItem(item) {
  switch (item.type) {
    case 'beaker':
      drawEquipment.beaker(ctx, item.x, item.y, 1, item.state?.liquidLevel || 0, item.state?.liquidColor);
      break;
    case 'testtube':
      drawEquipment.testtube(
        ctx, item.x, item.y, 1,
        item.state?.liquidLevel || (item.state?.filled ? 0.5 : 0),
        item.state?.liquidColor
      );
      break;
    case 'flask':
      drawEquipment.flask(ctx, item.x, item.y, 1, item.state?.liquidLevel || 0, item.state?.liquidColor);
      break;
    case 'burner':
      drawEquipment.burner(ctx, item.x, item.y, 1, item.state?.burning);
      break;
    case 'tube':
      drawFlexibleTube(ctx, item);
      break;
    case 'ironstand':
      drawIronStand(ctx, item.x, item.y, 1);
      break;
    case 'gasjar':
    case 'gastank':
      drawGasJar(ctx, item.x, item.y, 1, item.state || {});
      break;
    case 'trough':
      drawWaterTrough(ctx, item.x, item.y, 1, item.state || {});
      break;
    case 'splint':
      drawSplint(ctx, item.x, item.y, 1, item.state || {});
      break;
    case 'reagentBottle':
      drawReagentBottle(ctx, item.x, item.y, item.state || {});
      break;
    case 'separatory':
      drawSeparatoryFunnel(ctx, item.x, item.y, 1, item.state?.liquidLevel || 0);
      break;
  }

  // 绘制器材名称
  const type = EQUIPMENT_TYPES[item.type];
  if (type) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(type.name, item.x, item.y + type.height / 2 + 15);
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

  // 试管 - 使用精细版，紫色高锰酸钾液体
  if (step >= 1) {
    drawEquipment.testtube(ctx, x + 40, 280, 1, step >= 2 ? 0.45 : 0, "#8B008B");
  }

  // 酒精灯 - 带火焰效果
  if (step >= 4) {
    drawEquipment.burner(ctx, x + 200, 360, 0.8, step >= 4);
  }

  // 导管
  if (step >= 5) {
    ctx.strokeStyle = "rgba(200, 230, 255, 0.6)";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + 48, 290);
    ctx.lineTo(x + 120, 290);
    ctx.lineTo(x + 120, 320);
    ctx.stroke();

    // 玻璃反光
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 46, 288);
    ctx.lineTo(x + 118, 288);
    ctx.stroke();
  }

  // 气泡 - 增强版
  if (step >= 5) {
    drawEquipment.gasbubbles(ctx, x + 120, 320, 5, "rgba(255, 255, 255, 0.8)");
  }

  // 水槽 - 精细版
  if (step >= 5) {
    drawEquipment.beaker(ctx, x + 230, 400, 1.2, 0.6, "rgba(100, 150, 200, 0.4)");
  }
}

function drawH2O2Exp(step) {
  const x = canvas.width / 2;

  // 锥形瓶 - 使用精细版，带液体
  if (step >= 2) {
    drawEquipment.flask(ctx, x - 80, 320, 1, step >= 3 ? 0.3 : 0, "#E6E6FA");
  }

  // 分液漏斗 - 精细版
  if (step >= 3) {
    drawEquipment.flask(ctx, x - 80, 220, 0.6, 0.5, "#E6E6FA");
    // 漏斗颈部
    ctx.fillStyle = "rgba(200, 230, 255, 0.6)";
    ctx.fillRect(x - 85, 260, 10, 40);
  }

  // 二氧化锰（催化剂）- 黑色颗粒
  if (step >= 2) {
    ctx.fillStyle = "#2F4F4F";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(x - 75 + i * 8, 350 + Math.sin(i) * 5, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 导管和气泡
  if (step >= 4) {
    ctx.strokeStyle = "rgba(200, 230, 255, 0.6)";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 40, 320);
    ctx.lineTo(x + 20, 320);
    ctx.lineTo(x + 20, 360);
    ctx.stroke();

    // 玻璃反光
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 42, 318);
    ctx.lineTo(x + 18, 318);
    ctx.stroke();

    drawEquipment.gasbubbles(ctx, x + 20, 360, 6, "rgba(255, 255, 255, 0.8)");
  }
}

function drawH2Exp(step) {
  const x = canvas.width / 2;

  // 试管
  if (step >= 2) {
    drawEquipment.testtube(ctx, x, 280, 1, step >= 3 ? 0.4 : 0);
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

// 动画循环 - 手动模式
function animationLoop() {
  // 始终绘制用户放置的器材
  drawLab();
  
  // 绘制反应动画（如果有）
  drawReactions();
  
  requestAnimationFrame(animationLoop);
}

// 绘制反应效果
function drawReactions() {
  // 检查是否有正在进行的反应
  canvasItems.forEach(item => {
    if (item.state?.reacting) {
      // 绘制气泡效果
      if (item.type === 'testtube' || item.type === 'flask') {
        drawEquipment.gasbubbles(ctx, item.x, item.y - 20, 5, "rgba(255, 255, 255, 0.8)");
      }
    }
    
    // 酒精灯火焰
    if (item.type === "burner" && item.state?.burning) {
      drawEquipment.burner(ctx, item.x, item.y, 1, true);
    }

    if (isGasJar(item) && item.state?.collecting && item.state?.inWater) {
      drawEquipment.gasbubbles(ctx, item.x, item.y + 25, 4, "rgba(255, 255, 255, 0.75)");
    }
  });
}

// 绘制默认实验器材（未开始实验时）
function drawDefaultEquipment() {
  const x = canvas.width / 2;

  // 显示提示文字
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("点击'开始实验'观看演示", canvas.width / 2, 200);

  switch (currentExp.name) {
    case "高锰酸钾制氧气":
      // 铁架台
      ctx.fillStyle = "#666";
      ctx.fillRect(x - 130, 200, 10, 200);
      ctx.fillRect(x + 20, 200, 10, 200);
      ctx.fillRect(x - 130, 195, 160, 10);
      // 试管 - 精细版
      drawEquipment.testtube(ctx, x - 60, 280, 1, 0);
      // 酒精灯 - 精细版
      drawEquipment.burner(ctx, x + 100, 360, 0.8, false);
      break;
    case "过氧化氢制氧气":
      drawEquipment.flask(ctx, x - 80, 320, 1, 0, null);
      break;
    case "锌粒制氢气":
      drawEquipment.testtube(ctx, x, 280, 1, 0);
      break;
    case "石灰石制二氧化碳":
      drawEquipment.flask(ctx, x - 100, 320, 1, 0, null);
      break;
    default:
      drawEquipment.beaker(ctx, x, 350, 1, 0, null);
  }
}

// 页面加载完成后初始化
window.addEventListener("load", () => {
  init();
  animationLoop();
});