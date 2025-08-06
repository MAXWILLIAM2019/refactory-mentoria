/**
 * Arquivo de índice para modelos
 * 
 * Este arquivo centraliza a exportação de todos os modelos
 * e estabelece os relacionamentos do sistema de mentoria.
 * 
 * FASE 1.1 - Implementação Base:
 * - Usuario: Tabela central de usuários
 * - GrupoUsuario: Perfis de acesso (aluno, administrador)
 * 
 * Baseado na estrutura do MVP mas adaptado para TypeScript
 * seguindo diretrizes de nomenclatura em português.
 */

// Importação dos models base
import Usuario from './Usuario';
import GrupoUsuario from './GrupoUsuario';
import AlunoInfo from './AlunoInfo';

/**
 * Configuração dos relacionamentos entre modelos
 */
console.log('🔗 Configurando relacionamentos entre modelos...');

// Relacionamento Usuario -> GrupoUsuario (N:1)
console.log('📎 Configurando relacionamento Usuario -> GrupoUsuario');
Usuario.belongsTo(GrupoUsuario, { 
  foreignKey: 'grupo', 
  as: 'grupoUsuario',
  onDelete: 'RESTRICT' // Não permite excluir grupo se há usuários vinculados
});

GrupoUsuario.hasMany(Usuario, { 
  foreignKey: 'grupo', 
  as: 'usuarios' 
});

// Relacionamento Usuario -> AlunoInfo (1:1)
console.log('📎 Configurando relacionamento Usuario -> AlunoInfo');
Usuario.hasOne(AlunoInfo, { 
  foreignKey: 'idusuario', 
  as: 'alunoInfo',
  onDelete: 'CASCADE' 
});

AlunoInfo.belongsTo(Usuario, { 
  foreignKey: 'idusuario', 
  as: 'usuario' 
});

console.log('✅ Relacionamentos configurados com sucesso!');

/**
 * Exportação centralizada dos modelos
 */
export {
  Usuario,
  GrupoUsuario,
  AlunoInfo
};

/**
 * Exportação default com todos os modelos
 */
export default {
  Usuario,
  GrupoUsuario,
  AlunoInfo
}; 