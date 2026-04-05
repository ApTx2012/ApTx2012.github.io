// 猜数字小游戏（核心逻辑，适配蓝色主题，弹窗式交互，不影响原有页面）
export function initGuessNumberGame() {
    // 生成1-100之间的随机数（答案）
    let answer = Math.floor(Math.random() * 100) + 1;
    // 猜测次数
    let guessCount = 0;
    // 游戏状态（是否结束）
    let isGameOver = false;

    // 游戏入口函数（点击主页按钮触发）
    window.startGuessGame = function() {
        // 重置游戏状态
        answer = Math.floor(Math.random() * 100) + 1;
        guessCount = 0;
        isGameOver = false;

        // 首次提示弹窗
        alert('🎮 猜数字小游戏开始！\n规则：猜1-100之间的数字，共10次机会，猜对获胜～');
        
        // 循环猜测逻辑
        while (!isGameOver && guessCount < 10) {
            const guessInput = prompt('请输入你猜的数字（1-100）：');
            // 处理用户取消输入
            if (guessInput === null) {
                alert('游戏已取消 😊');
                isGameOver = true;
                break;
            }
            // 验证输入是否为有效数字
            const guessNum = parseInt(guessInput);
            if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
                alert('❌ 请输入1-100之间的有效数字！');
                continue;
            }
            // 猜测次数+1
            guessCount++;
            // 判断猜测结果
            if (guessNum === answer) {
                isGameOver = true;
                alert(`🎉 恭喜你猜对啦！\n你猜了${guessCount}次，太厉害啦～\n答案就是：${answer}`);
            } else if (guessNum < answer) {
                alert(`📈 太小啦！再猜大一点，还剩${10 - guessCount}次机会`);
            } else {
                alert(`📉 太大啦！再猜小一点，还剩${10 - guessCount}次机会`);
            }
        }
        // 次数用完未猜对
        if (!isGameOver && guessCount >= 10) {
            alert(`😢 机会用完啦！\n正确答案是：${answer}\n下次加油哦～`);
        }
    }

    // 在主页添加小游戏入口按钮（贴合蓝色主题，不破坏原有布局）
    const gameEntry = document.createElement('div');
    gameEntry.style.cssText = `
        margin: 2rem 0;
        text-align: center;
    `;
    const gameBtn = document.createElement('button');
    gameBtn.innerText = '开始猜数字小游戏 🎮';
    gameBtn.style.cssText = `
        background: var(--primary);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s;
    `;
    // 按钮悬浮效果
    gameBtn.addEventListener('mouseenter', () => {
        gameBtn.style.background = 'var(--dark-blue)';
    });
    gameBtn.addEventListener('mouseleave', () => {
        gameBtn.style.background = 'var(--primary)';
    });
    // 点击触发游戏
    gameBtn.addEventListener('click', startGuessGame);
    gameEntry.appendChild(gameBtn);

    // 将按钮添加到主页"我的博客"板块下方
    const blogSection = document.querySelector('.blog-entry');
    if (blogSection) {
        blogSection.after(gameEntry);
    }
}