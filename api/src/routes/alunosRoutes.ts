import { Router } from 'express';
import { criarAluno } from '../controllers/autenticacaoController';
import { 
  autenticacao, 
  apenasAdministrador 
} from '../middleware/autenticacaoMiddleware';

/**
 * Rotas de alunos
 * Gerenciamento específico de alunos
 */
const router = Router();

/**
 * Middleware de log para todas as rotas de alunos
 */
router.use((req, res, next) => {
  console.log(`👨‍🎓 Rota de alunos acessada: ${req.method} ${req.originalUrl}`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  next();
});

/**
 * @route POST /api/alunos
 * @desc Cria um novo aluno (cadastro específico)
 * @access Público/Admin
 */
router.post('/', criarAluno);

export default router; 