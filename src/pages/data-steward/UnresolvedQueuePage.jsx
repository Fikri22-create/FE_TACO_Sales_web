import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaLink,
  FaPlus,
  FaTimes,
  FaBuilding,
  FaTag
} from 'react-icons/fa'
import { useToast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import { Stagger, fadeUpItem } from '../../components/ui/Stagger'

const mockUnresolved = [
  { id: 'UR-001', raw: 'Mitra Bangunan Sejati', type: 'Outlet', frequency: 145, lastSeen: '2026-08-21', suggestions: ['TB Mitra Bangunan', 'Mitra Sejati'] },
  { id: 'UR-002', raw: 'S. Tiga Roda', type: 'Product', frequency: 98, lastSeen: '2026-08-21', suggestions: ['Semen Tiga Roda'] },
  { id: 'UR-003', raw: 'Depo Bgn', type: 'Outlet', frequency: 67, lastSeen: '2026-08-20', suggestions: ['Depo Bangunan'] },
  { id: 'UR-004', raw: 'Pipa M', type: 'Product', frequency: 42, lastSeen: '2026-08-19', suggestions: ['Pipa Mas', 'Pipa M-Class'] },
  { id: 'UR-005', raw: 'Tk. Baru', type: 'Outlet', frequency: 12, lastSeen: '2026-08-15', suggestions: [] },
]

const UnresolvedQueuePage = () => {
  const toast = useToast()
  const [items, setItems] = useState(mockUnresolved)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [actionModal, setActionModal] = useState({ open: false, type: null, item: null })
  const [mapTarget, setMapTarget] = useState('')

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.raw.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === 'all' || item.type.toLowerCase() === typeFilter.toLowerCase()
      return matchesSearch && matchesType
    }).sort((a, b) => b.frequency - a.frequency)
  }, [items, searchTerm, typeFilter])

  const handleAction = (type, item) => {
    setActionModal({ open: true, type, item })
    if (type === 'map' && item.suggestions.length > 0) {
      setMapTarget(item.suggestions[0])
    } else {
      setMapTarget('')
    }
  }

  const confirmAction = () => {
    setItems(prev => prev.filter(i => i.id !== actionModal.item.id))
    
    let message = ''
    if (actionModal.type === 'map') message = `Berhasil dipetakan ke "${mapTarget}"`
    else if (actionModal.type === 'add') message = `Ditambahkan sebagai entitas baru`
    else if (actionModal.type === 'ignore') message = `Entitas diabaikan`
    
    toast.success(message)
    setActionModal({ open: false, type: null, item: null })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-2xl">
                <FaExclamationTriangle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-base lg:text-base font-display font-bold text-gray-900 dark:text-white">
                  Antrean Unresolved
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
                  Entitas yang gagal dipetakan otomatis ke dalam master data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari entitas..."
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
                <option value="outlet">Outlet</option>
                <option value="product">Product</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <FaExclamationTriangle className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-base font-medium text-gray-900 dark:text-white">Tidak ada antrean unresolved</p>
            </div>
          ) : (
            <Stagger className="min-w-[800px] w-full">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entitas (Raw)</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Frekuensi</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kandidat Canonical</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredItems.map((item) => (
                    <motion.tr key={item.id} variants={fadeUpItem} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-gray-900 dark:text-white text-base">"{item.raw}"</div>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                          {item.type === 'Outlet' ? <FaBuilding className="text-primary-500" /> : <FaTag className="text-secondary-500" />}
                          {item.type} • Terakhir: {item.lastSeen}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          {item.frequency}x muncul
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {item.suggestions.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {item.suggestions.map((sug, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 border border-primary-200 dark:border-primary-800/30 cursor-pointer hover:bg-primary-100" onClick={() => { setMapTarget(sug); handleAction('map', item); }}>
                                <FaLink className="w-3 h-3" />
                                {sug}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Tidak ada kandidat kuat</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAction('map', item)}
                            title="Petakan"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
                          >
                            <FaLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction('add', item)}
                            title="Tambah Baru"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-success-600 bg-success-50 hover:bg-success-100 transition-colors"
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction('ignore', item)}
                            title="Abaikan"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </Stagger>
          )}
        </div>
      </div>

      <Modal
        open={actionModal.open}
        onClose={() => setActionModal({ open: false, type: null, item: null })}
        title={
          actionModal.type === 'map' ? 'Petakan ke Canonical' :
          actionModal.type === 'add' ? 'Tambah Entitas Baru' : 'Abaikan Entitas'
        }
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActionModal({ open: false, type: null, item: null })}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmAction}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                actionModal.type === 'add' ? 'bg-success-500 hover:bg-success-600' :
                actionModal.type === 'ignore' ? 'bg-gray-500 hover:bg-gray-600' :
                'bg-primary-500 hover:bg-primary-600'
              }`}
            >
              Konfirmasi
            </button>
          </div>
        }
      >
        <div className="text-gray-600 dark:text-gray-300">
          <p className="mb-4 text-sm font-medium">Entitas asal: <span className="text-gray-900 dark:text-white">"{actionModal.item?.raw}"</span></p>
          
          {actionModal.type === 'map' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Canonical Target</label>
              <input
                type="text"
                value={mapTarget}
                onChange={(e) => setMapTarget(e.target.value)}
                placeholder="Ketik nama canonical..."
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white"
              />
              {actionModal.item?.suggestions?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {actionModal.item.suggestions.map((s, i) => (
                    <span 
                      key={i} 
                      onClick={() => setMapTarget(s)}
                      className="cursor-pointer text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          {actionModal.type === 'add' && <p>Entitas ini akan ditambahkan ke master data.</p>}
          {actionModal.type === 'ignore' && <p>Entitas ini akan diabaikan dan tidak akan muncul di antrean lagi.</p>}
        </div>
      </Modal>
    </div>
  )
}

export default UnresolvedQueuePage
