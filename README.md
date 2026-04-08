# Suvojit — Portfolio

A production-grade personal portfolio built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features

- **6 pages** — Home, About, Resume, Projects, Blog, Contact
- **Backend API routes** — `/api/contact` (Nodemailer email) and `/api/blog`
- **Dark editorial design** — Cormorant Garamond × DM Sans × JetBrains Mono
- **Fully typed** — TypeScript throughout
- **Animated** — CSS keyframe stagger animations, hover states
- **Responsive** — mobile-first, works on all screen sizes
- **SEO-ready** — `<Metadata>` on every page, OG tags
- **Deploy-ready** — one-click Vercel deployment

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` — the contact form works without any configuration (logs to console in dev). To enable real email delivery, add your SMTP credentials.

**Gmail setup**: Enable 2FA → create an App Password → use it as `SMTP_PASS`.

### 3. Add your assets

Put your profile photo at:

```
public/assets/Home/IMG_20181216_235843_046.jpg
```

Put your resume PDF at:

```
public/Resume_BigData_Java.pdf
```

### 4. Personalise content

All content lives in one file — `lib/data.ts`:

- `SITE_CONFIG` — name, title, email, social links
- `EXPERIENCES` — work history
- `PROJECTS` — portfolio projects
- `BLOG_POSTS` — blog articles (markdown-ish content)
- `SKILLS` — technical skills with proficiency levels
- `ABOUT_HIGHLIGHTS` — stats on the About page

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📦 Build & Deploy

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deployments.

Add your `.env.local` values as **Environment Variables** in the Vercel dashboard.

## 🗂 Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── globals.css         # Global styles, fonts, animations
│   ├── page.tsx            # Home page
│   ├── about/page.tsx      # About Me
│   ├── resume/page.tsx     # Resume / Experience
│   ├── projects/page.tsx   # Projects (filterable)
│   ├── blog/
│   │   ├── page.tsx        # Blog listing
│   │   └── [slug]/page.tsx # Individual blog post
│   ├── contact/page.tsx    # Contact form
│   ├── not-found.tsx       # 404 page
│   └── api/
│       ├── contact/route.ts  # POST — email sender
│       └── blog/route.ts     # GET  — blog posts API
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   └── data.ts             # All site content
├── types/
│   └── index.ts            # TypeScript interfaces
├── public/
│   ├── assets/
│   └── Resume_BigData_Java.pdf
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `bg` | `#080808` | Page background |
| `surface` | `#111111` | Cards |
| `accent` | `#c9a96e` | Gold highlights |
| `text-primary` | `#f0ece4` | Headings |
| `text-secondary` | `#888888` | Body text |
| `text-muted` | `#555555` | Labels, captions |
| Font display | Cormorant Garamond | Headings |
| Font body | DM Sans | Body |
| Font mono | JetBrains Mono | Code, labels |

## 📧 Contact Form

The `/api/contact` route supports two modes:

1. **With SMTP** — set `SMTP_*` env vars to send real emails via Nodemailer.
2. **Without SMTP** — submissions are logged to the console (good for dev/demo).

## License

MIT — use freely, attribution appreciated.
