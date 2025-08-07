import {
  BoltIcon,
  BookOpenIcon,
  ChevronDownIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import servicoAutenticacao from "@/services/servicoAutenticacao"
import { toast } from "sonner"

export default function UserProfileDropdown() {
  const { userData } = useAuth()
  const navigate = useNavigate()
  const [carregandoLogout, setCarregandoLogout] = useState(false)

  // Obtém as iniciais do nome do usuário
  const getIniciais = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Handler para logout - mesma lógica do sidebar
  const handleLogout = async () => {
    try {
      console.log('🚪 Iniciando processo de logout')
      setCarregandoLogout(true)

      // Faz logout seguro e obtém tipo de usuário para redirecionamento
      const tipoUsuario = await servicoAutenticacao.fazerLogoutSeguro()

      console.log('✅ Logout realizado, tipo de usuário retornado:', tipoUsuario)

      // Toast de sucesso
      toast.success('Logout realizado com sucesso!', {
        duration: 3000, // 3 segundos
        style: {
          background: '#10b981', // Verde vibrante
          color: 'white',
          border: '1px solid #059669'
        }
      })

      // Redireciona baseado no tipo de usuário
      if (tipoUsuario === 'aluno') {
        console.log('👨‍🎓 Redirecionando aluno para /login')
        navigate('/login')
      } else if (tipoUsuario === 'administrador') {
        console.log('👨‍💼 Redirecionando administrador para /loginAdm')
        navigate('/loginAdm')
      } else {
        console.log('⚠️ Tipo de usuário não detectado, redirecionando para /login')
        navigate('/login')
      }

    } catch (erro: any) {
      console.error('❌ Erro durante logout:', erro)
      
      toast.error(erro.message || 'Erro ao fazer logout', {
        duration: 5000, // 5 segundos para erros
        style: {
          background: '#ef4444', // Vermelho vibrante
          color: 'white',
          border: '1px solid #dc2626'
        }
      })
      
      // Mesmo com erro, tenta redirecionar para login
      navigate('/login')
    } finally {
      setCarregandoLogout(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent cursor-pointer">
          <Avatar>
            <AvatarImage src="./avatar.jpg" alt="Profile image" />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {userData?.nome ? getIniciais(userData.nome) : 'U'}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" align="end" side="bottom" sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="./avatar.jpg" alt={userData?.nome || 'Usuário'} />
              <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">
                {userData?.nome ? getIniciais(userData.nome) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {userData?.nome || 'Usuário'}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {userData?.login || 'usuario@email.com'}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Ajuda</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Favoritos</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Editar Perfil</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={carregandoLogout}
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>{carregandoLogout ? 'Saindo...' : 'Sair'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 