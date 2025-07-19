import { DataTypes, Model, Optional, Association, Op } from 'sequelize';
import sequelize from '../config/bancoDados';
import GrupoUsuario from './GrupoUsuario';

/**
 * Interface para atributos do Usuario
 */
export interface AtributosUsuario {
  idusuario: number;
  nome: string;
  cpf?: string;
  login: string;
  senha?: string;
  grupo: number;
  situacao: boolean;
  ultimo_acesso?: Date;
  data_senha_alterada?: Date;
  data_senha_expirada?: Date;
  login_secundario?: string;
}

/**
 * Interface para criação de Usuario (campos opcionais)
 */
interface AtributosCriacaoUsuario extends Optional<AtributosUsuario, 'idusuario'> {}

/**
 * Model Usuario - Tabela central de usuários do sistema
 * 
 * Baseado na estrutura do MVP:
 * - Suporta alunos e administradores
 * - Relaciona com grupo_usuario para controle de permissões
 * - Campos de auditoria (último acesso, datas de senha)
 */
class Usuario extends Model<AtributosUsuario, AtributosCriacaoUsuario> 
  implements AtributosUsuario {
  
  public idusuario!: number;
  public nome!: string;
  public cpf?: string;
  public login!: string;
  public senha?: string;
  public grupo!: number;
  public situacao!: boolean;
  public ultimo_acesso?: Date;
  public data_senha_alterada?: Date;
  public data_senha_expirada?: Date;
  public login_secundario?: string;

  // Timestamps automáticos (se habilitados)
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Associação com GrupoUsuario (carregada via include)
  public grupoUsuario?: GrupoUsuario;

  // Associações
  public static associations: {
    grupoUsuario: Association<Usuario, GrupoUsuario>;
  };
}

Usuario.init({
  idusuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idusuario'
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome é obrigatório'
      },
      len: {
        args: [2, 100],
        msg: 'Nome deve ter entre 2 e 100 caracteres'
      }
    }
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: true,
    unique: true,
    validate: {
      is: {
        args: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
        msg: 'CPF deve estar no formato 000.000.000-00 ou apenas números'
      }
    }
  },
  login: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Login é obrigatório'
      },
      len: {
        args: [3, 50],
        msg: 'Login deve ter entre 3 e 50 caracteres'
      }
    }
  },
  senha: {
    type: DataTypes.STRING(100),
    allowNull: true, // Pode ser null inicialmente
    validate: {
      len: {
        args: [6, 100],
        msg: 'Senha deve ter pelo menos 6 caracteres'
      }
    }
  },
  grupo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'grupo_usuario',
      key: 'idgrupo'
    },
    validate: {
      notNull: {
        msg: 'Grupo é obrigatório'
      }
    }
  },
  situacao: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    validate: {
      notNull: {
        msg: 'Situação é obrigatória'
      }
    }
  },
  ultimo_acesso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data_senha_alterada: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data_senha_expirada: {
    type: DataTypes.DATE,
    allowNull: true
  },
  login_secundario: {
    type: DataTypes.STRING(25),
    allowNull: true,
    validate: {
      len: {
        args: [0, 25],
        msg: 'Login secundário deve ter no máximo 25 caracteres'
      }
    }
  }
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'usuario',
  timestamps: false, // Segue padrão do MVP
  indexes: [
    {
      unique: true,
      fields: ['login']
    },
    {
      unique: true,
      fields: ['cpf'],
      where: {
        cpf: {
          [Op.ne]: null
        }
      }
    },
    {
      fields: ['grupo']
    },
    {
      fields: ['situacao']
    }
  ]
});

export default Usuario; 