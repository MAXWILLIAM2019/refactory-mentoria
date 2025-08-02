import { Request, Response } from 'express';
import { z } from 'zod';
import { 
  realizarLoginUnificado, 
  buscarDadosUsuarioLogado, 
  verificarToken 
} from '../services/servicoAutenticacao';
import { DadosLogin, TipoGrupoUsuario } from '../types/autenticacao';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario';
import GrupoUsuario from '../models/GrupoUsuario';
import { logger } from '../utils/logger';

/**
 * Esquema de validação para dados de login
 */
const esquemaLogin = z.object({
  login: z.string()
    .min(3, 'Login deve ter pelo menos 3 caracteres')
    .max(50, 'Login deve ter no máximo 50 caracteres'),
  senha: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  grupo: z.enum(['aluno', 'administrador'])
    .optional()
});

/**
 * Interface para Request com dados do usuário autenticado
 */
export interface RequestAutenticado extends Request {
  usuario?: {
    idusuario: number;
    nomeGrupo: string;
    estaPersonificando?: boolean;
    idOriginal?: number;
    papelOriginal?: string;
    permissoes?: string[];
  };
}

/**
 * @desc Login unificado (funciona para alunos e administradores)
 * @route POST /api/auth/login
 * @access Público
 * 
 * Baseado na função loginUnificado do MVP mas adaptado para
 * trabalhar com as duas rotas separadas do projeto local
 */
export const fazerLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🚀 Iniciando processo de login');
    console.log('📋 Dados recebidos:', { 
      login: req.body.login, 
      grupo: req.body.grupo,
      origem: req.get('origin') || 'desconhecida'
    });

    // Validação dos dados de entrada
    const resultadoValidacao = esquemaLogin.safeParse(req.body);
    
    if (!resultadoValidacao.success) {
      const errosValidacao = resultadoValidacao.error.issues
        .map((erro: any) => erro.message)
        .join(', ');
      
      res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos: ' + errosValidacao
      });
      return;
    }

    const dadosLogin: DadosLogin = {
      login: resultadoValidacao.data.login,
      senha: resultadoValidacao.data.senha,
      grupo: resultadoValidacao.data.grupo as TipoGrupoUsuario
    };

    // Executa o login usando o serviço
    const resultado = await realizarLoginUnificado(dadosLogin);

    if (resultado.sucesso) {
      console.log('✅ Login realizado com sucesso');
      
      // Adiciona o grupo na resposta para compatibilidade com frontend
      const respostaCompleta = {
        ...resultado,
        grupo: resultado.usuario?.grupo?.nome || 'aluno'
      };
      
      res.status(200).json(respostaCompleta);
    } else {
      console.log('❌ Falha no login:', resultado.mensagem);
      res.status(401).json(resultado);
    }

  } catch (erro) {
    console.error('💥 Erro inesperado no login:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

/**
 * @desc Obtém dados do usuário logado
 * @route GET /api/auth/me
 * @access Privado (requer token JWT)
 * 
 * Baseado na função me do MVP
 */
export const obterDadosUsuario = async (req: RequestAutenticado, res: Response): Promise<void> => {
  try {
    console.log('🔍 Buscando dados do usuário logado');
    console.log('👤 Token decodificado:', req.usuario);

    if (!req.usuario) {
      res.status(401).json({
        sucesso: false,
        mensagem: 'Token não encontrado ou inválido'
      });
      return;
    }

    // Busca dados completos do usuário
    const dadosUsuario = await buscarDadosUsuarioLogado({
      idusuario: req.usuario.idusuario,
      login: '',
      grupo: 0,
      nomeGrupo: req.usuario.nomeGrupo,
      'sis-mentoria': {
        nome_papel: '',
        permissoes: []
      }
    });

    console.log('✅ Dados do usuário retornados com sucesso');

    res.json({
      sucesso: true,
      usuario: dadosUsuario,
      grupo: req.usuario.nomeGrupo,
      permissoes: req.usuario.permissoes || []
    });

  } catch (erro) {
    console.error('❌ Erro ao buscar dados do usuário:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar dados do usuário'
    });
  }
};

/**
 * @desc Valida um token JWT
 * @route POST /api/auth/validar
 * @access Público
 */
export const validarToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        sucesso: false,
        mensagem: 'Token é obrigatório'
      });
      return;
    }

    const resultado = verificarToken(token);

    if (resultado.valido) {
      res.json({
        sucesso: true,
        valido: true,
        usuario: resultado.usuario
      });
    } else {
      res.status(401).json({
        sucesso: false,
        valido: false,
        mensagem: resultado.erro
      });
    }

  } catch (erro) {
    console.error('❌ Erro ao validar token:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

/**
 * @desc Rota de teste para verificar se o módulo está funcionando
 * @route GET /api/auth/teste
 * @access Público
 */
export const testeAuth = async (req: Request, res: Response): Promise<void> => {
  res.json({
    sucesso: true,
    mensagem: 'Módulo de autenticação funcionando!',
    timestamp: new Date().toISOString(),
    versao: '1.0.0'
  });
}; 

/**
 * Cadastra um novo usuário (cadastro geral)
 * @route POST /auth/cadastrar
 * @access Public
 */
export const cadastrarUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, login, senha, grupo } = req.body;
    
    logger.auth('Tentativa de cadastro de usuário', { login, grupo });
    
    // Validação de campos obrigatórios
    if (!nome || !login || !senha || !grupo) {
      logger.warning('Tentativa de cadastro com campos faltantes', { campos: { nome, login, senha, grupo } });
      return res.status(400).json({ 
        success: false, 
        message: 'Preencha todos os campos obrigatórios.' 
      });
    }

    // Verifica se já existe usuário com o mesmo login
    const usuarioExistente = await Usuario.findOne({ where: { login } });
    if (usuarioExistente) {
      logger.warning('Tentativa de cadastro com login já existente', { login });
      return res.status(400).json({ 
        success: false, 
        message: 'Login já está em uso.' 
      });
    }

    // Busca o grupo na tabela grupo_usuario
    const grupoObj = await GrupoUsuario.findOne({ where: { nome: grupo } });
    if (!grupoObj) {
      logger.warning('Tentativa de cadastro com grupo inválido', { grupo });
      return res.status(400).json({ 
        success: false, 
        message: 'Grupo de usuário inválido.' 
      });
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Cria o usuário
    const novoUsuario = await Usuario.create({
      login,
      senha: senhaCriptografada,
      grupo: grupoObj.idgrupo,
      situacao: true,
      nome
    });

    // Cria info complementar (simplificado por enquanto)
    // TODO: Implementar AlunoInfo e AdministradorInfo quando os models estiverem prontos
    logger.auth('Usuário cadastrado com sucesso', { 
      id: novoUsuario.idusuario, 
      login, 
      grupo 
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Usuário cadastrado com sucesso!' 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    logger.error('Erro ao cadastrar usuário', { error: errorMessage });
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao cadastrar usuário.' 
    });
  }
};

/**
 * Cria um novo aluno (cadastro específico)
 * @route POST /api/alunos
 * @access Public/Admin
 */
export const criarAluno = async (req: Request, res: Response) => {
  try {
    const { nome, email, cpf, senha } = req.body;
    
    logger.auth('Tentativa de cadastro de aluno', { email });
    
    // Validação de campos obrigatórios
    if (!nome || !email || !cpf) {
      logger.warning('Tentativa de cadastro de aluno com campos faltantes', { 
        campos: { nome, email, cpf } 
      });
      return res.status(400).json({ 
        message: 'Preencha nome, email e CPF.' 
      });
    }

    // Verifica se já existe usuário com o mesmo email (login)
    const usuarioExistente = await Usuario.findOne({ where: { login: email } });
    if (usuarioExistente) {
      logger.warning('Tentativa de cadastro de aluno com email já existente', { email });
      return res.status(400).json({ 
        message: 'Já existe um usuário com este email.' 
      });
    }

    // Verifica se já existe usuário com o mesmo CPF
    const cpfExistente = await Usuario.findOne({ where: { cpf } });
    if (cpfExistente) {
      logger.warning('Tentativa de cadastro de aluno com CPF já existente', { cpf });
      return res.status(400).json({ 
        message: 'Já existe um usuário com este CPF.' 
      });
    }

    // Busca o grupo "aluno"
    const grupoObj = await GrupoUsuario.findOne({ where: { nome: 'aluno' } });
    if (!grupoObj) {
      logger.error('Grupo de usuário "aluno" não encontrado');
      return res.status(400).json({ 
        message: 'Grupo de usuário "aluno" não encontrado.' 
      });
    }

    // Criptografa a senha se enviada, senão deixa nulo
    let senhaCriptografada: string | undefined = undefined;
    if (senha) {
      senhaCriptografada = await bcrypt.hash(senha, 10);
    }

    // Cria o usuário
    const novoUsuario = await Usuario.create({
      login: email,
      senha: senhaCriptografada,
      grupo: grupoObj.idgrupo,
      situacao: true,
      nome: nome,
      cpf: cpf
    });

    // Monta resposta (sem senha)
    const usuarioSemSenha = novoUsuario.toJSON();
    delete usuarioSemSenha.senha;

    logger.auth('Aluno cadastrado com sucesso', { 
      id: novoUsuario.idusuario, 
      email 
    });

    res.status(201).json({ 
      success: true,
      message: 'Aluno cadastrado com sucesso!',
      usuario: usuarioSemSenha
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    logger.error('Erro ao cadastrar aluno', { error: errorMessage });
    
    // Verifica se é erro de constraint única
    if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Já existe um aluno cadastrado com este email ou CPF.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Erro ao cadastrar aluno', 
      error: errorMessage
    });
  }
}; 

/**
 * @desc Faz logout do usuário logado
 * @route POST /api/auth/logout
 * @access Privado (requer token JWT válido)
 */
export const fazerLogout = async (req: RequestAutenticado, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = req.usuario?.idusuario;
    const nomeUsuario = req.usuario?.nomeGrupo;
    
    logger.auth(`🚪 Logout iniciado - Usuário: ${userId}, Tipo: ${nomeUsuario}`);
    
    // TODO: Implementar blacklist de tokens (FASE 2)
    // await tokenBlacklist.adicionarTokenRevogado(token);
    
    // TODO: Desativar sessão no banco (FASE 3)
    // await db.sessions.update({ where: { userId, token }, data: { isActive: false } });
    
    logger.auth(`✅ Logout realizado com sucesso - Usuário: ${userId}`);
    
    res.json({
      sucesso: true,
      mensagem: 'Logout realizado com sucesso'
    });
    
  } catch (erro) {
    logger.error('❌ Erro durante logout:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
}; 