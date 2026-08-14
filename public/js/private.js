// Private page logic + anti-screenshot best-effort protection

const loginSection = document.getElementById('login-section');
const privateContent = document.getElementById('private-content');
const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');
const blurOverlay = document.getElementById('blur-overlay');

// Check if already authenticated
async function checkAuth() {
  try {
    const res = await fetch('/api/check-auth');
    const data = await res.json();
    if (data.authenticated) {
      showPrivateContent();
    }
  } catch (e) {
    console.log('Auth check failed');
  }
}

function showPrivateContent() {
  loginSection.classList.add('hidden');
  privateContent.classList.add('visible');
  document.body.classList.add('protected-page');
  enableProtection();
}

function showLogin() {
  loginSection.classList.remove('hidden');
  privateContent.classList.remove('visible');
  document.body.classList.remove('protected-page');
}

// Login handler
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
      }, 800);
    } else {
      errorMsg.textContent = data.message;
      errorMsg.style.display = 'block';
    }
  } catch (err) {
    errorMsg.textContent = 'خطا در ارتباط با سرور. دوباره تلاش کن.';
    errorMsg.style.display = 'block';
  }
});

// Logout
async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } catch (e) {}
  showLogin();
  window.location.reload();
}

// ========== Anti-screenshot / protection best efforts ==========
function enableProtection() {
  // Disable right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Disable common keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // PrintScreen, Ctrl+P, Ctrl+S, Ctrl+Shift+I, F12, etc.
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

  // When tab loses focus / visibility change → hide content
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      blurOverlay.style.display = 'flex';
    } else {
      blurOverlay.style.display = 'none';
    }
  });

  // Blur on window blur (some screenshot tools)
  window.addEventListener('blur', () => {
    blurOverlay.style.display = 'flex';
  });
  window.addEventListener('focus', () => {
    blurOverlay.style.display = 'none';
  });

  // Prevent drag
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

// Init
checkAuth();
