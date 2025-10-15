import type { ReactElement, ReactNode } from 'react'

import { motion } from 'framer-motion'

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  children: ReactNode
  error?: string
}

export function FormField({
  label,
  htmlFor,
  required,
  children,
  error,
}: FormFieldProps): ReactElement {
  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="space-y-2"
      initial={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-medium" htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </label>
      {children}
      {error ? (
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-destructive"
          initial={{ opacity: 0, y: -5 }}
        >
          {error}
        </motion.p>
      ) : null}
    </motion.div>
  )
}
