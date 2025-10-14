# Portfolio Website - Nuralim

Portfolio website profesional single-page berbahasa Indonesia untuk Nuralim, Product & Technology Development Manager dengan 6+ tahun pengalaman di industri software engineering.

## 🎯 Fitur Utama

- ✨ **Modern & Elegant**: Desain premium dengan animasi halus menggunakan Framer Motion
- 📱 **Fully Responsive**: Mobile-first design yang optimal di semua device
- 🌓 **Dark Mode**: Toggle dark/light theme dengan next-themes
- 🎨 **Custom Brand Colors**: Palet warna kustom (#0A84FF, #00C2A8, #0B1220)
- ♿ **Accessible**: Semantic HTML, ARIA labels, dan keyboard navigation
- 🚀 **SEO Optimized**: OpenGraph, Twitter Cards, dan schema.org Person
- 📊 **10 Projects**: Portfolio lengkap dengan case study modal
- 💼 **Complete Resume**: Experience timeline, skills, education
- 📬 **Contact Form**: Form kontak dengan validasi dan WhatsApp integration
- ⚡ **Performance**: Target Lighthouse score ≥ 90

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Animations**: framer-motion
- **Theme**: next-themes
- **Font**: Inter (Google Fonts)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, atau bun

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build for Production

```bash
# Build aplikasi
npm run build

# Test production build locally
npm start
```

## 📂 Struktur Proyek

```
src/
├── app/
│   ├── layout.tsx          # Root layout dengan metadata & SEO
│   ├── page.tsx            # Home page dengan semua sections
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── header.tsx          # Sticky header
│   ├── footer.tsx          # Footer dengan social links
│   ├── theme-provider.tsx  # Theme context provider
│   ├── theme-toggle.tsx    # Dark mode toggle
│   ├── sections/           # Section components
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── skills-section.tsx
│   │   ├── experience-section.tsx
│   │   ├── projects-section.tsx
│   │   ├── education-section.tsx
│   │   └── contact-section.tsx
│   └── ui/                 # shadcn/ui components
├── data/
│   └── portfolio.ts        # Portfolio data (projects, skills, etc)
└── lib/
    └── utils.ts            # Utility functions
```

## 🎨 Color Palette

```css
Primary: #0A84FF   /* Blue - Professional, trustworthy */
Accent:  #00C2A8   /* Teal - Innovation, growth */
Dark:    #0B1220   /* Dark blue - Premium, elegant */
Muted:   #E2E8F0   /* Light gray - Clean, minimal */
```

## 📝 Customization

### Update Content

Edit file `src/data/portfolio.ts` untuk mengubah:
- Personal info (nama, email, phone, social links)
- Hero section content
- About section & metrics
- Skills & tech stack
- Work experience
- Projects & case studies
- Education & interests

### Update Colors

Edit CSS variables di `src/app/globals.css`:

```css
:root {
  --brand-primary: #0A84FF;
  --brand-accent: #00C2A8;
  --brand-dark: #0B1220;
  --brand-muted: #E2E8F0;
}
```

### Update Metadata & SEO

Edit metadata di `src/app/layout.tsx`:
- Title & description
- OpenGraph images
- Twitter card metadata
- Keywords

## 📱 Sections Overview

1. **Header** - Sticky navigation dengan blur effect
2. **Hero** - Headline, CTA, tech badges
3. **About** - Personal story & metrics
4. **Skills** - Tech stack grid (6 categories)
5. **Experience** - Timeline cards (2 companies, 5 positions)
6. **Projects** - 10 projects dengan case study modal
7. **Education** - Education cards & interests
8. **Contact** - Form + WhatsApp CTA
9. **Footer** - Social links & copyright

## ✅ SEO Features

- ✅ Semantic HTML5
- ✅ Meta tags (title, description, keywords)
- ✅ OpenGraph tags (Facebook, LinkedIn)
- ✅ Twitter Card metadata
- ✅ schema.org Person structured data
- ✅ Mobile-friendly viewport
- ✅ Proper heading hierarchy
- ✅ Alt text untuk images

## 📊 Performance

- Server-side rendering (SSR)
- Static generation where possible
- Image optimization dengan Next.js Image
- Code splitting otomatis
- Lazy loading untuk components
- Target Lighthouse score ≥ 90

## 🔧 Scripts

```bash
npm run dev      # Start development server dengan Turbopack
npm run build    # Build untuk production
npm start        # Run production build
npm run lint     # Run ESLint
```

## 🤝 Contact

- **Email**: nuralim.mail@gmail.com
- **Phone**: +62 811 144 1696
- **WhatsApp**: [Chat Now](https://wa.me/628111441696?text=Halo%20Nuralim,%20saya%20ingin%20diskusikan%20proyek%20software.)

---

© 2025 Nuralim. Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
