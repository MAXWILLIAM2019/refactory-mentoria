# ⚙️ CONFIGURAÇÃO INICIAL - API Backend

> **🎯 FASE 1.1 CONCLUÍDA**: Configuração do Banco + Models Base

## 📋 Estrutura Implementada

### ✅ **Arquivos Criados:**
```
api/src/
├── config/
│   └── bancoDados.ts          # Configuração Sequelize + PostgreSQL
├── models/
│   ├── Usuario.ts             # Model de usuários
│   ├── GrupoUsuario.ts        # Model de grupos/perfis
│   └── index.ts               # Exportação centralizada + relacionamentos
├── types/
│   └── autenticacao.ts        # Interfaces TypeScript
└── scripts/
    └── testarConexao.ts       # Script de teste da conexão
```

### ✅ **Scripts Adicionados:**
```json
{
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "test:conexao": "ts-node src/scripts/testarConexao.ts"
}
```

---

## 🔧 Configuração Necessária

### **1. Variáveis de Ambiente (.env)**
Crie um arquivo `.env` na raiz da pasta `api/` com:

```env
# 🚀 Servidor
PORT=3000
NODE_ENV=development

# 🔐 JWT
JWT_SECRET=sua_chave_secreta_jwt_super_segura_aqui
TOKEN_EXPIRATION=24h

# 🗄️ Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mentoria_sistema
DB_USER=postgres
DB_PASS=sua_senha_postgres

# 🔐 Criptografia
BCRYPT_ROUNDS=12
```

### **2. Banco PostgreSQL**
```sql
-- Criar banco de dados
CREATE DATABASE mentoria_sistema;

-- Dar permissões ao usuário
GRANT ALL PRIVILEGES ON DATABASE mentoria_sistema TO postgres;
```

---

## 🧪 Teste da Configuração

### **1. Instalar Dependências**
```bash
cd api
npm install
```

### **2. Testar Conexão**
```bash
npm run test:conexao
```

**Saída esperada:**
```
🚀 Iniciando teste de conexão...

📡 Testando conexão com PostgreSQL...
✅ Conexão com PostgreSQL estabelecida com sucesso!

📊 Verificando modelos registrados...
✅ 2 modelos encontrados: GrupoUsuario, Usuario

🔄 Sincronizando modelos com banco...
✅ Modelos sincronizados com o banco de dados!

🔍 Testando consulta simples...
📈 Estatísticas do banco:
   - Usuários: 0
   - Grupos: 0

✅ Teste concluído com sucesso!
🎉 Configuração do banco está funcionando corretamente.

🔌 Conexão com banco fechada.
```

---

## 🎯 Models Implementados

### **👤 GrupoUsuario**
- **Função**: Define perfis de acesso (aluno, administrador)
- **Campos**: idgrupo, nome, descricao
- **Validações**: Nome obrigatório, único

### **👥 Usuario**
- **Função**: Tabela central de usuários
- **Campos**: idusuario, nome, cpf, login, senha, grupo, situacao, etc.
- **Relacionamentos**: N:1 com GrupoUsuario
- **Validações**: Login/CPF únicos, validação de formato

---

## 🔗 Relacionamentos Configurados

```typescript
// Usuario N:1 GrupoUsuario
Usuario.belongsTo(GrupoUsuario, { 
  foreignKey: 'grupo', 
  as: 'grupoUsuario' 
});

GrupoUsuario.hasMany(Usuario, { 
  foreignKey: 'grupo', 
  as: 'usuarios' 
});
```

---

## 📚 Tipos TypeScript

### **Interfaces Principais:**
- `AtributosUsuario` - Estrutura do usuário
- `AtributosGrupoUsuario` - Estrutura do grupo
- `DadosLogin` - Dados de autenticação
- `RespostaAutenticacao` - Resposta da API
- `PayloadJWT` - Conteúdo do token

---

## 🚀 Próximos Passos

### **✅ FASE 1.1 CONCLUÍDA:**
- [x] Configuração do Sequelize + PostgreSQL
- [x] Models Usuario e GrupoUsuario 
- [x] Relacionamentos configurados
- [x] Tipos TypeScript definidos
- [x] Script de teste funcional

### **🔄 PRÓXIMA FASE 1.2:**
- [ ] Sistema de Disciplinas (CRUD simples)
- [ ] Models Disciplina e Assunto
- [ ] Sistema de versionamento

### **📋 Para Testar:**
1. Configure as variáveis de ambiente
2. Execute `npm run test:conexao`
3. Verifique se não há erros
4. Confirme que as tabelas foram criadas no PostgreSQL

---

**🎉 Base estrutural pronta! Sistema preparado para receber próximas funcionalidades.** 