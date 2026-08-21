import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaStore,
  FaSearch,
  FaCheck,
  FaTimes,
  FaCodeBranch,
  FaExclamationTriangle,
  FaBuilding,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaFilter,
  FaHourglassHalf,
  FaCopy
} from 'react-icons/fa'
import { useToast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import CountUp from '../../components/ui/CountUp'
import { Stagger, StaggerItem } from '../../components/ui/Stagger'

const mockOutlets = [
  { id: 'OUT-001', name: 'Toko Bangunan Berkah', type: 'Mitra', city: 'Jakarta Selatan', proposedBy: 'Budi (Sales)', date: '2026-08-20', similarity: 0, status: 'pending' },
  { id: 'OUT-002', name: 'TB. Maju Jaya', type: 'Retail', city: 'Bandung', proposedBy: 'Andi (Sales)', date: '2026-08-20', similarity: 92, possibleDuplicate: 'TB Maju Jaya Abadi', status: 'pending' },
  { id: 'OUT-003', name: 'Sinar Makmur', type: 'Grosir', city: 'Surabaya', proposedBy: 'Siti (Sales)', date: '2026-08-21', similarity: 0, status: 'pending' },
  { id: 'OUT-004', name: 'UD. Lancar', type: 'Retail', city: 'Semarang', proposedBy: 'Joko (Sales)', date: '2026-08-21', similarity: 85, possibleDuplicate: 'UD Lancar Rejeki', status: 'pending' },
  { id: 'OUT-005', name: 'Depo Bangunan Sejahtera', type: 'Depo', city: 'Jakarta Timur', proposedBy: 'Agus (Sales)', date: '2026-08-21', similarity: 0, status: 'pending' },
]

const NewOutletQueuePage = () => {
  const toast = useToast()
  const [outlets, setOutlets] = useState(mockOutlets)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedOutlet, setSelectedOutlet] = useState(null)
  const [actionModal, setActionModal] = useState({ open: false, type: null })

  const filteredOutlets = useMemo(() => {
    return outlets.filter((outlet) => {
      if (outlet.status !== 'pending') return false
      const matchesSearch = outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            outlet.city.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === 'all' || outlet.type.toLowerCase() === typeFilter.toLowerCase()
      return matchesSearch && matchesType
    })
  }, [outlets, searchTerm, typeFilter])

  const pendingCount = outlets.filter((o) => o.status === 'pending').length
  const duplicateWarningCount = outlets.filter((o) => o.status === 'pending' && o.similarity > 80).length

  const handleAction = (type, outlet) => {
    setSelectedOutlet(outlet)
    setActionModal({ open: true, type })
  }

  const [closingItems, setClosingItems] = useState({})

  const confirmAction = () => {
    if (!selectedOutlet) return
    
    setClosingItems(prev => ({ ...prev, [selectedOutlet.id]: actionModal.type }))
    setActionModal({ open: false, type: null })
  }

  const finalizeAction = (id, type) => {
    setOutlets(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, status: type }
      }
      return o
    }))
    
    let message = ''
    if (type === 'approve') message = 'Outlet disetujui. Notifikasi dikirim ke pengusul.'
    else if (type === 'merge') message = 'Outlet digabungkan dengan data existing.'
    else if (type === 'reject') message = 'Outlet ditolak. Notifikasi dikirim ke pengusul.'
    
    toast.success(message)
    setSelectedOutlet(null)
    setClosingItems(prev => {
      const newItems = { ...prev }
      delete newItems[id]
      return newItems
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-2xl">
                <FaStore className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-base lg:text-base font-display font-bold text-gray-900 dark:text-white">
                  Antrean Outlet Baru
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
                  Validasi usulan outlet baru dari lapangan dan cegah duplikasi data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <StaggerItem className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-50 dark:bg-secondary-500/10 rounded-2xl">
              <FaHourglassHalf className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Antrean Pending</p>
              <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mt-1">
                <CountUp value={pendingCount} />
              </h3>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning-50 dark:bg-warning-500/10 rounded-2xl">
              <FaCopy className="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Potensi Duplikat</p>
              <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mt-1">
                <CountUp value={duplicateWarningCount} />
              </h3>
            </div>
          </div>
        </StaggerItem>
      </Stagger>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama outlet atau kota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative w-full sm:w-48 shrink-0">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none text-gray-900 dark:text-white"
              >
                <option value="all">Semua Tipe</option>
                <option value="retail">Retail</option>
                <option value="grosir">Grosir</option>
                <option value="mitra">Mitra</option>
                <option value="depo">Depo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredOutlets.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <FaStore className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-base font-medium text-gray-900 dark:text-white">Tidak ada antrean</p>
              <p className="text-sm">Semua usulan outlet telah divalidasi atau tidak ada data yang cocok dengan filter.</p>
            </div>
          ) : (
            <div className="min-w-[800px] w-full">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Info Outlet</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lokasi</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pengusul</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deteksi Duplikat</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <AnimatePresence mode="popLayout">
                    {filteredOutlets.map((outlet, i) => {
                      const isClosing = closingItems[outlet.id]
                      return (
                        <motion.tr 
                          layout
                          key={outlet.id} 
                          initial={{ opacity: 0, y: 15 }}
                          animate={
                            isClosing ? {
                              x: isClosing === 'reject' ? '-50%' : '50%',
                              opacity: 0,
                              backgroundColor: isClosing === 'approve' ? 'rgba(34, 197, 94, 0.1)' : isClosing === 'reject' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)'
                            } : { 
                              x: 0, 
                              opacity: 1, 
                              y: 0,
                              backgroundColor: 'transparent'
                            }
                          }
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={
                            isClosing 
                              ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
                              : { duration: 0.4, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }
                          }
                          onAnimationComplete={() => {
                            if (isClosing) {
                              finalizeAction(outlet.id, isClosing)
                            }
                          }}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors origin-center"
                        >
                          <td className="px-4 py-2.5">
                            <div className="font-semibold text-gray-900 dark:text-white">{outlet.name}</div>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <FaBuilding className="w-3 h-3" />
                              <span>{outlet.type}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                              <FaMapMarkerAlt className="w-3.5 h-3.5 text-primary-500" />
                              {outlet.city}
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400">
                                <FaUser className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{outlet.proposedBy}</div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                  <FaCalendarAlt className="w-3 h-3" />
                                  {outlet.date}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            {outlet.similarity > 80 ? (
                              <div className="inline-flex flex-col gap-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400 border border-warning-200 dark:border-warning-800/30">
                                  <FaExclamationTriangle className="w-3 h-3" />
                                  {outlet.similarity}% Mirip
                                </span>
                                <span className="text-xs text-gray-500 truncate max-w-[150px]" title={outlet.possibleDuplicate}>
                                  ➔ {outlet.possibleDuplicate}
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400 border border-success-200 dark:border-success-800/30">
                                <FaCheck className="w-3 h-3" />
                                Aman
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex justify-end gap-2">
                              {outlet.similarity > 80 && (
                                <button
                                  onClick={() => handleAction('merge', outlet)}
                                  title="Gabungkan"
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-warning-600 bg-warning-50 hover:bg-warning-100 transition-colors"
                                >
                                  <FaCodeBranch className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleAction('approve', outlet)}
                                title="Setujui"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-success-600 bg-success-50 hover:bg-success-100 transition-colors"
                              >
                                <FaCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleAction('reject', outlet)}
                                title="Tolak"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-error-600 bg-error-50 hover:bg-error-100 transition-colors"
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={actionModal.open}
        onClose={() => setActionModal({ open: false, type: null })}
        title={
          actionModal.type === 'approve' ? 'Setujui Outlet' :
          actionModal.type === 'merge' ? 'Gabungkan Outlet' : 'Tolak Outlet'
        }
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActionModal({ open: false, type: null })}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmAction}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                actionModal.type === 'approve' ? 'bg-success-500 hover:bg-success-600' :
                actionModal.type === 'merge' ? 'bg-warning-500 hover:bg-warning-600' :
                'bg-error-500 hover:bg-error-600'
              }`}
            >
              Konfirmasi
            </button>
          </div>
        }
      >
        <div className="text-gray-600 dark:text-gray-300">
          <p>
            {actionModal.type === 'approve' && `Anda yakin ingin menyetujui outlet "${selectedOutlet?.name}" sebagai data baru?`}
            {actionModal.type === 'merge' && `Anda yakin ingin menggabungkan usulan "${selectedOutlet?.name}" dengan "${selectedOutlet?.possibleDuplicate}"?`}
            {actionModal.type === 'reject' && `Anda yakin ingin menolak usulan outlet "${selectedOutlet?.name}"?`}
          </p>
          <p className="mt-2 text-sm text-gray-500">Tindakan ini akan mengirimkan notifikasi kepada pengusul.</p>
        </div>
      </Modal>
    </div>
  )
}

export default NewOutletQueuePage
