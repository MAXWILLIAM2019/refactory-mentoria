/**
 * Serviço de Autenticação
 * 
 * Este módulo gerencia todas as operações relacionadas à autenticação,
 * incluindo login, validação de token e gerenciamento de sessão.
 * 
 * Baseado no authService.js do MVP mas adaptado para TypeScript
 * e nomenclatura em português.
 */

import axios from 'axios';

// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';

// Chaves do localStorage
const CHAVES_STORAGE = {
  TOKEN: 'token',
  PAPEL_USUARIO: 'papelUsuario',
  DADOS_USUARIO: 'dadosUsuario'
};

// Interface para dados de login
interface DadosLogin {
  login: string;
  senha: string;
  grupo?: 'aluno' | 'administrador';
}

// Interface para resposta de autenticação
interface RespostaAutenticacao {
  sucesso: boolean;
  mensagem?: string;
  token?: string;
  usuario?: any;
  grupo?: string;
}

// Interface para dados do usuário
interface DadosUsuario {
  idusuario: number;
  login: string;
  nome: string;
  grupo: string;
  permissoes?: string[];
}

/**
 * Configuração do Axios para comunicação com a API
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor para adicionar token de autenticação
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CHAVES_STORAGE.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para tratamento de erros de autenticação
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido - fazer logout
      servicoAutenticacao.fazerLogout();
    }
    return Promise.reject(error);
  }
);

/**
 * Serviço de autenticação
 */
const servicoAutenticacao = {
  /**
   * Realiza login no sistema
   * @param dadosLogin - Credenciais do usuário
   * @returns Promise com dados da autenticação
   */
  async fazerLogin(dadosLogin: DadosLogin): Promise<RespostaAutenticacao> {
    try {
      console.log('🔐 Iniciando processo de login:', {
        login: dadosLogin.login,
        grupo: dadosLogin.grupo
      });

      const resposta = await api.post('/auth/login', dadosLogin);
      
      if (resposta.data.sucesso && resposta.data.token) {
        // Armazena dados da sessão
        this.armazenarToken(resposta.data.token);
        
        // Corrige o acesso ao grupo (pode ser string ou objeto)
        const grupoUsuario = typeof resposta.data.grupo === 'string' 
          ? resposta.data.grupo 
          : resposta.data.grupo?.nome || 'aluno';
        
        console.log('🏷️ Grupo do usuário detectado:', {
          grupoOriginal: resposta.data.grupo,
          grupoProcessado: grupoUsuario,
          tipo: typeof resposta.data.grupo,
          respostaCompleta: resposta.data
        });
        
        this.armazenarPapelUsuario(grupoUsuario);
        this.armazenarDadosUsuario(resposta.data.usuario);
        
        console.log('✅ Login realizado com sucesso');
        return resposta.data;
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (erro: any) {
      console.error('❌ Erro no login:', erro);
      
      if (erro.response?.data?.mensagem) {
        throw new Error(erro.response.data.mensagem);
      } else if (erro.response?.status === 401) {
        throw new Error('Credenciais inválidas');
      } else {
        throw new Error('Erro ao conectar com o servidor');
      }
    }
  },

  /**
   * Cadastra um novo usuário
   * @param dadosCadastro - Dados para cadastro
   * @returns Promise com resultado do cadastro
   */
  async cadastrarUsuario(dadosCadastro: {
    nome: string;
    login: string;
    senha: string;
    grupo: 'aluno' | 'administrador';
  }): Promise<RespostaAutenticacao> {
    try {
      console.log('📝 Iniciando cadastro de usuário');
      
      const resposta = await api.post('/auth/cadastrarUsuario', dadosCadastro);
      console.log('📨 Resposta bruta da API:', resposta.data);
      
      // Normaliza a resposta para o formato esperado
      const respostaNormalizada = {
        sucesso: resposta.data.success || resposta.data.sucesso || false,
        mensagem: resposta.data.message || resposta.data.mensagem || 'Cadastro realizado com sucesso',
        token: resposta.data.token,
        usuario: resposta.data.usuario,
        grupo: resposta.data.grupo
      };
      
      console.log('✅ Usuário cadastrado com sucesso');
      console.log('📋 Resposta normalizada:', respostaNormalizada);
      return respostaNormalizada;
    } catch (erro: any) {
      console.error('❌ Erro no cadastro:', erro);
      
      if (erro.response?.data?.mensagem) {
        throw new Error(erro.response.data.mensagem);
      } else if (erro.response?.data?.message) {
        throw new Error(erro.response.data.message);
      } else {
        throw new Error('Erro ao cadastrar usuário');
      }
    }
  },

  /**
   * Cadastra um novo aluno
   * @param dadosAluno - Dados do aluno
   * @returns Promise com resultado do cadastro
   */
  async cadastrarAluno(dadosAluno: {
    nome: string;
    email: string;
    cpf: string;
    senha?: string;
  }): Promise<RespostaAutenticacao> {
    try {
      console.log('👨‍🎓 Iniciando cadastro de aluno');
      
      const resposta = await api.post('/alunos', dadosAluno);
      
      console.log('✅ Aluno cadastrado com sucesso');
      return resposta.data;
    } catch (erro: any) {
      console.error('❌ Erro no cadastro de aluno:', erro);
      
      if (erro.response?.data?.mensagem) {
        throw new Error(erro.response.data.mensagem);
      } else {
        throw new Error('Erro ao cadastrar aluno');
      }
    }
  },

  /**
   * Valida se o usuário está autenticado
   * @returns true se autenticado, false caso contrário
   */
  estaAutenticado(): boolean {
    const token = localStorage.getItem(CHAVES_STORAGE.TOKEN);
    return !!token;
  },

  /**
   * Obtém o papel do usuário logado
   * @returns Papel do usuário ou null
   */
  obterPapelUsuario(): string | null {
    const papel = localStorage.getItem(CHAVES_STORAGE.PAPEL_USUARIO);
    console.log('📖 Obtendo papel do usuário:', {
      papel: papel,
      chave: CHAVES_STORAGE.PAPEL_USUARIO
    });
    return papel;
  },

  /**
   * Obtém os dados do usuário logado
   * @returns Dados do usuário ou null
   */
  obterDadosUsuario(): DadosUsuario | null {
    const dados = localStorage.getItem(CHAVES_STORAGE.DADOS_USUARIO);
    return dados ? JSON.parse(dados) : null;
  },

  /**
   * Valida o token no servidor
   * @returns Promise com resultado da validação
   */
  async validarToken(): Promise<boolean> {
    try {
      const resposta = await api.post('/auth/validar', {
        token: localStorage.getItem(CHAVES_STORAGE.TOKEN)
      });
      return resposta.data.valido;
    } catch (erro) {
      console.error('❌ Erro ao validar token:', erro);
      return false;
    }
  },

  /**
   * Obtém dados do usuário logado do servidor
   * @returns Promise com dados do usuário
   */
  async obterDadosUsuarioLogado(): Promise<DadosUsuario> {
    try {
      const resposta = await api.get('/auth/me');
      return resposta.data.usuario;
    } catch (erro) {
      console.error('❌ Erro ao obter dados do usuário:', erro);
      throw new Error('Erro ao obter dados do usuário');
    }
  },

  /**
   * Faz logout do sistema
   */
  fazerLogout(): void {
    console.log('🚪 Fazendo logout do sistema');
    
    // Obtém dados antes de limpar para logging
    const papelUsuario = this.obterPapelUsuario();
    const dadosUsuario = this.obterDadosUsuario();
    
    console.log('👤 Usuário sendo deslogado:', {
      papel: papelUsuario,
      nome: dadosUsuario?.nome,
      login: dadosUsuario?.login
    });
    
    // Limpa todos os dados de sessão
    localStorage.removeItem(CHAVES_STORAGE.TOKEN);
    localStorage.removeItem(CHAVES_STORAGE.PAPEL_USUARIO);
    localStorage.removeItem(CHAVES_STORAGE.DADOS_USUARIO);
    
    console.log('✅ Logout realizado com sucesso - dados limpos');
  },

  /**
   * Obtém o tipo de usuário logado (aluno ou administrador)
   * @returns 'aluno' | 'administrador' | null
   */
  obterTipoUsuario(): 'aluno' | 'administrador' | null {
    const papel = this.obterPapelUsuario();
    
    console.log('🔍 Verificando tipo de usuário:', {
      papelBruto: papel,
      tipo: typeof papel,
      localStorage: {
        token: localStorage.getItem('token'),
        papel: localStorage.getItem('papelUsuario'),
        dados: localStorage.getItem('dadosUsuario')
      }
    });
    
    if (!papel) {
      console.log('⚠️ Nenhum papel de usuário encontrado');
      return null;
    }
    
    // Normaliza o papel para garantir compatibilidade
    const papelNormalizado = papel.toLowerCase();
    
    console.log('🏷️ Papel normalizado:', papelNormalizado);
    
    if (papelNormalizado === 'aluno') {
      console.log('👨‍🎓 Tipo de usuário detectado: aluno');
      return 'aluno';
    } else if (papelNormalizado === 'administrador') {
      console.log('👨‍💼 Tipo de usuário detectado: administrador');
      return 'administrador';
    } else {
      console.log('⚠️ Papel de usuário desconhecido:', papel);
      return null;
    }
  },

  /**
   * Faz logout com redirecionamento baseado no tipo de usuário
   * @returns Promise com o tipo de usuário para redirecionamento
   */
  async fazerLogoutComRedirecionamento(): Promise<'aluno' | 'administrador' | null> {
    try {
      console.log('🚪 Iniciando logout com redirecionamento');
      
      // Obtém o tipo de usuário antes de fazer logout
      const tipoUsuario = this.obterTipoUsuario();
      
      // Faz o logout
      this.fazerLogout();
      
      console.log('✅ Logout realizado, tipo de usuário para redirecionamento:', tipoUsuario);
      
      return tipoUsuario;
    } catch (erro) {
      console.error('❌ Erro durante logout:', erro);
      // Mesmo com erro, limpa os dados
      this.fazerLogout();
      return null;
    }
  },

  /**
   * Faz logout seguro chamando backend e limpando localStorage
   * @returns Promise com o tipo de usuário para redirecionamento
   */
  async fazerLogoutSeguro(): Promise<'aluno' | 'administrador' | null> {
    try {
      console.log('🚪 Iniciando logout seguro');
      
      // Obtém o tipo de usuário antes de fazer logout
      const tipoUsuario = this.obterTipoUsuario();
      
      console.log('🔍 Tipo de usuário antes do logout:', tipoUsuario);
      
      // Chama backend para invalidar token
      try {
        await api.post('/auth/logout');
        console.log('✅ Backend notificado sobre logout');
      } catch (erroBackend) {
        console.warn('⚠️ Erro ao notificar backend, mas continua logout local:', erroBackend);
      }
      
      // Limpa localStorage (sempre executa)
      this.fazerLogout();
      
      console.log('✅ Logout seguro realizado, tipo de usuário para redirecionamento:', tipoUsuario);
      return tipoUsuario;
      
    } catch (erro) {
      console.error('❌ Erro durante logout seguro:', erro);
      // Mesmo com erro, limpa os dados
      this.fazerLogout();
      return null;
    }
  },

  /**
   * Armazena token de autenticação
   * @param token - Token JWT
   */
  armazenarToken(token: string): void {
    localStorage.setItem(CHAVES_STORAGE.TOKEN, token);
  },

  /**
   * Armazena papel do usuário
   * @param papel - Papel do usuário
   */
  armazenarPapelUsuario(papel: string): void {
    console.log('💾 Armazenando papel do usuário:', {
      papel: papel,
      chave: CHAVES_STORAGE.PAPEL_USUARIO
    });
    localStorage.setItem(CHAVES_STORAGE.PAPEL_USUARIO, papel);
  },

  /**
   * Armazena dados do usuário
   * @param dados - Dados do usuário
   */
  armazenarDadosUsuario(dados: any): void {
    localStorage.setItem(CHAVES_STORAGE.DADOS_USUARIO, JSON.stringify(dados));
  }
};

export default servicoAutenticacao; 