const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// One-time credentials (5 keys)
const credentials = [
  { username: 'sepid_azizam', password: 'lily_tulip26', used: false },
  { username: 'my_beautiful', password: 'purple_kiss', used: false },
  { username: 'kia_sepid', password: 'forever_love', used: false },
  { username: 'birthday_sepid', password: 'glass_heart', used: false },
  { username: 'love_of_life', password: 'matte_pink26', used: false }
];

// Active sessions (token -> expiry)
const sessions = new Map();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Helper: generate session token
function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'یوزرنیم و پسورد الزامی است' });
  }

  const cred = credentials.find(
    c => c.username === username.trim() && c.password === password.trim()
  );

  if (!cred) {
    return res.status(401).json({ success: false, message: 'یوزرنیم یا پسورد اشتباه است' });
  }

  if (cred.used) {
    return res.status(403).json({ success: false, message: 'این کلید قبلاً استفاده شده و منقضی شده است' });
  }

  // Mark as used
  cred.used = true;

  // Create session (valid for 2 hours)
  const token = createToken();
  sessions.set(token, Date.now() + 2 * 60 * 60 * 1000);

  res.cookie('private_token', token, {
    httpOnly: true,
    maxAge: 2 * 60 * 60 * 1000,
    sameSite: 'lax'
  });

  return res.json({ success: true, message: 'ورود موفقیت‌آمیز بود' });
});

// Check session
app.get('/api/check-auth', (req, res) => {
  const token = req.cookies.private_token;
  if (!token || !sessions.has(token)) {
    return res.json({ authenticated: false });
  }
  const expiry = sessions.get(token);
  if (Date.now() > expiry) {
    sessions.delete(token);
    return res.json({ authenticated: false });
  }
  return res.json({ authenticated: true });
});

// Logout / clear
app.post('/api/logout', (req, res) => {
  const token = req.cookies.private_token;
  if (token) sessions.delete(token);
  res.clearCookie('private_token');
  res.json({ success: true });
});

// Serve private content only if authenticated (optional extra protection)
app.get('/private-content', (req, res) => {
  const token = req.cookies.private_token;
  if (!token || !sessions.has(token) || Date.now() > sessions.get(token)) {
    return res.status(401).send('Unauthorized');
  }
  res.sendFile(path.join(__dirname, 'public', 'private-content.html'));
});

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌸 Sepid Birthday site running on http://localhost:${PORT}`);
  console.log('Available one-time keys (for admin only):');
  credentials.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.username} / ${c.password}`);
  });
});
