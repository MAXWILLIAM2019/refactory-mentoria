import {
  ChartLine,
  UsersRoundIcon,
  LocateFixed,
  FileSymlink,
  PackageCheck,
  Search,
  ChevronDownIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function PlanosTabs() {
  return (
    <Tabs defaultValue="planos">
      <ScrollArea>
        <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 w-full justify-start">
          <TabsTrigger
            value="planos"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-lg cursor-pointer"
          >
            <FileSymlink
              className="-ms-0.5 me-1.5 opacity-60"
              size={20}
              aria-hidden="true"
            />
            Planos
          </TabsTrigger>
          <TabsTrigger
            value="sprints"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-lg cursor-pointer"
          >
            <PackageCheck
              className="-ms-0.5 me-1.5 opacity-60"
              size={20}
              aria-hidden="true"
            />
            Sprints
            <Badge
              className="bg-primary/15 ms-1.5 min-w-5 px-1"
              variant="secondary"
            >
              12
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="metas"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-lg cursor-pointer"
          >
            <LocateFixed
              className="-ms-0.5 me-1.5 opacity-60"
              size={20}
              aria-hidden="true"
            />
            Metas
          </TabsTrigger>
          <TabsTrigger
            value="personalizar"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-lg cursor-pointer"
          >
            <UsersRoundIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={20}
              aria-hidden="true"
            />
            Personalizar
          </TabsTrigger>
          <TabsTrigger
            value="cadastrar"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none text-lg cursor-pointer"
          >
            <ChartLine
              className="-ms-0.5 me-1.5 opacity-60"
              size={20}
              aria-hidden="true"
            />
            Cadastrar
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="planos">
        <div className="flex items-center space-x-2 mb-4">
          <Button className="bg-primary cursor-pointer">
            Cadastrar
          </Button>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar planos..."
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                Todos
                <ChevronDownIcon
                  className="-me-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
              <DropdownMenuItem>Todos</DropdownMenuItem>
              <DropdownMenuItem>Ativos</DropdownMenuItem>
              <DropdownMenuItem>Inativos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Planos Ativos</h3>
          <p className="text-muted-foreground text-base">
            Visualize e gerencie todos os planos que estão atualmente ativos no sistema. 
            Aqui você pode ver informações detalhadas sobre cada plano, incluindo preços, 
            recursos disponíveis e status de ativação.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="sprints">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Todos os Sprints</h3>
          <p className="text-muted-foreground text-base">
            Acesso completo a todos os sprints do sistema, incluindo ativos e inativos. 
            Esta seção permite uma visão abrangente de todos os sprints disponíveis, 
            facilitando a comparação e análise de diferentes opções.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="metas">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Metas do Sistema</h3>
          <p className="text-muted-foreground text-base">
            Visualize e gerencie as metas estabelecidas para o sistema. 
            Aqui você pode acompanhar o progresso, definir novos objetivos 
            e monitorar o desempenho das metas definidas.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="personalizar">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Personalizar Planos</h3>
          <p className="text-muted-foreground text-base">
            Configure e personalize os planos existentes de acordo com as necessidades 
            específicas. Adicione ou remova recursos, ajuste preços e modifique 
            configurações para atender diferentes perfis de usuários.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="cadastrar">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Cadastrar Novo Plano</h3>
          <p className="text-muted-foreground text-base">
            Crie novos planos para o sistema com recursos personalizados, preços 
            definidos e configurações específicas. Esta seção permite a criação 
            completa de novos pacotes de serviços para os alunos.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
} 