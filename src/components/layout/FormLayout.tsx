import type { ReactElement, ReactNode } from 'react'

import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SlideIn } from '../shared/SlideIn'
import { Button } from '../ui/button'

interface FormLayoutProps {
  children: ReactNode
  title: string
  backLink: string
  onSubmit: (e: React.FormEvent) => void
  isPending: boolean
  isEditing?: boolean
}

export function FormLayout({
  children,
  title,
  backLink,
  onSubmit,
  isPending,
  isEditing = false,
}: FormLayoutProps): ReactElement {
  return (
    <SlideIn direction="up">
      <div className="space-y-6">
        {/* Header */}
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
          <h1 className="text-2xl font-bold">{title}</h1>
        </motion.div>

        {/* Form */}
        <motion.form
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 rounded-lg border bg-card p-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={onSubmit}
        >
          {children}

          {/* Form Actions */}
          <motion.div
            animate={{ opacity: 1 }}
            className="flex justify-end gap-2 border-t pt-6"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Button asChild type="button" variant="outline">
              <Link to={backLink}>Cancel</Link>
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  {isEditing ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </SlideIn>
  )
}
