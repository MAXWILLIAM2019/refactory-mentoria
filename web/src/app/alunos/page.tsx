import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAlunos } from "@/hooks/useAlunos"
import type { DataTableRow } from "@/lib/schemas"

export default function AlunosPage() {
  const { alunos, erro, recarregarAlunos, carregando } = useAlunos()
  
  // Mapear os dados reais dos alunos para o formato da tabela
  const dadosTabela: DataTableRow[] = alunos.length > 0 ? alunos.map(aluno => ({
    id: aluno.id,
    header: aluno.nome,           // Nome para coluna "Nome" + avatar
    email: aluno.email,          // Email para mostrar abaixo do nome
    type: "Plano Padrão",        // Descrição fixa para coluna "Plano" 
    status: aluno.situacao ? "Done" : "Pending", // true="Ativo", false="Inativo"
    target: "12/12/2025",        // Data fixa para coluna "Vencimento"
    limit: "N/A",                // Campo não usado
    reviewer: "Sistema"          // Campo não usado
  })) : []


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="space-y-6">
                  <div>
                    <p className="text-muted-foreground">
                      Gerencie os alunos do sistema
                    </p>
                    {erro && (
                      <p className="text-red-500 text-sm mt-2">
                        ❌ Erro: {erro} (usando dados de exemplo)
                      </p>
                    )}
                    {alunos.length > 0 && erro && (
                      <p className="text-yellow-600 text-sm mt-2">
                        ⚠️ {alunos.length} alunos de exemplo (API indisponível)
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <DataTable 
                data={dadosTabela} 
                onAlunoExcluido={recarregarAlunos}
                carregandoExterno={carregando}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 