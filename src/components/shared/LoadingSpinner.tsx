import type { ReactElement } from 'react'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function LoadingSpinner({
  size = 'md',
  text,
}: LoadingSpinnerProps): ReactElement {
  const sizes = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-12',
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-12"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'linear',
        }}
      >
        <Loader2 className={`${sizes[size]} text-primary`} />
      </motion.div>
      {text ? (
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      ) : null}
    </motion.div>
  )
}
