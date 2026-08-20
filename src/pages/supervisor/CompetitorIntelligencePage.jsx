import { useState } from 'react'
import {
  FaArrowUp,
  FaCalendar,
  FaChartBar,
  FaChartLine,
  FaChevronDown,
  FaEye,
  FaEyeSlash,
  FaFileExport,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaSearch,
  FaUserCheck,
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import Modal from '../../components/ui/Modal'
import CountUp from '../../components/ui/CountUp'
import { Stagger, StaggerItem } from '../../components/ui/Stagger'
import { LineChart, BarChart } from '../../components/ui/Charts'
import { useToast } from '../../components/ui/Toast'
import {
  brandActivityData,
  competitorBrands,
  dashboardSummary,
  outletTypeBreakdown,
  periodOptions,
  priceTrendData,
  signalReports,
  signalTypeColors,
} from '../../data/mockData'

const PERIOD_MULTIPLIER = {
  today: 0.2,
  week: 1,
  month: 4.3,
  quarter: 13,
  custom: 1,
}

const BRAND_KEY_MAP = {
  'Brand A': 'brandA',
  'Brand B': 'brandB',
  'Brand C': 'brandC',
  'Brand D': 'brandD',
  'Brand E': 'brandE',
}

const PAGE_SIZE = 5

const CompetitorIntelligencePage = () => {
  const { success } = useToast()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedBrands, setSelectedBrands] = useState(competitorBrands.map((brand) => brand.id))
  const [searchTerm, setSearchTerm] = useState('')
  const [signalTypeFilter, setSignalTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [detailReport, setDetailReport] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)

  const multiplier = PERIOD_MULTIPLIER[selectedPeriod] || 1
  const totalSignals = Math.round(dashboardSummary.signalsThisWeek * multiplier)

  const lastWeekActivity = brandActivityData[brandActivityData.length - 1]
  const topCompetitorKey = BRAND_KEY_MAP[dashboardSummary.topCompetitor] || 'brandA'
  const topCompetitorSignals = Math.round(lastWeekActivity[topCompetitorKey] * multiplier)

  const priceChartData = priceTrendData.map((item) => ({
    label: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    values: { B001: item.brandA, B002: item.brandB, B003: item.brandC, B004: item.brandD, B005: item.brandE },
  }))

  const activityChartData = brandActivityData.map((item) => ({
    label: item.week,
    values: { B001: item.brandA, B002: item.brandB, B003: item.brandC, B004: item.brandD, B005: item.brandE },
  }))

  const totalOutletSignals = outletTypeBreakdown.reduce((sum, item) => sum + item.count, 0)

  const filteredReports = signalReports.filter((report) => {
    const term = searchTerm.trim().toLowerCase()
    const matchesSearch =
      term === '' ||
      report.outlet.toLowerCase().includes(term) ||
      report.brand.toLowerCase().includes(term) ||
      report.region.toLowerCase().includes(term) ||
      report.signalType.toLowerCase().includes(term)
    const matchesType = signalTypeFilter === '' || report.signalType === signalTypeFilter
    return matchesSearch && matchesType
  })

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedReports = filteredReports.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const startIndex = filteredReports.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const endIndex = Math.min(safePage * PAGE_SIZE, filteredReports.length)

  const periodLabel = periodOptions.find((option) => option.value === selectedPeriod)?.label || selectedPeriod

  const handleBrandToggle = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId],
    )
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleTypeFilterChange = (e) => {
    setSignalTypeFilter(e.target.value)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSignalTypeFilter('')
    setCurrentPage(1)
  }

  const getBrandColor = (brandName) => {
    const brand = competitorBrands.find((item) => item.name === brandName)
    return brand ? brand.color : '#ff4c00'
  }

  const getSignalBadge = (signalType) => (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        signalTypeColors[signalType] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {signalType}
    </span>
  )

  const formatTableDate = (date) =>
    new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

  const formatFullDate = (date) =>
    new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const handleExport = () => {
    const header = ['Outlet', 'Tanggal', 'Brand', 'Tipe Sinyal', 'Detail', 'Wilayah']
    const rows = filteredReports.map((report) => [
      report.outlet,
      report.date,
      report.brand,
      report.signalType,
      report.details,
      report.region,
    ])
    const csvContent =
      '\uFEFF' +
      [header, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `intelijen-kompetitor-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setExportOpen(false)
    success('Data berhasil diexport ke CSV')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-primary-50 rounded-xl dark:bg-primary-500/15">
            <FaChartLine className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-semibold text-gray-900 dark:text-white">Intelijen Kompetitor</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Pantau harga, promosi, dan aktivitas kompetitor untuk mendukung keputusan strategis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-gray-100/70 dark:bg-gray-800/60 border border-transparent rounded-xl text-sm appearance-none cursor-pointer text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-md [&>option]:bg-white dark:[&>option]:bg-gray-800 [&>option]:text-gray-900 dark:[&>option]:text-gray-100"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>

          <button
            onClick={() => setExportOpen(true)}
            className="shrink-0 whitespace-nowrap inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            <FaFileExport className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StaggerItem>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Sinyal</p>
                <h3 className="text-3xl font-display font-semibold text-gray-900 dark:text-white">
                  <CountUp value={totalSignals} />
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <FaArrowUp className="w-4 h-4 text-success-500" />
                  <span className="text-sm font-medium text-success-600 dark:text-success-400">+12% dari minggu lalu</span>
                </div>
              </div>
              <div className="p-3 bg-primary-50 rounded-xl dark:bg-primary-500/15">
                <FaChartLine className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Kompetitor Paling Aktif</p>
                <h3 className="text-2xl font-display font-semibold text-gray-900 dark:text-white">
                  {dashboardSummary.topCompetitor}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{topCompetitorSignals} sinyal minggu ini</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-xl dark:bg-secondary-500/15">
                <FaChartBar className="w-7 h-7 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tipe Sinyal Dominan</p>
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
                  {dashboardSummary.dominantSignalType}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">35% dari total sinyal</p>
              </div>
              <div className="p-3 bg-warm-50 rounded-xl dark:bg-warm-500/15">
                <FaInfoCircle className="w-7 h-7 text-warm-700 dark:text-warm-400" />
              </div>
            </div>
          </div>
        </StaggerItem>
      </Stagger>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-1">Filter Brand</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Atur visibilitas brand pada grafik</p>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {selectedBrands.length} dari {competitorBrands.length} brand dipilih
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {competitorBrands.map((brand) => {
            const active = selectedBrands.includes(brand.id)
            return (
              <button
                key={brand.id}
                onClick={() => handleBrandToggle(brand.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 text-sm font-medium ${
                  active
                    ? 'border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-500/40 dark:bg-primary-500/15 dark:text-primary-300'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800'
                }`}
              >
                {active ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.color }} />
                <span>{brand.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-1">
                Tren Harga Kompetitor
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Perkembangan harga dalam 15 hari terakhir</p>
            </div>
            <span className="px-3 py-1 bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400 text-xs font-medium rounded-full">
              Update Langsung
            </span>
          </div>

          <LineChart
            data={priceChartData}
            series={competitorBrands}
            selectedIds={selectedBrands}
            valueFormatter={(n) => 'Rp ' + n.toLocaleString('id-ID')}
          />

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap gap-3">
              {competitorBrands.map((brand) => {
                const active = selectedBrands.includes(brand.id)
                return (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandToggle(brand.id)}
                    className={`flex items-center gap-2 text-sm transition-all duration-200 ${
                      active
                        ? 'text-gray-700 dark:text-gray-200'
                        : 'text-gray-400 dark:text-gray-500 opacity-50 hover:opacity-80'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.color }} />
                    <span>{brand.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-1">
                Aktivitas Brand per Minggu
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Frekuensi penyebutan dalam laporan sales</p>
            </div>
            <span className="px-3 py-1 bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400 text-xs font-medium rounded-full">
              4 Minggu Terakhir
            </span>
          </div>

          <BarChart data={activityChartData} series={competitorBrands} selectedIds={selectedBrands} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-1">
              Sinyal per Tipe Outlet
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Distribusi laporan berdasarkan kategori outlet</p>
          </div>
          <span className="px-3 py-1 bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400 text-xs font-medium rounded-full">
            Total {totalOutletSignals} Sinyal
          </span>
        </div>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {outletTypeBreakdown.map((item) => (
            <StaggerItem
              key={item.type}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{item.type}</h3>
                <span className="text-lg font-display font-semibold text-gray-900 dark:text-white">
                  <CountUp value={item.count} />
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.percentage}%` }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.percentage}%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round((item.count / totalOutletSignals) * 100)}% dari total
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-1">
                Laporan Sinyal Kompetitor
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Laporan sinyal dari tim sales
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Cari outlet, brand, wilayah, tipe..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2.5 w-full sm:w-72 bg-gray-100/70 dark:bg-gray-800/60 border border-transparent rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-md"
                />
              </div>

              <select
                value={signalTypeFilter}
                onChange={handleTypeFilterChange}
                className="px-3 py-2.5 bg-gray-100/70 dark:bg-gray-800/60 border border-transparent rounded-xl text-sm appearance-none cursor-pointer text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-md [&>option]:bg-white dark:[&>option]:bg-gray-800 [&>option]:text-gray-900 dark:[&>option]:text-gray-100"
              >
                <option value="">Semua Tipe</option>
                {Object.keys(signalTypeColors).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Outlet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipe Sinyal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Wilayah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-14 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Tidak ada laporan yang cocok</p>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-500/15 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/25 transition-colors"
                    >
                      <FaSearch className="w-4 h-4" />
                      Reset Filter
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedReports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                          <FaMapMarkerAlt className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{report.outlet}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {report.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{formatTableDate(report.date)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Dilaporkan</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getBrandColor(report.brand) }} />
                        <span className="text-sm text-gray-900 dark:text-white">{report.brand}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getSignalBadge(report.signalType)}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">{report.region}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">{report.salesName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setDetailReport(report)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/25 transition-colors"
                      >
                        <FaEye className="w-3.5 h-3.5" />
                        Detail
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div>
              Menampilkan <span className="font-medium text-gray-900 dark:text-white">{startIndex}</span>–
              <span className="font-medium text-gray-900 dark:text-white">{endIndex}</span> dari{' '}
              <span className="font-medium text-gray-900 dark:text-white">{filteredReports.length}</span> laporan
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safePage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={detailReport !== null}
        onClose={() => setDetailReport(null)}
        title="Detail Laporan"
        icon={<FaEye />}
        size="md"
      >
        {detailReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">Outlet</p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FaMapMarkerAlt className="w-4 h-4 text-primary-500 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{detailReport.outlet}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ID: {detailReport.id}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">Tanggal</p>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white">{formatFullDate(detailReport.date)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Dilaporkan</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">Brand</p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getBrandColor(detailReport.brand) }} />
                  <p className="font-medium text-gray-900 dark:text-white">{detailReport.brand}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">Nama Sales</p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FaUserCheck className="w-4 h-4 text-primary-500 shrink-0" />
                  <p className="font-medium text-gray-900 dark:text-white">{detailReport.salesName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">Tipe Sinyal & Wilayah</p>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                  <div>{getSignalBadge(detailReport.signalType)}</div>
                  <p className="text-sm text-gray-900 dark:text-white">{detailReport.region}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">Isi Sinyal</p>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-900 dark:text-gray-100">{detailReport.details}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export Data CSV"
        icon={<FaFileExport />}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setExportOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            >
              Export
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-500 dark:text-gray-400">Jumlah laporan</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{filteredReports.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-500 dark:text-gray-400">Periode</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{periodLabel}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-500 dark:text-gray-400">Tipe sinyal</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{signalTypeFilter || 'Semua Tipe'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-500 dark:text-gray-400">Brand terpilih</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {selectedBrands.length} dari {competitorBrands.length}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CompetitorIntelligencePage