import { useId } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const id = useId()
  const { theme, setTheme } = useTheme()
  
  // Considera tema como claro quando é "light" ou quando é "system" (assumindo padrão claro)
  const isLightMode = theme === "light" || theme === "system"

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "light" : "dark")
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Switch
        id={id}
        checked={isLightMode}
        onCheckedChange={handleToggle}
        aria-label="Alternar tema"
      />
      <Label htmlFor={id}>
        <span className="sr-only">Alternar tema</span>
        {isLightMode ? (
          <SunIcon size={16} aria-hidden="true" />
        ) : (
          <MoonIcon size={16} aria-hidden="true" />
        )}
      </Label>
    </div>
  )
}
