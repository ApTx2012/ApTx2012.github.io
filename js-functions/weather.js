// 功能：苏州实时天气展示（对接免费天气API，分钟级更新，贴合蓝色主题）
export function initSuzhouWeather() {
    try {
        // 1. 创建天气展示容器，贴合网站整体布局与蓝色主题
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

        // 2. 天气标题（贴合主题色，标注苏州）
        const weatherTitle = document.createElement('h3');
        weatherTitle.innerText = '苏州实时天气';
        weatherTitle.style.cssText = `
            margin: 0 0 1rem 0;
            color: var(--primary);
            font-size: 1.2rem;
        `;

        // 3. 天气加载提示
        const loadingTip = document.createElement('p');
        loadingTip.innerText = '正在获取苏州天气数据...';
        loadingTip.style.color = '#6c757d';

        // 4. 天气信息容器（默认隐藏，获取数据后显示）
        const weatherInfo = document.createElement('div');
        weatherInfo.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 0.8rem;
            align-items: center;
        `;

        // 天气核心信息（温度、天气状况）
        const tempElem = document.createElement('p');
        tempElem.style.cssText = `
            font-size: 2rem;
            font-weight: 600;
            color: var(--primary);
        `;
        const statusElem = document.createElement('p');
        statusElem.style.color = '#333';

        // 天气辅助信息（湿度、风向、更新时间）
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
        const windElem = document.createElement('span');
        const updateElem = document.createElement('span');

        // 组装天气信息容器
        extraInfo.appendChild(humidityElem);
        extraInfo.appendChild(windElem);
        extraInfo.appendChild(updateElem);
        weatherInfo.appendChild(tempElem);
        weatherInfo.appendChild(statusElem);
        weatherInfo.appendChild(extraInfo);

        // 组装天气容器
        weatherContainer.appendChild(weatherTitle);
        weatherContainer.appendChild(loadingTip);
        weatherContainer.appendChild(weatherInfo);

        // 5. 对接免费天气API（支持国内3400+城市，分钟级更新），获取苏州天气数据
        // 采用公开免费API，无需密钥，直接调用（适配本地开发调试）
        const weatherApi = 'https://api.vvhan.com/api/weather?city=苏州';
        fetch(weatherApi)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data) {
                    const weatherData = data.data;
                    // 渲染天气数据
                    tempElem.innerText = `${weatherData.temp}℃`;
                    statusElem.innerText = weatherData.type;
                    humidityElem.innerText = `湿度：${weatherData.humidity}`;
                    windElem.innerText = `风向：${weatherData.wind}`;
                    updateElem.innerText = `更新时间：${weatherData.updateTime}`;

                    // 隐藏加载提示，显示天气信息
                    loadingTip.style.display = 'none';
                    weatherInfo.style.display = 'flex';
                } else {
                    loadingTip.innerText = '天气数据获取失败，请刷新页面重试';
                    loadingTip.style.color = '#dc3545';
                }
            })
            .catch(error => {
                loadingTip.innerText = '天气数据获取失败，请刷新页面重试';
                loadingTip.style.color = '#dc3545';
                console.error("❌ 苏州天气API调用失败：", error);
            });

        // 6. 将天气模块插入到页面（放在留言板下方，贴合页面布局）
        const messageBoard = document.querySelector('.message-board');
        if (messageBoard) {
            messageBoard.after(weatherContainer);
        } else {
            // 兜底：若留言板未加载，插入到博客板块下方
            const blogSection = document.querySelector('.blog-entry');
            if (blogSection) {
                blogSection.after(weatherContainer);
            }
        }

        console.log("✅ 苏州天气功能加载成功！");
    } catch (error) {
        console.error("❌ 苏州天气功能加载失败：", error);
    }
}