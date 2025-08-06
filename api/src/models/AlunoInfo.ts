import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/bancoDados';

interface AlunoInfoAttributes {
  idalunoinfo: number;
  idusuario: number;
  email: string;
  cpf?: string;
  data_nascimento?: Date;
  data_criacao?: Date;
  telefone?: string;
  status_cadastro: 'PRE_CADASTRO' | 'CADASTRO_COMPLETO';
  status_pagamento: 'PENDENTE' | 'APROVADO' | 'CANCELADO';
  cep?: string;
  asaas_external_reference?: string;
}

interface AlunoInfoCreationAttributes extends Optional<AlunoInfoAttributes, 'idalunoinfo' | 'cpf' | 'data_nascimento' | 'data_criacao' | 'telefone' | 'cep' | 'asaas_external_reference'> {}

class AlunoInfo extends Model<AlunoInfoAttributes, AlunoInfoCreationAttributes> implements AlunoInfoAttributes {
  public idalunoinfo!: number;
  public idusuario!: number;
  public email!: string;
  public cpf?: string;
  public data_nascimento?: Date;
  public data_criacao?: Date;
  public telefone?: string;
  public status_cadastro!: 'PRE_CADASTRO' | 'CADASTRO_COMPLETO';
  public status_pagamento!: 'PENDENTE' | 'APROVADO' | 'CANCELADO';
  public cep?: string;
  public asaas_external_reference?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AlunoInfo.init(
  {
    idalunoinfo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idusuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'usuario',
        key: 'idusuario'
      }
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: true,
    },
    data_nascimento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    status_cadastro: {
      type: DataTypes.ENUM('PRE_CADASTRO', 'CADASTRO_COMPLETO'),
      allowNull: false,
      defaultValue: 'PRE_CADASTRO',
    },
    status_pagamento: {
      type: DataTypes.ENUM('PENDENTE', 'APROVADO', 'CANCELADO'),
      allowNull: false,
      defaultValue: 'PENDENTE',
    },
    cep: {
      type: DataTypes.STRING(9),
      allowNull: true,
    },
    asaas_external_reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'AlunoInfo',
    tableName: 'aluno_info',
    timestamps: false, // A tabela não tem createdAt/updatedAt padrão
  }
);

export default AlunoInfo;