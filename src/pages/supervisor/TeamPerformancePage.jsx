import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaChartLine,
  FaCalendar,
  FaChevronDown,
  FaSearch,
  FaDownload,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCrown,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaEye,
  FaEnvelope,
  FaPhone,
  FaFire,
  FaCalendarAlt,
} from 'react-icons/fa'
import { useToast } from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import CountUp from '../../components/ui/CountUp'
import { Stagger, StaggerItem, fadeUpItem } from '../../components/ui/Stagger'
import { getPeriodData, periodOptions, statusBadgeColors } from '../../data/mockData'

const PAGE_SIZE = 5

const statusLabels = {
  active: 'Aktif',
  off: 'Off',
  'on-leave': 'Cuti',
  training: 'Training',
}

const periodLabels = {
  today: 'Hari Ini',
  week: 'Minggu Ini',
  month: 'Bulan Ini',
  quarter: 'Kuartal Ini',
  custom: 'Periode Kustom',
}

const statusFilterOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'off', label: 'Off' },
  { value: 'on-leave', label: 'Cuti' },
  { value: 'training', label: 'Training' },
]

const sortableColumns = [
  { key: 'name', label: 'Anggota' },
  { key: 'visits', label: 'Kunjungan' },
  { key: 'avgQualityScore', label: 'Skor Kualitas' },
  { key: 'streak', label: 'Streak' },
]

const trendConfigs = {
  up: { Icon: FaArrowUp, cls: 'text-success-600 dark:text-success-400', label: 'Naik' },
  down: { Icon: FaArrowDown, cls: 'text-error-600 dark:text-error-400', label: 'Turun' },
  stable: { Icon: FaMinus, cls: 'text-gray-500 dark:text-gray-400', label: 'Stabil' },
}

const deltaClasses = {
  up: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
  down: 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
  stable: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const getScoreColor = (score) => {
  if (score >= 1.8) return 'text-success-600 dark:text-success-400'
  if (score >= 1.5) return 'text-warning-600 dark:text-warning-400'
  return 'text-error-600 dark:text-error-400'
}

const getScoreBarClass = (score) => {
  if (score >= 1.8) return 'bg-success-500'
  if (score >= 1.5) return 'bg-warning-500'
  return 'bg-error-500'
}

const getRankBadgeClass = (rank) => {
  if (rank === 1) return 'bg-warning-500'
  if (rank === 2) return 'bg-gray-400 dark:bg-gray-500'
  if (rank === 3) return 'bg-warm-600 dark:bg-warm-500'
  if (rank === 4) return 'bg-primary-500'
  return 'bg-gray-500 dark:bg-gray-600'
}

const getDeltaInfo = (item) => {
  if (item.prevRank > item.rank) {
    return { type: 'up', text: `Naik ${item.prevRank - item.rank} posisi`, Icon: FaArrowUp }
  }
  if (item.prevRank < item.rank) {
    return { type: 'down', text: `Turun ${item.rank - item.prevRank} posisi`, Icon: FaArrowDown }
  }
  return { type: 'stable', text: 'Tetap', Icon: FaMinus }
}

const formatShortDate = (value) =>
  new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

const formatLastActivity = (value) => {
  const date = new Date(value)
  return `${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
}

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
      statusBadgeColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }`}
  >
    {statusLabels[status] || status}
  </span>
)

const DeltaBadge = ({ item }) => {
  const info = getDeltaInfo(item)
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${deltaClasses[info.type]}`}
    >
      <info.Icon className="w-3 h-3" />
      {info.text}
    </span>
  )
}

const TrendIndicator = ({ trend }) => {
  const config = trendConfigs[trend] || trendConfigs.stable
  return (
    <span className={`inline-flex items-center gap-1.5 ${config.cls}`}>
      <config.Icon className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{config.label}</span>
    </span>
  )
}

const InfoItem = ({ icon, label, value, valueClass = 'text-gray-900 dark:text-white' }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
    <div className="mt-0.5 p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-sm font-medium mt-0.5 break-words ${valueClass}`}>{value}</p>
    </div>
  </div>
)

const TeamPerformancePage = () => {
  const toast = useToast()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [exportOpen, setExportOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailMember, setDetailMember] = useState(null)

  const periodData = useMemo(() => getPeriodData(selectedPeriod), [selectedPeriod])

  const coachingMembers = useMemo(
    () => periodData.teamMembers.filter((member) => member.coachingNeeded),
    [periodData],
  )

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    let list = periodData.teamMembers
    if (term) {
      list = list.filter(
        (member) =>
          member.name.toLowerCase().includes(term) || member.position.toLowerCase().includes(term),
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((member) => member.status === statusFilter)
    }
    return list
  }, [periodData, searchTerm, statusFilter])

  const sortedMembers = useMemo(() => {
    const { key, direction } = sortConfig
    return [...filteredMembers].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (typeof av === 'string') {
        return direction === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return direction === 'asc' ? av - bv : bv - av
    })
  }, [filteredMembers, sortConfig])

  const totalPages = Math.max(1, Math.ceil(sortedMembers.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageMembers = sortedMembers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const displayStart = sortedMembers.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const displayEnd = Math.min(safePage * PAGE_SIZE, sortedMembers.length)

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
    }
    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
    ) : (
      <FaSortDown className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
    )
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const openDetail = (member) => {
    setDetailMember(member)
    setDetailOpen(true)
  }

  const handleExport = () => {
    const header = ['Nama', 'Kunjungan', 'Skor Kualitas', 'Streak', 'Status']
    const rows = sortedMembers.map((member) => [
      member.name,
      member.visits,
      member.avgQualityScore.toFixed(2),
      member.streak,
      statusLabels[member.status] || member.status,
    ])
    const csv =
      '\uFEFF' +
      [header, ...rows]
        .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kinerja-tim-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setExportOpen(false)
    toast.success('Data berhasil diexport')
  }

  const summary = periodData.summary
  const onTrack = summary.avgQualityScore >= 1.8
  const periodLabel = periodLabels[selectedPeriod] || selectedPeriod

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-lg">
              <FaUsers className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white">
              Kinerja Tim
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Pantau performa anggota tim, identifikasi kebutuhan pembinaan, dan lacak progres terhadap
            target.
          </p>
        </div>

        <div className="relative shrink-0">
          <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            aria-label="Pilih periode"
            className="appearance-none pl-10 pr-9 py-2.5 bg-gray-100/70 dark:bg-gray-800/60 border border-transparent rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 cursor-pointer hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-md [&>option]:bg-white dark:[&>option]:bg-gray-800 [&>option]:text-gray-900 dark:[&>option]:text-gray-100"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
      </div>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Anggota</p>
              <h3 className="text-3xl font-display font-semibold text-gray-900 dark:text-white mb-1">
                <CountUp value={summary.totalTeamMembers} />
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {summary.activeToday} aktif hari ini
                </span>
              </div>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-500/10 rounded-xl shrink-0">
              <FaUserCheck className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Rata-rata Skor Kualitas</p>
              <h3 className={`text-3xl font-display font-semibold mb-1 ${getScoreColor(summary.avgQualityScore)}`}>
                <CountUp
                  value={summary.avgQualityScore}
                  format={(n) => n.toFixed(2)}
                  duration={1000}
                />
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Target: 1.8</span>
                <span
                  className={`text-sm font-medium ${
                    onTrack
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-error-600 dark:text-error-400'
                  }`}
                >
                  {onTrack ? 'On Track' : 'Perlu Ditingkatkan'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(100, (summary.avgQualityScore / 2) * 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Kunjungan</p>
              <h3 className="text-3xl font-display font-semibold text-gray-900 dark:text-white mb-1">
                <CountUp value={summary.totalVisits} />
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rata-rata {summary.avgVisitsPerMember.toFixed(1)} per anggota
              </p>
            </div>
            <div className="p-3 bg-secondary-50 dark:bg-secondary-500/10 rounded-xl shrink-0">
              <FaChartLine className="w-7 h-7 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Perlu Pembinaan</p>
              <h3 className="text-3xl font-display font-semibold text-gray-900 dark:text-white mb-1">
                <CountUp value={coachingMembers.length} />
              </h3>
              <div className="flex items-center mt-2">
                <div className="flex -space-x-2">
                  {coachingMembers.slice(0, 4).map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      title={member.name}
                      className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
                    />
                  ))}
                  {coachingMembers.length > 4 && (
                    <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 ring-2 ring-white dark:ring-gray-900 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                      +{coachingMembers.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-3 bg-warm-50 dark:bg-warm-500/10 rounded-xl shrink-0">
              <FaUserTimes className="w-7 h-7 text-warm-700 dark:text-warm-400" />
            </div>
          </div>
        </StaggerItem>
      </Stagger>

      <Stagger className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StaggerItem className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaCrown className="w-5 h-5 text-warning-500 dark:text-warning-400" />
                  <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white">
                    Leaderboard Konsistensi
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Posisi teratas berdasarkan streak aktivitas
                </p>
              </div>
              <span className="shrink-0 px-3 py-1 bg-warm-50 dark:bg-warm-500/10 text-warm-700 dark:text-warm-300 text-xs font-medium rounded-full">
                {periodLabel}
              </span>
            </div>
          </div>
          <div className="p-4">
            <Stagger className="space-y-3">
              {periodData.consistencyLeaderboard.slice(0, 5).map((item) => (
                <StaggerItem
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="relative shrink-0">
                    {item.rank === 1 && (
                      <FaCrown className="absolute -top-2 -right-2 w-4 h-4 text-warning-500 dark:text-warning-400" />
                    )}
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${getRankBadgeClass(item.rank)}`}
                    >
                      {item.rank}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Skor:{' '}
                      <span className="font-medium text-gray-900 dark:text-white">{item.score}</span>
                    </p>
                  </div>
                  <DeltaBadge item={item} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </StaggerItem>

        <StaggerItem className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaStar className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                  <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white">
                    Leaderboard Kualitas Insight
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Posisi teratas berdasarkan skor kualitas rata-rata
                </p>
              </div>
              <span className="shrink-0 px-3 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                {periodLabel}
              </span>
            </div>
          </div>
          <div className="p-4">
            <Stagger className="space-y-3">
              {periodData.qualityLeaderboard.slice(0, 5).map((item) => (
                <StaggerItem
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${getRankBadgeClass(item.rank)}`}
                  >
                    {item.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Skor:{' '}
                      <span className={`font-medium ${getScoreColor(item.score)}`}>
                        {item.score.toFixed(1)}
                      </span>
                    </p>
                  </div>
                  <DeltaBadge item={item} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </StaggerItem>
      </Stagger>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-1">
                Anggota Tim
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Metrik performa detail untuk seluruh anggota tim
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Cari nama atau jabatan..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full bg-gray-100/70 dark:bg-gray-800/60 border border-transparent rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-md"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  aria-label="Filter status"
                  className="appearance-none pl-4 pr-9 py-2.5 bg-gray-100/70 dark:bg-gray-800/60 border border-transparent rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 cursor-pointer hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-md [&>option]:bg-white dark:[&>option]:bg-gray-800 [&>option]:text-gray-900 dark:[&>option]:text-gray-100"
                >
                  {statusFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={() => setExportOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                <FaDownload className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {sortedMembers.length === 0 ? (
          <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <FaUserTimes className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">
              Tidak ada anggota yang cocok
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Coba ubah kata kunci pencarian atau filter status.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FaSearch className="w-3.5 h-3.5" />
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            <Stagger key={safePage} className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/60">
                  <tr>
                    {sortableColumns.map((column) => (
                      <th
                        key={column.key}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        <button
                          type="button"
                          onClick={() => handleSort(column.key)}
                          className="inline-flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          {column.label}
                          {getSortIcon(column.key)}
                        </button>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Tren
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {pageMembers.map((member) => (
                    <motion.tr
                      key={member.id}
                      variants={fadeUpItem}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {member.position}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {member.visits}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">kunjungan</div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`text-lg font-semibold ${getScoreColor(member.avgQualityScore)}`}
                        >
                          {member.avgQualityScore.toFixed(1)}
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getScoreBarClass(member.avgQualityScore)}`}
                            style={{ width: `${(member.avgQualityScore / 2) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {member.streak}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          terakhir: {formatShortDate(member.lastActivity)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <StatusBadge status={member.status} />
                          {member.coachingNeeded && (
                            <span className="block w-fit text-xs font-medium text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-500/10 px-2 py-0.5 rounded-md">
                              Perlu Pembinaan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <TrendIndicator trend={member.performanceTrend} />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => openDetail(member)}
                          aria-label={`Lihat detail ${member.name}`}
                          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </Stagger>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
                <p>
                  Menampilkan{' '}
                  <span className="font-medium text-gray-900 dark:text-white">{displayStart}</span>
                  {'\u2013'}
                  <span className="font-medium text-gray-900 dark:text-white">{displayEnd}</span> dari{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {sortedMembers.length}
                  </span>{' '}
                  anggota
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={safePage === 1}
                    className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={safePage === totalPages}
                    className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export Data CSV"
        icon={<FaDownload className="w-5 h-5" />}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setExportOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-sm font-medium text-white transition-colors"
            >
              Export
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <FaUsers className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
            <span>
              Jumlah anggota yang diexport:{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {sortedMembers.length}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <FaCalendar className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
            <span>
              Periode terpilih:{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{periodLabel}</span>
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <FaDownload className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
            <span>
              Kolom:{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                Nama, Kunjungan, Skor Kualitas, Streak, Status
              </span>
            </span>
          </div>
        </div>
      </Modal>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Detail Anggota"
        icon={<FaUserCheck className="w-5 h-5" />}
        size="md"
      >
        {detailMember && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={detailMember.avatar}
                alt={detailMember.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white truncate">
                  {detailMember.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{detailMember.position}</p>
                <div className="mt-2">
                  <StatusBadge status={detailMember.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                icon={<FaEnvelope className="w-4 h-4" />}
                label="Email"
                value={detailMember.email}
              />
              <InfoItem
                icon={<FaPhone className="w-4 h-4" />}
                label="Telepon"
                value={detailMember.phone}
              />
              <InfoItem
                icon={<FaChartLine className="w-4 h-4" />}
                label="Kunjungan"
                value={`${detailMember.visits} kunjungan`}
              />
              <InfoItem
                icon={<FaStar className="w-4 h-4" />}
                label="Skor Kualitas"
                value={detailMember.avgQualityScore.toFixed(2)}
                valueClass={getScoreColor(detailMember.avgQualityScore)}
              />
              <InfoItem
                icon={<FaFire className="w-4 h-4" />}
                label="Streak"
                value={`${detailMember.streak} hari`}
              />
              <InfoItem
                icon={<FaCalendarAlt className="w-4 h-4" />}
                label="Terakhir Aktif"
                value={formatLastActivity(detailMember.lastActivity)}
              />
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Tren Performa:</span>
                <TrendIndicator trend={detailMember.performanceTrend} />
              </div>
              {detailMember.coachingNeeded && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-500/10 px-2.5 py-1 rounded-full">
                  <FaUserTimes className="w-3 h-3" />
                  Perlu Pembinaan
                </span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TeamPerformancePage