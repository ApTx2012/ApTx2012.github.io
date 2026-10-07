import '@/styles/main.css';
import { initGalaxy } from '@/core/galaxy';
import { loadGithubData } from '@/core/data';
import { renderContributions, renderLanguages, renderRepos, attachResize } from '@/charts';
import { animateNumber, observePanels } from '@/core/effects';
import { renderActivity } from '@/components/activity';

async function boot(): Promise<void> {
  // 1. 启动 3D 星系背景
  const canvas = document.getElementById('galaxy') as HTMLCanvasElement | null;
  const galaxy = canvas ? initGalaxy(canvas) : null;

  // 2. 加载数据
  const data = await loadGithubData();

  // 3. 副标题 & 徽标
  const subtitle = document.getElementById('heroSubtitle');
  if (subtitle) {
    subtitle.textContent = data.stats.bio || `@${data.stats.login} · GitHub 数据观测站`;
  }

  // 4. 主屏统计数字滚动
  const statMap: Record<string, number> = {
    stars: data.stats.totalStars,
    commits: data.stats.totalCommits,
    repos: data.stats.publicRepos,
    prs: data.stats.totalPRs,
  };
  document.querySelectorAll<HTMLElement>('.stat-card').forEach((card) => {
    const key = card.dataset.stat || '';
    const valueEl = card.querySelector<HTMLElement>('.stat-card__value');
    if (valueEl && key in statMap) {
      // 延迟到入场动画后
      setTimeout(() => animateNumber(valueEl, statMap[key]), 900);
    }
  });

  // 5. 图表延迟初始化（滚动到面板时再渲染，省性能）
  const charts: ReturnType<typeof renderContributions>[] = [];
  const rendered = new Set<string>();

  const contribTotal = document.getElementById('contribTotal');
  if (contribTotal) {
    contribTotal.textContent = `过去一年 ${data.contributions.total.toLocaleString('en-US')} 次贡献`;
  }

  observePanels((panel) => {
    const name = panel.dataset.panel;
    if (!name || rendered.has(name)) return;
    rendered.add(name);

    if (name === 'contributions') {
      const el = document.getElementById('chart-contributions');
      if (el) charts.push(renderContributions(el, data.contributions));
    } else if (name === 'languages') {
      const el = document.getElementById('chart-languages');
      if (el) charts.push(renderLanguages(el, data.languages));
    } else if (name === 'repos') {
      const el = document.getElementById('chart-repos');
      if (el) charts.push(renderRepos(el, data.repos));
    } else if (name === 'activity') {
      const el = document.getElementById('activity-list');
      if (el) renderActivity(el, data.activity);
    }
  });

  // 6. 统一 resize
  attachResize(charts);

  // 7. 页脚
  const footer = document.getElementById('footerInfo');
  if (footer) {
    const gen = new Date(data.stats.generatedAt);
    footer.textContent = `DATA SYNC · ${gen.toLocaleString('zh-CN')} · POWERED BY GITHUB GRAPHQL`;
  }

  // 清理钩子（HMR 友好）
  if (import.meta.hot) {
    import.meta.hot.dispose(() => galaxy?.destroy());
  }
}

boot().catch((err) => {
  console.error('[boot] 初始化失败:', err);
});