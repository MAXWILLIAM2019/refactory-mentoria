import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import servicoAutenticacao from "@/services/servicoAutenticacao"
import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const [carregandoLogout, setCarregandoLogout] = useState(false)

  // Handler para logout
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Conta
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Pagamentos
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notificações
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={carregandoLogout}
              className="cursor-pointer"
            >
              <IconLogout />
              {carregandoLogout ? 'Saindo...' : 'Sair'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
