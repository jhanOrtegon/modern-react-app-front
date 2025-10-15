import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SlideIn } from '../shared/SlideIn'
import { Button } from '../ui/button'

interface DetailLayoutProps {
  children: ReactNode
  backLink: string
  actions?: ReactNode
  isLoading?: boolean
}

export function DetailLayout({
  children,
  backLink,
  actions,
  isLoading,
}: DetailLayoutProps): ReactElement {
  return (
    <SlideIn direction="right">
      <div className="space-y-6">
        {/* Navigation Bar */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Button asChild variant="ghost">
            <Link to={backLink}>
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Link>
          </Button>
          {actions && !isLoading ? (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2"
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {actions}
            </motion.div>
          ) : null}
        </motion.div>

        {/* Content Card */}
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="rounded-lg border bg-card p-8"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </SlideIn>
  )
}
