// 功能：无需登录在线观看B站视频（采用B站官方嵌入接口，无登录限制，贴合蓝色主题）
export function initBilibiliPlayer() {
    try {
        // 1. 创建B站播放器容器，贴合网站整体布局与蓝色主题
        const bilibiliContainer = document.createElement('section');
        bilibiliContainer.className = 'bilibili-player';
        bilibiliContainer.style.cssText = `
            margin: 2rem 0;
            padding: 1.5rem;
            border-radius: 12px;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
        `;

        // 2. 模块标题（贴合主题色，标注无登录）
        const playerTitle = document.createElement('h3');
        playerTitle.innerText = '无需登录 · B站视频观看';
        playerTitle.style.cssText = `
            margin: 0 0 1.5rem 0;
            color: var(--primary);
            font-size: 1.2rem;
            text-align: center;
        `;

        // 3. 视频输入区域（输入B站视频BV号/AV号，无需登录）
        const inputGroup = document.createElement('div');
        inputGroup.style.cssText = `
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            justify-content: center;
        `;

        // BV号/AV号输入框
        const bvInput = document.createElement('input');
        bvInput.type = 'text';
        bvInput.placeholder = '请输入B站视频BV号或AV号（无需登录）';
        bvInput.style.cssText = `
            flex: 1;
            min-width: 200px;
            max-width: 500px;
            padding: 0.8rem;
            border-radius: 8px;
            border: 1px solid #dee2e6;
            font-size: 1rem;
        `;

        // 加载视频按钮（贴合蓝色主题）
        const loadBtn = document.createElement('button');
        loadBtn.innerText = '加载视频';
        loadBtn.style.cssText = `
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            background: var(--primary);
            color: white;
            border: none;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s;
        `;

        // 按钮悬浮效果（与网站其他按钮风格统一）
        loadBtn.addEventListener('mouseenter', () => {
            loadBtn.style.background = 'var(--dark-blue)';
        });
        loadBtn.addEventListener('mouseleave', () => {
            loadBtn.style.background = 'var(--primary)';
        });

        // 4. 视频提示文本（引导用户输入）
        const tipText = document.createElement('p');
        tipText.innerText = '提示：BV号格式如BV1xx411x7x7，AV号格式如AV12345678，输入后点击加载即可无登录观看';
        tipText.style.cssText = `
            margin: 0 0 1rem 0;
            font-size: 0.85rem;
            color: #6c757d;
            text-align: center;
        `;

        // 5. 视频播放器容器（默认隐藏，加载视频后显示）
        const playerWrapper = document.createElement('div');
        playerWrapper.style.cssText = `
            display: none;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e9ecef;
        `;

        // 6. 错误提示容器（加载失败时显示）
        const errorTip = document.createElement('p');
        errorTip.innerText = '';
        errorTip.style.cssText = `
            display: none;
            color: #dc3545;
            text-align: center;
            margin-top: 1rem;
        `;

        // 组装输入区域
        inputGroup.appendChild(bvInput);
        inputGroup.appendChild(loadBtn);

        // 组装B站播放器容器
        bilibiliContainer.appendChild(playerTitle);
        bilibiliContainer.appendChild(tipText);
        bilibiliContainer.appendChild(inputGroup);
        bilibiliContainer.appendChild(errorTip);
        bilibiliContainer.appendChild(playerWrapper);

        // 7. 加载视频逻辑（无需登录，对接B站官方嵌入接口）
        loadBtn.addEventListener('click', () => {
            const videoId = bvInput.value.trim();
            if (!videoId) {
                errorTip.innerText = '请输入有效的B站BV号或AV号！';
                errorTip.style.display = 'block';
                playerWrapper.style.display = 'none';
                return;
            }

            // 清空错误提示，显示加载状态
            errorTip.innerText = '';
            errorTip.style.display = 'none';
            loadBtn.innerText = '加载中...';
            loadBtn.disabled = true;

            try {
                // 拼接B站官方嵌入地址（无登录限制，支持所有公开视频）
                let embedUrl = '';
                if (videoId.startsWith('BV')) {
                    // 处理BV号
                    embedUrl = `https://player.bilibili.com/player.html?bvid=${videoId}&page=1&autoplay=0&high_quality=1&danmaku=0`;
                } else if (videoId.startsWith('AV')) {
                    // 处理AV号（兼容旧版AV号）
                    const avNum = videoId.replace('AV', '');
                    embedUrl = `https://player.bilibili.com/player.html?aid=${avNum}&page=1&autoplay=0&high_quality=1&danmaku=0`;
                } else {
                    throw new Error('格式错误');
                }

                // 创建iframe嵌入播放器（无登录，支持播放、暂停、音量调节）
                const iframe = document.createElement('iframe');
                iframe.src = embedUrl;
                iframe.width = '100%';
                iframe.height = '450';
                iframe.frameBorder = '0';
                iframe.allowFullscreen = true;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

                // 清空播放器容器，插入新的iframe
                playerWrapper.innerHTML = '';
                playerWrapper.appendChild(iframe);
                playerWrapper.style.display = 'block';
            } catch (error) {
                errorTip.innerText = '视频ID格式错误，请输入正确的BV号或AV号！';
                errorTip.style.display = 'block';
                playerWrapper.style.display = 'none';
            } finally {
                // 恢复按钮状态
                loadBtn.innerText = '加载视频';
                loadBtn.disabled = false;
            }
        });

        // 8. 回车键触发加载视频
        bvInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                loadBtn.click();
            }
        });

        // 9. 将B站播放器模块插入到页面（放在天气模块下方，布局连贯）
        const weatherContainer = document.querySelector('.suzhou-weather');
        if (weatherContainer) {
            weatherContainer.after(bilibiliContainer);
        } else {
            // 兜底：若天气模块未加载，插入到留言板下方
            const messageBoard = document.querySelector('.message-board');
            if (messageBoard) {
                messageBoard.after(bilibiliContainer);
            } else {
                const blogSection = document.querySelector('.blog-entry');
                if (blogSection) {
                    blogSection.after(bilibiliContainer);
                }
            }
        }

        console.log("✅ B站无登录观看功能加载成功！");
    } catch (error) {
        console.error("❌ B站无登录观看功能加载失败：", error);
    }
}