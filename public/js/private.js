// Private page: Love Game + Login + Protection

const loveGame = document.getElementById('love-game');
const loginSection = document.getElementById('login-section');
const privateContent = document.getElementById('private-content');
const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');
const blurOverlay = document.getElementById('blur-overlay');

const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const catResult = document.getElementById('cat-result');
const gameButtons = document.getElementById('game-buttons');
const btnContinue = document.getElementById('btn-continue');

let noClickCount = 0;
const MAX_RUNAWAY = 6;

// ---------- Init ----------
async function init() {
  // First check if already authenticated
  try {
    const authRes = await fetch('/api/check-auth');
    const authData = await authRes.json();
    if (authData.authenticated) {
      showPrivateContent();
      return;
    }
  } catch (e) {}

  // Check if this IP already played the game
  try {
    const gameRes = await fetch('/api/check-game');
    const gameData = await gameRes.json();
    if (gameData.alreadyPlayed) {
      showLogin();
    } else {
      showLoveGame();
    }
  } catch (e) {
    showLogin();
  }
}

function showLoveGame() {
  loveGame.style.display = 'block';
  loginSection.style.display = 'none';
  privateContent.classList.remove('visible');
}

function showLogin() {
  loveGame.style.display = 'none';
  loginSection.style.display = 'block';
  privateContent.classList.remove('visible');
}

function showPrivateContent() {
  loveGame.style.display = 'none';
  loginSection.style.display = 'none';
  privateContent.classList.add('visible');
  document.body.classList.add('protected-page');
  enableProtection();
}

// ---------- Love Game Logic ----------
btnYes.addEventListener('click', async () => {
  gameButtons.style.display = 'none';
  catResult.style.display = 'block';
  catResult.innerHTML = `
    <p style="font-size: 2.5rem; margin-bottom: 0.8rem;">🥰</p>
    <p style="font-size: 1.2rem; color: #f0d0e0; margin-bottom: 1.5rem;">دمت گرم... می‌دونستم 💜</p>
    <button type="button" class="btn" id="btn-continue-yes" style="max-width: 240px; margin: 0 auto;">بزن بریم پیامتو ببین</button>
  `;
  document.getElementById('btn-continue-yes').addEventListener('click', finishGame);
  if (window.launchConfetti) window.launchConfetti();
});

btnNo.addEventListener('click', () => {
  noClickCount++;

  if (noClickCount < MAX_RUNAWAY) {
    runAway(btnNo);
  } else {
    // 6th time → crying cat
    gameButtons.style.display = 'none';
    catResult.style.display = 'block';
  }
});

function runAway(btn) {
  const container = btn.parentElement;
  const containerRect = container.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  const maxX = Math.max(20, containerRect.width - btnRect.width - 20);
  const maxY = Math.max(30, 120);

  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;

  btn.style.position = 'absolute';
  btn.style.left = newX + 'px';
  btn.style.top = newY + 'px';
  btn.style.transition = 'all 0.22s ease';
  btn.style.zIndex = '10';

  btn.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.1)' },
    { transform: 'scale(1)' }
  ], { duration: 180 });
}

// Extra runaway on hover (desktop)
btnNo.addEventListener('mouseenter', () => {
  if (noClickCount < MAX_RUNAWAY - 1) {
    noClickCount++;
    runAway(btnNo);
  }
});

btnContinue.addEventListener('click', finishGame);

async function finishGame() {
  try {
    await fetch('/api/mark-game-played', { method: 'POST' });
  } catch (e) {}
  showLogin();
}

// ---------- Login ----------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.style.display = 'none';
  successMsg.style.display = 'none';

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      successMsg.textContent = data.message + ' ✨';
      successMsg.style.display = 'block';
      setTimeout(() => {
        showPrivateContent();
      }, 700);
    } else {
      errorMsg.textContent = data.message;
      errorMsg.style.display = 'block';
    }
  } catch (err) {
    errorMsg.textContent = 'خطا در ارتباط با سرور. دوباره تلاش کن.';
    errorMsg.style.display = 'block';
  }
});

async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } catch (e) {}
  window.location.reload();
}

// ---------- Anti-screenshot protection ----------
function enableProtection() {
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'PrintScreen' ||
      (e.ctrlKey && (e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S')) ||
      (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J')) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      showTempWarning();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      blurOverlay.style.display = 'flex';
    } else {
      blurOverlay.style.display = 'none';
    }
  });

  window.addEventListener('blur', () => {
    blurOverlay.style.display = 'flex';
  });
  window.addEventListener('focus', () => {
    blurOverlay.style.display = 'none';
  });

  document.addEventListener('dragstart', (e) => e.preventDefault());
}

function showTempWarning() {
  const original = blurOverlay.innerHTML;
  blurOverlay.innerHTML = `
    <div>
      <p style="font-size: 2rem; margin-bottom: 1rem;">🚫</p>
      <p>اسکرین‌شات و کپی مجاز نیست</p>
    </div>
  `;
  blurOverlay.style.display = 'flex';
  setTimeout(() => {
    blurOverlay.style.display = 'none';
    blurOverlay.innerHTML = original;
  }, 1500);
}

// Start
init();
