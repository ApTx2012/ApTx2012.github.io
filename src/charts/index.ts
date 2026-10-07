/**
 * ECharts 图表集
 * 统一赛博朋克主题
 */
import * as echarts from 'echarts';
import type { ContributionCalendar, LanguageEntry, RepoEntry } from '@/types/github';

type ECharts = echarts.ECharts;

const NEON = {
  cyan: '#00f0ff',
  magenta: '#ff2e97',
  purple: '#a06bff',
  lime: '#b6ff3c',
  text: '#8fa3c4',
  textDim: '#4d5f7d',
  line: 'rgba(0,240,255,0.18)',
};

const TOOLTIP_BASE = {
  backgroundColor: 'rgba(10,13,28,0.95)',
  borderColor: 'rgba(0,240,255,0.35)',
  borderWidth: 1,
  textStyle: { color: '#e8f4ff', fontSize: 12 },
  extraCssText: 'backdrop-filter: blur(8px); border-radius: 8px;',
};

/** 01 贡献热力图 */
export function renderContributions(el: HTMLElement, cal: ContributionCalendar): ECharts {
  const chart = echarts.init(el, undefined, { renderer: 'canvas' });

  const weeks = cal.weeks;
  const data: [number, number, number][] = [];
  const dates: string[] = [];

  weeks.forEach((week, wi) => {
    week.forEach((day, di) => {
      // 让第 0 行是周日：GitHub 的 weeks 起点是周日
      data.push([wi, di, day.count]);
      dates.push(day.date);
    });
  });

  const maxCount = Math.max(4, ...data.map((d) => d[2]));

  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      ...TOOLTIP_BASE,
      formatter: (p: any) => {
        const [wi, di, cnt] = p.value;
        const idx = wi * 7 + di;
        const date = dates[idx] || '';
        return `<b>${date}</b><br/>贡献 ${cnt} 次`;
      },
    },
    grid: { left: 30, right: 16, top: 20, bottom: 50 },
    xAxis: {
      type: 'category',
      data: weeks.map((_, i) => i),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: NEON.textDim,
        fontSize: 10,
        interval: 8,
        formatter: (v: string) => {
          const wi = Number(v);
          const first = weeks[wi]?.[0];
          if (!first) return '';
          const d = new Date(first.date);
          return `${d.getMonth() + 1}月`;
        },
      },
      splitArea: { show: false },
    },
    yAxis: {
      type: 'category',
      data: ['日', '一', '二', '三', '四', '五', '六'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: NEON.textDim, fontSize: 10 },
    },
    visualMap: {
      type: 'piecewise',
      show: false,
      pieces: [
        { min: 0, max: 0, color: 'rgba(0,240,255,0.05)' },
        { min: 1, max: Math.ceil(maxCount * 0.25), color: 'rgba(0,240,255,0.25)' },
        { min: Math.ceil(maxCount * 0.25) + 1, max: Math.ceil(maxCount * 0.5), color: 'rgba(0,240,255,0.5)' },
        { min: Math.ceil(maxCount * 0.5) + 1, max: Math.ceil(maxCount * 0.75), color: 'rgba(0,240,255,0.75)' },
        { min: Math.ceil(maxCount * 0.75) + 1, max: maxCount, color: NEON.cyan },
      ],
    },
    series: [
      {
        type: 'heatmap',
        data,
        itemStyle: {
          borderColor: 'rgba(5,6,15,0.8)',
          borderWidth: 2,
          borderRadius: 3,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: NEON.cyan,
            borderColor: NEON.cyan,
          },
        },
        progressive: 2000,
      },
    ],
  });

  return chart;
}

/** 02 语言构成环形图 */
export function renderLanguages(el: HTMLElement, langs: LanguageEntry[]): ECharts {
  const chart = echarts.init(el, undefined, { renderer: 'canvas' });
  const top = langs.slice(0, 8);
  const rest = langs.slice(8);
  const restBytes = rest.reduce((s, l) => s + l.bytes, 0);
  const seriesData = top.map((l) => ({
    name: l.name,
    value: l.bytes,
    itemStyle: { color: l.color },
  }));
  if (restBytes > 0) {
    seriesData.push({ name: '其他', value: restBytes, itemStyle: { color: '#3a4660' } });
  }

  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      ...TOOLTIP_BASE,
      formatter: (p: any) => {
        const total = seriesData.reduce((s, d) => s + d.value, 0) || 1;
        const pct = ((p.value / total) * 100).toFixed(1);
        return `<b>${p.name}</b><br/>${(p.value / 1024).toFixed(1)} KB · ${pct}%`;
      },
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: NEON.text, fontFamily: 'monospace', fontSize: 12 },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 12,
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: 'rgba(5,6,15,0.9)',
          borderWidth: 2,
        },
        label: { show: false },
        labelLine: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: { shadowBlur: 20, shadowColor: NEON.cyan },
        },
        data: seriesData,
      },
    ],
  });

  return chart;
}

/** 03 仓库星榜横向柱状 */
export function renderRepos(el: HTMLElement, repos: RepoEntry[]): ECharts {
  const chart = echarts.init(el, undefined, { renderer: 'canvas' });
  const top = repos
    .slice()
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 8)
    .reverse();

  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      ...TOOLTIP_BASE,
      formatter: (p: any) => {
        const r = top[p.dataIndex];
        return `<b>${r.name}</b><br/>${r.description || '无描述'}<br/>⭐ ${r.stars} · 🍴 ${r.forks}${
          r.language ? ` · ${r.language}` : ''
        }`;
      },
    },
    grid: { left: 10, right: 40, top: 20, bottom: 20, containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: NEON.textDim, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0,240,255,0.06)' } },
    },
    yAxis: {
      type: 'category',
      data: top.map((r) => r.name),
      axisLine: { lineStyle: { color: NEON.line } },
      axisTick: { show: false },
      axisLabel: {
        color: NEON.text,
        fontSize: 11,
        fontFamily: 'monospace',
        width: 140,
        overflow: 'truncate',
      },
    },
    series: [
      {
        type: 'bar',
        data: top.map((r) => ({
          value: r.stars,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(0,240,255,0.15)' },
              { offset: 1, color: r.languageColor || NEON.cyan },
            ]),
            borderRadius: [0, 6, 6, 0],
          },
        })),
        barWidth: '55%',
        emphasis: {
          itemStyle: { shadowBlur: 16, shadowColor: NEON.cyan },
        },
        label: {
          show: true,
          position: 'right',
          color: NEON.cyan,
          fontFamily: 'monospace',
          fontSize: 11,
          formatter: '{c}',
        },
      },
    ],
  });

  return chart;
}

/** 统一 resize */
export function attachResize(charts: ECharts[]): () => void {
  const handler = () => charts.forEach((c) => c.resize());
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}