const startBtn = document.getElementById('startBtn');
const chooseBtn = document.getElementById('chooseBtn');
const clickSfx = document.getElementById('clickSfx');
const homeBgm = document.getElementById('homeBgm');

// Try autoplay (browser may block, but WebView will allow)
window.addEventListener('load', () => {
  homeBgm.volume = 0.4;
  homeBgm.play().catch(() => {});
});

// Common button click sound
function playClick() {
  clickSfx.currentTime = 0;
  clickSfx.play().catch(() => {});
}

// Start game
startBtn.addEventListener('click', () => {
  playClick();
  setTimeout(() => {
    homeBgm.pause();
    window.location.href = 'game/game.html';
  }, 150);
});

// Choose Bird
chooseBtn.addEventListener('click', () => {
  playClick();
  setTimeout(() => {
    homeBgm.pause();
    window.location.href = 'Iconpage/ip.html';
  }, 150);
});

