/**
 * GitHub Dashboard 数据模型
 * 与 scripts/fetch-github.mjs 产出的 JSON 结构严格一致
 */

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

export interface LanguageEntry {
  name: string;
  bytes: number;
  percent: number;
  color: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  total: number;
  weeks: ContributionDay[][];
}

export interface ActivityEntry {
  id: string;
  type: 'commit' | 'pr' | 'issue' | 'release' | 'star' | 'other';
  repo: string;
  title: string;
  url: string;
  createdAt: string;
}

export interface GithubData {
  stats: GithubStats;
  repos: RepoEntry[];
  languages: LanguageEntry[];
  contributions: ContributionCalendar;
  activity: ActivityEntry[];
}

export type FetchMode = 'live' | 'mock';