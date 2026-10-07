# ApTx2012 · GitHub Observatory 🛰️

> 一个数据驱动的 GitHub 观测站 —— 赛博朋克数据大屏 + 3D 粒子星系。
> 通过 GitHub Actions 定时拉取 GitHub 数据，静态部署到 GitHub Pages。

## ✨ 特性

- 🌌 **3D 粒子星系** —— Three.js 渲染，鼠标交互视差
- 📊 **数据可视化** —— ECharts 呈现贡献热力、语言构成、仓库星榜
- ⚡ **赛博朋克视觉** —— 霓虹、网格、扫描线、故障文字
- 🔄 **数据自动更新** —— GitHub Actions 定时拉取 GraphQL 数据
- 📱 **响应式** —— 移动端自适应，粒子数自动降级
- 🎬 **滚动叙事** —— 面板滚动进场，数字滚动动画

## 🏗️ 技术栈

| 层 | 选型 |
|---|---|
| 构建 | Vite + TypeScript |
| 3D | Three.js |
| 图表 | ECharts |
| 动画 | GSAP |
| 数据 | GitHub GraphQL API |
| CI/CD | GitHub Actions |
| 部署 | GitHub Pages |

## 📁 结构

```
ApTx2012.github.io/
├── index.html                 # 入口
├── src/
│   ├── main.ts                # 主入口
│   ├── core/                  # 核心模块（星系、数据、动效）
│   ├── charts/                # ECharts 图表
│   ├── components/            # UI 组件
│   ├── types/                 # TS 类型
│   └── styles/                # 样式
├── scripts/
│   └── fetch-github.mjs       # 数据拉取脚本
├── data/                      # 生成的 JSON 数据
└── .github/workflows/         # CI
```

## 🔧 本地开发

```bash
# 安装依赖
pnpm install

# 拉数据（无 token 用 mock）
pnpm fetch

# 启动开发服务器
pnpm dev

# 构建
pnpm build
```

## 🔐 配置 GitHub Token

数据拉取需要 GitHub Personal Access Token：

1. 访问 [Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. 创建 token，勾选 `read:user` + `public_repo`
3. 存到仓库 `Settings → Secrets and variables → Actions`，命名为 `GH_DASHBOARD_TOKEN`

本地开发：复制 `.env.example` 为 `.env`，填入 `GITHUB_TOKEN`。

## 📄 许可

MIT