import type { ReactElement, ReactNode } from 'react'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageTransition } from '../shared/PageTransition'
import { Button } from '../ui/button'

interface ModuleLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  backLink: string
  actions?: ReactNode
}

export function ModuleLayout({
  children,
  title,
  subtitle,
  backLink,
  actions,
}: ModuleLayoutProps): ReactElement {
  return (
    <PageTransition>
      <div className="space-y-6">
        {}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <Button asChild size="sm" variant="ghost">
              <Link to={backLink}>
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              {subtitle ? (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
          </div>
          {actions ? (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {actions}
            </motion.div>
          ) : null}
        </motion.div>

        {}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </PageTransition>
  )
}
