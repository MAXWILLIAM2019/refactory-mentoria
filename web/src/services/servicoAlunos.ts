import axios from 'axios'

// Interfaces baseadas na estrutura do banco
export interface DadosAluno {
  id: number // MVP usa 'id' em vez de 'idusuario'
  nome: string
  email: string // MVP usa 'login' como email
  grupo: string // MVP retorna string 'aluno'
  situacao: boolean
}

export interface RespostaAPI {
  sucesso: boolean
  mensagem?: string
  dados?: DadosAluno[]
  erro?: string
}

// Configuração da API baseada no MVP
const API_BASE_URL = 'http://localhost:3001/api'

// Classe principal do serviço de alunos
class ServicoAlunos {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  constructor() {
    // Adiciona interceptor para incluir token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Adiciona interceptor para tratamento de erros de autenticação
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('❌ Token inválido ou expirado');
          // TODO: Implementar logout automático se necessário
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Lista todos os alunos do sistema
   * Endpoint: GET /api/auth/alunos (conforme MVP)
   */
  async listarAlunos(): Promise<DadosAluno[]> {
    try {
      console.log('🔍 Buscando alunos no banco de dados...')
      
      // Debug: Verificar se há token
      const token = localStorage.getItem('token');
      console.log('🔑 Token encontrado:', token ? 'SIM' : 'NÃO');
      if (token) {
        console.log('🔑 Token (primeiros 20 chars):', token.substring(0, 20) + '...');
      }
      
      // Endpoint correto do MVP
      const resposta = await this.api.get<RespostaAPI>('/auth/alunos')

      console.log('📡 Resposta da API:', resposta.data)
      console.log('📡 Status da resposta:', resposta.status)
      console.log('📡 Headers da resposta:', resposta.headers)

      if (resposta.data.sucesso && resposta.data.dados) {
        const alunos = resposta.data.dados.map(this.mapearDadosAluno)
        console.log('✅ Alunos carregados com sucesso:', alunos.length)
        console.log('📋 Primeiro aluno:', alunos[0])
        return alunos
      } else {
        console.error('❌ API retornou erro:', resposta.data)
        throw new Error(resposta.data.mensagem || 'Erro ao buscar alunos')
      }

    } catch (erro) {
      console.error('❌ Erro ao listar alunos:', erro)
      
      // Debug: Verificar tipo de erro
      if (erro instanceof Error && 'response' in erro) {
        const axiosError = erro as any;
        console.error('❌ Status do erro:', axiosError.response?.status);
        console.error('❌ Dados do erro:', axiosError.response?.data);
      }
      
      // Em caso de erro, retornar dados de exemplo para desenvolvimento
      console.warn('⚠️ Retornando dados de exemplo devido ao erro na API')
      return this.dadosExemplo()
    }
  }

  /**
   * Mapeia dados do banco para formato da interface
   * Seguindo exatamente o padrão da tabela usuario
   */
  private mapearDadosAluno(dados: any): DadosAluno {
    return {
      id: dados.id || dados.idusuario, // Banco usa 'idusuario'
      nome: dados.nome || 'Nome não informado',
      email: dados.login || dados.email || 'Email não informado', // Banco usa 'login' como email
      grupo: dados.grupo || 'aluno', // Banco retorna string do grupo
      situacao: dados.situacao === true || dados.situacao === 'true' // Banco usa boolean
    }
  }

  /**
   * Dados de exemplo para desenvolvimento
   * Usado quando API não está disponível
   * Seguindo formato do MVP
   */
  private dadosExemplo(): DadosAluno[] {
    return [
      {
        id: 1,
        nome: 'Ana Silva',
        email: 'ana.silva@email.com',
        grupo: 'aluno',
        situacao: true
      },
      {
        id: 2,
        nome: 'Carlos Santos',
        email: 'carlos.santos@email.com',
        grupo: 'aluno',
        situacao: true
      },
      {
        id: 3,
        nome: 'Beatriz Costa',
        email: 'beatriz.costa@email.com',
        grupo: 'aluno',
        situacao: false
      },
      {
        id: 4,
        nome: 'João Pereira',
        email: 'joao.pereira@email.com',
        grupo: 'aluno',
        situacao: true
      },
      {
        id: 5,
        nome: 'Mariana Lima',
        email: 'mariana.lima@email.com',
        grupo: 'aluno',
        situacao: false
      }
    ]
  }

  /**
   * Busca aluno específico por ID
   * Endpoint: GET /api/auth/usuarios/:id
   */
  async buscarAlunoPorId(id: number): Promise<DadosAluno | null> {
    try {
      const resposta = await this.api.get<RespostaAPI>(`/auth/usuarios/${id}`)
      
      if (resposta.data.sucesso && resposta.data.dados && resposta.data.dados.length > 0) {
        return this.mapearDadosAluno(resposta.data.dados[0])
      }
      
      return null
    } catch (erro) {
      console.error('❌ Erro ao buscar aluno por ID:', erro)
      return null
    }
  }

  /**
   * Atualiza dados de um aluno
   * Endpoint: PUT /api/auth/usuarios/:id
   */
  async atualizarAluno(id: number, dados: Partial<DadosAluno>): Promise<boolean> {
    try {
      const resposta = await this.api.put<RespostaAPI>(`/auth/usuarios/${id}`, dados)
      return resposta.data.sucesso || false
    } catch (erro) {
      console.error('❌ Erro ao atualizar aluno:', erro)
      return false
    }
  }

  /**
   * Ativa/desativa um aluno
   * Endpoint: PATCH /api/auth/usuarios/:id/situacao
   */
  async alterarSituacaoAluno(id: number, ativo: boolean): Promise<boolean> {
    try {
      const resposta = await this.api.patch<RespostaAPI>(`/auth/usuarios/${id}/situacao`, {
        situacao: ativo
      })
      return resposta.data.sucesso || false
    } catch (erro) {
      console.error('❌ Erro ao alterar situação do aluno:', erro)
      return false
    }
  }
}

// Instância única do serviço (Singleton)
const servicoAlunos = new ServicoAlunos()

export default servicoAlunos 