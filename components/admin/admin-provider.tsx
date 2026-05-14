'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

const EDITING_MODE_STORAGE_KEY = 'jstalin:editing-mode'

interface AdminContextValue {
  isAdmin: boolean
  userEmail: string | null
  isEditingMode: boolean
  toggleEditingMode: () => void
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  userEmail: null,
  isEditingMode: false,
  toggleEditingMode: () => {},
})

interface AdminProviderProps {
  isAdmin: boolean
  userEmail: string | null
  children: ReactNode
}

export function AdminProvider({ isAdmin, userEmail, children }: AdminProviderProps) {
  // Default: editing mode on when admin is present.
  // Will be overridden on mount by localStorage value if one exists.
  const [isEditingMode, setIsEditingMode] = useState(isAdmin)

  // Sync with localStorage after mount so SSR and client agree initially.
  useEffect(() => {
    if (!isAdmin) return
    const stored = localStorage.getItem(EDITING_MODE_STORAGE_KEY)
    if (stored !== null) {
      setIsEditingMode(stored === 'true')
    }
  }, [isAdmin])

  const toggleEditingMode = useCallback(() => {
    setIsEditingMode((prev) => {
      const next = !prev
      localStorage.setItem(EDITING_MODE_STORAGE_KEY, String(next))
      return next
    })
  }, [])

  return (
    <AdminContext.Provider value={{ isAdmin, userEmail, isEditingMode, toggleEditingMode }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin(): AdminContextValue {
  return useContext(AdminContext)
}
