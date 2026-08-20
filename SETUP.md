# Setup Instructions - TACO Sales Insight Dashboard

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## 🚀 Quick Start

1. **Navigate to project folder:**
```bash
cd d:\Project\PKL\TACO\TACO_web
```

2. **Install required dependencies (jika belum):**
```bash
npm install
```

3. **Install optional packages untuk animasi dan chart:**
```bash
npm install framer-motion recharts papaparse
```

## 🎨 Design System Configuration

### Custom Colors (already configured in `src/styles/tailwind.config.js`)
- Primary: Deep Blue (`#0077ff`)
- Secondary: Neutral Gray Scale
- Accent: Professional Pink (`#ec4899`)

### Fonts (already configured)
- Sans: Inter
- Heading: Manrope

## 🔧 Development

### Start development server:
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## 📱 Features Overview

### ✅ Implemented
- **Login System** dengan mock authentication
- **Supervisor Dashboard** - Kinerja Tim
- **Supervisor Dashboard** - Intelijen Kompetitor
- **Responsive Layout** dengan sidebar navigation
- **Dark Mode** toggle
- **CSV Export** functionality
- **Sortable Tables**
- **Interactive Charts** (simulated)
- **Loading States** dengan skeleton screens
- **Error Handling** sesuai security requirements

### 📝 Mock Credentials
```
Supervisor: supervisor@demo.com / password123
Data Steward: steward@demo.com / password123
```

## 🎯 Business Requirements Met

### Kinerja Tim:
- ✅ Hanya tim supervisor yang login
- ✅ Visual indicators untuk coaching needs
- ✅ Leaderboard dengan delta ranking
- ✅ Filter periode
- ✅ Performance trend arrows

### Intelijen Kompetitor:
- ✅ Privacy compliance (nama sales tidak ditampilkan)
- ✅ Export CSV functional
- ✅ Drill-down laporan detail
- ✅ Brand filtering
- ✅ Empty state handling

## 🔍 Code Structure Highlights

### Authentication System
- Context API untuk state management
- Protected routes dengan role-based access
- Mock data dengan hardcoded credentials
- Local storage persistence

### Mock Data
Semua data ada di `src/data/mockData.js`:
- 8 team members dengan variasi performa
- Competitor brands dengan harga historis
- Signal reports untuk drill-down
- Dashboard summary statistics

### UI Components
- Custom design system (bukan template generik)
- Micro-interactions dan hover states
- Page transitions dan animations
- Skeleton loading screens
- Responsive breakpoints

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use:**
```bash
# Ubah port di vite.config.js atau
# Kill process yang menggunakan port 5173
```

2. **Missing dependencies:**
```bash
npm install
# atau untuk spesifik package
npm install framer-motion recharts papaparse
```

3. **ESLint errors:**
```bash
npm run lint -- --fix
```

4. **Build errors:**
- Pastikan semua dependencies terinstall
- Check console untuk error messages spesifik

## 📈 Performance Optimization

### Development:
- HMR (Hot Module Replacement) aktif
- Fast refresh untuk React components

### Production:
- Code splitting otomatis dengan Vite
- Minification dan compression
- Tree shaking untuk unused code

## 🔒 Security Notes

### Implemented Security Measures:
- Generic error messages untuk login failures
- No specific username/password hints
- Sales names hidden in competitor intelligence
- Client-side validation dengan user-friendly feedback
- XSS prevention melalui proper escaping

### Security Best Practices:
- Never commit `.env` files
- Use environment variables untuk sensitive data
- Implement proper CORS di production
- Regular dependency updates

## 🤝 Contributing

### Development Workflow:
1. Create feature branch dari `main`
2. Implement changes dengan proper testing
3. Run linting sebelum commit
4. Create PR dengan clear description

### Coding Standards:
- Follow existing project structure
- Use Tailwind CSS untuk styling
- Implement responsive design
- Add loading states untuk async operations
- Maintain mock data consistency

## 📚 Additional Resources

### Documentation:
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

### Icons:
- [React Icons](https://react-icons.github.io/react-icons/)

### Charts (optional):
- [Recharts](https://recharts.org/)
- [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

Untuk issues atau questions:
1. Check existing documentation
2. Review error messages di console
3. Refer to mock data structure
4. Test dengan provided credentials

---

**Status:** ✅ Ready for Development  
**Version:** 1.0.0  
**Last Updated:** August 20, 2026  
**Maintainer:** TACO Development Team