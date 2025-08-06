import { useState, useEffect } from 'react'
import servicoAlunos, { type DadosAluno } from '@/services/servicoAlunos'

// Estados do hook
interface EstadoAlunos {
  alunos: DadosAluno[]
  carregando: boolean
  erro: string | null
}

// Hook customizado para gerenciar dados dos alunos
export function useAlunos() {
  const [estado, setEstado] = useState<EstadoAlunos>({
    alunos: [],
    carregando: true,
    erro: null
  })

  /**
   * Busca alunos do servidor
   */
  const buscarAlunos = async () => {
    try {
      setEstado(prev => ({ ...prev, carregando: true, erro: null }))
      
      console.log('🔄 Iniciando busca de alunos...')
      const alunos = await servicoAlunos.listarAlunos()
      
      console.log('✅ Alunos carregados:', alunos.length)
      setEstado({
        alunos,
        carregando: false,
        erro: null
      })

    } catch (erro) {
      console.error('❌ Erro ao buscar alunos:', erro)
      
      const mensagemErro = erro instanceof Error 
        ? erro.message 
        : 'Erro ao carregar alunos'
      
      setEstado({
        alunos: [],
        carregando: false,
        erro: mensagemErro
      })
    }
  }

  /**
   * Atualiza dados de um aluno
   */
  const atualizarAluno = async (id: number, dados: Partial<DadosAluno>) => {
    try {
      const sucesso = await servicoAlunos.atualizarAluno(id, dados)
      
      if (sucesso) {
        // Recarrega lista após atualização
        await buscarAlunos()
        return true
      }
      
      return false
    } catch (erro) {
      console.error('❌ Erro ao atualizar aluno:', erro)
      return false
    }
  }

  /**
   * Altera situação de um aluno (ativo/inativo)
   */
  const alterarSituacaoAluno = async (id: number, ativo: boolean) => {
    try {
      const sucesso = await servicoAlunos.alterarSituacaoAluno(id, ativo)
      
      if (sucesso) {
        // Recarrega lista após alteração
        await buscarAlunos()
        return true
      }
      
      return false
    } catch (erro) {
      console.error('❌ Erro ao alterar situação do aluno:', erro)
      return false
    }
  }

  /**
   * Busca aluno específico por ID
   */
  const buscarAlunoPorId = async (id: number) => {
    try {
      return await servicoAlunos.buscarAlunoPorId(id)
    } catch (erro) {
      console.error('❌ Erro ao buscar aluno por ID:', erro)
      return null
    }
  }

  /**
   * Filtra alunos por situação (ativo/inativo)
   */
  const filtrarAlunosPorSituacao = (apenasAtivos: boolean) => {
    if (apenasAtivos) {
      return estado.alunos.filter(aluno => aluno.situacao === true)
    }
    return estado.alunos
  }

  /**
   * Busca alunos por nome ou email
   */
  const buscarAlunosPorTermo = (termo: string) => {
    if (!termo.trim()) return estado.alunos
    
    const termoLower = termo.toLowerCase()
    return estado.alunos.filter(aluno => 
      aluno.nome.toLowerCase().includes(termoLower) ||
      aluno.email.toLowerCase().includes(termoLower)
    )
  }

  // Carrega alunos automaticamente ao montar o hook
  useEffect(() => {
    console.log('🚀 useAlunos: Iniciando busca de alunos...')
    buscarAlunos()
  }, [])

  return {
    // Estados
    alunos: estado.alunos,
    carregando: estado.carregando,
    erro: estado.erro,
    
    // Ações
    buscarAlunos,
    atualizarAluno,
    alterarSituacaoAluno,
    buscarAlunoPorId,
    filtrarAlunosPorSituacao,
    buscarAlunosPorTermo
  }
} 