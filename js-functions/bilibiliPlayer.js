// B站无登录播放功能（适配明暗模式，无语法错误）
export function initBilibili() {
  const bilibiliDom = document.getElementById('bilibili');
  if (!bilibiliDom) return;

  // 渲染B站播放器容器
  bilibiliDom.innerHTML = `
    <div class="title">📺 无需登录 · B站视频播放</div>
    <input type="text" id="bvInput" placeholder="请输入BV号，例如：BV1ux411y7qm">
    <button onclick="loadBilibiliVideo()">加载视频</button>
    <div id="bilibiliPlayer"></div>
  `;

  // 暴露加载视频方法到全局
  window.loadBilibiliVideo = function() {
    const bv = document.getElementById('bvInput').value.trim();
    const playerDom = document.getElementById('bilibiliPlayer');

    if (!bv) {
      alert('请输入有效的B站BV号！');
      return;
    }

    // 拼接B站官方嵌入地址（无登录限制）
    const embedUrl = `https://player.bilibili.com/player.html?bvid=${bv}&page=1&autoplay=0&high_quality=1&danmaku=0`;
    // 渲染播放器
    playerDom.innerHTML = `
      <div id="player" style="display:block;">
        <iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
      </div>
    `;
  };

  // 回车键触发加载
  document.getElementById('bvInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      window.loadBilibiliVideo();
    }
  });
}