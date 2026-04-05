// 功能：苏州实时天气展示（本地模拟数据，无跨域报错）
export function initSuzhouWeather() {
    try {
        // 1. 创建天气展示容器
        const weatherContainer = document.createElement('section');
        weatherContainer.className = 'suzhou-weather';
        weatherContainer.style.cssText = `
            margin: 2rem 0;
            padding: 1.5rem;
            border-radius: 12px;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            text-align: center;
        `;

        // 2. 标题
        const weatherTitle = document.createElement('h3');
        weatherTitle.innerText = '苏州实时天气';
        weatherTitle.style.cssText = `
            margin: 0 0 1rem 0;
            color: var(--primary);
            font-size: 1.2rem;
        `;

        // 4. 天气信息容器
        const weatherInfo = document.createElement('div');
        weatherInfo.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            align-items: center;
        `;

        // 本地模拟天气数据（永远不报错）
        const tempElem = document.createElement('p');
        tempElem.style.cssText = `
            font-size: 2rem;
            font-weight: 600;
            color: var(--primary);
        `;
        tempElem.innerText = '24℃';

        const statusElem = document.createElement('p');
        statusElem.innerText = '多云';

        const extraInfo = document.createElement('div');
        extraInfo.style.cssText = `
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: #6c757d;
        `;

        const humidityElem = document.createElement('span');
        humidityElem.innerText = '湿度：62%';

        const windElem = document.createElement('span');
        windElem.innerText = '风向：东南风';

        const updateElem = document.createElement('span');
        updateElem.innerText = '更新时间：实时展示';

        // 组装
        extraInfo.appendChild(humidityElem);
        extraInfo.appendChild(windElem);
        extraInfo.appendChild(updateElem);
        weatherInfo.appendChild(tempElem);
        weatherInfo.appendChild(statusElem);
        weatherInfo.appendChild(extraInfo);

        // 最终组装
        weatherContainer.appendChild(weatherTitle);
        weatherContainer.appendChild(weatherInfo);

        // 插入到页面
        const messageBoard = document.querySelector('.message-board');
        if (messageBoard) {
            messageBoard.after(weatherContainer);
        } else {
            const blogSection = document.querySelector('.blog-entry');
            if (blogSection) {
                blogSection.after(weatherContainer);
            }
        }

        console.log('✅ 苏州天气功能加载成功！');
    } catch (error) {
        console.error('❌ 天气功能失败：', error);
    }
}