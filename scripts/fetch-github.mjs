#!/usr/bin/env node
/**
 * GitHub 数据拉取脚本
 *
 * 用法：
 *   node scripts/fetch-github.mjs            # 自动：有 GITHUB_TOKEN 走 live，无则 mock
 *   node scripts/fetch-github.mjs --live     # 强制 live（无 token 报错）
 *   node scripts/fetch-github.mjs --mock     # 强制 mock
 *
 * 环境变量：
 *   GITHUB_TOKEN     GitHub PAT（read:user + public_repo）
 *   GITHUB_USERNAME  目标用户名（默认 ApTx2012）
 *
 * 输出：data/*.json
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');

// ---------- 配置 ----------
const USERNAME = process.env.GITHUB_USERNAME || 'ApTx2012';
const TOKEN = process.env.GITHUB_TOKEN || '';

// 手动读取 .env（避免引依赖）
function loadDotEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, 'utf-8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadDotEnv();

const FINAL_TOKEN = process.env.GITHUB_TOKEN || '';
const FINAL_USERNAME = process.env.GITHUB_USERNAME || USERNAME;

// ---------- 模式判定 ----------
const arg = process.argv[2] || '';
let MODE;
if (arg === '--live') MODE = 'live';
else if (arg === '--mock') MODE = 'mock';
else MODE = FINAL_TOKEN ? 'live' : 'mock';

if (MODE === 'live' && !FINAL_TOKEN) {
  console.error('[fetch] --live 模式需要 GITHUB_TOKEN，但未找到。');
  process.exit(1);
}

console.log(`[fetch] 模式=${MODE} 用户=${FINAL_USERNAME}${FINAL_TOKEN ? ' token=有' : ' token=无'}`);

// ---------- GraphQL 查询 ----------
const QUERY = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    login
    name
    avatarUrl
    bio
    followers { totalCount }
    following { totalCount }
    repositories(privacy: PUBLIC, isFork: false, first: 100,
      orderBy: { field: STARGAZERS, direction: DESC }) {
      totalCount
      nodes {
        name
        description
        url
        stargazerCount
        forkCount
        isFork
        updatedAt
        primaryLanguage { name color }
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
        }
      }
    }
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount color }
        }
      }
    }
    pullRequests(first: 1) { totalCount }
    issues(first: 1) { totalCount }
  }
}`;

// ---------- live 拉取 ----------
async function fetchLive() {
  const now = new Date();
  const from = new Date(now.getTime() - 365 * 24 * 3600 * 1000).toISOString();
  const to = now.toISOString();

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${FINAL_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'aptx2012-dashboard',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: FINAL_USERNAME, from, to } }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GraphQL HTTP ${res.status}: ${body.slice(0, 500)}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors).slice(0, 500)}`);
  }
  return json.data.user;
}

// ---------- mock 数据 ----------
function buildMock() {
  const days = 365;
  const today = new Date();
  const contributionDays = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 3600 * 1000);
    const count = Math.max(0, Math.round(Math.sin(i / 7) * 5 + Math.random() * 6));
    contributionDays.push({
      date: d.toISOString().slice(0, 10),
      contributionCount: count,
      color: '',
    });
  }
  // 按周切分（每 7 天一周）
  const weeks = [];
  for (let i = 0; i < contributionDays.length; i += 7) {
    weeks.push({ contributionDays: contributionDays.slice(i, i + 7) });
  }

  const mockRepos = [
    { name: 'Starlight_Lancher', description: 'Minecraft 启动器', stars: 42, forks: 8, language: 'Rust', color: '#dea584' },
    { name: 'cargo-target-doctor', description: 'Cargo target 体检工具', stars: 18, forks: 3, language: 'Rust', color: '#dea584' },
    { name: 'ApTx2012.github.io', description: 'GitHub 数据可视化主页', stars: 12, forks: 2, language: 'TypeScript', color: '#3178c6' },
    { name: 'CarpetSLSAddition', description: 'Carpet 扩展 mod', stars: 9, forks: 1, language: 'Java', color: '#b07219' },
    { name: 'Minecraft-place-mod', description: '/place 结构生成修复', stars: 6, forks: 0, language: 'Java', color: '#b07219' },
    { name: 'activity-tracker', description: 'Windows 活动追踪', stars: 4, forks: 0, language: 'Rust', color: '#dea584' },
  ];

  return {
    login: FINAL_USERNAME,
    name: 'AxTps',
    avatarUrl: `https://github.com/${FINAL_USERNAME}.png`,
    bio: 'Minecraft 工具链 & 数据可视化爱好者',
    followers: { totalCount: 37 },
    following: { totalCount: 21 },
    repositories: {
      totalCount: mockRepos.length,
      nodes: mockRepos.map((r) => ({
        name: r.name,
        description: r.description,
        url: `https://github.com/${FINAL_USERNAME}/${r.name}`,
        stargazerCount: r.stars,
        forkCount: r.forks,
        isFork: false,
        updatedAt: new Date(Date.now() - Math.random() * 90 * 24 * 3600 * 1000).toISOString(),
        primaryLanguage: { name: r.language, color: r.color },
        languages: {
          edges: [
            { size: 50000, node: { name: 'Rust', color: '#dea584' } },
            { size: 30000, node: { name: 'TypeScript', color: '#3178c6' } },
            { size: 20000, node: { name: 'Java', color: '#b07219' } },
            { size: 10000, node: { name: 'CSS', color: '#563d7c' } },
          ],
        },
      })),
    },
    contributionsCollection: {
      totalCommitContributions: 823,
      totalPullRequestContributions: 64,
      totalIssueContributions: 28,
      restrictedContributionsCount: 0,
      contributionCalendar: {
        totalContributions: contributionDays.reduce((s, d) => s + d.contributionCount, 0),
        weeks,
      },
    },
    pullRequests: { totalCount: 64 },
    issues: { totalCount: 28 },
  };
}

// ---------- 归一化：GraphQL user -> JSON 各文件 ----------
function normalize(user) {
  const repos = (user.repositories?.nodes || []).map((r) => ({
    name: r.name,
    description: r.description,
    url: r.url,
    stars: r.stargazerCount,
    forks: r.forkCount,
    language: r.primaryLanguage?.name ?? null,
    languageColor: r.primaryLanguage?.color ?? null,
    updatedAt: r.updatedAt,
    isFork: r.isFork,
  }));

  const totalStars = repos.reduce((s, r) => s + r.stars, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks, 0);

  // 语言聚合
  const langMap = new Map();
  for (const r of user.repositories?.nodes || []) {
    for (const e of r.languages?.edges || []) {
      const name = e.node.name;
      const cur = langMap.get(name) || { name, bytes: 0, color: e.node.color || '#888' };
      cur.bytes += e.size;
      langMap.set(name, cur);
    }
  }
  const langArr = [...langMap.values()].sort((a, b) => b.bytes - a.bytes);
  const totalBytes = langArr.reduce((s, l) => s + l.bytes, 0) || 1;
  const languages = langArr.map((l) => ({
    name: l.name,
    bytes: l.bytes,
    percent: +(l.bytes / totalBytes * 100).toFixed(2),
    color: l.color,
  }));

  // 贡献日历
  const rawWeeks = user.contributionsCollection?.contributionCalendar?.weeks || [];
  const weeks = rawWeeks.map((w) =>
    (w.contributionDays || []).map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: countToLevel(d.contributionCount),
    })),
  );

  const stats = {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    followers: user.followers?.totalCount ?? 0,
    following: user.following?.totalCount ?? 0,
    publicRepos: user.repositories?.totalCount ?? repos.length,
    totalStars,
    totalForks,
    totalCommits: user.contributionsCollection?.totalCommitContributions ?? 0,
    totalPRs: user.pullRequests?.totalCount ?? user.contributionsCollection?.totalPullRequestContributions ?? 0,
    totalIssues: user.issues?.totalCount ?? user.contributionsCollection?.totalIssueContributions ?? 0,
    contributedTo: user.contributionsCollection?.restrictedContributionsCount ?? 0,
    generatedAt: new Date().toISOString(),
  };

  const activity = repos
    .slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 20)
    .map((r, i) => ({
      id: `mock-${i}`,
      type: 'commit',
      repo: r.name,
      title: r.description || r.name,
      url: r.url,
      createdAt: r.updatedAt,
    }));

  return { stats, repos, languages, contributions: { total: user.contributionsCollection?.contributionCalendar?.totalContributions ?? 0, weeks }, activity };
}

function countToLevel(n) {
  if (n <= 0) return 0;
  if (n <= 2) return 1;
  if (n <= 5) return 2;
  if (n <= 9) return 3;
  return 4;
}

// ---------- 写文件 ----------
function writeJson(name, obj) {
  mkdirSync(DATA_DIR, { recursive: true });
  const p = join(DATA_DIR, name);
  writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf-8');
  const size = (JSON.stringify(obj).length / 1024).toFixed(1);
  console.log(`  ✓ data/${name}  (${size} KB)`);
}

// ---------- 主流程 ----------
async function main() {
  let user;
  if (MODE === 'live') {
    console.log('[fetch] 调用 GraphQL API...');
    user = await fetchLive();
  } else {
    console.log('[fetch] 生成 mock 数据...');
    user = buildMock();
  }

  const data = normalize(user);

  console.log('[fetch] 写入 data/：');
  writeJson('stats.json', data.stats);
  writeJson('repos.json', data.repos);
  writeJson('languages.json', data.languages);
  writeJson('contributions.json', data.contributions);
  writeJson('activity.json', data.activity);

  // 汇总一份 github.json 方便前端一次拿全
  writeJson('github.json', data);

  console.log(`[fetch] 完成。模式=${MODE}`);
}

main().catch((err) => {
  console.error('[fetch] 失败:', err.message);
  process.exit(1);
});