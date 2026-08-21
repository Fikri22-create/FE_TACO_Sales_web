import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { clickPosition } from '../../utils/clickTracker'

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
}

const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

const Modal = ({ open, onClose, title, icon, children, footer, size = 'md', maxWidth }) => {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const previouslyFocusedRef = useRef(null)
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' })
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    if (open) {
      if (clickPosition.x !== 0 || clickPosition.y !== 0) {
        setOrigin({ x: `${clickPosition.x}px`, y: `${clickPosition.y}px` })
      } else {
        setOrigin({ x: '50%', y: '50%' })
      }
    }
    setPrevOpen(open)
  }

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    previouslyFocusedRef.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    if (panel) panel.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const focusables = panel ? Array.from(panel.querySelectorAll(focusableSelector)) : []
      if (focusables.length === 0) {
        event.preventDefault()
        if (panel) panel.focus()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocusedRef.current && typeof previouslyFocusedRef.current.focus === 'function') {
        previouslyFocusedRef.current.focus()
      }
    }
  }, [open])

  const panelWidth = maxWidth || sizeMap[size] || sizeMap.md

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            style={{ transformOrigin: `${origin.x} ${origin.y}` }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] } }}
          >
            <div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className={`pointer-events-auto relative z-[101] w-full ${panelWidth} max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl outline-none dark:border-gray-700 dark:bg-gray-900`}
            >
              <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
                {icon && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 dark:bg-primary-500/15 dark:text-primary-400">
                    {icon}
                  </div>
                )}
                <h2 className="flex-1 font-display text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="px-6 py-5">{children}</div>
              {footer && <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">{footer}</div>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal
