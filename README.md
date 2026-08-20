# TACO Sales Intelligence Dashboard

A modern, professional sales intelligence platform designed for sales supervisors to monitor team performance and competitor analysis.

## 🚀 Tech Stack

- **React** + **Vite** (Frontend Framework)
- **Tailwind CSS** (Styling)
- **Flowbite React** (UI Components)
- **React Router DOM** (Routing)
- **React Icons** (Icons)
- **Framer Motion** (Animations) *[optional]*
- **Recharts** (Charts) *[optional]*
- **PapaParse** (CSV Export) *[optional]*

## 📁 Struktur Project

```
src/
├── components/
│   ├── auth/           # Komponen authentication
│   ├── ui/             # Komponen UI reusable
│   └── common/         # Komponen umum
├── pages/
│   ├── auth/           # Halaman auth (login)
│   ├── supervisor/     # Halaman supervisor
│   └── misc/           # Halaman lain
├── layouts/            # Layout components
├── contexts/           # React contexts
├── data/              # Mock data
├── hooks/             # Custom hooks
├── routes/            # Route configurations
├── styles/            # Global styles
├── utils/             # Utility functions
└── assets/            # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Vibrant Orange (`#ff4c00`) - Primary brand color for CTAs and highlights
- **Secondary**: Deep Brown (`#953d1f`) - Secondary accents and depth
- **Warm Tone**: Soft Beige (`#dac690`) - Supporting warm tone for backgrounds
- **Neutral**: Complete gray scale (`#f8fafc` to `#0f172a`) - Text, borders, and UI elements
- **Semantic Colors**: Success (green), Warning (amber), Error (red), Info (blue)

### Typography
- **Primary Font**: Inter (body text, interface)
- **Display Font**: Manrope (headings, titles)

### Animation System
- Fade In/Out (300ms ease-out)
- Slide Up/Down (400ms ease-out)
- Scale In (300ms ease-out)
- Smooth transitions (200ms cubic-bezier)
- Staggered animations for lists and grids
- Micro-interactions for hover, focus, and active states

## 🛣️ Routing Structure

```
/                       → Redirect ke /login
/login                  → Halaman Login
/supervisor             → Redirect ke /supervisor/kinerja-tim
/supervisor/kinerja-tim → Dashboard Kinerja Tim
/supervisor/kompetitor  → Intelijen Kompetitor
/data-steward/*         → Coming Soon (Data Steward)
/admin/*               → Coming Soon (Admin Panel)
```

## 🔐 Authentication

**Demo Credentials:**
- Supervisor: `supervisor@demo.com` / `password123`

## 📊 Fitur Implementasi

### 1. Login Screen
- [x] Split-screen layout
- [x] Password visibility toggle
- [x] Online/offline indicator
- [x] Loading states
- [x] Error handling (generic messages)

### 2. Supervisor Dashboard - Kinerja Tim
- [x] Tabel anggota team (sortable)
- [x] Leaderboard konsistensi & kualitas
- [x] Filter periode
- [x] Performance indicators
- [x] Coaching needs highlighting
- [x] Responsive design

### 3. Supervisor Dashboard - Intelijen Kompetitor
- [x] Line chart tren harga
- [x] Bar chart aktivitas brand
- [x] Breakdown sinyal per outlet
- [x] Drill-down laporan detail
- [x] CSV export functionality
- [x] Brand filtering

### 4. Layout & Navigation
- [x] Sidebar navigation
- [x] User menu dengan logout
- [x] Dark mode toggle
- [x] Responsive design
- [x] Page transitions

## 🎯 Requirements Business

### Kinerja Tim
- [x] Hanya tim milik supervisor yang login
- [x] Data mock variasi (kecil & besar team)
- [x] Visual indicators untuk coaching needs
- [x] Delta ranking (naik/turun)

### Intelijen Kompetitor
- [x] Tidak menampilkan nama sales (privacy)
- [x] Export CSV functional
- [x] Empty state handling
- [x] Drill-down modal/expand

## 🧪 Testing & Validation

### Dependencies yang perlu diinstal:
```bash
npm install framer-motion recharts papaparse
```

### Menjalankan Development Server:
```bash
npm run dev
```

### Build untuk Production:
```bash
npm run build
```

## 📝 Catatan Penting

1. **Tidak ada backend** - Semua data menggunakan mock data di `src/data/mockData.js`
2. **Loading simulation** - Menggunakan `setTimeout` untuk simulasi API calls
3. **Security compliance** - Pesan error login tidak spesifik, nama sales disembunyikan
4. **Scalable structure** - Folder structure siap untuk penambahan fitur
5. **Professional design** - Custom design system, bukan template generik

## 🔮 Roadmap (Tahap Berikutnya)

1. **Data Steward Module**
   - Validasi data sales
   - Data enrichment tools
   - Batch processing

2. **Admin Panel**
   - User management
   - Role permissions
   - System configuration

3. **Enhanced Features**
   - Real-time notifications
   - Advanced analytics
   - Integration with mobile app

## 👥 Tim Pengembang

- **Frontend**: React Developer
- **Design**: Senior UI/UX Designer
- **Project**: TACO Sales Insight v1.0.0

---

*© 2024 TACO Sales Insight Dashboard - Internal Use Only*