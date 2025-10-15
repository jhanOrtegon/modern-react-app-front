import { motion } from 'framer-motion'
import type { ReactElement, ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  className = '',
}: FadeInProps): ReactElement {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={className}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  )
}
