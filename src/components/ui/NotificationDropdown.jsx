import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBell, FaTrash } from 'react-icons/fa'

export default function NotificationDropdown({ initialData, isOpen, onToggle, onClose }) {
  const [notifications, setNotifications] = useState(initialData || [])

  const unreadCount = notifications.filter(n => n.unread).length

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n))
  }
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const deleteNotification = (e, id) => {
    e.stopPropagation()
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <div className="relative">
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-label="Notifikasi"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none"
      >
        <FaBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4C00] opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-900 bg-[#FF4C00]"></span>
          </span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 z-50 mt-2 w-80 md:w-96 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Notifikasi {unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#FF4C00]/10 text-[#FF4C00] text-xs">{unreadCount}</span>}
              </p>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead} 
                  className="text-xs font-medium text-[#FF4C00] hover:text-[#953D1F] transition-colors focus:outline-none"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>
            <div className="overflow-y-auto no-scrollbar flex-1">
              {notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => markAsRead(notif.id)}
                      className={`group p-4 border-b border-gray-50 dark:border-gray-800/50 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 flex gap-3 ${notif.unread ? 'bg-[#FF4C00]/5 dark:bg-[#FF4C00]/10' : ''}`}
                    >
                      <div className="mt-1 shrink-0">
                        {notif.unread ? (
                          <div className="w-2 h-2 rounded-full bg-[#FF4C00]" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notif.unread ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                          {notif.text}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">{notif.time}</p>
                      </div>
                      <button
                        onClick={(e) => deleteNotification(e, notif.id)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 -m-2 text-gray-400 hover:text-error-500 focus:outline-none"
                        title="Hapus notifikasi"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <FaBell className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Tidak ada notifikasi baru</p>
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-2 border-t border-gray-100 dark:border-gray-800 shrink-0">
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="w-full py-2 text-sm font-medium rounded-lg transition-colors bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800 dark:text-gray-300"
                >
                  Lihat Semua
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
