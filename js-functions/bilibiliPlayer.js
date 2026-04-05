export function initBilibiliPlayer() {
    try {
        const bilibiliContainer = document.createElement('section');
        bilibiliContainer.className = 'bilibili-player';
        bilibiliContainer.style.cssText = `
            margin: 2rem 0;
            padding: 1.5rem;
            border-radius: 12px;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
        `;

        const playerTitle = document.createElement('h3');
        playerTitle.innerText = 'B站视频播放器 (无需登录)';
        playerTitle.style.cssText = `
            margin: 0 0 1.5rem 0;
            color: var(--primary);
            font-size: 1.2rem;
            text-align: center;
        `;

        const inputGroup = document.createElement('div');
        inputGroup.style.cssText = `
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            justify-content: center;
        `;

        const bvInput = document.createElement('input');
        bvInput.type = 'text';
        bvInput.placeholder = '输入BV号 例如: BV1ux411y7qm';
        bvInput.style.cssText = `
            flex: 1;
            min-width: 200px;
            max-width: 500px;
            padding: 0.8rem;
            border-radius: 8px;
            border: 1px solid #dee2e6;
            font-size: 1rem;
        `;

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

        loadBtn.addEventListener('mouseenter', () => {
            loadBtn.style.background = 'var(--dark-blue)';
        });
        loadBtn.addEventListener('mouseleave', () => {
            loadBtn.style.background = 'var(--primary)';
        });

        const tipText = document.createElement('p');
        tipText.innerText = '支持BV号,无需登录,全屏播放';
        tipText.style.cssText = `
            margin: 0 0 1rem 0;
            font-size: 0.85rem;
            color: #6c757d;
            text-align: center;
        `;

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

        const errorTip = document.createElement('p');
        errorTip.innerText = '';
        errorTip.style.cssText = `
            display: none;
            color: #dc3545;
            text-align: center;
            margin-top: 1rem;
        `;

        inputGroup.appendChild(bvInput);
        inputGroup.appendChild(loadBtn);

        bilibiliContainer.appendChild(playerTitle);
        bilibiliContainer.appendChild(tipText);
        bilibiliContainer.appendChild(inputGroup);
        bilibiliContainer.appendChild(errorTip);
        bilibiliContainer.appendChild(playerWrapper);

        loadBtn.addEventListener('click', () => {
            const videoId = bvInput.value.trim();
            if (!videoId) {
                errorTip.innerText = '请输入BV号';
                errorTip.style.display = 'block';
                playerWrapper.style.display = 'none';
                return;
            }

            errorTip.style.display = 'none';
            loadBtn.innerText = '加载中...';
            loadBtn.disabled = true;

            try {
                let embedUrl = '';
                if (videoId.startsWith('BV')) {
                    embedUrl = 'https://player.bilibili.com/player.html?bvid=' + videoId + '&page=1&autoplay=0&high_quality=1&danmaku=0';
                } else {
                    throw new Error('error');
                }

                const iframe = document.createElement('iframe');
                iframe.src = embedUrl;
                iframe.width = '100%';
                iframe.height = '450';
                iframe.frameBorder = '0';
                iframe.allowFullscreen = true;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

                playerWrapper.innerHTML = '';
                playerWrapper.appendChild(iframe);
                playerWrapper.style.display = 'block';
            } catch (error) {
                errorTip.innerText = 'BV号格式不正确';
                errorTip.style.display = 'block';
                playerWrapper.style.display = 'none';
            } finally {
                loadBtn.innerText = '加载视频';
                loadBtn.disabled = false;
            }
        });

        bvInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                loadBtn.click();
            }
        });

        const weatherContainer = document.querySelector('.suzhou-weather');
        if (weatherContainer) {
            weatherContainer.after(bilibiliContainer);
        } else {
            const messageBoard = document.querySelector('.message-board');
            if (messageBoard) {
                messageBoard.after(bilibiliContainer);
            }
        }

        console.log('Bilibili player loaded');
    } catch (err) {
        console.error('bilibili error', err);
    }
}