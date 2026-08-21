import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FaBook,
  FaSearch,
  FaPlus,
  FaEdit,
  FaPowerOff,
  FaCheckCircle,
  FaMagic,
  FaFilter,
  FaInbox
} from 'react-icons/fa'
import { useToast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import CountUp from '../../components/ui/CountUp'
import { Stagger, StaggerItem, fadeUpItem } from '../../components/ui/Stagger'

const mockLexicons = [
  { id: 'LEX-001', canonical: 'Toko Bangunan', variants: ['TB', 'Tokbang', 'Tk. Bgn'], priority: 'High', status: 'active' },
  { id: 'LEX-002', canonical: 'Sumber Rejeki', variants: ['Smbr Rjk', 'Sumber Rjeki', 'S. Rejeki'], priority: 'Medium', status: 'active' },
  { id: 'LEX-003', canonical: 'Semen Gresik', variants: ['SG', 'Sm. Gresik'], priority: 'High', status: 'active' },
  { id: 'LEX-004', canonical: 'Pipa Wavin', variants: ['Wavin', 'P. Wvn'], priority: 'Low', status: 'inactive' },
]

const mockProposals = [
  { id: 'PROP-001', raw: 'S. Jaya', proposedCanonical: 'Sumber Jaya', by: 'Andi (Sales)' },
  { id: 'PROP-002', raw: 'T. Mas', proposedCanonical: 'Toko Mas', by: 'Budi (Sales)' },
]

const LexiconManagementPage = () => {
  const toast = useToast()
  const [lexicons, setLexicons] = useState(mockLexicons)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [previewInput, setPreviewInput] = useState('')
  
  const [modalState, setModalState] = useState({ open: false, type: null, data: null })

  const filteredLexicons = useMemo(() => {
    return lexicons.filter((lex) => {
      const matchesSearch = lex.canonical.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            lex.variants.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === 'all' || lex.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [lexicons, searchTerm, statusFilter])

  const activeCount = lexicons.filter(l => l.status === 'active').length
  const proposalCount = mockProposals.length

  const resolvePreview = (input) => {
    if (!input) return ''
    const lowerInput = input.toLowerCase()
    const match = lexicons.find(lex => 
      lex.status === 'active' && 
      (lex.canonical.toLowerCase() === lowerInput || lex.variants.some(v => v.toLowerCase() === lowerInput))
    )
    return match ? match.canonical : 'Tidak ada kecocokan'
  }

  const handleOpenModal = (type, data = null) => {
    setModalState({ open: true, type, data })
  }

  const handleCloseModal = () => {
    setModalState({ open: false, type: null, data: null })
  }

  const handleSave = (e) => {
    e.preventDefault()
    toast.success(modalState.type === 'add' ? 'Lexicon berhasil ditambahkan' : 'Lexicon berhasil diperbarui')
    handleCloseModal()
  }

  const handleToggleStatus = (id) => {
    setLexicons(prev => prev.map(lex => {
      if (lex.id === id) {
        const newStatus = lex.status === 'active' ? 'inactive' : 'active'
        toast.success(`Lexicon ${lex.canonical} di-${newStatus === 'active' ? 'aktifkan' : 'nonaktifkan'}`)
        return { ...lex, status: newStatus }
      }
      return lex
    }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-2xl">
                <FaBook className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-base lg:text-base font-display font-bold text-gray-900 dark:text-white">
                  Manajemen Lexicon
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
                  Kelola kamus varian lafal (alias) untuk entitas bisnis.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal('add')}
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium shadow-sm transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Tambah Lexicon
          </button>
        </div>
      </div>

      <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StaggerItem className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-2xl">
              <FaCheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lexicon Aktif</p>
              <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mt-1">
                <CountUp value={activeCount} />
              </h3>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-50 dark:bg-secondary-500/10 rounded-2xl">
              <FaInbox className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usulan Lapangan</p>
              <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mt-1">
                <CountUp value={proposalCount} />
              </h3>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem className="bg-warm-50 dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-warm-200 dark:border-gray-800 flex flex-col justify-center">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2 flex items-center gap-2">
            <FaMagic className="text-warm-600" /> Preview Resolusi
          </p>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Ketik varian..." 
              value={previewInput}
              onChange={(e) => setPreviewInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-primary-500"
            />
            <div className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 truncate border border-transparent">
              ➔ {resolvePreview(previewInput)}
            </div>
          </div>
        </StaggerItem>
      </Stagger>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari canonical atau varian..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
              <div className="relative w-full sm:w-48 shrink-0">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none text-gray-900 dark:text-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <Stagger className="min-w-[600px] w-full">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Canonical</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Varian Lafal</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prioritas</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredLexicons.map((lex) => (
                    <motion.tr key={lex.id} variants={fadeUpItem} className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${lex.status === 'inactive' ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-gray-900 dark:text-white">{lex.canonical}</div>
                        <div className="text-xs text-gray-500">{lex.id}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          {lex.variants.map((v, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                              {v}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          lex.priority === 'High' ? 'bg-primary-50 text-primary-700' :
                          lex.priority === 'Medium' ? 'bg-warm-50 text-warm-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {lex.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal('edit', lex)}
                            title="Edit"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(lex.id)}
                            title={lex.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              lex.status === 'active' ? 'text-error-500 hover:bg-error-50' : 'text-success-500 hover:bg-success-50'
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

        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white">Antrean Usulan</h3>
            <p className="text-xs text-gray-500 mt-1">Varian baru yang diusulkan oleh tim lapangan.</p>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <Stagger className="space-y-3">
              {mockProposals.map((prop) => (
                <StaggerItem key={prop.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">"{prop.raw}"</div>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">{prop.by}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">Usulan target: <span className="font-medium text-gray-700 dark:text-gray-300">{prop.proposedCanonical}</span></div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-primary-50 text-primary-600 rounded text-xs font-medium hover:bg-primary-100 transition-colors">
                      Tambah
                    </button>
                    <button className="flex-1 py-1.5 bg-gray-50 text-gray-600 rounded text-xs font-medium hover:bg-gray-100 transition-colors">
                      Abaikan
                    </button>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>

      <Modal
        open={modalState.open}
        onClose={handleCloseModal}
        title={modalState.type === 'add' ? 'Tambah Lexicon Baru' : 'Edit Lexicon'}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Canonical</label>
            <input 
              type="text" 
              defaultValue={modalState.data?.canonical || ''}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Varian Lafal (pisahkan dengan koma)</label>
            <textarea 
              rows={3}
              defaultValue={modalState.data?.variants?.join(', ') || ''}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioritas Resolusi</label>
            <select
              defaultValue={modalState.data?.priority || 'Medium'}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none text-gray-900 dark:text-white"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default LexiconManagementPage
