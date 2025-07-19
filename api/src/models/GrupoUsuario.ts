import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/bancoDados';

/**
 * Interface para atributos do GrupoUsuario
 */
export interface AtributosGrupoUsuario {
  idgrupo: number;
  nome: string;
  descricao?: string;
}

/**
 * Interface para criação de GrupoUsuario (campos opcionais)
 */
interface AtributosCriacaoGrupoUsuario extends Optional<AtributosGrupoUsuario, 'idgrupo'> {}

/**
 * Model GrupoUsuario - Define os perfis de acesso do sistema
 * 
 * Baseado na estrutura do MVP:
 * - Perfis: 'aluno', 'administrador'
 * - Controla permissões de acesso às funcionalidades
 */
class GrupoUsuario extends Model<AtributosGrupoUsuario, AtributosCriacaoGrupoUsuario> 
  implements AtributosGrupoUsuario {
  
  public idgrupo!: number;
  public nome!: string;
  public descricao?: string;

  // Timestamps automáticos (se habilitados)
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

GrupoUsuario.init({
  idgrupo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idgrupo'
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Nome do grupo é obrigatório'
      },
      len: {
        args: [1, 50],
        msg: 'Nome deve ter entre 1 e 50 caracteres'
      }
    }
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'GrupoUsuario',
  tableName: 'grupo_usuario',
  timestamps: false, // Segue padrão do MVP
  indexes: [
    {
      unique: true,
      fields: ['nome']
    }
  ]
});

export default GrupoUsuario; 