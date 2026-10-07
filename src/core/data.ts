/**
 * 数据加载层
 * - 优先 fetch data/github.json（Actions 生成）
 * - 失败时回退到内置 mock（保证页面永不空白）
 */
import type { GithubData } from '@/types/github';

const DATA_URL = `${import.meta.env.BASE_URL}data/github.json`;

let cache: GithubData | null = null;

export async function loadGithubData(): Promise<GithubData> {
  if (cache) return cache;
  try {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as GithubData;
    cache = json;
    return json;
  } catch (err) {
    console.warn('[data] 加载 data/github.json 失败，使用内置 mock：', err);
    cache = buildFallback();
    return cache;
  }
}

/** 极端兜底：连 data 目录都没有时页面也能渲染 */
function buildFallback(): GithubData {
  const today = new Date();
  const weeks = [];
  for (let w = 0; w < 53; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(today.getTime() - (52 - w) * 7 * 86400000 - (6 - d) * 86400000);
      const count = Math.max(0, Math.round(Math.sin(w / 3) * 4 + Math.random() * 5));
      days.push({
        date: dt.toISOString().slice(0, 10),
        count,
        level: (count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4) as 0 | 1 | 2 | 3 | 4,
      });
    }
    weeks.push(days);
  }
  return {
    stats: {
      login: 'ApTx2012',
      name: 'AxTps',
      avatarUrl: 'https://github.com/ApTx2012.png',
      bio: '数据加载失败，展示占位',
      followers: 0,
      following: 0,
      publicRepos: 0,
      totalStars: 0,
      totalForks: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      contributedTo: 0,
      generatedAt: new Date().toISOString(),
    },
    repos: [],
    languages: [],
    contributions: { total: 0, weeks },
    activity: [],
  };
}