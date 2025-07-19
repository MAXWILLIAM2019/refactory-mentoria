# 🗄️ ESTRUTURA DO BANCO DE DADOS - Sistema de Mentoria

> **📋 Documentação Completa**: DDL de todas as tabelas do PostgreSQL organizadas por funcionalidade

## 📊 Visão Geral da Arquitetura

O banco segue o padrão **Templates → Instâncias**:
- **Templates (Mestre)**: Modelos reutilizáveis criados por administradores
- **Instâncias**: Dados personalizados gerados para cada aluno

---

## 🔐 SISTEMA DE USUÁRIOS E AUTENTICAÇÃO

### 👤 Tabela: `grupo_usuario`
```sql
CREATE TABLE public.grupo_usuario (
	idgrupo serial4 NOT NULL,
	nome varchar(50) NOT NULL,
	descricao varchar(255) NULL,
	CONSTRAINT grupo_usuario_nome_key UNIQUE (nome),
	CONSTRAINT grupo_usuario_pkey PRIMARY KEY (idgrupo)
);
```
**Função**: Define os perfis de acesso (aluno, administrador)

### 👥 Tabela: `usuario`
```sql
CREATE TABLE public.usuario (
	idusuario serial4 NOT NULL,
	login varchar(50) NOT NULL,
	senha varchar(100) NULL,
	grupo int4 NOT NULL,
	situacao bool NOT NULL,
	ultimo_acesso timestamp NULL,
	data_senha_alterada timestamp NULL,
	data_senha_expirada timestamp NULL,
	login_secundario varchar(25) NULL,
	nome varchar(100) NULL,
	cpf varchar(14) NULL,
	CONSTRAINT usuario_cpf_key UNIQUE (cpf),
	CONSTRAINT usuario_login_key UNIQUE (login),
	CONSTRAINT usuario_pkey PRIMARY KEY (idusuario),
	CONSTRAINT usuario_grupo_fkey FOREIGN KEY (grupo) REFERENCES public.grupo_usuario(idgrupo)
);
```
**Função**: Tabela central de usuários (alunos e administradores)

### 🎓 Tabela: `aluno_info`
```sql
CREATE TABLE public.aluno_info (
	idalunoinfo serial4 NOT NULL,
	idusuario int4 NOT NULL,
	email varchar(120) NOT NULL,
	cpf varchar(14) NULL,
	data_nascimento date NULL,
	data_criacao timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	telefone varchar(20) NULL,
	status_cadastro public."enum_aluno_info_status_cadastro" DEFAULT 'PRE_CADASTRO'::enum_aluno_info_status_cadastro NOT NULL,
	status_pagamento public."enum_aluno_info_status_pagamento" DEFAULT 'PENDENTE'::enum_aluno_info_status_pagamento NOT NULL,
	cep varchar(9) NULL,
	asaas_external_reference varchar(100) NULL,
	CONSTRAINT aluno_info_idusuario_key UNIQUE (idusuario),
	CONSTRAINT aluno_info_pkey PRIMARY KEY (idalunoinfo),
	CONSTRAINT fk_aluno_usuario FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario) ON DELETE CASCADE
);
```
**Função**: Informações específicas dos alunos (extensão da tabela usuario)

### 👨‍💼 Tabela: `administrador_info`
```sql
CREATE TABLE public.administrador_info (
	idadmininfo serial4 NOT NULL,
	idusuario int4 NOT NULL,
	email varchar(120) NOT NULL,
	cpf varchar(14) NULL,
	data_nascimento date NULL,
	data_criacao timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT administrador_info_idusuario_key UNIQUE (idusuario),
	CONSTRAINT administrador_info_pkey PRIMARY KEY (idadmininfo),
	CONSTRAINT fk_admin_usuario FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario) ON DELETE CASCADE
);
```
**Função**: Informações específicas dos administradores

---

## 📚 SISTEMA DE DISCIPLINAS E ASSUNTOS

### 📖 Tabela: `Disciplinas`
```sql
CREATE TABLE public."Disciplinas" (
	id serial4 NOT NULL,
	nome varchar(255) NOT NULL,
	descricao text NULL,
	versao int4 DEFAULT 1 NOT NULL,
	ativa bool DEFAULT true NOT NULL,
	disciplina_origem_id int4 NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Disciplinas_pkey" PRIMARY KEY (id),
	CONSTRAINT "Disciplinas_disciplina_origem_id_fkey" FOREIGN KEY (disciplina_origem_id) REFERENCES public."Disciplinas"(id) ON DELETE SET NULL ON UPDATE CASCADE
);
```
**Função**: Gerencia disciplinas com sistema de versionamento

### 📝 Tabela: `Assuntos`
```sql
CREATE TABLE public."Assuntos" (
	id serial4 NOT NULL,
	nome varchar(255) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"disciplinaId" int4 NULL,
	CONSTRAINT "Assuntos_pkey" PRIMARY KEY (id),
	CONSTRAINT "Assuntos_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES public."Disciplinas"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```
**Função**: Assuntos específicos dentro de cada disciplina

---

## 🎯 TEMPLATES (MODELOS MESTRE)

### 📋 Tabela: `PlanosMestre`
```sql
CREATE TABLE public."PlanosMestre" (
	id serial4 NOT NULL,
	nome varchar(255) NOT NULL,
	cargo varchar(255) NOT NULL,
	descricao text NOT NULL,
	duracao int4 NOT NULL,
	versao varchar(10) DEFAULT '1.0'::character varying NOT NULL,
	ativo bool DEFAULT true NOT NULL,
	"createdAt" timestamptz DEFAULT now() NOT NULL,
	"updatedAt" timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT "PlanosMestre_pkey" PRIMARY KEY (id)
);
```
**Função**: Templates de planos de estudo reutilizáveis

### 🏃‍♂️ Tabela: `SprintsMestre`
```sql
CREATE TABLE public."SprintsMestre" (
	id serial4 NOT NULL,
	nome varchar(255) NOT NULL,
	posicao int4 DEFAULT 0 NOT NULL,
	descricao text NULL,
	"createdAt" timestamptz DEFAULT now() NOT NULL,
	"updatedAt" timestamptz DEFAULT now() NOT NULL,
	"PlanoMestreId" int4 NOT NULL,
	"dataInicio" date NULL,
	"dataFim" date NULL,
	status public."enum_SprintsMestre_status" DEFAULT 'Pendente'::"enum_SprintsMestre_status" NOT NULL,
	CONSTRAINT "SprintsMestre_pkey" PRIMARY KEY (id),
	CONSTRAINT plano_mestre_posicao_unique UNIQUE ("PlanoMestreId", posicao),
	CONSTRAINT "SprintsMestre_PlanoMestreId_fkey" FOREIGN KEY ("PlanoMestreId") REFERENCES public."PlanosMestre"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```
**Função**: Templates de sprints com ordenação (drag & drop)

### 🎯 Tabela: `MetasMestre`
```sql
CREATE TABLE public."MetasMestre" (
	id serial4 NOT NULL,
	disciplina varchar(255) NOT NULL,
	tipo public."enum_MetasMestre_tipo" NOT NULL,
	titulo varchar(255) NOT NULL,
	comandos varchar(255) NULL,
	link varchar(255) NULL,
	relevancia int4 NOT NULL,
	"createdAt" timestamptz DEFAULT now() NOT NULL,
	"updatedAt" timestamptz DEFAULT now() NOT NULL,
	"SprintMestreId" int4 NOT NULL,
	"tempoEstudado" varchar(255) DEFAULT '00:00'::character varying NULL,
	desempenho numeric(5, 2) DEFAULT 0 NULL,
	status public."enum_MetasMestre_status" DEFAULT 'Pendente'::"enum_MetasMestre_status" NOT NULL,
	"totalQuestoes" int4 DEFAULT 0 NULL,
	"questoesCorretas" int4 DEFAULT 0 NULL,
	posicao int4 DEFAULT 0 NOT NULL,
	CONSTRAINT "MetasMestre_pkey" PRIMARY KEY (id),
	CONSTRAINT "MetasMestre_relevancia_check" CHECK (((relevancia >= 1) AND (relevancia <= 5))),
	CONSTRAINT sprint_mestre_posicao_unique UNIQUE ("SprintMestreId", posicao),
	CONSTRAINT "MetasMestre_SprintMestreId_fkey" FOREIGN KEY ("SprintMestreId") REFERENCES public."SprintsMestre"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```
**Função**: Templates de metas com tipos (teoria, questões, revisão, reforço)

---

## 🎯 INSTÂNCIAS (DADOS DO ALUNO)

### 📋 Tabela: `Planos`
```sql
CREATE TABLE public."Planos" (
	id serial4 NOT NULL,
	nome varchar(255) NOT NULL,
	cargo varchar(255) NOT NULL,
	descricao text NOT NULL,
	duracao int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	plano_mestre_id int4 NULL,
	CONSTRAINT "Planos_pkey" PRIMARY KEY (id),
	CONSTRAINT "Planos_plano_mestre_fkey" FOREIGN KEY (plano_mestre_id) REFERENCES public."PlanosMestre"(id)
);
CREATE INDEX idx_planos_mestre ON public."Planos" USING btree (plano_mestre_id);
```
**Função**: Instâncias de planos personalizadas para alunos

### 🏃‍♂️ Tabela: `Sprints`
```sql
CREATE TABLE public."Sprints" (
	id serial4 NOT NULL,
	nome varchar(255) NOT NULL,
	"dataInicio" date NOT NULL,
	"dataFim" date NOT NULL,
	status public."enum_Sprints_status" DEFAULT 'Pendente'::"enum_Sprints_status" NOT NULL,
	posicao int4 DEFAULT 0 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"PlanoId" int4 NOT NULL,
	sprint_mestre_id int4 NULL,
	CONSTRAINT "Sprints_pkey" PRIMARY KEY (id),
	CONSTRAINT plano_posicao_unique UNIQUE ("PlanoId", posicao),
	CONSTRAINT "Sprints_PlanoId_fkey" FOREIGN KEY ("PlanoId") REFERENCES public."Planos"(id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "Sprints_sprint_mestre_fkey" FOREIGN KEY (sprint_mestre_id) REFERENCES public."SprintsMestre"(id)
);
CREATE INDEX idx_sprints_mestre ON public."Sprints" USING btree (sprint_mestre_id);
```
**Função**: Instâncias de sprints com datas reais calculadas

### 🎯 Tabela: `Meta`
```sql
CREATE TABLE public."Meta" (
	id serial4 NOT NULL,
	disciplina varchar(255) NOT NULL,
	tipo public."enum_Meta_tipo" NOT NULL,
	titulo varchar(255) NOT NULL,
	comandos varchar(255) NULL,
	link varchar(255) NULL,
	relevancia int4 NOT NULL,
	"tempoEstudado" varchar(255) DEFAULT '00:00'::character varying NULL,
	desempenho numeric(5, 2) DEFAULT 0 NULL,
	status public."enum_Meta_status" DEFAULT 'Pendente'::"enum_Meta_status" NULL,
	"totalQuestoes" int4 DEFAULT 0 NULL,
	"questoesCorretas" int4 DEFAULT 0 NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"SprintId" int4 NULL,
	meta_mestre_id int4 NULL,
	posicao int4 DEFAULT 0 NOT NULL,
	CONSTRAINT "Meta_pkey" PRIMARY KEY (id),
	CONSTRAINT sprint_posicao_unique UNIQUE ("SprintId", posicao),
	CONSTRAINT "Meta_SprintId_fkey" FOREIGN KEY ("SprintId") REFERENCES public."Sprints"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Meta_meta_mestre_fkey" FOREIGN KEY (meta_mestre_id) REFERENCES public."MetasMestre"(id)
);
CREATE INDEX idx_meta_mestre ON public."Meta" USING btree (meta_mestre_id);
```
**Função**: Instâncias de metas com progresso real do aluno

---

## 🔗 TABELAS DE ASSOCIAÇÃO

### 👨‍🎓 Tabela: `AlunoPlanos`
```sql
CREATE TABLE public."AlunoPlanos" (
	"dataInicio" timestamptz NOT NULL,
	"dataPrevisaoTermino" timestamptz NULL,
	"dataConclusao" timestamptz NULL,
	progresso int4 DEFAULT 0 NOT NULL,
	status public."enum_AlunoPlanos_status" DEFAULT 'não iniciado'::"enum_AlunoPlanos_status" NOT NULL,
	observacoes text NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	idusuario int4 NOT NULL,
	"PlanoId" int4 NOT NULL,
	ativo bool NULL,
	CONSTRAINT "AlunoPlanos_pkey" PRIMARY KEY (idusuario, "PlanoId"),
	CONSTRAINT "AlunoPlanos_PlanoId_fkey" FOREIGN KEY ("PlanoId") REFERENCES public."Planos"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "AlunoPlanos_idusuario_fkey" FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_aluno_planos_ativo ON public."AlunoPlanos" USING btree (ativo);
```
**Função**: Relaciona alunos com seus planos e acompanha progresso

### 📚 Tabela: `PlanoDisciplina`
```sql
CREATE TABLE public."PlanoDisciplina" (
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"PlanoId" int4 NOT NULL,
	"DisciplinaId" int4 NOT NULL,
	CONSTRAINT "PlanoDisciplina_pkey" PRIMARY KEY ("PlanoId", "DisciplinaId"),
	CONSTRAINT "PlanoDisciplina_DisciplinaId_fkey" FOREIGN KEY ("DisciplinaId") REFERENCES public."Disciplinas"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "PlanoDisciplina_PlanoId_fkey" FOREIGN KEY ("PlanoId") REFERENCES public."Planos"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```
**Função**: Relaciona planos com disciplinas (N:M)

---

## 🎯 CONTROLE DE SPRINT ATUAL

### 📊 Tabela: `SprintAtual`
```sql
CREATE TABLE public."SprintAtual" (
	id serial4 NOT NULL,
	idusuario int4 NOT NULL,
	"SprintId" int4 NOT NULL,
	"dataAtualizacao" timestamptz NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "SprintAtual_AlunoId_key" UNIQUE (idusuario),
	CONSTRAINT "SprintAtual_pkey" PRIMARY KEY (id),
	CONSTRAINT "SprintAtual_SprintId_fkey" FOREIGN KEY ("SprintId") REFERENCES public."Sprints"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "SprintAtual_idusuario_fkey" FOREIGN KEY (idusuario) REFERENCES public.usuario(idusuario) ON DELETE CASCADE ON UPDATE CASCADE
);
```
**Função**: Controla qual sprint o aluno está executando atualmente

---

## 📊 MAPEAMENTO COM CLASSES DO BACKEND

### 🔐 **Autenticação**
| Tabela | Classe Backend | Arquivo |
|--------|----------------|---------|
| `usuario` | `Usuario` | `/models/Usuario.js` |
| `grupo_usuario` | `GrupoUsuario` | `/models/GrupoUsuario.js` |
| `aluno_info` | `AlunoInfo` | `/models/AlunoInfo.js` |
| `administrador_info` | `AdministradorInfo` | `/models/AdministradorInfo.js` |

### 📚 **Disciplinas**
| Tabela | Classe Backend | Arquivo |
|--------|----------------|---------|
| `Disciplinas` | `Disciplina` | `/models/Disciplina.js` |
| `Assuntos` | `Assunto` | `/models/Assunto.js` |

### 🎯 **Templates (Mestre)**
| Tabela | Classe Backend | Arquivo |
|--------|----------------|---------|
| `PlanosMestre` | `PlanoMestre` | `/models/PlanoMestre.js` |
| `SprintsMestre` | `SprintMestre` | `/models/SprintMestre.js` |
| `MetasMestre` | `MetaMestre` | `/models/MetaMestre.js` |

### 🏃‍♂️ **Instâncias**
| Tabela | Classe Backend | Arquivo |
|--------|----------------|---------|
| `Planos` | `Plano` | `/models/Plano.js` |
| `Sprints` | `Sprint` | `/models/Sprint.js` |
| `Meta` | `Meta` | `/models/Meta.js` |

### 🔗 **Associações**
| Tabela | Classe Backend | Arquivo |
|--------|----------------|---------|
| `AlunoPlanos` | `AlunoPlano` | `/models/AlunoPlano.js` |
| `PlanoDisciplina` | - | Associação automática |
| `SprintAtual` | `SprintAtual` | `/models/SprintAtual.js` |

---

## ⚙️ ENUMS E TIPOS ESPECIAIS

### 📋 Status de Planos
```sql
enum_AlunoPlanos_status: 'não iniciado', 'em andamento', 'concluído', 'pausado'
```

### 🏃‍♂️ Status de Sprints
```sql
enum_Sprints_status: 'Pendente', 'Em Andamento', 'Concluída'
enum_SprintsMestre_status: 'Pendente', 'Em Andamento', 'Concluída'
```

### 🎯 Tipos de Metas
```sql
enum_Meta_tipo: 'teoria', 'questoes', 'revisao', 'reforco'
enum_MetasMestre_tipo: 'teoria', 'questoes', 'revisao', 'reforco'
```

### 🎯 Status de Metas
```sql
enum_Meta_status: 'Pendente', 'Em Andamento', 'Concluída'
enum_MetasMestre_status: 'Pendente', 'Em Andamento', 'Concluída'
```

### 👨‍🎓 Status de Cadastro/Pagamento
```sql
enum_aluno_info_status_cadastro: 'PRE_CADASTRO', 'CADASTRO_COMPLETO'
enum_aluno_info_status_pagamento: 'PENDENTE', 'APROVADO', 'CANCELADO'
```

---

## 🔍 CONSTRAINTS E ÍNDICES IMPORTANTES

### 🔑 **Chaves Únicas Compostas**
- `plano_mestre_posicao_unique`: (`PlanoMestreId`, `posicao`) - Ordenação de sprints mestre
- `plano_posicao_unique`: (`PlanoId`, `posicao`) - Ordenação de sprints instanciadas
- `sprint_mestre_posicao_unique`: (`SprintMestreId`, `posicao`) - Ordenação de metas mestre
- `sprint_posicao_unique`: (`SprintId`, `posicao`) - Ordenação de metas instanciadas

### 📊 **Índices de Performance**
- `idx_planos_mestre`: Relacionamento Planos → PlanosMestre
- `idx_sprints_mestre`: Relacionamento Sprints → SprintsMestre  
- `idx_meta_mestre`: Relacionamento Meta → MetasMestre
- `idx_aluno_planos_ativo`: Filtro por planos ativos

### ✅ **Validações de Negócio**
- `MetasMestre_relevancia_check`: Relevância entre 1 e 5
- Cascatas de exclusão configuradas para manter integridade
- Campos obrigatórios vs opcionais bem definidos

---

## 🚀 Fluxo de Instanciação Automática

### 1. **Admin cria Template**
```
PlanoMestre → SprintsMestre → MetasMestre
```

### 2. **Sistema gera Instâncias**
```
POST /api/planos-mestre/criar-instancia
↓
PlanoMestre → Plano (cópia)
SprintsMestre → Sprints (com datas calculadas)
MetasMestre → Meta (prontas para execução)
AlunoPlano (associação criada)
```

### 3. **Aluno executa**
```
Aluno acessa → AlunoPlano → Plano → Sprints → Metas
SprintAtual (controla progresso atual)
```

---

**📝 Última atualização**: `${new Date().toLocaleDateString('pt-BR')}`  
**🔄 Status**: Estrutura completa e validada com MVP funcional 