import { motion } from 'framer-motion'

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

export const fadeUpItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

export const Stagger = ({ className = '', children, ...rest }) => (
  <motion.div className={className} variants={staggerContainer} initial="hidden" animate="show" {...rest}>
    {children}
  </motion.div>
)

export const StaggerItem = ({ className = '', children, ...rest }) => (
  <motion.div className={className} variants={fadeUpItem} {...rest}>
    {children}
  </motion.div>
)
