/**
 * GitHub Dashboard 数据模型
 * 与 scripts/fetch-github.mjs 产出的 JSON 结构严格一致
 */

/** 核心统计卡片 */
export interface GithubStats {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  contributedTo: number;
  generatedAt: string;
}

/** 仓库条目 */
export interface RepoEntry {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string | null;
  updatedAt: string;
  isFork: boolean;
}

/** 语言构成 */
export interface LanguageEntry {
  name: string;
  bytes: number;
  percent: number;
  color: string;
}

/** 贡献日历：按周分列，每列 7 天 */
export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  total: number;
  weeks: ContributionDay[][];
}

/** 活动流条目 */
export interface ActivityEntry {
  id: string;
  type: 'commit' | 'pr' | 'issue' | 'release' | 'star' | 'other';
  repo: string;
  title: string;
  url: string;
  createdAt: string;
}

/** 数据包总汇 */
export interface GithubData {
  stats: GithubStats;
  repos: RepoEntry[];
  languages: LanguageEntry[];
  contributions: ContributionCalendar;
  activity: ActivityEntry[];
}

/** fetch 脚本运行模式 */
export type FetchMode = 'live' | 'mock';