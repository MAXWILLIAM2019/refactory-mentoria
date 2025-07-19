import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../services/servicoAutenticacao';
import { RequestAutenticado } from '../controllers/autenticacaoController';

/**
 * Mapeamento de papéis para permissões
 * Baseado na estrutura do MVP
 */
const permissoesPorPapel = {
  administrador: ['administrador', 'read:all', 'write:all', 'impersonate:aluno'],
  aluno: ['aluno', 'read:own_profile', 'write:own_profile']
};

/**
 * Middleware principal de autenticação
 * Verifica se o usuário está autenticado através do token JWT
 * 
 * Baseado no middleware auth.js do MVP mas adaptado para TypeScript
 */
export const autenticacao = async (
  req: RequestAutenticado, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    console.log('🔐 Middleware de autenticação iniciado');
    console.log('🔄 Método da requisição:', req.method);
    console.log('🌐 URL da requisição:', req.originalUrl);

    // Extrai o token do header Authorization
    const cabecalhoAuth = req.header('Authorization');
    const token = cabecalhoAuth?.startsWith('Bearer ') 
      ? cabecalhoAuth.slice(7) 
      : cabecalhoAuth;

    if (!token) {
      res.status(401).json({
        sucesso: false,
        mensagem: 'Token de acesso não fornecido'
      });
      return;
    }

    // Verifica e decodifica o token
    const resultadoValidacao = verificarToken(token);

    if (!resultadoValidacao.valido) {
      res.status(401).json({
        sucesso: false,
        mensagem: resultadoValidacao.erro || 'Token inválido'
      });
      return;
    }

    const payload = resultadoValidacao.usuario!;

    // Monta informações do usuário
    const informacoesUsuario = {
      idusuario: payload.idusuario,
      nomeGrupo: payload.nomeGrupo,
      estaPersonificando: payload.estaPersonificando || false,
      idOriginal: payload['sis-mentoria'].personificando?.idOriginal,
      papelOriginal: payload['sis-mentoria'].personificando?.papelOriginal
    };

    // Define as permissões baseadas no papel
    const papelAtual = informacoesUsuario.estaPersonificando 
      ? informacoesUsuario.papelOriginal || 'aluno'
      : informacoesUsuario.nomeGrupo;

    const permissoes = permissoesPorPapel[papelAtual as keyof typeof permissoesPorPapel] || [];

    // Adiciona as informações ao request
    req.usuario = {
      ...informacoesUsuario,
      permissoes
    };

    // Log para debug
    console.log('👤 Usuário autenticado:', {
      idusuario: req.usuario.idusuario,
      grupo: req.usuario.nomeGrupo,
      permissoes,
      url: req.originalUrl,
      metodo: req.method,
      estaPersonificando: req.usuario.estaPersonificando
    });

    next();

  } catch (erro) {
    console.error('❌ Erro no middleware de autenticação:', erro);
    res.status(401).json({
      sucesso: false,
      mensagem: 'Token inválido ou expirado'
    });
  }
};

/**
 * Middleware para verificar se o usuário é administrador
 * Baseado no adminOnly do MVP
 */
export const apenasAdministrador = async (
  req: RequestAutenticado, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não autenticado'
      });
      return;
    }

    // Se estiver personificando, usa o papel original
    const papelAtual = req.usuario.estaPersonificando 
      ? req.usuario.papelOriginal 
      : req.usuario.nomeGrupo;

    if (papelAtual !== 'administrador') {
      res.status(403).json({
        sucesso: false,
        mensagem: 'Acesso permitido apenas para administradores'
      });
      return;
    }

    console.log('✅ Verificação de administrador aprovada');
    next();

  } catch (erro) {
    console.error('❌ Erro ao verificar permissão de administrador:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao verificar permissões'
    });
  }
};

/**
 * Middleware para verificar se o usuário é o dono do recurso ou um administrador
 * Baseado no ownProfileOrAdmin do MVP
 * 
 * @param nomeParametro - Nome do parâmetro que contém o ID do recurso
 */
export const proprietarioOuAdministrador = (nomeParametro: string) => {
  return async (
    req: RequestAutenticado, 
    res: Response, 
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.usuario) {
        res.status(401).json({
          sucesso: false,
          mensagem: 'Usuário não autenticado'
        });
        return;
      }

      const idRecurso = req.params[nomeParametro];
      const idUsuario = req.usuario.idusuario;
      const papelAtual = req.usuario.estaPersonificando 
        ? req.usuario.papelOriginal 
        : req.usuario.nomeGrupo;

      // Administrador tem acesso total ou se for o próprio usuário
      if (papelAtual === 'administrador' || idUsuario === parseInt(idRecurso)) {
        console.log('✅ Acesso autorizado:', { 
          usuario: idUsuario, 
          recurso: idRecurso, 
          papel: papelAtual 
        });
        return next();
      }

      res.status(403).json({
        sucesso: false,
        mensagem: 'Acesso não autorizado a este recurso'
      });

    } catch (erro) {
      console.error('❌ Erro ao verificar permissão de acesso:', erro);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao verificar permissões'
      });
    }
  };
};

/**
 * Middleware para verificar se o usuário é aluno
 */
export const apenasAluno = async (
  req: RequestAutenticado, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não autenticado'
      });
      return;
    }

    // Se estiver personificando, verifica o papel atual (aluno)
    const papelAtual = req.usuario.estaPersonificando 
      ? req.usuario.nomeGrupo  // Papel personificado
      : req.usuario.nomeGrupo; // Papel real

    if (papelAtual !== 'aluno') {
      res.status(403).json({
        sucesso: false,
        mensagem: 'Acesso permitido apenas para alunos'
      });
      return;
    }

    console.log('✅ Verificação de aluno aprovada');
    next();

  } catch (erro) {
    console.error('❌ Erro ao verificar permissão de aluno:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao verificar permissões'
    });
  }
}; 