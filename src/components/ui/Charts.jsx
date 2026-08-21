import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const defaultFormatter = (n) => n.toLocaleString('id-ID')

const GRIDLINE_COUNT = 5

const niceCeil = (value) => {
  if (!Number.isFinite(value) || value <= 0) return 10
  const pow = 10 ** Math.floor(Math.log10(value))
  const norm = value / pow
  let nice = 10
  if (norm <= 1) nice = 1
  else if (norm <= 2) nice = 2
  else if (norm <= 2.5) nice = 2.5
  else if (norm <= 5) nice = 5
  return nice * pow
}

const buildLayout = (data, selectedSeries, W, H, padL, padR, padT, padB) => {
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const x0 = padL
  const x1 = W - padR
  const y0 = padT
  const y1 = H - padB
  const n = data.length
  const getX = (i) => (n === 1 ? x0 + plotW / 2 : x0 + (i / (n - 1)) * plotW)
  const rawMax = selectedSeries.reduce((acc, s) => {
    return data.reduce((max, d) => Math.max(max, d.values[s.id] ?? 0), acc)
  }, 0)
  const maxValue = niceCeil(rawMax)
  const points = {}
  selectedSeries.forEach((s) => {
    points[s.id] = data.map((d, i) => ({
      x: getX(i),
      y: y1 - ((d.values[s.id] ?? 0) / maxValue) * plotH,
    }))
  })
  let labels
  if (n <= 6) {
    labels = data.map((d) => d.label)
  } else {
    const mid = Math.floor((n - 1) / 2)
    labels = data.map((d, i) => (i === 0 || i === mid || i === n - 1 ? d.label : null))
  }
  const gridlines = Array.from({ length: GRIDLINE_COUNT }, (_, i) => ({
    value: maxValue - (i / (GRIDLINE_COUNT - 1)) * maxValue,
    y: y0 + (i / (GRIDLINE_COUNT - 1)) * plotH,
  }))
  return { W, H, x0, x1, y0, y1, plotW, plotH, maxValue, points, labels, gridlines, getX }
}

const buildBarLayout = (data, selectedSeries, W, H, padL, padR, padT, padB) => {
  const plotW = W - padL - padR
  const plotH = H - padT - padB
  const x0 = padL
  const y0 = padT
  const y1 = H - padB
  const n = data.length
  const rawMax = selectedSeries.reduce((acc, s) => {
    return data.reduce((max, d) => Math.max(max, d.values[s.id] ?? 0), acc)
  }, 0)
  const maxValue = niceCeil(rawMax)
  const groupWidth = plotW / n
  const slotCount = selectedSeries.length
  const barGap = 6
  const barWidth = Math.max(6, (groupWidth - barGap * (slotCount + 1)) / slotCount)
  let labels
  if (n <= 6) {
    labels = data.map((d) => d.label)
  } else {
    const mid = Math.floor((n - 1) / 2)
    labels = data.map((d, i) => (i === 0 || i === mid || i === n - 1 ? d.label : null))
  }
  const gridlines = Array.from({ length: GRIDLINE_COUNT }, (_, i) => ({
    value: maxValue - (i / (GRIDLINE_COUNT - 1)) * maxValue,
    y: y0 + (i / (GRIDLINE_COUNT - 1)) * plotH,
  }))
  return { W, H, x0, y0, y1, plotW, plotH, maxValue, groupWidth, slotCount, barGap, barWidth, labels, gridlines }
}

const EmptyState = ({ height }) => (
  <div
    className="flex items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500"
    style={{ height }}
  >
    Tidak ada data
  </div>
)

export const LineChart = ({
  data = [],
  series = [],
  selectedIds = [],
  height = 260,
  valueFormatter = defaultFormatter,
}) => {
  const wrapperRef = useRef(null)
  const [hoverIndex, setHoverIndex] = useState(null)
  const [hoverPointX, setHoverPointX] = useState(null)

  const W = 800
  const H = height
  const padL = 52
  const padR = 16
  const padT = 18
  const padB = 36

  const selectedSeries = useMemo(() => series.filter((s) => selectedIds.includes(s.id)), [series, selectedIds])

  const layout = useMemo(
    () => buildLayout(data, selectedSeries, W, H, padL, padR, padT, padB),
    [data, selectedSeries, H],
  )

  if (selectedSeries.length === 0 || data.length === 0) {
    return <EmptyState height={height} />
  }

  const handleMouseMove = (event) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const rect = wrapper.getBoundingClientRect()
    const relX = ((event.clientX - rect.left) / rect.width) * W
    const n = data.length
    const index = n === 1 ? 0 : Math.max(0, Math.min(n - 1, Math.round(((relX - layout.x0) / layout.plotW) * (n - 1))))
    setHoverIndex(index)
    setHoverPointX(layout.getX(index))
  }

  const handleMouseLeave = () => {
    setHoverIndex(null)
    setHoverPointX(null)
  }

  const { x0, x1, y0, y1, points, labels, gridlines } = layout

  return (
    <div ref={wrapperRef} className="relative w-full" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img">
        <defs>
          {selectedSeries.map((s) => (
            <linearGradient key={s.id} id={`line-area-${s.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {gridlines.map((line) => (
          <g key={line.value}>
            <line
              x1={x0}
              x2={x1}
              y1={line.y}
              y2={line.y}
              strokeWidth="1"
              className="stroke-gray-200 dark:stroke-gray-700/70"
            />
            <text x={x0 - 8} y={line.y + 4} textAnchor="end" className="fill-gray-400 text-[10px] dark:fill-gray-500">
              {valueFormatter(line.value)}
            </text>
          </g>
        ))}
        {selectedSeries.map((s, si) => {
          const pts = points[s.id]
          const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
          const areaPath = `${linePath} L${pts[pts.length - 1].x},${y1} L${pts[0].x},${y1} Z`
          return (
            <g key={s.id}>
              <motion.path
                d={areaPath}
                fill={`url(#line-area-${s.id})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: si * 0.15 + 0.4 }}
              />
              <motion.path
                d={linePath}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: si * 0.15, ease: [0.16, 1, 0.3, 1] }}
              />
              {pts.map((p, i) => (
                <motion.circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill={s.color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: si * 0.15 + 1.05 + i * 0.01 }}
                />
              ))}
            </g>
          )
        })}
        {data.map((d, i) => {
          const label = labels[i]
          if (!label) return null
          const x = layout.getX(i)
          const anchor = i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'
          return (
            <text key={`xlabel-${i}`} x={x} y={H - 10} textAnchor={anchor} className="fill-gray-400 text-[10px] dark:fill-gray-500">
              {label}
            </text>
          )
        })}
        {hoverIndex !== null && hoverPointX !== null && (
          <line
            x1={hoverPointX}
            x2={hoverPointX}
            y1={y0}
            y2={y1}
            strokeWidth="1"
            strokeDasharray="4 3"
            className="stroke-gray-400 dark:stroke-gray-500"
          />
        )}
      </svg>
      {hoverIndex !== null && hoverPointX !== null && (
        <div
          className="pointer-events-none absolute top-2 -translate-x-1/2 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/95"
          style={{ left: `${Math.min(Math.max((hoverPointX / W) * 100, 15), 85)}%` }}
        >
          <p className="mb-1 font-semibold text-gray-700 dark:text-gray-200">{data[hoverIndex].label}</p>
          <div className="space-y-0.5">
            {selectedSeries.map((s) => (
              <p key={s.id} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="font-medium text-gray-700 dark:text-gray-200">{s.name}:</span>
                {valueFormatter(data[hoverIndex].values[s.id] ?? 0)}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const BarChart = ({
  data = [],
  series = [],
  selectedIds = [],
  height = 260,
  valueFormatter = defaultFormatter,
}) => {
  const W = 800
  const H = height
  const padL = 52
  const padR = 16
  const padT = 18
  const padB = 36

  const selectedSeries = useMemo(() => series.filter((s) => selectedIds.includes(s.id)), [series, selectedIds])

  const layout = useMemo(
    () => buildBarLayout(data, selectedSeries, W, H, padL, padR, padT, padB),
    [data, selectedSeries, H],
  )

  if (selectedSeries.length === 0 || data.length === 0) {
    return <EmptyState height={height} />
  }

  const { x0, y0, y1, maxValue, groupWidth, slotCount, barGap, barWidth, labels, gridlines } = layout

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img">
        {gridlines.map((line) => (
          <g key={line.value}>
            <line
              x1={x0}
              x2={W - padR}
              y1={line.y}
              y2={line.y}
              strokeWidth="1"
              className="stroke-gray-200 dark:stroke-gray-700/70"
            />
            <text x={x0 - 8} y={line.y + 4} textAnchor="end" className="fill-gray-400 text-[10px] dark:fill-gray-500">
              {valueFormatter(line.value)}
            </text>
          </g>
        ))}
        {data.map((d, gi) => {
          const groupX = x0 + gi * groupWidth
          return selectedSeries.map((s, si) => {
            const val = d.values[s.id] ?? 0
            const barH = (val / maxValue) * (y1 - y0)
            const x = groupX + barGap + si * (barWidth + barGap)
            const y = y1 - barH
            return (
              <motion.rect
                key={`${s.id}-${gi}`}
                x={x}
                width={barWidth}
                rx="3"
                fill={s.color}
                initial={{ y: y1, height: 0 }}
                animate={{ y, height: barH }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (gi * slotCount + si) * 0.05 }}
                className="cursor-pointer transition-[filter] duration-150 hover:brightness-110"
              >
                <title>{`${s.name}: ${valueFormatter(val)}`}</title>
              </motion.rect>
            )
          })
        })}
        {data.map((d, i) => {
          const label = labels[i]
          if (!label) return null
          const cx = x0 + i * groupWidth + groupWidth / 2
          const anchor = i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'
          return (
            <text key={`bar-label-${i}`} x={cx} y={H - 10} textAnchor={anchor} className="fill-gray-400 text-[10px] dark:fill-gray-500">
              {label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
