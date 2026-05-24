# AxTps 小屋 🏠

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://Aptx2012.github.io)
[![Rust](https://img.shields.io/badge/Rust-WASM-orange)](https://www.rust-lang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 一个以温暖氛围为主的个人主页，既有简洁信息，也有轻松互动。

## ✨ 特性

- 🎨 **玻璃拟态设计** - 半透明背景、柔和渐变、梦幻光斑
- 🌓 **深色/浅色主题** - 支持自动切换，保存用户偏好
- 🌐 **多语言支持** - 中文、English、日本語
- 🎮 **2048 游戏** - Rust + WASM 实现，支持 AI 自动玩
- 🧪 **化学实验室** - Canvas 仿真实验平台（开发中）
- 🎵 **网易云音乐** - 悬浮播放器，支持收起/展开
- 🌤️ **实时天气** - 自动定位显示当地天气
- ⚡ **性能优化** - 自动检测设备性能，调整动画效果

## 🚀 在线访问

**GitHub Pages**: [https://Aptx2012.github.io](https://Aptx2012.github.io)

## 📁 项目结构

```
ApTx2012.github.io/
├── index.html              # 主页
├── game2048.html           # 2048 游戏页面
├── chem-lab.html           # 化学实验室
├── css/
│   ├── style.css           # 主样式
│   ├── text-light.css      # 文字发光效果
│   └── chem-lab.css        # 实验室样式
├── js/
│   ├── script.js           # 主页逻辑
│   ├── 2048.js             # 游戏逻辑
│   └── chem-lab.js         # 实验室逻辑
├── src/
│   └── i18n/               # 多语言系统
│       ├── index.js        # 语言管理器
│       ├── styles.css      # 语言切换器样式
│       └── locales/        # 翻译文件
│           ├── zh.ts       # 中文
│           ├── en.ts       # 英文
│           └── ja.ts       # 日文
├── wasm-2048/              # Rust WASM 模块
│   ├── src/lib.rs          # 游戏核心 + AI 算法
│   └── pkg/                # 编译输出
├── wasm-chem/              # 化学计算 WASM 模块
│   └── src/lib.rs
├── img/                    # 图片资源
└── .github/workflows/      # CI/CD
    └── build-wasm.yml      # 自动编译 WASM
```

## 🛠️ 技术栈

| 类别     | 技术                            |
| -------- | ------------------------------- |
| 前端     | HTML5, CSS3, JavaScript (ES6+)  |
| 游戏逻辑 | Rust → WebAssembly (wasm-pack) |
| AI 算法  | Expectimax (2048 自动玩)        |
| 样式     | CSS Variables, Glassmorphism    |
| 构建     | GitHub Actions                  |

## 🎮 功能详解

### 2048 游戏

- 使用 **Rust + WASM** 实现高性能游戏逻辑
- **AI 自动玩** - Expectimax 算法，支持自动求解
- **秘技代码** - 输入 ↑↑↓↓←←→→BABA 触发彩蛋
- 支持键盘、触摸、滑动操作

### 多语言系统

- 自动检测浏览器语言
- 支持 中文 / English / 日本語
- 语言设置保存到 localStorage

## 🔧 本地开发

```bash
# 克隆仓库
git clone https://github.com/Aptx2012/ApTx2012.github.io.git
cd ApTx2012.github.io

# 启动本地服务器
python -m http.server 8080

# 访问 http://localhost:8080
```

### 编译 WASM

```bash
# 安装 wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# 编译 2048 游戏
cd wasm-2048
wasm-pack build --target web --out-dir pkg

# 编译化学实验室
cd wasm-chem
wasm-pack build --target web --out-dir pkg
```

## 📝 更新日志

### 2026-05-24

- ✨ 添加多语言国际化支持 (中/英/日)
- 🤖 2048 添加 AI 自动玩功能
- ⚙️ 配置 GitHub Actions 自动编译 WASM

### 2026-05-23

- 🧪 新增化学实验室页面
- 🎮 2048 游戏支持移动端触摸
- 🎵 添加网易云音乐播放器

### 2026-05-22

- 🎨 优化玻璃拟态效果
- ⚡ 添加性能模式自动检测
- 🌓 完善主题切换功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

[MIT License](LICENSE)

---

Made with ❤️ by AxTps
