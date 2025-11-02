const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Audio
const bgm = document.getElementById("bgm");
const effect = document.getElementById("effect");
const loseSound = document.getElementById("loseSound");
const winSound = document.getElementById("winSound");

// Popup
const popup = document.getElementById("popup");
const popupImage = document.getElementById("popupImage");
const popupText = document.getElementById("popupText");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");

// Score
const scoreValue = document.getElementById("scoreValue");

// Bird setup
let birdImg = new Image();
let selectedBird = localStorage.getItem("selectedBird") || "bird1.png";
birdImg.src = "../Assets/images/birds/" + selectedBird;

// Background & poles
let background = new Image();
background.src = "../Assets/images/background.png";

let poleImg = new Image();
poleImg.src = "../Assets/images/pole.png";

let greenLine = { x: canvas.width * 3, width: 40, color: "lime" };

let bird = {
  x: 100,
  y: canvas.height / 2,
  width: 60,
  height: 60,
  gravity: 0.35,
  lift: -7,
  velocity: 0,
};

let poles = [];
let score = 0;
let gameOver = false;
let gameWin = false;

// Generate poles
let poleX = canvas.width + 200;
for (let i = 0; i < 20; i++) {
  let gap;
  if (i < 10) gap = 240;
  else if (i < 15) gap = 240;
  else gap = 210;

  let offsetY = Math.random() * 150 - 75;
  let topHeight = canvas.height / 2 - gap / 2 + offsetY;
  let bottomY = canvas.height / 2 + gap / 2 + offsetY;

  poles.push({
    x: poleX,
    width: 80,
    topHeight: topHeight,
    bottomY: bottomY,
    passed: false,
  });
  poleX += 400;
}

greenLine.x = poles[poles.length - 1].x + 400;

// ✅ BGM will start only after first jump
let bgmStarted = false;

// ✅ Only touch control (no mouse)
window.addEventListener("touchstart", () => {
  if (gameOver || gameWin) return;

  // Start bgm after first interaction
  if (!bgmStarted) {
    bgm.currentTime = 0;
    bgm.loop = true;
    bgm.play().catch(() => {});
    bgmStarted = true;
  }

  // Stop overlapping effect
  if (!effect.paused) {
    effect.pause();
    effect.currentTime = 0;
  }

  bird.velocity = bird.lift;
  effect.play().catch(() => {});
});

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPoles() {
  poles.forEach(p => {
    ctx.drawImage(poleImg, p.x, 0, p.width, p.topHeight);
    ctx.drawImage(poleImg, p.x, p.bottomY, p.width, canvas.height - p.bottomY);
  });
  ctx.fillStyle = "lime";
  ctx.fillRect(greenLine.x, 0, greenLine.width, canvas.height);
}

function showPopup(win) {
  popup.classList.remove("hidden");
  popupImage.src = win ? "../Assets/images/win.png" : "../Assets/images/lose.png";
  popupText.textContent = win ? "Jeet ki Khusi me ek Selfie ho jaye 😁" : "Tumse naa ho payega 🥱";

  bgm.pause();
  if (win) {
    winSound.currentTime = 0;
    winSound.play();
  } else {
    loseSound.currentTime = 0;
    loseSound.play();
  }
}

function resetGame() {
  // Instead of full reload, we reset all vars
  gameOver = false;
  gameWin = false;
  score = 0;
  scoreValue.textContent = 0;
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  poles = [];
  poleX = canvas.width + 200;

  for (let i = 0; i < 20; i++) {
    let gap = i < 10 ? 240 : i < 15 ? 240 : 220;
    let offsetY = Math.random() * 150 - 75;
    let topHeight = canvas.height / 2 - gap / 2 + offsetY;
    let bottomY = canvas.height / 2 + gap / 2 + offsetY;

    poles.push({
      x: poleX,
      width: 80,
      topHeight: topHeight,
      bottomY: bottomY,
      passed: false,
    });
    poleX += 400;
  }

  greenLine.x = poles[poles.length - 1].x + 400;
  popup.classList.add("hidden");
  loseSound.pause();
  winSound.pause();

  // 🟢 Force bgm to wait for first jump again
  bgm.pause();
  bgmStarted = false;

  update();
}

restartBtn.onclick = resetGame;

homeBtn.onclick = () => {
  loseSound.pause();
  winSound.pause();
  window.location.href = "../index.html";
};

function update() {
  if (gameOver || gameWin) return;

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
    showPopup(false);
  }

  drawPoles();
  drawBird();

  poles.forEach(p => {
    let speed = 4.5;
    if (score > 10) speed = 4.0;
    if (score > 15) speed = 3.8;
    p.x -= speed;

    if (
      bird.x + bird.width > p.x &&
      bird.x < p.x + p.width &&
      (bird.y < p.topHeight || bird.y + bird.height > p.bottomY)
    ) {
      gameOver = true;
      showPopup(false);
    }

    if (!p.passed && p.x + p.width < bird.x) {
      score++;
      scoreValue.textContent = score;
      p.passed = true;
    }
  });

  // ✅ Fixed: Move green line using proper speed variable
  let lineSpeed = 4.5;
  if (score > 10) lineSpeed = 4.0;
  if (score > 15) lineSpeed = 3.8;
  greenLine.x -= lineSpeed;

  // ✅ Trigger win cleanly
  if (!gameWin && bird.x + bird.width >= greenLine.x) {
    gameWin = true;
    showPopup(true);
  }

  requestAnimationFrame(update);
}

update();



