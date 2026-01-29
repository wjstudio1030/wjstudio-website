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

// --- 6. 潛行導航欄邏輯 ---
const navbar = document.querySelector('.navbar');
let isScrolled = false;

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
const interactives = document.querySelectorAll('a, button, .services__card, .navbar__toggle, .main__content h1, .main__content h2');

interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.3)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        follower.style.borderColor = 'transparent';

        // --- 核心邏輯：區分顏色 ---
        // 如果是 H2 (I'M JARVIS) 或者是按鈕 (main__btn)
        if (el.tagName === 'H2' || el.classList.contains('main__btn')) {
            follower.style.background = 'rgba(0, 242, 254, 0.4)'; // 淺藍色 (Jarvis Blue)
        } else {
            follower.style.background = 'rgba(247, 112, 98, 0.3)'; // 原本的紅粉色
        }
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.background = 'transparent';
        follower.style.borderColor = '#ff8177'; // 平常狀態維持原色或你喜歡的顏色
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

window.addEventListener('scroll', () => {
    // 當捲動超過 100px 時，進入隱藏模式
    if (window.scrollY > 100) {
        if (!isScrolled) {
            navbar.classList.add('nav-hidden');
            isScrolled = true;
        }
    } else {
        // 回到頁面頂部時，自動顯現
        navbar.classList.remove('nav-hidden');
        isScrolled = false;
    }
});

// 滑鼠靠近頂部或進入 Navbar 時顯現
document.addEventListener('mousemove', (e) => {
    if (isScrolled) {
        // 如果滑鼠座標在螢幕頂部 30px 以內，或是導航欄正在顯示中且滑鼠在上面
        if (e.clientY < 30) {
            navbar.classList.remove('nav-hidden');
        }
    }
});


// 等待網頁載入完成
document.addEventListener('DOMContentLoaded', () => {
    const jarvisText = document.querySelectorAll('.main__content h1, .main__content h2');
    const overlay = document.getElementById('gif-overlay');

    // 1. 點擊文字顯示 GIF
    jarvisText.forEach(text => {
        text.addEventListener('click', () => {
            overlay.classList.add('active');
            
            // 可選：播放音效 (如果你有 jarvis_voice.mp3)
            let audio = new Audio('audio/HI_WJ.mp3');
            audio.play();

            // 3秒後自動關閉（或者是演完 GIF 的時間）
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 7500);
        });
    });

    // 2. 點擊 GIF 任何地方也可以手動關閉
    overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
    });
});

// --- 3. 滑鼠互動效果 ---
// 在這裡加入 .main__content h1 和 .main__content h2




// 當滑鼠離開 Navbar 區域後，如果還是在捲動狀態，就把它藏回去
navbar.addEventListener('mouseleave', () => {
    if (isScrolled) {
        navbar.classList.add('nav-hidden');
    }
});
