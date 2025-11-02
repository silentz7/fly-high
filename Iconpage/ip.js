// iconpage/ip.js (REPLACE your current file with this)

const birdGrid = document.getElementById('birdGrid');
const clickSfx = document.getElementById('clickSfx');
const ipBgm = document.getElementById('ipBgm');
const homeBtn = document.getElementById('homeBtn');
const startBtn = document.getElementById('startBtn');

const totalBirds = 10;
let selectedBird = localStorage.getItem('selectedBird') || 'bird1.png';

// autoplay for APK / attempt in browser
window.addEventListener('load', () => {
  ipBgm.volume = 0.4;
  ipBgm.play().catch(() => {});
});

// helper: play click sound
function playClick() {
  if (!clickSfx) return;
  try {
    clickSfx.currentTime = 0;
    clickSfx.play();
  } catch (e) {
    // ignore autoplay restrictions
  }
}

// create bird cards with names
for (let i = 1; i <= totalBirds; i++) {
  const birdDiv = document.createElement('div');
  birdDiv.classList.add('bird');
  birdDiv.dataset.filename = `bird${i}.png`;

  if (selectedBird === `bird${i}.png`) {
    birdDiv.classList.add('selected');
  }

  // image
  const img = document.createElement('img');
  img.src = `../Assets/images/birds/bird${i}.png`;
  img.alt = `Bird ${i}`;

  // name label
  const name = document.createElement('div');
  name.classList.add('bird-name');
  name.textContent = `Bird ${i}`;

  // append
  birdDiv.appendChild(img);
  birdDiv.appendChild(name);

  // click / touch handler
  birdDiv.addEventListener('click', () => {
    playClick();
    // remove previous selection
    document.querySelectorAll('.bird').forEach(b => b.classList.remove('selected'));
    birdDiv.classList.add('selected');

    selectedBird = birdDiv.dataset.filename;
    localStorage.setItem('selectedBird', selectedBird);
  });

  birdGrid.appendChild(birdDiv);
}

// navigation handlers
homeBtn.addEventListener('click', () => {
  playClick();
  setTimeout(() => {
    try { ipBgm.pause(); } catch(e) {}
    window.location.href = '../index.html';
  }, 120);
});

startBtn.addEventListener('click', () => {
  playClick();
  if (!selectedBird) selectedBird = 'bird1.png';
  localStorage.setItem('selectedBird', selectedBird);
  setTimeout(() => {
    try { ipBgm.pause(); } catch(e) {}
    window.location.href = '../game/game.html';
  }, 120);
});

