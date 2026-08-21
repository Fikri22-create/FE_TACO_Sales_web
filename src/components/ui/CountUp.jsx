import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

const defaultFormat = (n) => n.toLocaleString('id-ID')

const CountUp = ({ value, duration = 1200, format = defaultFormat, className = '', prefix = '', suffix = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: duration / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(display)}
      {suffix}
    </span>
  )
}

export default CountUp
