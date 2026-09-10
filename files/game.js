// ============================================================
// DANGER DAVE: PAC EDITION
// A Dangerous-Dave-style platformer with Pac-Man theming:
// run & jump across platforms, gobble dots & diamonds,
// dodge patrolling ghosts, grab the power dot to hunt them,
// and reach the trophy door to clear the level.
// ============================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');
const highEl = document.getElementById('high');

const GRAVITY = 0.6;
const MOVE_SPEED = 3.4;
const JUMP_VELOCITY = -12;
const MAX_FALL = 14;
const POWER_DURATION = 420; // frames (~7s at 60fps)

// ---------- Sound (simple WebAudio beeps, no external assets) ----------
let audioCtx = null;
function beep(freq, dur, type = 'square', vol = 0.05) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.stop(audioCtx.currentTime + dur);
  } catch (e) {
    /* audio not available - ignore */
  }
}
const SFX = {
  dot: () => beep(880, 0.05, 'square', 0.04),
  diamond: () => beep(1200, 0.12, 'triangle', 0.06),
  power: () => beep(220, 0.3, 'sawtooth', 0.07),
  eatGhost: () => beep(1600, 0.2, 'square', 0.08),
  hurt: () => beep(120, 0.35, 'sawtooth', 0.09),
  win: () => beep(660, 0.25, 'square', 0.08),
  jump: () => beep(500, 0.08, 'square', 0.03),
};

// ---------- Helpers ----------
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ============================================================
// LEVEL DATA
// Platforms are hand-placed rectangles (in pixels) so the
// jumping geometry is guaranteed to be reachable.
// ============================================================
function buildLevels() {
  const levels = [];

  // ---- LEVEL 1 ----
  levels.push({
    start: { x: 40, y: 380 },
    trophy: { x: 740, y: 100 },
    platforms: [
      { x: 0, y: 448, w: 800, h: 32 },      // ground
      { x: 150, y: 380, w: 120, h: 20 },
      { x: 320, y: 320, w: 120, h: 20 },
      { x: 480, y: 260, w: 120, h: 20 },
      { x: 640, y: 200, w: 140, h: 20 },
      { x: 480, y: 140, w: 120, h: 20 },
      { x: 260, y: 140, w: 120, h: 20 },
      { x: 60, y: 200, w: 120, h: 20 },
      { x: 700, y: 130, w: 90, h: 20 },
    ],
    dots: autoDots([
      { x: 150, y: 380, w: 120 },
      { x: 320, y: 320, w: 120 },
      { x: 480, y: 260, w: 120 },
      { x: 640, y: 200, w: 140 },
      { x: 260, y: 140, w: 120 },
      { x: 60, y: 200, w: 120 },
      { x: 0, y: 448, w: 800 },
    ]),
    diamonds: [
      { x: 370, y: 290 },
      { x: 690, y: 170 },
      { x: 100, y: 170 },
    ],
    power: { x: 530, y: 230 },
    ghosts: [
      { x: 340, y: 296, minX: 320, maxX: 420, speed: 1.4, color: '#ff4d4d' },
      { x: 500, y: 236, minX: 480, maxX: 580, speed: 1.7, color: '#ffb3ff' },
      { x: 100, y: 424, minX: 20, maxX: 700, speed: 1.9, color: '#4dd2ff' },
    ],
  });

  // ---- LEVEL 2 ----
  levels.push({
    start: { x: 40, y: 380 },
    trophy: { x: 40, y: 60 },
    platforms: [
      { x: 0, y: 448, w: 800, h: 32 },
      { x: 640, y: 380, w: 140, h: 20 },
      { x: 480, y: 320, w: 120, h: 20 },
      { x: 640, y: 260, w: 140, h: 20 },
      { x: 480, y: 200, w: 120, h: 20 },
      { x: 320, y: 260, w: 120, h: 20 },
      { x: 160, y: 200, w: 120, h: 20 },
      { x: 320, y: 140, w: 120, h: 20 },
      { x: 20, y: 140, w: 120, h: 20 },
      { x: 0, y: 90, w: 160, h: 20 },
    ],
    dots: autoDots([
      { x: 640, y: 380, w: 140 },
      { x: 480, y: 320, w: 120 },
      { x: 640, y: 260, w: 140 },
      { x: 320, y: 260, w: 120 },
      { x: 160, y: 200, w: 120 },
      { x: 320, y: 140, w: 120 },
      { x: 0, y: 448, w: 800 },
    ]),
    diamonds: [
      { x: 700, y: 230 },
      { x: 220, y: 170 },
      { x: 40, y: 110 },
    ],
    power: { x: 510, y: 170 },
    ghosts: [
      { x: 660, y: 356, minX: 640, maxX: 760, speed: 1.6, color: '#ff4d4d' },
      { x: 500, y: 176, minX: 480, maxX: 580, speed: 1.9, color: '#ffb3ff' },
      { x: 180, y: 176, minX: 160, maxX: 260, speed: 1.5, color: '#4dd2ff' },
      { x: 300, y: 424, minX: 20, maxX: 700, speed: 2.1, color: '#ffaa00' },
    ],
  });

  // ---- LEVEL 3 ----
  levels.push({
    start: { x: 20, y: 60 },
    trophy: { x: 740, y: 400 },
    platforms: [
      { x: 0, y: 448, w: 800, h: 32 },
      { x: 0, y: 90, w: 140, h: 20 },
      { x: 180, y: 150, w: 120, h: 20 },
      { x: 0, y: 210, w: 140, h: 20 },
      { x: 180, y: 270, w: 120, h: 20 },
      { x: 340, y: 330, w: 120, h: 20 },
      { x: 500, y: 270, w: 120, h: 20 },
      { x: 660, y: 210, w: 140, h: 20 },
      { x: 500, y: 150, w: 120, h: 20 },
      { x: 660, y: 380, w: 140, h: 20 },
    ],
    dots: autoDots([
      { x: 0, y: 90, w: 140 },
      { x: 180, y: 150, w: 120 },
      { x: 0, y: 210, w: 140 },
      { x: 180, y: 270, w: 120 },
      { x: 340, y: 330, w: 120 },
      { x: 500, y: 270, w: 120 },
      { x: 660, y: 210, w: 140 },
      { x: 500, y: 150, w: 120 },
      { x: 0, y: 448, w: 800 },
    ]),
    diamonds: [
      { x: 220, y: 120 },
      { x: 380, y: 300 },
      { x: 720, y: 180 },
    ],
    power: { x: 540, y: 120 },
    ghosts: [
      { x: 200, y: 246, minX: 180, maxX: 280, speed: 1.7, color: '#ff4d4d' },
      { x: 360, y: 306, minX: 340, maxX: 440, speed: 1.9, color: '#ffb3ff' },
      { x: 520, y: 246, minX: 500, maxX: 600, speed: 1.8, color: '#4dd2ff' },
      { x: 680, y: 186, minX: 660, maxX: 780, speed: 2.0, color: '#ffaa00' },
      { x: 400, y: 424, minX: 20, maxX: 700, speed: 2.3, color: '#ff77cc' },
    ],
  });

  return levels;
}

// Scatter dots evenly along the top edge of given platform strips
function autoDots(strips) {
  const dots = [];
  strips.forEach((s) => {
    const count = Math.max(2, Math.floor(s.w / 40));
    for (let i = 0; i < count; i++) {
      const x = s.x + 20 + i * ((s.w - 40) / Math.max(1, count - 1) || 1);
      dots.push({ x, y: s.y - 14 });
    }
  });
  return dots;
}

// ============================================================
// GAME STATE
// ============================================================
let LEVELS = buildLevels();
let state = 'title'; // 'title' | 'playing' | 'dead' | 'win' | 'gameover'
let levelIndex = 0;
let score = 0;
let lives = 3;
let highScore = Number(localStorage.getItem('ddpac_high') || 0);
highEl.textContent = highScore;

let player, platforms, dots, diamonds, ghosts, trophy, powerPellet;
let powerTimer = 0;
let respawnTimer = 0;
let keys = {};

function loadLevel(idx) {
  const L = LEVELS[idx];
  player = {
    x: L.start.x,
    y: L.start.y,
    w: 26,
    h: 34,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    invuln: 0,
  };
  platforms = L.platforms;
  dots = L.dots.map((d) => ({ ...d, taken: false }));
  diamonds = L.diamonds.map((d) => ({ ...d, taken: false }));
  ghosts = L.ghosts.map((g) => ({
    ...g,
    dir: 1,
    baseY: g.y,
    startX: g.x,
    alive: true,
    respawn: 0,
  }));
  trophy = { ...L.trophy, w: 34, h: 34 };
  powerPellet = L.power ? { ...L.power, taken: false } : null;
  powerTimer = 0;
}

function resetGame() {
  score = 0;
  lives = 3;
  levelIndex = 0;
  loadLevel(levelIndex);
  state = 'playing';
  updateHud();
}

function updateHud() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  levelEl.textContent = levelIndex + 1;
}

// ============================================================
// INPUT
// ============================================================
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'Enter') {
    if (state === 'title' || state === 'gameover' || state === 'win') {
      resetGame();
    }
  }
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
    e.preventDefault();
  }
});
window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});
canvas.addEventListener('click', () => {
  if (state === 'title' || state === 'gameover' || state === 'win') resetGame();
});

// ============================================================
// UPDATE
// ============================================================
function update() {
  if (state !== 'playing') return;

  // --- horizontal input ---
  if (keys['ArrowLeft'] || keys['KeyA']) {
    player.vx = -MOVE_SPEED;
    player.facing = -1;
  } else if (keys['ArrowRight'] || keys['KeyD']) {
    player.vx = MOVE_SPEED;
    player.facing = 1;
  } else {
    player.vx = 0;
  }

  // --- jump ---
  if ((keys['ArrowUp'] || keys['Space'] || keys['KeyW']) && player.onGround) {
    player.vy = JUMP_VELOCITY;
    player.onGround = false;
    SFX.jump();
  }

  // --- physics ---
  player.vy = Math.min(player.vy + GRAVITY, MAX_FALL);
  player.x += player.vx;
  player.y += player.vy;

  // clamp to world bounds horizontally
  player.x = Math.max(0, Math.min(W - player.w, player.x));

  // --- platform collision ---
  player.onGround = false;
  for (const p of platforms) {
    if (rectsOverlap(player, p)) {
      // Falling onto top of platform
      const prevBottom = player.y - player.vy + player.h;
      if (player.vy >= 0 && prevBottom <= p.y + 1) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.onGround = true;
      } else if (player.vy < 0 && player.y - player.vy >= p.y + p.h - 1) {
        // hit head on underside
        player.y = p.y + p.h;
        player.vy = 0;
      } else {
        // side collision - push out horizontally
        if (player.x + player.w / 2 < p.x + p.w / 2) {
          player.x = p.x - player.w;
        } else {
          player.x = p.x + p.w;
        }
      }
    }
  }

  // fell off the world -> lose a life
  if (player.y > H + 60) {
    loseLife();
    return;
  }

  if (player.invuln > 0) player.invuln--;

  // --- dots ---
  for (const d of dots) {
    if (!d.taken && Math.hypot(d.x - (player.x + player.w / 2), d.y - (player.y + player.h / 2)) < 20) {
      d.taken = true;
      score += 10;
      SFX.dot();
    }
  }

  // --- diamonds ---
  for (const dm of diamonds) {
    if (!dm.taken && Math.hypot(dm.x - (player.x + player.w / 2), dm.y - (player.y + player.h / 2)) < 22) {
      dm.taken = true;
      score += 50;
      SFX.diamond();
    }
  }

  // --- power pellet ---
  if (powerPellet && !powerPellet.taken) {
    if (Math.hypot(powerPellet.x - (player.x + player.w / 2), powerPellet.y - (player.y + player.h / 2)) < 24) {
      powerPellet.taken = true;
      powerTimer = POWER_DURATION;
      score += 20;
      SFX.power();
    }
  }
  if (powerTimer > 0) powerTimer--;

  // --- ghosts ---
  for (const g of ghosts) {
    if (!g.alive) {
      g.respawn--;
      if (g.respawn <= 0) {
        g.alive = true;
        g.x = g.startX;
        g.y = g.baseY;
      }
      continue;
    }
    g.x += g.dir * g.speed;
    if (g.x < g.minX) {
      g.x = g.minX;
      g.dir = 1;
    } else if (g.x + 24 > g.maxX) {
      g.x = g.maxX - 24;
      g.dir = -1;
    }
    const gRect = { x: g.x, y: g.y, w: 24, h: 24 };
    if (rectsOverlap(player, gRect)) {
      if (powerTimer > 0) {
        g.alive = false;
        g.respawn = 240;
        score += 200;
        SFX.eatGhost();
      } else if (player.invuln <= 0) {
        loseLife();
        return;
      }
    }
  }

  // --- trophy ---
  if (rectsOverlap(player, trophy)) {
    const allDotsTaken = dots.every((d) => d.taken);
    const allDiamondsTaken = diamonds.every((d) => d.taken);
    if (allDotsTaken && allDiamondsTaken) {
      nextLevel();
    }
  }

  updateHud();
}

function loseLife() {
  lives--;
  SFX.hurt();
  if (lives <= 0) {
    state = 'gameover';
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('ddpac_high', String(highScore));
      highEl.textContent = highScore;
    }
  } else {
    // respawn at level start, keep collected items
    const L = LEVELS[levelIndex];
    player.x = L.start.x;
    player.y = L.start.y;
    player.vx = 0;
    player.vy = 0;
    player.invuln = 90;
  }
  updateHud();
}

function nextLevel() {
  SFX.win();
  score += 500;
  levelIndex++;
  if (levelIndex >= LEVELS.length) {
    state = 'win';
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('ddpac_high', String(highScore));
      highEl.textContent = highScore;
    }
  } else {
    loadLevel(levelIndex);
  }
  updateHud();
}

// ============================================================
// RENDER
// ============================================================
function draw() {
  ctx.clearRect(0, 0, W, H);

  // background grid flair
  ctx.fillStyle = '#05050f';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  for (let x = 0; x < W; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  if (state === 'title') {
    drawCenteredText('DANGER DAVE: PAC EDITION', H / 2 - 40, 28, '#ffcc00');
    drawCenteredText('Press ENTER or click to start', H / 2, 16, '#ffffff');
    drawCenteredText('Collect dots & diamonds, dodge ghosts, find the trophy', H / 2 + 30, 13, '#9effa0');
    return;
  }

  // platforms
  ctx.fillStyle = '#2244ff';
  for (const p of platforms) {
    ctx.fillStyle = '#1c2e7a';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#3a5bff';
    ctx.fillRect(p.x, p.y, p.w, 4);
  }

  // dots
  ctx.fillStyle = '#ffe066';
  for (const d of dots) {
    if (d.taken) continue;
    ctx.beginPath();
    ctx.arc(d.x, d.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // diamonds
  for (const dm of diamonds) {
    if (dm.taken) continue;
    drawDiamond(dm.x, dm.y);
  }

  // power pellet (pulsing)
  if (powerPellet && !powerPellet.taken) {
    const pulse = 6 + Math.sin(Date.now() / 120) * 2;
    ctx.fillStyle = '#00ffea';
    ctx.beginPath();
    ctx.arc(powerPellet.x, powerPellet.y, pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  // trophy
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏆', trophy.x + trophy.w / 2, trophy.y + trophy.h);

  // ghosts
  for (const g of ghosts) {
    if (!g.alive) continue;
    drawGhost(g.x, g.y, powerTimer > 0 ? '#3355ff' : g.color, powerTimer > 0 && powerTimer < 90);
  }

  // player (flicker while invulnerable)
  if (!(player.invuln > 0 && Math.floor(player.invuln / 5) % 2 === 0)) {
    drawDave();
  }

  if (state === 'dead') {
    drawCenteredText('OUCH!', H / 2, 26, '#ff4444');
  } else if (state === 'gameover') {
    drawCenteredText('GAME OVER', H / 2 - 20, 30, '#ff4444');
    drawCenteredText(`Score: ${score}  |  High: ${highScore}`, H / 2 + 16, 16, '#ffffff');
    drawCenteredText('Press ENTER to try again', H / 2 + 44, 14, '#9effa0');
  } else if (state === 'win') {
    drawCenteredText('YOU WIN!', H / 2 - 20, 30, '#ffcc00');
    drawCenteredText(`Final Score: ${score}  |  High: ${highScore}`, H / 2 + 16, 16, '#ffffff');
    drawCenteredText('Press ENTER to play again', H / 2 + 44, 14, '#9effa0');
  }
}

function drawCenteredText(text, y, size, color) {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px 'Courier New', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(text, W / 2, y);
}

function drawDiamond(x, y) {
  ctx.fillStyle = '#66e0ff';
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x + 8, y);
  ctx.lineTo(x, y + 10);
  ctx.lineTo(x - 8, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawGhost(x, y, color, scared) {
  const w = 24;
  const h = 24;
  ctx.fillStyle = scared ? '#ffffff' : color;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, w / 2, Math.PI, 0);
  ctx.lineTo(x + w, y + h);
  for (let i = 0; i < 3; i++) {
    ctx.lineTo(x + w - (w / 3) * (i + 0.5), y + h - 6);
    ctx.lineTo(x + w - (w / 3) * (i + 1), y + h);
  }
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();
  // eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x + 7, y + 11, 3.5, 0, Math.PI * 2);
  ctx.arc(x + 17, y + 11, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = scared ? '#3355ff' : '#000';
  ctx.beginPath();
  ctx.arc(x + 7, y + 11, 1.7, 0, Math.PI * 2);
  ctx.arc(x + 17, y + 11, 1.7, 0, Math.PI * 2);
  ctx.fill();
}

function drawDave() {
  const { x, y, w, h, facing } = player;
  // body
  ctx.fillStyle = '#ff6600';
  ctx.fillRect(x, y + 12, w, h - 12);
  // head
  ctx.fillStyle = '#ffd8a8';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 10, 11, 0, Math.PI * 2);
  ctx.fill();
  // cap
  ctx.fillStyle = '#cc2222';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 6, 11, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(x + (facing > 0 ? w / 2 : -4), y + 2, 10, 4);
  // eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(x + w / 2 + (facing > 0 ? 2 : -6), y + 8, 3, 3);
}

// ============================================================
// MAIN LOOP
// ============================================================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loadLevel(0);
loop();
