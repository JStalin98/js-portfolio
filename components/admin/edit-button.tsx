'use client'

import { IconPencil } from '@tabler/icons-react'
import { useAdmin } from '@/components/admin/admin-provider'

interface EditButtonProps {
  onClick: () => void
  'aria-label': string
  /**
   * floating (default): absolutely positioned over parent content, group-hover fade-in on desktop.
   * inline: flows inline (no absolute), always visible when in editing mode.
   *         Use this when rendering next to a section heading.
   */
  variant?: 'floating' | 'inline'
  /**
   * Override position classes for the floating variant.
   * Defaults to 'top-2 right-2'.
   * Ignored when variant="inline".
   */
  positionClassName?: string
}

export function EditButton({
  onClick,
  'aria-label': ariaLabel,
  variant = 'floating',
  positionClassName = 'top-2 right-2',
}: EditButtonProps) {
  const { isAdmin, isEditingMode } = useAdmin()

  if (!isAdmin || !isEditingMode) return null

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={[
          'inline-flex items-center justify-center w-6 h-6 shrink-0',
          'text-ash hover:text-bone',
          'transition-colors duration-150',
          'rounded-[4px]',
          'focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma',
        ].join(' ')}
      >
        <IconPencil size={14} stroke={1.5} />
      </button>
    )
  }

  // floating variant
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        `absolute ${positionClassName} z-30`,
        'flex items-center justify-center w-6 h-6',
        'text-ash hover:text-bone',
        'transition-colors duration-150',
        'rounded-[4px]',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma',
        // On touch devices always visible; on pointer devices fade in on parent group-hover.
        'opacity-100 md:opacity-0 md:group-hover:opacity-100',
        'transition-opacity duration-150',
      ].join(' ')}
    >
      <IconPencil size={14} stroke={1.5} />
    </button>
  )
}
