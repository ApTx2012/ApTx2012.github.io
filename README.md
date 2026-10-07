# ApTx2012 · GitHub 数据看板

拉 GitHub 公开数据做成一个能看的页面：3D 粒子星系打底，ECharts 画贡献热力、语言构成、仓库星榜和活动流。数据每天由 Actions 自动更新。

## 有什么

- 3D 粒子星系背景，鼠标移动有视差
- 四块数据面板：贡献热力、语言构成、仓库星榜、活动流
- 滚动到哪块才渲染哪块，不浪费性能
- 移动端自动降低粒子数
- 数据每天自动更新（GitHub Actions + GraphQL）

## 技术栈

| 层 | 选型 |
|---|---|
| 构建 | Vite + TypeScript |
| 3D | Three.js |
| 图表 | ECharts |
| 动画 | GSAP |
| 数据 | GitHub GraphQL API |
| CI/CD | GitHub Actions |
| 部署 | GitHub Pages |

## 结构

```
ApTx2012.github.io/
├── index.html                 # 入口
├── src/
│   ├── main.ts                # 主入口
│   ├── core/                  # 星系、数据、动效
│   ├── charts/                # ECharts 图表
│   ├── components/            # UI 组件
│   ├── types/                 # TS 类型
│   └── styles/                # 样式
├── scripts/
│   └── fetch-github.mjs       # 数据拉取脚本
├── data/                      # 生成的 JSON 数据
└── .github/workflows/         # CI
```

## 本地开发

```bash
pnpm install
pnpm fetch    # 拉数据，没配 token 就用 mock
pnpm dev      # 起开发服务器
pnpm build    # 构建
```

## 配置 Token

数据拉取需要一个 GitHub Personal Access Token：

1. 去 [Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens) 建一个
2. 勾 `read:user` + `public_repo` 就够
3. 存到仓库 `Settings → Secrets and variables → Actions`，名字叫 `GH_DASHBOARD_TOKEN`

本地开发的话，把 `.env.example` 复制成 `.env`，填上 `GITHUB_TOKEN`。

## 许可

MIT