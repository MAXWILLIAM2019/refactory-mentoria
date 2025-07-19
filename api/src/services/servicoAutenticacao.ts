// import jwt from 'jsonwebtoken'; // TODO: Reabilitar quando implementarmos JWT completo
import bcrypt from 'bcryptjs';
import { Usuario, GrupoUsuario } from '../models';
import { 
  DadosLogin, 
  RespostaAutenticacao, 
  PayloadJWT, 
  DadosValidacaoToken,
  TipoGrupoUsuario 
} from '../types/autenticacao';
import sequelize from '../config/bancoDados';

/**
 * Configurações de autenticação
 * VERSÃO TEMPORÁRIA - Será expandida quando implementarmos JWT completo
 * Configurações centralizadas importadas de ./config/configuracao.ts
 */
import { AUTENTICACAO } from '../config/configuracao';

console.log('⚠️ [TEMPORÁRIO] Sistema de autenticação simplificado ativo. JWT completo será implementado com o frontend.');

/**
 * Obtém permissões baseadas no papel do usuário
 * @param papel - Papel do usuário no sistema
 * @returns Array de permissões
 */
const obterPermissoesPorPapel = (papel: string): string[] => {
  const permissoes = {
    administrador: [
      'read:all',
      'write:all', 
      'impersonate:aluno'
    ],
    aluno: [
      'read:own',
      'write:own'
    ]
  };
  return permissoes[papel as keyof typeof permissoes] || [];
};

/**
 * Gera token JWT para um usuário
 * Baseado na função gerarToken do MVP
 * 
 * @param dadosUsuario - Dados do usuário para o token
 * @param papel - Papel do usuário (aluno, administrador)
 * @param dadosPersonificacao - Dados de impersonation (opcional)
 * @returns Token JWT assinado
 */
export const gerarToken = (
  dadosUsuario: any, 
  papel: string, 
  dadosPersonificacao: any = null
): string => {
  // TODO: Implementação completa do JWT será feita quando conectarmos o frontend
  // Por enquanto, retornamos um token simples para testar o servidor
  
  console.log('🔑 [TEMPORÁRIO] Gerando token simples para:', {
    idusuario: dadosUsuario.idusuario,
    papel,
    personificando: !!dadosPersonificacao
  });

  // Token temporário simples (Base64 de JSON)
  const tokenData = {
    idusuario: dadosUsuario.idusuario || dadosUsuario.id,
    login: dadosUsuario.login,
    grupo: dadosUsuario.grupo || 0,
    nomeGrupo: papel,
    timestamp: Date.now()
  };

  return 'temp_' + Buffer.from(JSON.stringify(tokenData)).toString('base64');
};

/**
 * Verifica se um token é válido e retorna os dados do payload
 * 
 * @param token - Token JWT a ser verificado
 * @returns Dados de validação do token
 */
export const verificarToken = (token: string): DadosValidacaoToken => {
  try {
    // TODO: Implementação completa do JWT será feita quando conectarmos o frontend
    // Por enquanto, validamos o token simples
    
    if (!token.startsWith('temp_')) {
      throw new Error('Token inválido - formato não reconhecido');
    }

    const tokenBase64 = token.replace('temp_', '');
    const tokenDataString = Buffer.from(tokenBase64, 'base64').toString('utf-8');
    const tokenData = JSON.parse(tokenDataString);

    // Verifica se o token não é muito antigo (24 horas)
    const agora = Date.now();
    const tokenAge = agora - tokenData.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas

    if (tokenAge > maxAge) {
      throw new Error('Token expirado');
    }

    // Monta payload compatível
    const payload: PayloadJWT = {
      idusuario: tokenData.idusuario,
      login: tokenData.login,
      grupo: tokenData.grupo,
      nomeGrupo: tokenData.nomeGrupo,
      'sis-mentoria': {
        nome_papel: tokenData.nomeGrupo,
        permissoes: obterPermissoesPorPapel(tokenData.nomeGrupo)
      }
    };

    return {
      valido: true,
      usuario: payload
    };
  } catch (erro) {
    console.error('❌ [TEMPORÁRIO] Erro ao verificar token:', erro);
    return {
      valido: false,
      erro: 'Token inválido ou expirado'
    };
  }
};

/**
 * Realiza login unificado baseado na lógica do MVP
 * Suporta tanto login de alunos quanto administradores
 * 
 * @param dadosLogin - Credenciais do usuário
 * @returns Resposta de autenticação com token
 */
export const realizarLoginUnificado = async (
  dadosLogin: DadosLogin
): Promise<RespostaAutenticacao> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { login, senha, grupo } = dadosLogin;
    
    console.log('🔍 Tentativa de login:', { login, grupo });

    // Busca o usuário pelo login com dados relacionados
    const usuario = await Usuario.findOne({
      where: { 
        login, 
        situacao: true 
      },
      include: [
        { 
          model: GrupoUsuario, 
          as: 'grupoUsuario' 
        }
      ],
      transaction
    });

    console.log('👤 Usuário encontrado:', usuario ? {
      id: usuario.idusuario,
      login: usuario.login,
      grupo: usuario.grupoUsuario?.nome
    } : 'Não encontrado');

    if (!usuario) {
      throw new Error('Usuário ou senha inválidos');
    }

    // Verifica se a senha está correta
    if (!usuario.senha) {
      throw new Error('Usuário não possui senha definida');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    console.log('🔐 Senha válida:', senhaValida);

    if (!senhaValida) {
      throw new Error('Usuário ou senha inválidos');
    }

    // Verifica o grupo se fornecido (para compatibilidade com login duplo)
    const grupoUsuario = usuario.grupoUsuario?.nome;
    console.log('🏷️ Grupo do usuário:', grupoUsuario, 'Grupo informado:', grupo);

    if (grupo && grupoUsuario !== grupo) {
      throw new Error('Tipo de usuário incorreto');
    }

    // Atualiza último acesso
    await usuario.update(
      { ultimo_acesso: new Date() },
      { transaction }
    );

    // Gera o token JWT
    const token = gerarToken({
      idusuario: usuario.idusuario,
      login: usuario.login,
      grupo: usuario.grupo
    }, grupoUsuario || 'aluno');

    // Prepara dados do usuário sem senha
    const usuarioSemSenha = {
      idusuario: usuario.idusuario,
      nome: usuario.nome,
      login: usuario.login,
      cpf: usuario.cpf,
      situacao: usuario.situacao,
      ultimo_acesso: usuario.ultimo_acesso,
      grupoUsuario: usuario.grupoUsuario
    };

    await transaction.commit();

    console.log('✅ Login bem-sucedido para:', grupoUsuario);

    return {
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        idusuario: usuario.idusuario,
        nome: usuario.nome,
        login: usuario.login,
        grupo: {
          idgrupo: usuario.grupoUsuario?.idgrupo || 0,
          nome: usuario.grupoUsuario?.nome || 'desconhecido',
          descricao: usuario.grupoUsuario?.descricao || ''
        }
      }
    };

  } catch (erro) {
    await transaction.rollback();
    console.error('❌ Erro no login unificado:', erro);
    
    return {
      sucesso: false,
      mensagem: erro instanceof Error ? erro.message : 'Erro interno do servidor'
    };
  }
};

/**
 * Busca dados do usuário logado baseado no token
 * 
 * @param payloadToken - Dados decodificados do token JWT
 * @returns Dados completos do usuário
 */
export const buscarDadosUsuarioLogado = async (payloadToken: PayloadJWT) => {
  try {
    console.log('🔍 Buscando dados do usuário:', payloadToken.idusuario);

    const usuario = await Usuario.findOne({
      where: { 
        idusuario: payloadToken.idusuario,
        situacao: true 
      },
      include: [
        { 
          model: GrupoUsuario, 
          as: 'grupoUsuario' 
        }
      ]
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Retorna dados sem senha
    return {
      idusuario: usuario.idusuario,
      nome: usuario.nome,
      login: usuario.login,
      cpf: usuario.cpf,
      situacao: usuario.situacao,
      ultimo_acesso: usuario.ultimo_acesso,
      grupo: {
        idgrupo: usuario.grupoUsuario?.idgrupo || 0,
        nome: usuario.grupoUsuario?.nome || 'desconhecido',
        descricao: usuario.grupoUsuario?.descricao || ''
      }
    };

  } catch (erro) {
    console.error('❌ Erro ao buscar dados do usuário:', erro);
    throw erro;
  }
};

/**
 * Criptografa uma senha usando bcrypt
 * 
 * @param senhaTextoLimpo - Senha em texto limpo
 * @returns Senha criptografada
 */
export const criptografarSenha = async (senhaTextoLimpo: string): Promise<string> => {
  return bcrypt.hash(senhaTextoLimpo, AUTENTICACAO.bcrypt.saltRounds);
};

/**
 * Compara uma senha em texto limpo com uma senha criptografada
 * 
 * @param senhaTextoLimpo - Senha em texto limpo
 * @param senhaCriptografada - Senha criptografada
 * @returns true se as senhas coincidirem
 */
export const compararSenhas = async (
  senhaTextoLimpo: string, 
  senhaCriptografada: string
): Promise<boolean> => {
  return bcrypt.compare(senhaTextoLimpo, senhaCriptografada);
}; 