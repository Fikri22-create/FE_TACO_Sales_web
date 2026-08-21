import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCog,
  FaSave,
  FaHistory,
  FaFileSignature,
  FaStoreSlash,
  FaTrophy,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa'
import { useToast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import { Stagger, StaggerItem } from '../../components/ui/Stagger'

const mockHistory = [
  { id: 1, action: 'Memperbarui threshold kata', user: 'Budi Santoso', time: '2026-08-20 14:30', detail: 'Dari 4 menjadi 5' },
  { id: 2, action: 'Mengaktifkan gamification', user: 'Budi Santoso', time: '2026-08-19 09:15', detail: 'Untuk BU Retail' },
]

const SettingsPage = () => {
  const toast = useToast()
  
  const [wordThreshold, setWordThreshold] = useState(5)
  const [visitThreshold, setVisitThreshold] = useState(14)
  const [gamification, setGamification] = useState({ retail: true, grosir: false, depo: true })
  const [pipelineSchedule, setPipelineSchedule] = useState('02:00')
  
  const [history, setHistory] = useState(mockHistory)
  const [modalState, setModalState] = useState({ open: false, section: null, payload: null })

  const handleSaveAttempt = (section, payload) => {
    setModalState({ open: true, section, payload })
  }

  const confirmSave = () => {
    const { section, payload } = modalState
    let actionLabel = ''
    let detailLabel = ''

    if (section === 'word') {
      setWordThreshold(payload)
      actionLabel = 'Memperbarui threshold kata'
      detailLabel = `Menjadi ${payload} kata`
    } else if (section === 'visit') {
      setVisitThreshold(payload)
      actionLabel = 'Memperbarui threshold unvisited'
      detailLabel = `Menjadi ${payload} hari`
    } else if (section === 'gamification') {
      setGamification(payload)
      actionLabel = 'Memperbarui status gamification'
      detailLabel = 'Perubahan konfigurasi BU'
    } else if (section === 'pipeline') {
      setPipelineSchedule(payload)
      actionLabel = 'Memperbarui jadwal pipeline'
      detailLabel = `Dijadwalkan pada ${payload}`
    }

    setHistory(prev => [{
      id: Date.now(),
      action: actionLabel,
      user: 'Budi Santoso',
      time: new Date().toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      detail: detailLabel
    }, ...prev])

    toast.success('Pengaturan berhasil disimpan')
    setModalState({ open: false, section: null, payload: null })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-2xl">
            <FaCog className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 dark:text-white">
              Pengaturan Sistem
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
              Konfigurasi parameter global dan sinkronisasi data pipeline.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Stagger className="space-y-6">
            <StaggerItem className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary-50 dark:bg-primary-500/10 rounded-xl">
                    <FaFileSignature className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Validasi Laporan</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Atur batas minimal kata untuk kelayakan laporan kunjungan.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimal Jumlah Kata</label>
                  <input 
                    type="number" 
                    min="1"
                    defaultValue={wordThreshold}
                    id="input-word"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white" 
                  />
                </div>
                <button
                  onClick={() => handleSaveAttempt('word', parseInt(document.getElementById('input-word').value))}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20 rounded-lg font-medium transition-colors"
                >
                  <FaSave className="w-4 h-4" /> Simpan
                </button>
              </div>
            </StaggerItem>

            <StaggerItem className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-secondary-50 dark:bg-secondary-500/10 rounded-xl">
                    <FaStoreSlash className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Alert Outlet Pasif</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Atur batas waktu untuk menandai outlet yang tidak dikunjungi.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Batas Waktu (Hari)</label>
                  <input 
                    type="number" 
                    min="1"
                    defaultValue={visitThreshold}
                    id="input-visit"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white" 
                  />
                </div>
                <button
                  onClick={() => handleSaveAttempt('visit', parseInt(document.getElementById('input-visit').value))}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20 rounded-lg font-medium transition-colors"
                >
                  <FaSave className="w-4 h-4" /> Simpan
                </button>
              </div>
            </StaggerItem>

            <StaggerItem className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-warm-50 dark:bg-warm-500/10 rounded-xl">
                    <FaTrophy className="w-5 h-5 text-warm-600 dark:text-warm-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gamification</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aktifkan leaderboard dan badge per Business Unit.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(gamification).map(([bu, active]) => (
                    <label key={bu} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">BU {bu}</span>
                      <input 
                        type="checkbox" 
                        defaultChecked={active}
                        id={`check-${bu}`}
                        className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </label>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const payload = {
                        retail: document.getElementById('check-retail').checked,
                        grosir: document.getElementById('check-grosir').checked,
                        depo: document.getElementById('check-depo').checked,
                      }
                      handleSaveAttempt('gamification', payload)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20 rounded-lg font-medium transition-colors"
                  >
                    <FaSave className="w-4 h-4" /> Simpan
                  </button>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <FaDatabase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pipeline Data Warehouse</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Jadwal sinkronisasi harian ke sistem DWH.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-4">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jam Sinkronisasi (WIB)</label>
                    <input 
                      type="time" 
                      defaultValue={pipelineSchedule}
                      id="input-pipeline"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white" 
                    />
                  </div>
                  <button
                    onClick={() => handleSaveAttempt('pipeline', document.getElementById('input-pipeline').value)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20 rounded-lg font-medium transition-colors"
                  >
                    <FaSave className="w-4 h-4" /> Simpan
                  </button>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-success-500 w-4 h-4" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status Terakhir: <span className="font-semibold text-gray-900 dark:text-white">Sukses</span></span>
                  </div>
                  <span className="text-xs text-gray-500">Hari ini, 02:00 WIB</span>
                </div>
              </div>
            </StaggerItem>
          </Stagger>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <FaHistory className="text-gray-400" />
              <h3 className="font-display font-bold text-gray-900 dark:text-white">Riwayat Perubahan</h3>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {history.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 py-4">Belum ada riwayat perubahan.</p>
                ) : (
                  <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-3 space-y-6 pb-4">
                    {history.map((log) => (
                      <motion.div 
                        key={log.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative pl-6"
                      >
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-2 border-primary-500" />
                        <div className="font-medium text-sm text-gray-900 dark:text-white mb-0.5">{log.action}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{log.detail}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          <span>Oleh: {log.user}</span>
                          <span>•</span>
                          <span>{log.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={modalState.open}
        onClose={() => setModalState({ open: false, section: null, payload: null })}
        title="Konfirmasi Perubahan"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalState({ open: false, section: null, payload: null })}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmSave}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
            >
              Ya, Simpan
            </button>
          </div>
        }
      >
        <div className="text-gray-600 dark:text-gray-300">
          <div className="flex items-start gap-3 mb-2 p-3 bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400 rounded-xl">
            <FaExclamationTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Anda yakin ingin menyimpan perubahan pada pengaturan <strong>{
              modalState.section === 'word' ? 'Validasi Laporan' : 
              modalState.section === 'visit' ? 'Alert Outlet Pasif' : 
              modalState.section === 'gamification' ? 'Gamification' : 'Pipeline Data Warehouse'
            }</strong>?</p>
          </div>
          <p className="text-sm text-gray-500 mt-3">Perubahan pengaturan ini akan berdampak global pada sistem.</p>
        </div>
      </Modal>
    </div>
  )
}

export default SettingsPage
