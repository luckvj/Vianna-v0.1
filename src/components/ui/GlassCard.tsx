import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  variant?: 'default' | 'light' | 'dark'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const variantClasses = {
  default: 'glass',
  light: 'glass-light',
  dark: 'glass-dark',
}

export default function GlassCard({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
