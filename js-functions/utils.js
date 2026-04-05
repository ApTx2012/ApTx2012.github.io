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

// 新增功能5：深色模式切换（记忆用户偏好，贴合蓝色主题，修复未适配区域）
export function initDarkMode() {
    // 1. 定义深色模式样式变量，贴合原有蓝色主题
    const darkModeStyle = `
        :root {
            --primary: #165DFF; /* 原有主色不变 */
            --dark-blue: #0E42D2; /* 原有深色不变 */
            --bg-light: #121212; /* 深色模式背景 */
            --text-light: #ffffff; /* 深色模式文本 */
            --card-bg: #1E1E1E; /* 深色模式卡片背景 */
            --border-color: #333333; /* 深色模式边框 */
            --meta-color: #aaaaaa; /* 深色模式元信息文本色 */
        }
        body.dark-mode {
            background-color: var(--bg-light);
            color: var(--text-light);
        }
        /* 容器、导航栏、页脚基础适配 */
        body.dark-mode .container,
        body.dark-mode .blog-container,
        body.dark-mode .blog-detail-container {
            background-color: var(--bg-light);
        }
        body.dark-mode .navbar {
            background-color: #0A0A0A;
            border-bottom: 1px solid var(--border-color);
        }
        body.dark-mode .navbar .logo,
        body.dark-mode .navbar .nav-links a {
            color: var(--text-light);
        }
        body.dark-mode .navbar .nav-links a.active {
            color: var(--primary);
            border-bottom: 2px solid var(--primary);
        }
        body.dark-mode footer p {
            color: var(--meta-color);
        }
        /* 主页、博客列表、详情页核心区域适配 */
        body.dark-mode .header h1,
        body.dark-mode .header .subtitle,
        body.dark-mode .about h2,
        body.dark-mode .links h2,
        body.dark-mode .blog-entry h2,
        body.dark-mode .blog-header h1,
        body.dark-mode .blog-header p,
        body.dark-mode .blog-detail-header h1 {
            color: var(--text-light);
        }
        body.dark-mode .about p,
        body.dark-mode .blog-entry p,
        body.dark-mode .blog-excerpt,
        body.dark-mode .blog-detail-content p,
        body.dark-mode .blog-detail-content h3,
        body.dark-mode .blog-detail-content h4,
        body.dark-mode .blog-detail-content li {
            color: var(--text-light);
        }
        /* 卡片、按钮、链接适配 */
        body.dark-mode .blog-card,
        body.dark-mode .blog-detail,
        body.dark-mode .message-board,
        body.dark-mode .message-list > div {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
        }
        body.dark-mode .blog-meta span,
        body.dark-mode .blog-detail-meta span,
        body.dark-mode .message-list .msgTime {
            color: var(--meta-color);
        }
        body.dark-mode .blog-title a,
        body.dark-mode .back-blog,
        body.dark-mode .next-blog,
        body.dark-mode .prev-blog {
            color: var(--primary);
        }
        body.dark-mode .blog-title a:hover {
            color: #4080ff;
        }
        /* 代码块、表单、按钮适配 */
        body.dark-mode pre {
            background-color: #2D2D2D;
            border: 1px solid var(--border-color);
        }
        body.dark-mode code {
            color: #E0E0E0;
        }
        body.dark-mode button,
        body.dark-mode .link-buttons a,
        body.dark-mode .blog-btn,
        body.dark-mode .read-more,
        body.dark-mode .back-blog,
        body.dark-mode .next-blog,
        body.dark-mode .prev-blog {
            background-color: var(--primary);
            color: white;
            border: 1px solid var(--dark-blue);
        }
        body.dark-mode button:hover,
        body.dark-mode .link-buttons a:hover,
        body.dark-mode .blog-btn:hover,
        body.dark-mode .read-more:hover,
        body.dark-mode .back-blog:hover,
        body.dark-mode .next-blog:hover,
        body.dark-mode .prev-blog:hover {
            background-color: var(--dark-blue);
        }
        body.dark-mode input,
        body.dark-mode textarea {
            background-color: #2D2D2D;
            color: var(--text-light);
            border: 1px solid var(--border-color);
        }
        body.dark-mode input::placeholder,
        body.dark-mode textarea::placeholder {
            color: var(--meta-color);
        }
        /* 留言板专项适配 */
        body.dark-mode .message-board .emptyTip,
        body.dark-mode .message-list .msgName {
            color: var(--text-light);
        }
        body.dark-mode .message-list .msgContent {
            color: var(--text-light);
        }
        body.dark-mode .message-list .deleteBtn {
            background: #dc3545;
        }
        body.dark-mode .message-list .deleteBtn:hover {
            background: #bb2d3b;
        }
    `;

    // 2. 注入深色模式样式到页面
    const styleElem = document.createElement('style');
    styleElem.innerText = darkModeStyle;
    document.head.appendChild(styleElem);

    // 3. 创建深色模式切换按钮（导航栏右侧）
    const navLinks = document.querySelector('.nav-links');
    const darkModeBtn = document.createElement('button');
    darkModeBtn.innerText = '深色模式';
    darkModeBtn.style.cssText = `
        margin-left: 1rem;
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        background: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        transition: background 0.3s;
        font-size: 0.9rem;
    `;

    // 4. 读取本地存储的主题偏好，初始化主题
    const isDarkMode = localStorage.getItem('dark_mode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerText = '浅色模式';
    }

    // 5. 切换主题逻辑
    darkModeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('dark_mode', isDark);
        darkModeBtn.innerText = isDark ? '浅色模式' : '深色模式';
        // 切换时同步更新留言板样式（解决切换不实时问题）
        const messageItems = document.querySelectorAll('.message-list > div');
        messageItems.forEach(item => {
            item.style.backgroundColor = isDark ? 'var(--card-bg)' : 'white';
            item.style.borderColor = isDark ? 'var(--border-color)' : '#e9ecef';
        });
    });

    // 6. 鼠标悬浮效果
    darkModeBtn.addEventListener('mouseenter', () => {
        darkModeBtn.style.background = 'var(--dark-blue)';
    });
    darkModeBtn.addEventListener('mouseleave', () => {
        darkModeBtn.style.background = 'var(--primary)';
    });

    // 7. 将按钮添加到导航栏
    navLinks.appendChild(darkModeBtn);
}