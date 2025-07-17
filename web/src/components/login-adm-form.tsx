import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LoginAdmForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [selectedUserType, setSelectedUserType] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showDialogPassword, setShowDialogPassword] = useState(false)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
                          <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Acesso Administrativo</h1>
                <p className="text-muted-foreground text-balance">
                  Entre com sua conta
                </p>
              </div>
              <div className="grid gap-3">
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button"
                    variant={selectedUserType === "admin" ? "default" : "outline"} 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setSelectedUserType("admin")}
                  >
                    Administrador
                  </Button>
                  <Button 
                    type="button"
                    variant={selectedUserType === "mentor" ? "default" : "outline"} 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setSelectedUserType("mentor")}
                  >
                    Mentor
                  </Button>
                  <Button 
                    type="button"
                    variant={selectedUserType === "monitor" ? "default" : "outline"} 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setSelectedUserType("monitor")}
                  >
                    Monitor
                  </Button>
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@lumia.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className="pr-12" 
                    required 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent focus-visible:!bg-transparent data-[state=open]:!bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-primary" />
                    ) : (
                      <Eye className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Cadastre-se
                </span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Cadastrar novo usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Cadastro Administrativo</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar sua conta administrativa.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                      />
                    </div>
                                         <div className="grid gap-2">
                       <Label htmlFor="role">Função</Label>
                       <Select>
                         <SelectTrigger className="w-full">
                           <SelectValue placeholder="Selecione sua função" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="admin">Administrador</SelectItem>
                           <SelectItem value="mentor">Mentor</SelectItem>
                           <SelectItem value="monitor">Monitor</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                                         <div className="grid gap-2">
                       <Label htmlFor="dialog-password">Senha</Label>
                       <div className="relative">
                         <Input
                           id="dialog-password"
                           type={showDialogPassword ? "text" : "password"}
                           className="pr-12"
                           placeholder="Crie uma senha segura"
                         />
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           className="absolute right-0 top-0 h-full px-3 py-2 !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent focus-visible:!bg-transparent data-[state=open]:!bg-transparent"
                           onClick={() => setShowDialogPassword(!showDialogPassword)}
                           aria-label={showDialogPassword ? "Esconder senha" : "Mostrar senha"}
                         >
                           {showDialogPassword ? (
                             <EyeOff className="h-4 w-4 text-primary" />
                           ) : (
                             <Eye className="h-4 w-4 text-primary" />
                           )}
                         </Button>
                       </div>
                     </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Criar conta</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/logoLogin.png"
              alt="LumiaPRO Admin Login"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  )
} 