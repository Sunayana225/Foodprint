import React from 'react'
import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-white focus:ring-secondary-500 shadow-sm hover:shadow-md',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white active:bg-primary-700 focus:ring-primary-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: disabled || loading ? 1 : 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: disabled || loading ? 1 : 0.95,
      transition: { duration: 0.1 }
    }
  }

  const iconVariants = {
    initial: { x: 0 },
    hover: {
      x: iconPosition === 'right' ? 4 : -4,
      transition: { duration: 0.2 }
    }
  }

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick()
    }
  }

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`${iconSizeClasses[size]} mr-2`}
          >
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </motion.div>
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <motion.div
              variants={iconVariants}
              className={`${iconSizeClasses[size]} mr-2`}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          )}

          <span>{children}</span>

          {Icon && iconPosition === 'right' && (
            <motion.div
              variants={iconVariants}
              className={`${iconSizeClasses[size]} ml-2`}
            >
              <Icon className="w-full h-full" />
            </motion.div>
          )}
        </>
      )}
    </motion.button>
  )
}

export default AnimatedButton
