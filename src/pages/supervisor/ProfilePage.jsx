import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaUserCircle, FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useToast } from '../../components/ui/Toast'

const AVATAR_COLORS = ['ff4c00', '953d1f', 'dac690', '10b981', '8b5cf6', 'ec4899']

const DEFAULT_PREFS = { dateFormat: 'DD/MM/YYYY', language: 'id' }

const avatarUrl = (name, background) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Supervisor')}&background=${background}&color=fff`

const readPrefs = () => {
  try {
    const raw = localStorage.getItem('taco_prefs')
    if (!raw) return DEFAULT_PREFS
    const parsed = JSON.parse(raw)
    return {
      dateFormat: parsed.dateFormat || DEFAULT_PREFS.dateFormat,
      language: parsed.language || DEFAULT_PREFS.language,
    }
  } catch {
    return DEFAULT_PREFS
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass =
  'mt-1.5 w-full rounded-xl border border-transparent bg-gray-100/70 dark:bg-gray-800/60 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-md [&>option]:bg-white dark:[&>option]:bg-gray-800'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const toast = useToast()

  const fileInputRef = useRef(null)

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.avatar || avatarUrl(user?.name || 'Supervisor', 'ff4c00'),
  )
  const [prefs, setPrefs] = useState(readPrefs)
  const [formError, setFormError] = useState('')

  const isDark = theme === 'dark'

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFormError('File harus berupa gambar (JPG/PNG).')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      setSelectedAvatar(event.target.result)
      setFormError('')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const updatePref = (key, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value }
      try {
        localStorage.setItem('taco_prefs', JSON.stringify(next))
      } catch {
        return prev
      }
      return next
    })
    toast.info('Preferensi disimpan')
  }

  const handleSave = () => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      setFormError('Nama tidak boleh kosong.')
      return
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setFormError('Format email tidak valid.')
      return
    }
    if (password && password.length < 6) {
      setFormError('Kata sandi minimal 6 karakter.')
      return
    }

    const updates = { name: trimmedName, email: trimmedEmail, avatar: selectedAvatar }
    if (password) {
      updates.password = password
    }

    updateUser(updates)
    setFormError('')
    setPassword('')
    toast.success('Profil berhasil diperbarui')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-lg">
          <FaUserCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white">
            Profil & Pengaturan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola informasi akun, foto profil, dan preferensi tampilan Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Profil */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-5">
            Profil
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <img
              src={selectedAvatar}
              alt={name || 'Supervisor'}
              className="h-24 w-24 rounded-xl object-cover shadow-lg shrink-0"
            />
            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
              >
                <FaCamera className="w-4 h-4" />
                Ubah Foto
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Unggah foto (JPG/PNG) atau pilih warna avatar di bawah sebagai alternatif.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Warna Avatar</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Pilih warna untuk avatar otomatis
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {AVATAR_COLORS.map((color) => {
                const url = avatarUrl(name.trim() || user?.name || 'Supervisor', color)
                const isSelected = selectedAvatar === url
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(url)
                      setFormError('')
                    }}
                    aria-label={`Pilih avatar warna ${color}`}
                    className={`overflow-hidden rounded-xl transition-all ${
                      isSelected
                        ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900'
                        : 'ring-1 ring-gray-200 hover:ring-gray-300 dark:ring-gray-700 dark:hover:ring-gray-600'
                    }`}
                  >
                    <img src={url} alt="" className="h-10 w-10 object-cover" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Nama
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="profile-password" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Password Baru
              </label>
              <div className="relative mt-1.5">
                <input
                  id="profile-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-transparent bg-gray-100/70 dark:bg-gray-800/60 px-3 py-2 pr-10 text-sm text-gray-900 dark:text-gray-100 shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Kosongkan jika tidak ingin mengubah password
              </p>
            </div>

            {formError && (
              <p className="text-sm text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-500/10 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>

        {/* Preferensi */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-5">
            Preferensi
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Mode Gelap</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  Sesuaikan tampilan aplikasi
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                onClick={toggleTheme}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  isDark ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md ${isDark ? 'left-6' : 'left-1'}`}
                />
              </button>
            </div>

            <div>
              <label htmlFor="pref-dateformat" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Format Tanggal
              </label>
              <select
                id="pref-dateformat"
                value={prefs.dateFormat}
                onChange={(e) => updatePref('dateFormat', e.target.value)}
                className={inputClass}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage