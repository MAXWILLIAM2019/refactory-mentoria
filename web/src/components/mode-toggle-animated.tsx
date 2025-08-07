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
    <div>
      <div className="relative inline-grid h-6 w-11 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <Switch
          id={id}
          checked={isLightMode}
          onCheckedChange={handleToggle}
          className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto cursor-pointer [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        />
        <span className="pointer-events-none relative ms-0.5 flex min-w-5 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
          <MoonIcon size={12} aria-hidden="true" />
        </span>
        <span className="peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 flex min-w-5 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
          <SunIcon size={12} aria-hidden="true" />
        </span>
      </div>
      <Label htmlFor={id} className="sr-only">
        Alternar tema
      </Label>
    </div>
  )
}
