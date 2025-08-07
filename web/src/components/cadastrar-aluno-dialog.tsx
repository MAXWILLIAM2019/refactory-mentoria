import { Button } from "@/components/ui/button"
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
import servicoAutenticacao from "@/services/servicoAutenticacao"
import { toast } from "sonner"

interface CadastrarAlunoDialogProps {
  children: React.ReactNode
  onAlunoAdicionado?: () => void
}

export function CadastrarAlunoDialog({ children, onAlunoAdicionado }: CadastrarAlunoDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [carregandoCadastro, setCarregandoCadastro] = useState(false)
  const [dialogAberto, setDialogAberto] = useState(false)
  
  // Estados do formulário de cadastro
  const [dadosCadastro, setDadosCadastro] = useState({
    nome: "",
    email: "",
    senha: ""
  })

  // Handler para mudanças no formulário de cadastro
  const handleCadastroChange = (campo: string, valor: string) => {
    setDadosCadastro(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  // Handler para submit do cadastro
  const handleCadastroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setCarregandoCadastro(true)

    try {
      const resposta = await servicoAutenticacao.cadastrarAluno(dadosCadastro)
      
      // Verifica sucesso com fallback para compatibilidade
      const cadastroSucesso = resposta.sucesso
      
      if (cadastroSucesso) {
        toast.success('Aluno cadastrado com sucesso!', {
          duration: 4000,
          style: {
            background: '#10b981',
            color: 'white',
            border: '1px solid #059669'
          }
        })
        
        // Limpa o formulário
        setDadosCadastro({
          nome: "",
          email: "",
          senha: ""
        })
        
        // Fecha o dialog
        setDialogAberto(false)
        
        // Chama callback para atualizar lista (se fornecido)
        if (onAlunoAdicionado) {
          onAlunoAdicionado()
        }
        
      } else {
        const mensagem = resposta.mensagem || 'Erro inesperado no cadastro'
        toast.error(mensagem, {
          duration: 5000,
          style: {
            background: '#ef4444',
            color: 'white',
            border: '1px solid #dc2626'
          }
        })
      }
    } catch (erro: any) {
      const mensagemErro = erro.message || 'Erro ao cadastrar aluno'
      toast.error(mensagemErro, {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: '1px solid #dc2626'
        }
      })
    } finally {
      setCarregandoCadastro(false)
    }
  }

  // Handler para mudança de estado do dialog
  const handleDialogChange = (aberto: boolean) => {
    setDialogAberto(aberto)
    
    // Se estiver fechando, limpa o formulário
    if (!aberto) {
      setDadosCadastro({
        nome: "",
        email: "",
        senha: ""
      })
    }
  }

  return (
    <Dialog open={dialogAberto} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Cadastrar novo aluno</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo aluno no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCadastroSubmit} onPointerDown={(e) => e.stopPropagation()}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                placeholder="Nome completo do aluno"
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
                placeholder="email@exemplo.com"
                value={dadosCadastro.email}
                onChange={(e) => handleCadastroChange('email', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  className="pr-12"
                  placeholder="Senha do aluno"
                  value={dadosCadastro.senha}
                  onChange={(e) => handleCadastroChange('senha', e.target.value)}
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
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              disabled={carregandoCadastro}
            >
              {carregandoCadastro ? 'Cadastrando...' : 'Cadastrar aluno'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}