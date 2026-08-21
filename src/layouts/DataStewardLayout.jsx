import { useState } from 'react'
import { NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaBars,
  FaCaretDown,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaUserCircle,
  FaStore,
  FaBook,
  FaExclamationTriangle,
  FaTags,
  FaCog,
  FaDatabase
} from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ToastProvider } from '../components/ui/Toast'
import Modal from '../components/ui/Modal'
import { Stagger, StaggerItem } from '../components/ui/Stagger'
import NotificationDropdown from '../components/ui/NotificationDropdown'
import { dataStewardNotifications } from '../data/mockData'


const avatarUrl = (name, background) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Data Steward')}&background=${background}&color=fff`

const navItems = [
  { to: '/data-steward/outlet-baru', label: 'Antrean Outlet Baru', icon: FaStore },
  { to: '/data-steward/lexicon', label: 'Manajemen Lexicon', icon: FaBook },
  { to: '/data-steward/unresolved', label: 'Antrean Unresolved', icon: FaExclamationTriangle },
  { to: '/data-steward/brand-kompetitor', label: 'Brand Kompetitor', icon: FaTags },
  { to: '/data-steward/pengaturan', label: 'Pengaturan Sistem', icon: FaCog },
]

const LayoutShell = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const outlet = useOutlet()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const showLabels = !collapsed || mobileOpen

  const handleLogout = () => {
    setLogoutOpen(false)
    logout()
    navigate('/login')
  }

  const logoutFooter = (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={() => setLogoutOpen(false)}
        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        Batal
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg bg-error-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-error-600"
      >
        Keluar
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${
          mobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'
        } ${showLabels ? 'md:w-64' : 'md:w-20'}`}
      >
        <div
          className={`relative flex h-16 shrink-0 items-center border-b border-gray-200 dark:border-gray-800 ${
            showLabels ? 'justify-between px-5' : 'justify-center'
          }`}
        >
          {showLabels ? (
            <>
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500 shadow-sm">
                  <FaDatabase className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">TACO</h1>
                  <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">Data Steward</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => (mobileOpen ? setMobileOpen(false) : setCollapsed(true))}
                aria-label="Ciutkan sidebar"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 shadow-sm">
                <FaDatabase className="h-5 w-5 text-white" />
              </div>
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                aria-label="Perluas sidebar"
                className="absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition-colors hover:border-primary-500 hover:text-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                <FaChevronRight className="h-3 w-3" />
              </button>
            </>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {showLabels && (
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Menu Utama
            </p>
          )}
          <Stagger className="space-y-1">
            {navItems.map((item) => (
              <StaggerItem key={item.to}>
                <NavLink
                  to={item.to}
                  title={showLabels ? undefined : item.label}
                  onClick={() => {
                    if (mobileOpen) setMobileOpen(false)
                  }}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 rounded-lg py-2.5 transition-colors ${
                      showLabels ? 'justify-start px-4' : 'justify-center px-3'
                    } ${
                      isActive
                        ? 'font-medium text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="steward-nav-indicator"
                          className="absolute inset-0 rounded-lg border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-3">
                        <item.icon className="h-5 w-5 shrink-0" />
                        {showLabels && <span className="truncate text-sm">{item.label}</span>}
                      </span>
                    </>
                  )}
                </NavLink>
              </StaggerItem>
            ))}
          </Stagger>
        </nav>
      </aside>

      <div className={`flex min-h-screen flex-col transition-all duration-300 ${showLabels ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
            >
              <FaBars className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-semibold text-gray-900 dark:text-white md:text-lg">
                Data Steward Dashboard
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 md:gap-2">
            <NotificationDropdown
              initialData={dataStewardNotifications}
              isOpen={openMenu === 'notifications'}
              onToggle={() => setOpenMenu(openMenu === 'notifications' ? null : 'notifications')}
              onClose={() => setOpenMenu(null)}
            />

            <div className="relative">
              {openMenu === 'user' && (
                <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} aria-hidden="true" />
              )}
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'user' ? null : 'user')}
                aria-label="Menu pengguna"
                className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <img
                  src={user?.avatar || avatarUrl(user?.name || 'Data Steward', '953d1f')}
                  alt={user?.name || 'Data Steward'}
                  className="h-9 w-9 shrink-0 rounded-xl object-cover"
                />
                <span className="hidden min-w-0 text-left lg:block">
                  <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || 'Data Steward'}
                  </span>
                  <span className="block truncate text-xs capitalize text-gray-500 dark:text-gray-400">
                    {user?.role || 'data-steward'}
                  </span>
                </span>
                <FaCaretDown
                  className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200 ${
                    openMenu === 'user' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openMenu === 'user' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="border-b border-gray-100 px-3 py-3 dark:border-gray-800">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name || 'Data Steward'}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || 'email belum diatur'}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null)
                          navigate('/data-steward/profil')
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                      >
                        <FaUserCircle className="h-4 w-4 shrink-0 text-gray-400" />
                        Profile & Pengaturan
                      </button>
                    </div>
                    <div className="border-t border-gray-100 py-1 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null)
                          setLogoutOpen(true)
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-error-600 transition-colors hover:bg-error-50 hover:text-error-700 dark:text-error-400 dark:hover:bg-error-500/10 dark:hover:text-error-300"
                      >
                        <FaSignOutAlt className="h-4 w-4 shrink-0" />
                        Keluar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-4 md:px-5 md:py-6">
          <div className="mx-auto max-w-7xl">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {outlet}
            </motion.div>
          </div>
        </main>

        <footer className="mt-auto border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900 md:px-6">
          <div className="flex flex-col items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400 md:flex-row">
            <div className="flex items-center gap-3">
              <span>© {new Date().getFullYear()} TACO Data Steward Platform</span>
              <span className="hidden md:inline">•</span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">v1.0.0</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Status: <span className="text-success-500">Connected</span></span>
            </div>
          </div>
        </footer>
      </div>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Keluar dari Aplikasi?"
        size="sm"
        footer={logoutFooter}
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/10">
            <FaSignOutAlt className="h-6 w-6 text-error-500" />
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Anda yakin ingin keluar? Sesi Anda akan berakhir.
          </p>
        </div>
      </Modal>
    </div>
  )
}

const DataStewardLayout = () => (
  <ThemeProvider>
    <ToastProvider>
      <LayoutShell />
    </ToastProvider>
  </ThemeProvider>
)

export default DataStewardLayout
