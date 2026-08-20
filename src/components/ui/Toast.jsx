import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

const ToastContext = createContext(null)

const TOAST_DURATION = 3500

const toastVisuals = {
  success: { Icon: FaCheckCircle, iconClass: 'text-success-500', barClass: 'bg-success-500' },
  error: { Icon: FaExclamationCircle, iconClass: 'text-error-500', barClass: 'bg-error-500' },
  info: { Icon: FaInfoCircle, iconClass: 'text-primary-500', barClass: 'bg-primary-500' },
}

let toastSequence = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id))
    const timer = timersRef.current[id]
    if (timer) {
      clearTimeout(timer)
      delete timersRef.current[id]
    }
  }, [])

  const push = useCallback(
    (type, message) => {
      toastSequence += 1
      const id = toastSequence
      setToasts((prev) => [...prev, { id, type, message }])
      timersRef.current[id] = setTimeout(() => dismiss(id), TOAST_DURATION)
    },
    [dismiss],
  )

  const toast = useMemo(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    }),
    [push],
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer))
    }
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[110] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

const ToastCard = ({ item, onDismiss }) => {
  const visual = toastVisuals[item.type] || toastVisuals.info
  const Icon = visual.Icon
  return (
    <motion.div
      className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 pl-5 shadow-lg dark:border-gray-700 dark:bg-gray-900"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${visual.barClass}`} />
      <Icon size={18} className={`mt-0.5 shrink-0 ${visual.iconClass}`} />
      <p className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">{item.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Tutup notifikasi"
        className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      >
        <FaTimes size={12} />
      </button>
    </motion.div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
