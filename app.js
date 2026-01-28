const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const navLinks = document.querySelectorAll('.navbar__links');

// --- 1. Mobile Menu 邏輯 ---
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
};

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