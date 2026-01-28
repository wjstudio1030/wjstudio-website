const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const navLinks = document.querySelectorAll('.navbar__links');
// --- 5. Logo 點擊粒子特效 (數位煙火) ---
const logo = document.querySelector('#navbar__logo');

// --- 1. Mobile Menu 邏輯 ---
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
};

// 新增以下這段監聽器
logo.addEventListener('click', (e) => {
    // 1. 核心重點：阻止 <a> 標籤的預設行為（即：跳轉/重載網頁）
    e.preventDefault(); 

    // 2. 觸發點擊時的震動效果 (若你有寫 CSS logo-active 類別)
    logo.classList.add('logo-active');
    setTimeout(() => logo.classList.remove('logo-active'), 300);

    // 3. 呼叫你寫好的煙火函數
    // 使用 e.clientX/Y 確保煙火從滑鼠點擊的位置噴發
    for (let i = 0; i < 30; i++) {
        createParticle(e.clientX, e.clientY);
    }
});

menu.addEventListener('click', mobileMenu);

// 點擊選單連結後自動關閉選單 (優化體驗)
navLinks.forEach(n => n.addEventListener('click', () => {
    if(menuLinks.classList.contains('active')) mobileMenu();
}));


// --- 2. 滑鼠追蹤邏輯 (優化效能) ---
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 使用動畫幀確保平滑度
const animateCursor = () => {
    // 這裡是平滑跟隨的關鍵公式：當前位置 + (目標位置 - 當前位置) * 延遲係數
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    
    follower.style.left = `${cursorX}px`;
    follower.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
};
animateCursor();


// --- 3. 滑鼠互動效果 ---
const interactives = document.querySelectorAll('a, button, .services__card, .navbar__toggle');

interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        // 保持 translate(-50%, -50%) 以免指標跑位
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.8)';
        follower.style.background = 'rgba(247, 112, 98, 0.2)';
        follower.style.borderColor = 'transparent';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.background = 'transparent';
        follower.style.borderColor = '#ff8177';
    });
});


// --- 4. 捲動顯示動畫 (Intersection Observer) ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // 如果只需要進場動畫一次，可以取消監測
            // revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .services__card, .main__content').forEach(el => {
    el.classList.add('reveal'); // 確保都有動畫類別
    revealObserver.observe(el);
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    document.body.appendChild(particle);

    // 隨機設定粒子的噴發方向與速度 (利用你擅長的物理運動概念)
    const size = Math.floor(Math.random() * 10 + 5);
    const destinationX = (Math.random() - 0.5) * 300;
    const destinationY = (Math.random() - 0.5) * 300;
    const rotation = Math.random() * 520;
    const delay = Math.random() * 200;

    // 設定初始顏色 (配合你網站的漸層色)
    const color = Math.random() > 0.5 ? '#ff0844' : '#4837ff';
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;
    particle.style.boxShadow = `0 0 10px ${color}`;
    
    // 定位到點擊處
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    // 啟動動畫
    const animation = particle.animate([
        {
            transform: `translate(-50%, -50%) translate(0, 0) rotate(0deg)`,
            opacity: 1
        },
        {
            transform: `translate(-50%, -50%) translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg)`,
            opacity: 0
        }
    ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        delay: delay
    });

    // 動畫結束後移除元素，節省記憶體
    animation.onfinish = () => {
        particle.remove();
    };
}
