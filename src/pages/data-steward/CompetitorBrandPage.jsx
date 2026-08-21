import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FaTags,
  FaSearch,
  FaPlus,
  FaEdit,
  FaPowerOff,
  FaFilter,
  FaMapSigns,
  FaEye,
  FaComments
} from 'react-icons/fa'
import { useToast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import CountUp from '../../components/ui/CountUp'
import { Stagger, StaggerItem, fadeUpItem } from '../../components/ui/Stagger'

const mockCompetitors = [
  { id: 'COMP-001', name: 'Semen Gresik', category: 'Semen', tier: 'Tier 1 (Premium)', substitute: 'Semen Tiga Roda', status: 'active', mentions: 342 },
  { id: 'COMP-002', name: 'Pipa Mas', category: 'Pipa PVC', tier: 'Tier 2 (Menengah)', substitute: 'Pipa Wavin', status: 'active', mentions: 156 },
  { id: 'COMP-003', name: 'Cat Nippon', category: 'Cat', tier: 'Tier 1 (Premium)', substitute: 'Cat Dulux', status: 'active', mentions: 289 },
  { id: 'COMP-004', name: 'Semen Padang', category: 'Semen', tier: 'Tier 2 (Menengah)', substitute: 'Semen Merah Putih', status: 'active', mentions: 110 },
  { id: 'COMP-005', name: 'Pipa Jaya', category: 'Pipa PVC', tier: 'Tier 3 (Ekonomis)', substitute: 'Pipa Mas', status: 'inactive', mentions: 45 },
]

const CompetitorBrandPage = () => {
  const toast = useToast()
  const [competitors, setCompetitors] = useState(mockCompetitors)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [modalState, setModalState] = useState({ open: false, type: null, data: null })

  const filteredCompetitors = useMemo(() => {
    return competitors.filter((comp) => {
      const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            comp.substitute.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || comp.category.toLowerCase() === categoryFilter.toLowerCase()
      return matchesSearch && matchesCategory
    }).sort((a, b) => b.mentions - a.mentions)
  }, [competitors, searchTerm, categoryFilter])

  const activeCount = competitors.filter(c => c.status === 'active').length
  const totalMentions = competitors.reduce((acc, curr) => acc + curr.mentions, 0)

  const handleOpenModal = (type, data = null) => {
    setModalState({ open: true, type, data })
  }

  const handleCloseModal = () => {
    setModalState({ open: false, type: null, data: null })
  }

  const handleSave = (e) => {
    e.preventDefault()
    toast.success(modalState.type === 'add' ? 'Brand kompetitor berhasil ditambahkan' : 'Brand kompetitor berhasil diperbarui')
    handleCloseModal()
  }

  const handleToggleStatus = (id) => {
    setCompetitors(prev => prev.map(comp => {
      if (comp.id === id) {
        const newStatus = comp.status === 'active' ? 'inactive' : 'active'
        toast.success(`${comp.name} di-${newStatus === 'active' ? 'aktifkan' : 'nonaktifkan'}. Data historis tetap terjaga.`)
        return { ...comp, status: newStatus }
      }
      return comp
    }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-2xl">
                <FaTags className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-base lg:text-base font-display font-bold text-gray-900 dark:text-white">
                  Brand Kompetitor
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
                  Kelola master data brand kompetitor beserta peta substitusi ke brand kita.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal('add')}
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium shadow-sm transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Tambah Brand
          </button>
        </div>
      </div>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <StaggerItem className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-2xl">
              <FaEye className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Brand Dipantau</p>
              <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mt-1">
                <CountUp value={activeCount} />
              </h3>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-50 dark:bg-secondary-500/10 rounded-2xl">
              <FaComments className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Mentions</p>
              <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mt-1">
                <CountUp value={totalMentions} />
              </h3>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem className="bg-warm-50 dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-warm-200 dark:border-gray-800 flex flex-col justify-center relative overflow-hidden">
          <FaMapSigns className="absolute -right-4 -bottom-4 w-24 h-24 text-warm-200/50 dark:text-warm-900/30 rotate-12" />
          <div className="relative z-10">
            <h3 className="font-display font-bold text-warm-900 dark:text-warm-100 text-base mb-1">Peta Substitusi</h3>
            <p className="text-sm text-warm-800/80 dark:text-warm-200/80">Panduan mapping produk kompetitor ke alternatif produk TACO berdasarkan tier harga dan kualitas.</p>
          </div>
        </StaggerItem>
      </Stagger>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari brand kompetitor atau substitusi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative w-full sm:w-48 shrink-0">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none text-gray-900 dark:text-white"
              >
                <option value="all">Semua Kategori</option>
                <option value="semen">Semen</option>
                <option value="pipa pvc">Pipa PVC</option>
                <option value="cat">Cat</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <Stagger className="min-w-[800px] w-full">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand Kompetitor</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tier Market</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Substitusi Internal</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredCompetitors.map((comp) => (
                  <motion.tr key={comp.id} variants={fadeUpItem} className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${comp.status === 'inactive' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-gray-900 dark:text-white text-base">{comp.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{comp.mentions} mentions bulan ini</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                        {comp.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        comp.tier.includes('1') ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-800/30' :
                        comp.tier.includes('2') ? 'bg-warm-50 text-warm-700 border-warm-200 dark:bg-warm-500/10 dark:text-warm-400 dark:border-warm-800/30' : 
                        'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                      }`}>
                        {comp.tier}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">➔</span>
                        <span className="font-medium text-secondary-600 dark:text-secondary-400">{comp.substitute}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal('edit', comp)}
                          title="Edit"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(comp.id)}
                          title={comp.status === 'active' ? 'Nonaktifkan (Data historis tetap)' : 'Aktifkan'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            comp.status === 'active' ? 'text-error-500 hover:bg-error-50' : 'text-success-500 hover:bg-success-50'
                          }`}
                        >
                          <FaPowerOff className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </Stagger>
        </div>
      </div>

      <Modal
        open={modalState.open}
        onClose={handleCloseModal}
        title={modalState.type === 'add' ? 'Tambah Brand Kompetitor' : 'Edit Brand Kompetitor'}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
            >
              Simpan
            </button>
          </div>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Brand Kompetitor</label>
            <input 
              type="text" 
              defaultValue={modalState.data?.name || ''}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
              <select
                defaultValue={modalState.data?.category || 'Semen'}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none text-gray-900 dark:text-white"
              >
                <option>Semen</option>
                <option>Pipa PVC</option>
                <option>Cat</option>
                <option>Atap</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tier Market</label>
              <select
                defaultValue={modalState.data?.tier || 'Tier 2 (Menengah)'}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none text-gray-900 dark:text-white"
              >
                <option>Tier 1 (Premium)</option>
                <option>Tier 2 (Menengah)</option>
                <option>Tier 3 (Ekonomis)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand Substitusi (Internal)</label>
            <input 
              type="text" 
              defaultValue={modalState.data?.substitute || ''}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white" 
            />
          </div>
          {modalState.type === 'edit' && (
            <p className="text-xs text-gray-500 mt-2">
              Note: Menonaktifkan brand (melalui icon power di tabel) disarankan jika brand sudah tidak beredar, agar data historis laporan sales tetap terjaga.
            </p>
          )}
        </form>
      </Modal>
    </div>
  )
}

export default CompetitorBrandPage
