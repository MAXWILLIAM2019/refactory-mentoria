import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import { useLocation, Link } from "react-router-dom"


import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const location = useLocation()
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Meu Plano"
              className="bg-secondary text-secondary-foreground min-w-8 relative cursor-default hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground active:bg-secondary active:text-secondary-foreground"
            >
              <IconCirclePlusFilled />
              <span>Meu Plano</span>
            </SidebarMenuButton>
            {/* <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            // Lógica melhorada para detectar seleção, incluindo rotas dinâmicas
            const isSelected = location.pathname === item.url || 
              (item.title === "Dashboard" && (location.pathname === "/dashboard" || location.pathname === "/aluno/dashboard"))
            
            
            return (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url} className="w-full cursor-pointer">
                  <SidebarMenuButton 
                    tooltip={item.title}
                    className="relative w-full cursor-pointer"
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm" />
                    )}
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
