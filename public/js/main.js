// Shared utilities for Sepid Birthday site

// Floating hearts (subtle, continuous)
function spawnHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart-particle';
  heart.textContent = ['💜', '🌸', '💕', '✨'][Math.floor(Math.random() * 4)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.bottom = '-20px';
  heart.style.fontSize = (0.7 + Math.random() * 0.9) + 'rem';
  heart.style.animationDuration = (6 + Math.random() * 5) + 's';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 9000);
}

// Start gentle hearts
let heartsStarted = false;
function startHearts() {
  if (heartsStarted) return;
  heartsStarted = true;
  setInterval(spawnHeart, 1600);
  // a few right away
  for (let i = 0; i < 3; i++) setTimeout(spawnHeart, i * 400);
}

// Confetti burst
function launchConfetti() {
  const colors = ['#e8a0c0', '#c48ba5', '#b8a0c8', '#f0d0e0', '#d4a0b8', '#9b82b0', '#ffb6c1', '#ff9ec0'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = '-12px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (5 + Math.random() * 8) + 'px';
    piece.style.height = (5 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.45 ? '50%' : '2px';
    piece.style.animationDelay = (Math.random() * 0.5) + 's';
    piece.style.animationDuration = (2.3 + Math.random() * 1.6) + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4200);
  }
}

window.launchConfetti = launchConfetti;
window.startHearts = startHearts;

// Auto-start hearts if intro already done (refresh / other pages)
document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro-overlay');
  if (!intro || intro.classList.contains('hidden') || sessionStorage.getItem('sepid_intro_done')) {
    setTimeout(startHearts, 600);
  }
});
