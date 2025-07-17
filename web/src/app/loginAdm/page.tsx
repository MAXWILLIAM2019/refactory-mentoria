import { LoginAdmForm } from "@/components/login-adm-form"
import { ModeToggle } from "@/components/mode-toggle"

export default function LoginAdmPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginAdmForm />
      </div>
    </div>
  )
} 