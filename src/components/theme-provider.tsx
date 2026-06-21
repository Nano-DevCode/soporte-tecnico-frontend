import { useState, useMemo } from "react"
import { ThemeProviderContext, type Theme } from "./useTheme"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  // Función interna para aplicar el estilo al DOM inmediatamente
  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
    }
  }

  // ✅ Aplicamos el tema al cargar la app (único caso donde necesitamos useEffect)
  // Nota: También podrías poner esto en un script en tu index.html para evitar parpadeo inicial.
  // useEffect(() => { applyTheme(theme) }, []) 

  const value = useMemo(() => ({
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
      // ✅ FIX: Ejecutamos la lógica AQUÍ, directamente cuando ocurre el clic,
      // eliminando la necesidad de un useEffect que "observe" al estado.
      applyTheme(newTheme)
    },
  }), [theme, storageKey])

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}