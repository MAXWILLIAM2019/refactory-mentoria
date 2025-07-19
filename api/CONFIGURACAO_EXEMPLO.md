# ⚙️ CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE

Para configurar a API, crie um arquivo `.env` na raiz do diretório `api/` com as seguintes variáveis:

```env
# 🔧 CONFIGURAÇÕES DO BANCO DE DADOS
DB_NAME=mentoria_sistema
DB_USER=postgres
DB_PASS=sua_senha_aqui
DB_HOST=localhost
DB_PORT=5432

# 🔐 CONFIGURAÇÕES DE AUTENTICAÇÃO
JWT_SECRET=sua_chave_secreta_super_segura_aqui_mude_em_producao
TOKEN_EXPIRATION=24h
BCRYPT_ROUNDS=12

# 🌐 CONFIGURAÇÕES DO SERVIDOR
PORT=3001
NODE_ENV=development

# 🎨 CONFIGURAÇÕES DO FRONTEND
FRONTEND_URL=http://localhost:3000
```

## 📋 Instruções de Setup

1. **Copie as configurações acima** para um arquivo `.env` no diretório `api/`
2. **Substitua os valores** pelos seus dados reais do PostgreSQL
3. **Configure uma chave JWT segura** (pelo menos 32 caracteres)
4. **Nunca** commite o arquivo `.env` (já está no `.gitignore`)

## 🔐 Segurança

- **JWT_SECRET**: Use uma chave forte e única para produção
- **DB_PASS**: Configure uma senha forte para o banco
- **BCRYPT_ROUNDS**: 12 é um bom valor para balancear segurança e performance

## 🚀 Teste da Configuração

Para testar se tudo está configurado corretamente:

```bash
npm run test:conexao
``` 