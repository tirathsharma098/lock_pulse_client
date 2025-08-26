'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
// Add MUI theme imports
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

type Theme = 'light' | 'dark' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'lockpulse-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  // Brand/color + zero radius config in one place
  const BRAND_PRIMARY = '#4682B4';

  // Safe system mode resolver for SSR/Edge (no window during render)
  const getSystemPaletteMode = () => {
    if (typeof window === 'undefined') return 'light' as const
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Resolve current palette mode from light/dark/system
  const paletteMode = useMemo<'light' | 'dark'>(() => {
    return theme === 'system' ? getSystemPaletteMode() : theme
  }, [theme])

  // Centralized MUI theme: brand color, zero border radius, and modern baseline
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: paletteMode,
          primary: { main: BRAND_PRIMARY },
        },
        shape: { borderRadius: 0 },
        typography: {
          fontFamily: [
            'Inter',
            'system-ui',
            '-apple-system',
            'Segoe UI',
            'Roboto',
            'Helvetica',
            'Arial',
            'sans-serif',
            'Apple Color Emoji',
            'Segoe UI Emoji',
          ].join(','),
        },
        components: {
          // Extra safety to ensure zero radius everywhere
          MuiButton: { styleOverrides: { root: { borderRadius: 0 } } },
          MuiPaper: { styleOverrides: { root: { borderRadius: 0 } } },
          MuiCard: { styleOverrides: { root: { borderRadius: 0 } } },
          MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 0 } } },
          MuiInputBase: { styleOverrides: { root: { borderRadius: 0 } } },
          MuiChip: { styleOverrides: { root: { borderRadius: 0 } } },
          MuiAlert: { styleOverrides: { root: { borderRadius: 0 } } },
          MuiToggleButton: { styleOverrides: { root: { borderRadius: 0 } } },
          // Controls sometimes inheriting rounding from defaults
          MuiSelect: { styleOverrides: { select: { borderRadius: 0 } } },
          MuiMenu: { styleOverrides: { paper: { borderRadius: 0 } } },
          MuiPopover: { styleOverrides: { paper: { borderRadius: 0 } } },
          MuiDialog: { styleOverrides: { paper: { borderRadius: 0 } } },
          MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 0 } } },
        },
      }),
    [paletteMode]
  )

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
