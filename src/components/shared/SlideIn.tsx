import { motion } from 'framer-motion'
import type { ReactElement, ReactNode } from 'react'

interface SlideInProps {
  children: ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  className?: string
}

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: SlideInProps): ReactElement {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
  }

  return (
    <motion.div
      animate={{ opacity: 1, x: 0, y: 0 }}
      className={className}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  )
}
