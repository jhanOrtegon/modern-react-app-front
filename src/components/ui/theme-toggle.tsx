import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import type { ReactElement } from 'react'
import { useTheme } from '../theme-provider'
import { Button } from './button'

export function ThemeToggle(): ReactElement {
  const { theme, setTheme } = useTheme()

  const toggleTheme = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button size="icon" variant="ghost" onClick={toggleTheme}>
      <motion.div
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon className="size-5" />
        ) : (
          <Sun className="size-5" />
        )}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
