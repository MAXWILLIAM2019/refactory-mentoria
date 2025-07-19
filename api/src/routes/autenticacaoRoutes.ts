import { Router } from 'express';
import { 
  fazerLogin, 
  obterDadosUsuario, 
  validarToken, 
  testeAuth,
  cadastrarUsuario,
  criarAluno
} from '../controllers/autenticacaoController';
import { 
  autenticacao, 
  apenasAdministrador 
} from '../middleware/autenticacaoMiddleware';

/**
 * Rotas de autenticação
 * Baseado no authRoutes.js do MVP mas adaptado para TypeScript
 * e nomenclatura em português
 */
const router = Router();

/**
 * Middleware de log para todas as rotas de autenticação
 */
router.use((req, res, next) => {
  console.log(`🔄 Rota de autenticação acessada: ${req.method} ${req.originalUrl}`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  next();
});

/**
 * @route GET /api/auth/teste
 * @desc Rota de teste para verificar se o módulo está funcionando
 * @access Público
 */
router.get('/teste', testeAuth);

/**
 * @route POST /api/auth/login
 * @desc Login unificado para alunos e administradores
 * @access Público
 */
router.post('/login', fazerLogin);

/**
 * @route POST /api/auth/cadastrarUsuario
 * @desc Cadastra um novo usuário (cadastro geral)
 * @access Público
 */
router.post('/cadastrarUsuario', cadastrarUsuario);

/**
 * @route POST /api/auth/validar
 * @desc Valida se um token JWT é válido
 * @access Público
 */
router.post('/validar', validarToken);

/**
 * @route GET /api/auth/me
 * @desc Obtém dados do usuário logado
 * @access Privado (requer token JWT válido)
 */
router.get('/me', autenticacao, obterDadosUsuario);

export default router; 