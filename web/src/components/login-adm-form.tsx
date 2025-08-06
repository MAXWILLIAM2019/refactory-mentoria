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
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import servicoAutenticacao from "@/services/servicoAutenticacao"
import { toast } from "sonner"

export function LoginAdmForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [selectedUserType, setSelectedUserType] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showDialogPassword, setShowDialogPassword] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [carregandoCadastro, setCarregandoCadastro] = useState(false)
  const [dialogAberto, setDialogAberto] = useState(false)
  
  // Estados do formulário de login
  const [dadosLogin, setDadosLogin] = useState({
    login: "",
    senha: "",
    grupo: "administrador" as "aluno" | "administrador"
  })

  // Estados do formulário de cadastro
  const [dadosCadastro, setDadosCadastro] = useState({
    nome: "",
    login: "",
    senha: "",
    grupo: "administrador" as "aluno" | "administrador"
  })

  // Handler para mudanças no formulário de login
  const handleLoginChange = (campo: string, valor: string) => {
    setDadosLogin(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  // Handler para mudanças no formulário de cadastro
  const handleCadastroChange = (campo: string, valor: string) => {
    setDadosCadastro(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  // Handler para submit do login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Previne propagação
    
    // Se o dialog estiver aberto, não executa o login
    if (dialogAberto) {
      return
    }
    
    setCarregando(true)

    try {
      console.log('🔐 Tentando fazer login administrativo:', dadosLogin)
      
      // Usa o login do AuthContext
      await login(dadosLogin)
      
      toast.success('Login realizado com sucesso!', {
        duration: 3000, // 3 segundos
        style: {
          background: '#10b981', // Verde vibrante
          color: 'white',
          border: '1px solid #059669'
        }
      })
      console.log('✅ Login administrativo realizado, redirecionando para dashboard')
      
      // Redireciona para dashboard
      navigate('/dashboard')
    } catch (erro: any) {
      console.error('❌ Erro no login administrativo:', erro)
      toast.error(erro.message || 'Erro ao fazer login', {
        duration: 5000, // 5 segundos para erros
        style: {
          background: '#ef4444', // Vermelho vibrante
          color: 'white',
          border: '1px solid #dc2626'
        }
      })
    } finally {
      setCarregando(false)
    }
  }

  // Handler para submit do cadastro
  const handleCadastroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Previne propagação
    console.log('🚀 Iniciando handleCadastroSubmit')
    setCarregandoCadastro(true)

    try {
      console.log('📝 Tentando cadastrar usuário:', dadosCadastro)
      
      const resposta = await servicoAutenticacao.cadastrarUsuario(dadosCadastro)
      console.log('📨 Resposta da API:', resposta)
      
      // Verifica tanto 'sucesso' quanto 'success' (inconsistência da API)
      const sucesso = resposta.sucesso || resposta.sucesso
      
      if (sucesso) {
        console.log('✅ Sucesso detectado, mostrando toast...')
        toast.success('Usuário cadastrado com sucesso!', {
          duration: 4000, // 4 segundos
          style: {
            background: '#10b981', // Verde mais vibrante
            color: 'white',
            border: '1px solid #059669'
          }
        })
        console.log('✅ Usuário cadastrado com sucesso')
        
        // Limpa o formulário
        setDadosCadastro({
          nome: "",
          login: "",
          senha: "",
          grupo: "administrador"
        })
        console.log('🧹 Formulário limpo')
        
        // Fecha o dialog
        setDialogAberto(false)
        console.log('🚪 Dialog fechado')
      } else {
        console.log('❌ Resposta não indica sucesso:', resposta)
        const mensagem = resposta.mensagem || resposta.mensagem || 'Erro inesperado no cadastro'
        toast.error(mensagem, {
          duration: 5000, // 5 segundos para erros
          style: {
            background: '#ef4444', // Vermelho vibrante
            color: 'white',
            border: '1px solid #dc2626'
          }
        })
      }
    } catch (erro: any) {
      console.error('❌ Erro no cadastro:', erro)
      toast.error(erro.message || 'Erro ao cadastrar usuário', {
        duration: 5000, // 5 segundos para erros
        style: {
          background: '#ef4444', // Vermelho vibrante
          color: 'white',
          border: '1px solid #dc2626'
        }
      })
    } finally {
      console.log('🏁 Finalizando handleCadastroSubmit')
      setCarregandoCadastro(false)
    }
  }

  // Handler para abrir dialog
  const handleAbrirDialog = () => {
    setDialogAberto(true)
  }


  // Handler para mudança de estado do dialog
  const handleDialogChange = (aberto: boolean) => {
    setDialogAberto(aberto)
    
    // Se estiver fechando, limpa o formulário
    if (!aberto) {
      setDadosCadastro({
        nome: "",
        login: "",
        senha: "",
        grupo: "administrador"
      })
      console.log('🧹 Formulário limpo ao fechar dialog')
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleLoginSubmit}>
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
                  value={dadosLogin.login}
                  onChange={(e) => handleLoginChange('login', e.target.value)}
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
                    placeholder="Sua senha"
                    value={dadosLogin.senha}
                    onChange={(e) => handleLoginChange('senha', e.target.value)}
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
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={carregando}
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </Button>
              
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Cadastre-se
                </span>
              </div>
              
              <Dialog open={dialogAberto} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={handleAbrirDialog}
                  >
                    Cadastrar novo usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Cadastro Administrativo</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar uma nova conta.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCadastroSubmit} onPointerDown={(e) => e.stopPropagation()}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          placeholder="Seu nome completo"
                          value={dadosCadastro.nome}
                          onChange={(e) => handleCadastroChange('nome', e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={dadosCadastro.login}
                          onChange={(e) => handleCadastroChange('login', e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Função</Label>
                        <Select 
                          value={dadosCadastro.grupo} 
                          onValueChange={(valor) => handleCadastroChange('grupo', valor)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione sua função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administrador">Administrador</SelectItem>
                            <SelectItem value="aluno">Aluno</SelectItem>
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
                            value={dadosCadastro.senha}
                            onChange={(e) => handleCadastroChange('senha', e.target.value)}
                            required
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
                      <Button 
                        type="submit"
                        disabled={carregandoCadastro}
                      >
                        {carregandoCadastro ? 'Cadastrando...' : 'Criar conta'}
                      </Button>
                    </DialogFooter>
                  </form>
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