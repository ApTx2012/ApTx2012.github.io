// 功能1：博客阅读时长计算（参数：文本内容，返回：阅读时长（分钟））
export function calculateReadingTime(content) {
    // 成年人平均阅读速度：每分钟250字，取中间值，适配中文阅读
    const wordCount = content.replace(/\s+/g, '').length; // 过滤空格，统计有效字数
    const readingTime = wordCount / 250;
    // 保留1位小数，不足1分钟按1分钟计算，贴合用户习惯
    return readingTime < 1.0 ? 1.0 : Math.round(readingTime * 10) / 10;
}

// 功能2：代码块一键复制（适配所有pre code标签，贴合蓝色主题）
export function initCopyCode() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const preBlock = block.parentElement;
        // 给pre标签添加相对定位，使复制按钮定位生效
        if (preBlock.style.position !== 'relative') {
            preBlock.style.position = 'relative';
        }
        // 创建复制按钮，样式贴合原有蓝色主题
        const copyBtn = document.createElement('button');
        copyBtn.innerText = '复制代码';
        copyBtn.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.2rem 0.5rem;
            border-radius: 8px 0 0 0;
            font-size: 0.7rem;
            cursor: pointer;
            transition: background 0.3s;
            z-index: 10;
        `;
        // 鼠标悬浮/离开效果
        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.background = 'var(--dark-blue)';
        });
        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.background = 'var(--primary)';
        });
        // 点击复制逻辑
        copyBtn.addEventListener('click', () => {
            const codeText = block.innerText;
            // 原生剪贴板API复制
            navigator.clipboard.writeText(codeText).then(() => {
                copyBtn.innerText = '复制成功';
                setTimeout(() => {
                    copyBtn.innerText = '复制代码';
                }, 1500); // 1.5秒后恢复原文本
            }).catch(() => {
                copyBtn.innerText = '复制失败';
                setTimeout(() => {
                    copyBtn.innerText = '复制代码';
                }, 1500);
            });
        });
        preBlock.appendChild(copyBtn);
    });
}

// 功能3：网站访问次数统计（本地存储，持久化记录，替代原有Rust功能）
export function initVisitCount() {
    // 获取本地存储的访问次数，无则初始化为0
    let count = localStorage.getItem('visit_count') || 0;
    count = parseInt(count) + 1;
    // 重新存储访问次数
    localStorage.setItem('visit_count', count);
    // 将访问次数显示在网站底部，适配原有样式
    const footerElem = document.querySelector('footer p');
    if (footerElem) {
        const currentText = footerElem.innerText;
        footerElem.innerText = `${currentText} | 访问次数：${count}`;
    }
}

// 新增功能4：博客字数统计（参数：文本内容，返回：有效字数）
export function countBlogWords(content) {
    // 过滤空格、换行符，统计真实有效字数（适配中文）
    return content.replace(/\s+/g, '').length;
}