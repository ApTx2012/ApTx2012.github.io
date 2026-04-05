// 留言板功能（本地存储，支持提交、删除，显示时间，贴合蓝色主题）
export function initMessageBoard() {
    // 1. 获取或初始化留言列表（本地存储）
    let messages = JSON.parse(localStorage.getItem('blog_messages')) || [];

    // 2. 创建留言板容器，贴合主页布局
    const messageBoard = document.createElement('section');
    messageBoard.className = 'message-board';
    messageBoard.style.cssText = `
        margin: 3rem 0;
        padding: 2rem;
        border-radius: 12px;
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
    `;

    // 3. 留言板标题
    const boardTitle = document.createElement('h2');
    boardTitle.innerText = '留言板';
    boardTitle.style.cssText = `
        text-align: center;
        margin-bottom: 1.5rem;
        color: var(--primary);
    `;

    // 4. 留言提交表单
    const messageForm = document.createElement('form');
    messageForm.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    `;

    // 表单元素：昵称输入框
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '请输入你的昵称';
    nameInput.required = true;
    nameInput.style.cssText = `
        padding: 0.8rem;
        border-radius: 8px;
        border: 1px solid #dee2e6;
        font-size: 1rem;
    `;

    // 表单元素：留言内容输入框
    const contentTextarea = document.createElement('textarea');
    contentTextarea.placeholder = '请输入你的留言...';
    contentTextarea.required = true;
    contentTextarea.rows = 4;
    contentTextarea.style.cssText = `
        padding: 0.8rem;
        border-radius: 8px;
        border: 1px solid #dee2e6;
        font-size: 1rem;
        resize: vertical;
    `;

    // 表单元素：提交按钮
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.innerText = '提交留言';
    submitBtn.style.cssText = `
        padding: 0.8rem;
        border-radius: 8px;
        background: var(--primary);
        color: white;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s;
    `;

    // 提交按钮悬浮效果
    submitBtn.addEventListener('mouseenter', () => {
        submitBtn.style.background = 'var(--dark-blue)';
    });
    submitBtn.addEventListener('mouseleave', () => {
        submitBtn.style.background = 'var(--primary)';
    });

    // 5. 留言列表容器
    const messageList = document.createElement('div');
    messageList.className = 'message-list';
    messageList.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `;

    // 6. 组装留言板结构
    messageForm.appendChild(nameInput);
    messageForm.appendChild(contentTextarea);
    messageForm.appendChild(submitBtn);
    messageBoard.appendChild(boardTitle);
    messageBoard.appendChild(messageForm);
    messageBoard.appendChild(messageList);

    // 7. 渲染留言列表
    function renderMessages() {
        // 清空现有留言
        messageList.innerHTML = '';

        // 无留言时显示提示
        if (messages.length === 0) {
            const emptyTip = document.createElement('p');
            emptyTip.className = 'emptyTip';
            emptyTip.innerText = '暂无留言，快来留下你的足迹吧～';
            emptyTip.style.cssText = `
                text-align: center;
                color: #6c757d;
                padding: 2rem;
            `;
            messageList.appendChild(emptyTip);
            // 深色模式同步提示文本色
            if (localStorage.getItem('dark_mode') === 'true') {
                emptyTip.style.color = 'var(--meta-color)';
            }
            return;
        }

        // 倒序渲染（最新留言在最上面）
        messages.reverse().forEach((msg, index) => {
            const messageItem = document.createElement('div');
            messageItem.style.cssText = `
                padding: 1.2rem;
                border-radius: 8px;
                background-color: white;
                border: 1px solid #e9ecef;
                position: relative;
            `;

            // 深色模式适配（同步主题）
            if (localStorage.getItem('dark_mode') === 'true') {
                messageItem.style.backgroundColor = 'var(--card-bg)';
                messageItem.style.borderColor = 'var(--border-color)';
            }

            // 留言昵称
            const msgName = document.createElement('h4');
            msgName.className = 'msgName';
            msgName.innerText = msg.name;
            msgName.style.cssText = `
                margin: 0 0 0.5rem 0;
                color: var(--primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;

            // 留言时间
            const msgTime = document.createElement('span');
            msgTime.className = 'msgTime';
            msgTime.innerText = formatTime(msg.time);
            msgTime.style.cssText = `
                font-size: 0.8rem;
                color: #6c757d;
            `;
            // 深色模式同步时间文本色
            if (localStorage.getItem('dark_mode') === 'true') {
                msgTime.style.color = 'var(--meta-color)';
            }

            // 留言内容
            const msgContent = document.createElement('p');
            msgContent.className = 'msgContent';
            msgContent.innerText = msg.content;
            msgContent.style.cssText = `
                margin: 0 0 0.5rem 0;
                line-height: 1.6;
            `;
            // 深色模式同步内容文本色
            if (localStorage.getItem('dark_mode') === 'true') {
                msgContent.style.color = 'var(--text-light)';
            }

            // 删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'deleteBtn';
            deleteBtn.innerText = '删除';
            deleteBtn.style.cssText = `
                padding: 0.3rem 0.6rem;
                border-radius: 4px;
                background: #dc3545;
                color: white;
                border: none;
                font-size: 0.7rem;
                cursor: pointer;
                transition: background 0.3s;
                position: absolute;
                top: 1rem;
                right: 1rem;
            `;

            // 删除按钮悬浮效果
            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.background = '#bb2d3b';
            });
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.background = '#dc3545';
            });

            // 删除留言逻辑
            deleteBtn.addEventListener('click', () => {
                // 恢复正序，删除对应索引，再倒序存储
                messages.reverse();
                messages.splice(index, 1);
                localStorage.setItem('blog_messages', JSON.stringify(messages));
                renderMessages();
            });

            // 组装单条留言
            msgName.appendChild(msgTime);
            messageItem.appendChild(msgName);
            messageItem.appendChild(msgContent);
            messageItem.appendChild(deleteBtn);
            messageList.appendChild(messageItem);
        });

        // 恢复留言列表正序（便于后续添加新留言）
        messages.reverse();
    }

    // 8. 时间格式化工具函数（YYYY-MM-DD HH:MM:SS）
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    // 9. 表单提交逻辑（添加新留言）
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止表单默认提交
        const name = nameInput.value.trim();
        const content = contentTextarea.value.trim();

        // 验证输入
        if (!name || !content) {
            alert('昵称和留言内容不能为空！');
            return;
        }

        // 添加新留言
        const newMessage = {
            name: name,
            content: content,
            time: Date.now() // 记录当前时间戳
        };
        messages.push(newMessage);
        localStorage.setItem('blog_messages', JSON.stringify(messages));

        // 重置表单
        messageForm.reset();

        // 重新渲染留言列表
        renderMessages();

        // 提示提交成功
        alert('留言提交成功！');
    });

    // 10. 深色模式切换时，同步更新留言板样式（优化实时同步）
    window.addEventListener('click', (e) => {
        if (e.target.innerText === '浅色模式' || e.target.innerText === '深色模式') {
            const isDark = localStorage.getItem('dark_mode') === 'true';
            const messageItems = document.querySelectorAll('.message-list > div');
            const emptyTip = document.querySelector('.emptyTip');
            const msgTimes = document.querySelectorAll('.msgTime');
            const msgContents = document.querySelectorAll('.msgContent');

            // 留言卡片样式同步
            messageItems.forEach(item => {
                item.style.backgroundColor = isDark ? 'var(--card-bg)' : 'white';
                item.style.borderColor = isDark ? 'var(--border-color)' : '#e9ecef';
            });
            // 无留言提示文本色同步
            if (emptyTip) {
                emptyTip.style.color = isDark ? 'var(--meta-color)' : '#6c757d';
            }
            // 留言时间文本色同步
            msgTimes.forEach(time => {
                time.style.color = isDark ? 'var(--meta-color)' : '#6c757d';
            });
            // 留言内容文本色同步
            msgContents.forEach(content => {
                content.style.color = isDark ? 'var(--text-light)' : '#333';
            });
        }
    });

    // 11. 将留言板添加到主页"我的博客"板块下方（小游戏按钮之后）
    const blogSection = document.querySelector('.blog-entry');
    if (blogSection) {
        const gameEntry = document.querySelector('.blog-entry + div');
        if (gameEntry) {
            gameEntry.after(messageBoard);
        } else {
            blogSection.after(messageBoard);
        }
    }

    // 12. 初始化渲染留言列表
    renderMessages();
}