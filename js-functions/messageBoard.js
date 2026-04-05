// 留言板功能（本地存储，适配明暗模式，持久化保存）
export function initMessageBoard() {
  const messageDom = document.getElementById('message');
  if (!messageDom) return;

  // 渲染留言板结构
  messageDom.innerHTML = `
    <div class="title">💬 留言板</div>
    <input type="text" id="msgName" placeholder="你的昵称">
    <textarea id="msgContent" rows="3" placeholder="说点什么吧..."></textarea>
    <button onclick="sendMessage()">提交留言</button>
    <div id="msgList" style="margin-top:20px;"></div>
  `;

  // 读取本地存储的留言
  let messages = JSON.parse(localStorage.getItem('blog_messages')) || [];

  // 提交留言
  window.sendMessage = function() {
    const name = document.getElementById('msgName').value.trim();
    const content = document.getElementById('msgContent').value.trim();

    if (!name || !content) {
      alert('昵称和留言内容不能为空！');
      return;
    }

    // 新增留言
    const newMsg = {
      name: name,
      content: content,
      time: new Date().toLocaleString()
    };
    messages.push(newMsg);
    // 保存到本地存储
    localStorage.setItem('blog_messages', JSON.stringify(messages));
    // 重新渲染留言列表
    renderMessages();
    // 重置表单
    document.getElementById('msgName').value = '';
    document.getElementById('msgContent').value = '';
  };

  // 渲染留言列表
  function renderMessages() {
    const msgListDom = document.getElementById('msgList');
    if (messages.length === 0) {
      msgListDom.innerHTML = `<p style="text-align:center; color:var(--text-light);">暂无留言，快来留下你的足迹吧～</p>`;
      return;
    }

    // 倒序渲染（最新留言在最上面）
    msgListDom.innerHTML = messages.reverse().map(msg => `
      <div class="msg-item">
        <div class="msg-header">
          <span class="msg-name">${msg.name}</span>
          <span class="msg-time">${msg.time}</span>
        </div>
        <div class="msg-content">${msg.content}</div>
      </div>
    `).join('');

    // 恢复正序，便于后续添加新留言
    messages.reverse();
  }

  // 初始化渲染留言列表
  renderMessages();
}