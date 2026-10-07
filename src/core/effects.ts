/**
 * 数字滚动 & 面板进场观察器
 */
import gsap from 'gsap';

/** 数字从 0 滚到目标值 */
export function animateNumber(el: HTMLElement, target: number, duration = 1.6): void {
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(obj.v).toLocaleString('en-US');
    },
  });
}

/** 面板滚动进场：IntersectionObserver + 渐显 */
export function observePanels(onVisible: (el: HTMLElement) => void): () => void {
  const panels = document.querySelectorAll<HTMLElement>('.panel');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          onVisible(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15 },
  );
  panels.forEach((p) => io.observe(p));
  return () => io.disconnect();
}

/** 相对时间 */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} 天前`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo} 个月前`;
  return `${Math.floor(mo / 12)} 年前`;
}