import type { ActivityEntry } from '@/types/github';
import { timeAgo } from '@/core/effects';

const TYPE_LABEL: Record<ActivityEntry['type'], string> = {
  commit: 'COMMIT',
  pr: 'PULL',
  issue: 'ISSUE',
  release: 'RELEASE',
  star: 'STAR',
  other: 'EVENT',
};

export function renderActivity(listEl: HTMLElement, items: ActivityEntry[]): void {
  listEl.innerHTML = '';
  if (!items.length) {
    const li = document.createElement('li');
    li.className = 'activity-item';
    li.innerHTML = '<span class="activity-item__repo">暂无活动数据</span>';
    listEl.appendChild(li);
    return;
  }

  for (const it of items) {
    const li = document.createElement('a');
    li.className = 'activity-item';
    li.href = it.url;
    li.target = '_blank';
    li.rel = 'noopener noreferrer';

    const type = document.createElement('span');
    type.className = 'activity-item__type';
    type.textContent = TYPE_LABEL[it.type] || 'EVENT';

    const main = document.createElement('div');
    main.className = 'activity-item__main';
    const repo = document.createElement('div');
    repo.className = 'activity-item__repo';
    repo.textContent = it.repo;
    const title = document.createElement('div');
    title.className = 'activity-item__title';
    title.textContent = it.title;
    main.append(repo, title);

    const time = document.createElement('span');
    time.className = 'activity-item__time';
    time.textContent = timeAgo(it.createdAt);

    li.append(type, main, time);
    listEl.appendChild(li);
  }
}