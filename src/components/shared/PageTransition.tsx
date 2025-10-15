import type { ReactElement, ReactNode } from 'react'

import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({
  children,
}: PageTransitionProps): ReactElement {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      initial={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
