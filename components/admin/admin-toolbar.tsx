'use client'

import { useState } from 'react'
import { IconInbox, IconLogout, IconMenu2, IconX } from '@tabler/icons-react'
import { useAdmin } from '@/components/admin/admin-provider'
import { signOut } from '@/app/actions/auth'

export function AdminToolbar() {
  const { isAdmin, isEditingMode, toggleEditingMode } = useAdmin()
  const [mobileOpen, setMobileOpen] = useState(false)

  // No render for non-admins — no flash, no leaks.
  if (!isAdmin) return null

  const editToggleClass = isEditingMode
    ? 'bg-plasma text-midnight text-[11px] font-mono px-2.5 py-1 rounded-[6px] transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma'
    : 'bg-transparent text-ash border border-[rgba(139,146,165,0.4)] text-[11px] font-mono px-2.5 py-1 rounded-[6px] transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma'

  const iconBtnClass =
    'flex items-center justify-center text-ash hover:text-bone transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma rounded-[4px] p-0.5'

  const divider = (
    <span
      className="inline-block w-px bg-[rgba(139,146,165,0.3)]"
      style={{ height: '16px' }}
      aria-hidden="true"
    />
  )

  const toolbarContents = (
    <>
      {/* Admin indicator dot */}
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-plasma opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-plasma" />
        </span>
        <span className="text-[10px] font-mono text-ash uppercase tracking-[0.1em]">
          Admin
        </span>
      </span>

      {divider}

      {/* Editing mode toggle */}
      <button
        type="button"
        onClick={toggleEditingMode}
        className={editToggleClass}
        aria-pressed={isEditingMode}
        aria-label={isEditingMode ? 'Disable editing mode' : 'Enable editing mode'}
      >
        {isEditingMode ? 'Editing on' : 'Preview mode'}
      </button>

      {divider}

      {/* Inbox — placeholder for Phase 5.6 */}
      <button
        type="button"
        className={iconBtnClass}
        aria-label="Open inbox"
        data-pending-implementation="inbox"
      >
        <IconInbox size={16} stroke={1.5} />
      </button>

      {divider}

      {/* Logout */}
      <form action={signOut}>
        <button
          type="submit"
          className={iconBtnClass}
          aria-label="Log out"
        >
          <IconLogout size={16} stroke={1.5} />
        </button>
      </form>
    </>
  )

  return (
    <>
      {/* Desktop toolbar — hidden below 640px */}
      <div
        className="hidden sm:flex fixed bottom-6 right-6 z-50 items-center gap-3 px-3 py-2.5 rounded-[12px] bg-carbon border border-[rgba(139,146,165,0.2)] backdrop-blur-sm"
        role="toolbar"
        aria-label="Admin controls"
      >
        {toolbarContents}
      </div>

      {/* Mobile — collapsed icon button that expands vertically */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        {mobileOpen ? (
          <div
            className="flex flex-col items-end gap-3 p-3 rounded-[12px] bg-carbon border border-[rgba(139,146,165,0.2)] backdrop-blur-sm"
            role="toolbar"
            aria-label="Admin controls"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={iconBtnClass}
              aria-label="Close admin toolbar"
            >
              <IconX size={16} stroke={1.5} />
            </button>

            {/* Admin dot */}
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-plasma opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-plasma" />
              </span>
              <span className="text-[10px] font-mono text-ash uppercase tracking-[0.1em]">
                Admin
              </span>
            </span>

            {/* Editing toggle */}
            <button
              type="button"
              onClick={toggleEditingMode}
              className={editToggleClass}
              aria-pressed={isEditingMode}
              aria-label={isEditingMode ? 'Disable editing mode' : 'Enable editing mode'}
            >
              {isEditingMode ? 'Editing on' : 'Preview mode'}
            </button>

            {/* Inbox placeholder */}
            <button
              type="button"
              className={iconBtnClass}
              aria-label="Open inbox"
              data-pending-implementation="inbox"
            >
              <IconInbox size={16} stroke={1.5} />
            </button>

            {/* Logout */}
            <form action={signOut}>
              <button type="submit" className={iconBtnClass} aria-label="Log out">
                <IconLogout size={16} stroke={1.5} />
              </button>
            </form>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-carbon border border-[rgba(139,146,165,0.2)] text-ash hover:text-bone transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-plasma backdrop-blur-sm"
            aria-label="Open admin toolbar"
          >
            <IconMenu2 size={18} stroke={1.5} />
          </button>
        )}
      </div>
    </>
  )
}
