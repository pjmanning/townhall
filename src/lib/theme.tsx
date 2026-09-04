import { createContext, use, useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Tiny theme store. Deliberately not `next-themes` — see AGENTS.md, we avoid
 * Next-shaped dependencies. The class is applied by `themeScript` before paint
 * so there is no flash, and this provider only keeps React in sync.
 */

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'townhall-theme'
const DEFAULT_THEME: Theme = 'light'

/**
 * Inlined in <head> so the correct class exists on the very first paint.
 *
 * Light is the brand default and wins unless the visitor has explicitly chosen
 * dark. To follow the OS preference instead, replace the fallback with:
 *   window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t='${DEFAULT_THEME}'}var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(t)}catch(_){document.documentElement.classList.add('${DEFAULT_THEME}')}})()`

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME)

  // Adopt whatever `themeScript` already decided, once we're on the client.
  useEffect(() => {
    setThemeState(document.documentElement.classList.contains('light') ? 'light' : 'dark')
  }, [])

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode / storage disabled — theme just won't persist.
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [theme, setTheme],
  )

  return <ThemeContext value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext>
}

export function useTheme() {
  return use(ThemeContext)
}
