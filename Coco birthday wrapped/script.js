const slides = Array.from(document.querySelectorAll('.slide'));
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const replayBtn = document.getElementById('replayBtn');
const startBtn = document.querySelector('.start-btn');
const progressBar = document.getElementById('progressBar');
const storiesBar = document.getElementById('storiesBar');
const slideCounter = document.getElementById('slideCounter');
const music = document.getElementById('bgmusic');
const musicBtn = document.getElementById('musicBtn');
const giftBox = document.getElementById('giftBox');
const giftMessage = document.getElementById('giftMessage');
const confettiContainer = document.getElementById('confetti-container');

let currentSlide = 0;

function initStoriesBar() {
    if (!storiesBar) return;
    storiesBar.innerHTML = '';
    slides.forEach((_, i) => {
        const seg = document.createElement('div');
        seg.className = 'segment';
        if (i <= currentSlide) seg.classList.add('filled');
        storiesBar.appendChild(seg);
    });
}

function updateCounter() {
    if (slideCounter) slideCounter.textContent = `${currentSlide + 1}/${slides.length}`;
}

function updateStoriesBar() {
    if (!storiesBar) return;
    const segs = storiesBar.querySelectorAll('.segment');
    segs.forEach((seg, i) => seg.classList.toggle('filled', i <= currentSlide));
    if (progressBar) progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
}

function showSlide(index) {
    index = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    currentSlide = index;
    updateStoriesBar();
    updateCounter();
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) showSlide(currentSlide - 1);
}

function setMusicIcon(isUnmuted) {
    if (!musicBtn) return;
    const icon = musicBtn.querySelector('i');
    if (!icon) return;
    icon.className = isUnmuted ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
}

function attachListeners() {
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); });
    if (replayBtn) replayBtn.addEventListener('click', () => { showSlide(0); });
    if (startBtn) startBtn.addEventListener('click', () => { nextSlide(); });

    if (musicBtn && music) {
        musicBtn.addEventListener('click', () => {
            music.muted = !music.muted;
            if (!music.muted) {
                music.play().catch(() => {});
            }
            setMusicIcon(!music.muted);
        });
    }

    if (giftBox) {
        giftBox.addEventListener('click', () => {
            if (giftMessage) giftMessage.classList.add('show');
            giftBox.innerHTML = '❤️';
            launchConfetti();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') { nextSlide(); }
        if (event.key === 'ArrowLeft') { prevSlide(); }
    });

    let touchstartX = 0;
    let touchstartY = 0;
    let touchIsScrolling = false;

    document.addEventListener('touchstart', (event) => {
        const touch = event.changedTouches[0];
        touchstartX = touch.screenX;
        touchstartY = touch.screenY;
        touchIsScrolling = false;
    }, { passive: true });

    document.addEventListener('touchmove', (event) => {
        const touch = event.changedTouches[0];
        const diffX = Math.abs(touch.screenX - touchstartX);
        const diffY = Math.abs(touch.screenY - touchstartY);
        if (diffY > diffX) {
            touchIsScrolling = true;
        }
    }, { passive: true });

    document.addEventListener('touchend', (event) => {
        if (touchIsScrolling) return;
        const touchendX = event.changedTouches[0].screenX;
        const diff = touchendX - touchstartX;
        if (Math.abs(diff) > 50) {
            if (diff < 0) { nextSlide(); }
            else { prevSlide(); }
        }
    });

    document.addEventListener('click', () => {
        if (music && music.paused) {
            music.play().catch(() => {});
            setMusicIcon(true);
        }
    }, { once: true });
}

function launchConfetti() {
    if (!confettiContainer) return;
    const colors = ['#ff5b5b', '#ff9a9a', '#ffd1d1', '#fff2f2'];
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confettiContainer.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initStoriesBar();
    attachListeners();
    showSlide(0);

    if (music) {
        music.muted = false;
        const playPromise = music.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setMusicIcon(!music.muted))
                .catch(() => setMusicIcon(!music.muted));
        } else {
            setMusicIcon(!music.muted);
        }
    } else {
        setMusicIcon(false);
    }
});

