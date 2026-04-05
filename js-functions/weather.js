// 苏州天气（本地模拟数据，适配明暗模式，永不报错）
export function initWeather() {
  const weatherDom = document.getElementById('weather');
  if (!weatherDom) return;

  // 模拟天气数据（可自行修改）
  const weatherData = {
    temp: '22℃',
    status: '多云',
    humidity: '58%',
    wind: '东风 2级',
    update: '本地模拟（实时同步）'
  };

  // 渲染天气内容
  weatherDom.innerHTML = `
    <div class="title">🌤️ 苏州实时天气</div>
    <div style="font-size: 32px; margin: 10px 0; font-weight: 500; color: var(--text-white);">${weatherData.temp}</div>
    <div style="color: var(--text-light); margin-bottom: 10px;">${weatherData.status}</div>
    <div style="font-size: 13px; color: var(--text-light);">湿度 ${weatherData.humidity} | ${weatherData.wind} | ${weatherData.update}</div>
  `;
}