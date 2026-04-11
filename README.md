# 🖤 secT — Portfolio

> Personal portfolio built with **Next.js 14**, **TypeScript** & **Tailwind CSS**  

---

## ⚡ Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Email | Nodemailer (SMTP) |
| Deploy | Vercel |

---

## 📁 Structure

```
portfolio/
├── app/
│   ├── page.tsx              → Home
│   ├── about/page.tsx        → About Me
│   ├── resume/page.tsx       → Resume / Experience
│   ├── projects/page.tsx     → Projects (filterable)
│   ├── blog/page.tsx         → Blog listing
│   ├── blog/[slug]/page.tsx  → Single post
│   ├── contact/page.tsx      → Contact form
│   ├── not-found.tsx         → 404
│   └── api/
│       ├── contact/route.ts  → POST — sends email
│       └── blog/route.ts     → GET  — blog API
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   └── data.ts               → ✏️ ALL your content lives here
├── types/index.ts            → TypeScript interfaces
└── public/
    ├── assets/               → Images
    └── Resume_BigData_Java.pdf
```

---

## 🚀 Quick Start

### 1️⃣ Clone & install

```bash
git clone https://github.com/sect-55/Portfolio.git
cd Portfolio
npm install
```

### 2️⃣ Set up env

```bash
cp .env.local.example .env.local
```

> 📭 **No SMTP?** Leave it blank — contact form logs to console in dev.  
> 📬 **Want real email?** Fill in SMTP vars (see below).

### 3️⃣ Add your assets

```
public/assets/Home/IMG_20181216_235843_046.jpg  ← your photo
public/Resume_BigData_Java.pdf                  ← your resume
```

### 4️⃣ Personalize content

Open `lib/data.ts` — change everything here:

| Key | What it controls |
|---|---|
| `SITE_CONFIG` | Name, title, email, social links |
| `EXPERIENCES` | Work history |
| `PROJECTS` | Portfolio projects |
| `BLOG_POSTS` | Blog articles |
| `SKILLS` | Tech skills + proficiency |
| `ABOUT_HIGHLIGHTS` | Stats on About page |

### 5️⃣ Run locally

```bash
npm run dev
```

→ Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Build & Deploy

```bash
npm run build
npm start
```

### 🔺 Deploy to Vercel (1 command)

```bash
npx vercel
```

**OR** connect your GitHub repo at [vercel.com](https://vercel.com) for auto-deploys on every push.

> ⚠️ Add your `.env.local` values as **Environment Variables** in the Vercel dashboard.

---

## 📧 Contact Form — SMTP Setup

Edit `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your_app_password
SMTP_TO=you@gmail.com
```

**Gmail steps:**
1. Enable 2FA on your Google account
2. Go to **Google Account → Security → App Passwords**
3. Generate a password → paste it as `SMTP_PASS`

---

## 🎨 Design Tokens

| Token | Value | Used for |
|---|---|---|
| `bg` | `#080808` | Page background |
| `surface` | `#111111` | Cards |
| `accent` | `#c9a96e` | Gold highlights |
| `text-primary` | `#f0ece4` | Headings |
| `text-secondary` | `#888888` | Body text |
| `text-muted` | `#555555` | Labels, captions |
| Display font | Cormorant Garamond | Headings |
| Body font | DM Sans | Body |
| Mono font | JetBrains Mono | Code, labels |

---

## 📄 License

MIT — use freely, credit appreciated.
