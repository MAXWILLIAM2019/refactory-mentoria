# 🚀 Sistema de Mentoria - API Backend

Backend do sistema de mentoria construído com **Node.js + TypeScript + Express + Sequelize**, seguindo as diretrizes de desenvolvimento em português e princípios de código limpo.

## 🎯 Objetivo

API backend para migração das funcionalidades do MVP (sis-mentoria) mantendo:
- ✅ **Stack moderna**: TypeScript + Node.js + Express + PostgreSQL  
- ✅ **Código em português**: Variáveis, funções, comentários
- ✅ **Princípios SOLID**: Clean Code e boas práticas
- ✅ **Compatibilidade MVP**: Mesma estrutura de dados e endpoints

---

## 💻 Stack Tecnológica

### **🔧 Backend Core**
- **Node.js** - Runtime JavaScript/TypeScript
- **Express 5.1.0** - Framework web minimalista e rápido
- **TypeScript 5.8.3** - Superset JavaScript com tipagem estática

### **🗄️ Banco de Dados**
- **PostgreSQL** - Banco relacional robusto
- **Sequelize 6.37.7** - ORM para PostgreSQL
- **pg 8.16.3** - Driver PostgreSQL para Node.js

### **🔐 Segurança e Autenticação**
- **JWT (jsonwebtoken 9.0.2)** - Autenticação stateless
- **bcryptjs 3.0.2** - Criptografia de senhas
- **CORS 2.8.5** - Cross-Origin Resource Sharing

### **⚙️ Utilitários**
- **dotenv 17.2.0** - Gerenciamento de variáveis de ambiente
- **Zod 4.0.5** - Validação de dados moderna e tipada

### **🛠️ Desenvolvimento**
- **ts-node 10.9.2** - Executar TypeScript diretamente
- **nodemon 3.1.10** - Auto-restart durante desenvolvimento
- **@types/** - Tipagens TypeScript para todas as bibliotecas

---

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **PostgreSQL** (versão 12 ou superior)
- **npm** ou **yarn**

---

## 🛠️ Instalação

### **1. Clone e navegue para a pasta**
```bash
# Assumindo que você já está no projeto refactory-mentoria
cd api
```

### **2. Instalar dependências**
```bash
# Dependências já foram instaladas durante o setup
npm install
```

### **3. Configurar banco PostgreSQL**
```bash
# Criar banco de dados
createdb mentoria_sistema

# Ou via psql
psql -U postgres
CREATE DATABASE mentoria_sistema;
```

### **4. Configurar variáveis de ambiente**
```bash
# Criar arquivo .env na raiz da pasta api
cp .env.exemplo .env

# Editar configurações do banco
nano .env
```

---

## ⚙️ Configuração

### **Arquivo `.env` (a ser criado)**
```env
# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_jwt_super_segura_aqui

# Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mentoria_sistema
DB_USER=seu_usuario_postgres
DB_PASS=sua_senha_postgres

# Configurações adicionais
BCRYPT_ROUNDS=12
TOKEN_EXPIRATION=24h
```

---

## 🚀 Execução

### **Desenvolvimento**
```bash
# Iniciar servidor em modo desenvolvimento
npm run dev

# O servidor estará disponível em: http://localhost:3000
```

### **Produção**
```bash
# Build do TypeScript
npm run build

# Iniciar servidor de produção
npm start
```

---

## 📁 Estrutura de Pastas (Planejada)

```
api/
├── src/
│   ├── controllers/            # Controllers - arquivos em português
│   │   ├── autenticacaoController.ts
│   │   ├── planosController.ts
│   │   └── sprintsController.ts
│   ├── models/                 # Models Sequelize - arquivos em português  
│   │   ├── Usuario.ts
│   │   ├── PlanoMestre.ts
│   │   └── SprintMestre.ts
│   ├── services/               # Services/lógica de negócio - arquivos em português
│   │   ├── servicoAutenticacao.ts
│   │   └── servicoEmail.ts
│   ├── routes/                 # Routes - arquivos em português
│   │   ├── autenticacao.ts
│   │   └── planos.ts
│   ├── middlewares/            # Middlewares - arquivos em português
│   │   ├── autenticacaoMiddleware.ts
│   │   └── validacaoMiddleware.ts
│   ├── config/                 # Configurações - arquivos em português
│   │   ├── bancoDados.ts
│   │   └── servidor.ts
│   ├── utils/                  # Utilities - arquivos em português
│   │   ├── criptografia.ts
│   │   └── validadores.ts
│   ├── types/                  # Types/Interfaces TypeScript - arquivos em português
│   │   ├── autenticacao.ts
│   │   └── usuario.ts
│   └── servidor.ts             # Arquivo principal
├── dist/                       # Build TypeScript (gerado)
├── .env                        # Variáveis de ambiente (criar)
├── .env.exemplo               # Template das variáveis (a criar)
├── package.json               # ✅ Dependências configuradas
├── tsconfig.json              # ✅ Configuração TypeScript  
└── README.md                  # ✅ Esta documentação
```

---

## 📜 Scripts Disponíveis (a serem configurados)

```json
{
  "scripts": {
    "dev": "nodemon src/servidor.ts",
    "build": "tsc",
    "start": "node dist/servidor.js",
    "db:sync": "ts-node src/scripts/sincronizarBanco.ts",
    "db:seed": "ts-node src/scripts/popularBanco.ts"
  }
}
```

---

## 🎯 Diretrizes de Desenvolvimento

### **🇧🇷 Uso Obrigatório do Português**
- **Pastas/Diretórios**: Convenção padrão em inglês (controllers, models, services, routes)
- **Arquivos**: `autenticacaoController.ts`, `servicoAutenticacao.ts`
- **Variáveis**: `usuarioLogado`, `dadosFormulario`, `listaPlanos`
- **Funções**: `validarCredenciais()`, `criarInstancia()`, `calcularProgresso()`
- **Classes**: `GerenciadorMetas`, `ValidadorCredenciais`
- **Comentários**: Sempre em português
- **Logs**: `console.log('Usuário autenticado com sucesso')`

### **🏗️ Princípios SOLID**
- **S** - Single Responsibility: Cada classe/função com responsabilidade única
- **O** - Open/Closed: Aberto para extensão, fechado para modificação  
- **L** - Liskov Substitution: Substituição transparente de implementações
- **I** - Interface Segregation: Interfaces específicas e enxutas
- **D** - Dependency Inversion: Inversão de dependências

### **🧹 Clean Code**
- Nomes descritivos em português
- Funções pequenas e focadas
- Evitar duplicação (DRY)
- Comentários quando necessário
- Tratamento adequado de erros

---

## 🔌 Endpoints Planejados

### **🔐 Autenticação**
```typescript
POST /auth/login          // Login unificado
POST /auth/register       // Registro de usuário
GET  /auth/validate       // Validar token JWT
GET  /auth/me            // Dados do usuário logado
POST /auth/impersonate/:id // Personificação admin→aluno
```

### **📊 Planos Mestre**
```typescript
GET    /planos            // Listar templates de planos
POST   /planos            // Criar template de plano
GET    /planos/:id        // Buscar plano específico
PUT    /planos/:id        // Atualizar template
DELETE /planos/:id        // Excluir template
```

### **🏃‍♂️ Sprints e Metas**
```typescript
GET    /sprints           // Listar sprints de um plano
POST   /sprints           // Criar sprint
PUT    /sprints/:id       // Atualizar sprint
DELETE /sprints/:id       // Excluir sprint
PUT    /sprints/reordenar // Reordenar sprints (drag & drop)
```

---

## 🚧 Status Atual

### ✅ **Concluído**
- [x] Projeto Node.js inicializado
- [x] TypeScript configurado  
- [x] Dependências de produção instaladas
- [x] Dependências de desenvolvimento instaladas
- [x] Tipagens TypeScript completas
- [x] Documentação básica criada

### 🔄 **Próximas Etapas**
- [ ] Criar estrutura de pastas em português
- [ ] Configurar scripts no package.json
- [ ] Implementar configuração do banco de dados
- [ ] Criar modelos Sequelize base
- [ ] Implementar sistema de autenticação
- [ ] Criar endpoints básicos

---

## 🤝 Contribuindo

1. Siga as diretrizes de nomenclatura em português
2. Implemente testes para novas funcionalidades  
3. Documente mudanças significativas
4. Use princípios SOLID e Clean Code
5. Mantenha compatibilidade com o MVP

---

## 📄 Licença

Este projeto está licenciado sob a licença do sistema de mentoria principal.

---

**🎯 Para dúvidas ou suporte, consulte a documentação técnica ou entre em contato com a equipe de desenvolvimento.**

*Documentação criada em: ${new Date().toLocaleDateString('pt-BR')}* 