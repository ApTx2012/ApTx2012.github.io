import { calculateReadingTime, initCopyCode, initVisitCount, countBlogWords } from './js-functions/utils.js';
import { initGuessNumberGame } from './js-functions/mini-game.js';
import { initMessageBoard } from './js-functions/messageBoard.js';
import { initSuzhouWeather } from './js-functions/weather.js';
import { initBilibiliPlayer } from './js-functions/bilibiliPlayer.js';

window.addEventListener('load', () => {
    try {
        initVisitCount();
        initCopyCode();

        const blogContent = document.querySelector('.blog-detail-content');
        if (blogContent) {
            const contentText = blogContent.innerText;
            const readingTime = calculateReadingTime(contentText);
            const wordCount = countBlogWords(contentText);
            const readingTimeElem = document.querySelector('.blog-detail-meta span:last-child');
            if (readingTimeElem) {
                readingTimeElem.innerText = '阅读时长：' + readingTime + '分钟 | 字数：' + wordCount + '字';
            }
        }

        initGuessNumberGame();
        initMessageBoard();
        initSuzhouWeather();
        initBilibiliPlayer();

        console.log('✅ 所有功能加载完成');
    } catch (error) {
        console.error('❌ 加载失败：', error);
    }
});