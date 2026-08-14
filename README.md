# 🌸 Sepid Birthday – Glassmorphism Site

سایت تبریک تولد سپید  
ساخته‌شده با عشق توسط **Kia & Grok**

---

## ویژگی‌ها

- طراحی مدرن شیشه‌ای (Glassmorphism)
- تم مات صورتی + بنفش با حس گل‌های لاله و لیلیوم
- سه بخش:
  1. **عمومی** – پیام تبریک اصلی + پیام گروک
  2. **درد و دل‌ها** – حرف‌های صمیمی‌تر
  3. **Private** – بخش کاملاً خصوصی با کلید یک‌بارمصرف
- ۵ کلید یک‌بارمصرف (بعد از استفاده منقضی می‌شوند)
- تلاش برای جلوگیری از اسکرین‌شات در صفحه Private
- کاملاً آماده برای دیپلوی روی **Railway**

---

## ۵ کلید یک‌بارمصرف (فقط برای ادمین / کیا)

| # | Username          | Password       |
|---|-------------------|----------------|
| 1 | `sepid_azizam`    | `lily_tulip26` |
| 2 | `my_beautiful`    | `purple_kiss`  |
| 3 | `kia_sepid`       | `forever_love` |
| 4 | `birthday_sepid`  | `glass_heart`  |
| 5 | `love_of_life`    | `matte_pink26` |

> هر کلید فقط **یک بار** کار می‌کند. بعد از ورود موفق، دیگر قابل استفاده نیست.

---

## اجرا روی لوکال

```bash
npm install
npm start
```

سایت روی `http://localhost:3000` بالا می‌آید.

---

## دیپلوی روی Railway (خیلی ساده)

1. این پوشه را به یک ریپازیتوری GitHub پوش کن (یا مستقیم از Railway آپلود کن).
2. برو به [railway.app](https://railway.app) و لاگین کن.
3. New Project → Deploy from GitHub repo (یا Empty Project و آپلود).
4. Railway به صورت خودکار `package.json` را تشخیص می‌دهد و `npm start` را اجرا می‌کند.
5. بعد از دیپلوی، یک دامنه رایگان بهت می‌دهد (مثل `sepid-birthday-production.up.railway.app`).
6. همون لینک را برای سپید بفرست.

> نکته: چون کلیدها در حافظه (memory) نگهداری می‌شوند، اگر سرویس Railway ریستارت شود، کلیدهای استفاده‌شده دوباره فعال می‌شوند. برای تولد مشکلی ایجاد نمی‌کند.

---

## ویرایش محتوا

- پیام‌های بخش عمومی و درد و دل‌ها را در فایل‌های:
  - `public/index.html`
  - `public/dard.html`
  - `public/private.html`
  می‌توانی تغییر بدهی.

- رنگ‌ها و استایل در `public/css/style.css` هستند.

---

Made by Kia & Grok for Sepid Birthday 💜
