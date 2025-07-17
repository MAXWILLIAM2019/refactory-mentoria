# 🔄 CONTEXTO DE MIGRAÇÃO - MVP → PROJETO LOCAL

> **⚠️ ARQUIVO TEMPORÁRIO**: Este arquivo será deletado após concluir 100% da migração das funcionalidades

## 📋 Objetivo da Migração

Migrar **apenas funcionalidades e rotas** do MVP (sis-mentoria) para o projeto local (refactory-mentoria), mantendo:
- ✅ **Design system local** (ShadCN UI + TailwindCSS)
- ✅ **Stack local** (TypeScript + React 19 + Vite 7)
- ✅ **Arquitetura local** bem estruturada
- ❌ **NÃO migrar**: Estilos, componentes visuais, tecnologias do MVP

---

## 🇧🇷 Diretrizes de Desenvolvimento

### 📝 **Uso Obrigatório do Português**
- ✅ **Nomes de arquivos**: `autenticacaoService.ts`, `gerenciarPlanos.tsx`
- ✅ **Nomes de variáveis**: `usuarioLogado`, `listaPlanos`, `metasConcluidas`
- ✅ **Nomes de funções**: `validarCredenciais()`, `criarInstancia()`, `calcularProgresso()`
- ✅ **Nomes de componentes**: `FormularioLogin`, `TabelaPlanos`, `DashboardAluno`
- ✅ **Comentários e documentação**: Sempre em português
- ✅ **Mensagens de erro**: "Credenciais inválidas", "Erro ao salvar plano"
- ✅ **Logs de console**: `console.log('Usuário autenticado com sucesso')`

### 🚫 **Exceções Permitidas**
- Keywords da linguagem: `function`, `const`, `interface`, `type`
- Bibliotecas externas: `useState`, `useEffect`, `axios`
- Convenções estabelecidas: `props`, `key`, `children`
- Termos técnicos sem tradução adequada: `token`, `payload`, `middleware`

### 📋 **Exemplos Práticos**
```typescript
// ✅ CORRETO
interface DadosUsuario {
  id: number;
  nome: string;
  email: string;
  grupoAcesso: 'aluno' | 'administrador';
}

const autenticarUsuario = async (credenciais: CredenciaisLogin) => {
  const resposta = await api.post('/auth/login', credenciais);
  return resposta.data;
}

// ❌ EVITAR
interface UserData {
  id: number;
  name: string;
  email: string;
  userRole: 'student' | 'admin';
}

const authenticateUser = async (credentials: LoginCredentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}
```

---

## 📋 Convenções de Nomenclatura em Português
- **Arquivos**: `autenticacaoService.ts`, `formularioLogin.tsx`, `tabelaPlanos.tsx`
- **Variáveis**: `usuarioLogado`, `listaPlanos`, `metasConcluidas`
- **Funções**: `validarCredenciais()`, `criarInstancia()`, `buscarDados()`
- **Componentes**: `FormularioLogin`, `TabelaPlanos`, `CardMetrica`
- **Interfaces**: `IDadosUsuario`, `IConfiguracaoPlano`

## 🎨 Design System e Boas Práticas

### Design System Local (ShadCN UI)
- **SEMPRE** seguir o padrão de design system do projeto local
- **NUNCA** alterar o diretório `/components/ui/` dos componentes ShadCN configurados
- **SEMPRE** dar preferência aos componentes já prontos e configurados
- **REUTILIZAR** componentes existentes em `/components/ui/`:
  - Button, Card, Input, Table, Dialog, Sheet, etc.
- **MANTER** consistência visual com o tema e cores já estabelecidos
- **USAR** as variantes e props já configuradas nos componentes

### Boas Práticas de Programação
- **Clean Code**: Código limpo, legível e bem documentado
- **Princípios SOLID**:
  - Single Responsibility (responsabilidade única)
  - Open/Closed (aberto para extensão, fechado para modificação)
  - Liskov Substitution (substituição de Liskov)
  - Interface Segregation (segregação de interfaces)
  - Dependency Inversion (inversão de dependência)
- **DRY** (Don't Repeat Yourself): Evitar duplicação de código
- **KISS** (Keep It Simple, Stupid): Manter soluções simples
- **Separação de responsabilidades**: Cada arquivo/função com propósito único
- **Tipagem TypeScript forte**: Usar interfaces e tipos bem definidos
- **Componentização**: Criar componentes reutilizáveis e modulares
- **Error Handling**: Tratamento adequado de erros e estados de loading
- **Performance**: Otimizações como memoização quando necessário

### Estrutura de Componentes
```typescript
// Exemplo de estrutura ideal para componentes migrados
interface IPropsFormularioLogin {
  aoSubmeter: (dados: IDadosLogin) => Promise<void>;
  carregando?: boolean;
}

export function FormularioLogin({ aoSubmeter, carregando = false }: IPropsFormularioLogin) {
  // Usar hooks do projeto local
  // Usar componentes ShadCN existentes
  // Seguir padrões de validação já estabelecidos
}
```

## 🇧🇷 Diretrizes de Desenvolvimento - Sistema de Mentoria

### USO OBRIGATÓRIO DO PORTUGUÊS
- **Nomes de arquivos**: autenticacaoService.ts, gerenciarPlanos.tsx, formularioLogin.tsx
- **Nomes de variáveis**: usuarioLogado, listaPlanos, metasConcluidas, dadosFormulario
- **Nomes de funções**: validarCredenciais(), criarInstancia(), calcularProgresso(), buscarPlanos()
- **Nomes de componentes**: FormularioLogin, TabelaPlanos, DashboardAluno, ModalCadastro
- **Comentários e documentação**: SEMPRE em português
- **Mensagens de erro**: "Credenciais inválidas", "Erro ao salvar plano", "Dados obrigatórios"
- **Logs de console**: console.log('Usuário autenticado com sucesso')
- **Interfaces e tipos**: DadosUsuario, CredenciaisLogin, RespostaAPI

### EXCEÇÕES PERMITIDAS
- **Keywords da linguagem**: function, const, interface, type, useState, useEffect
- **Bibliotecas externas**: axios, useState, useRouter, props, key, children
- **Termos técnicos consolidados**: token, payload, middleware, endpoint

### EXEMPLOS CORRETOS
```typescript
// ✅ CORRETO
interface DadosUsuario {
  id: number;
  nome: string;
  email: string;
  grupoAcesso: 'aluno' | 'administrador';
}

const autenticarUsuario = async (credenciais: CredenciaisLogin) => {
  const resposta = await api.post('/auth/login', credenciais);
  console.log('Login realizado com sucesso');
  return resposta.data;
}

const FormularioLogin = () => {
  const [dadosFormulario, setDadosFormulario] = useState({});
  const [carregandoLogin, setCarregandoLogin] = useState(false);
  
  const handleSubmitFormulario = async () => {
    try {
      await autenticarUsuario(dadosFormulario);
    } catch (erro) {
      console.error('Erro na autenticação:', erro);
    }
  };
}
```

### ⚠️ ALERTAS CRÍTICOS
- **SEMPRE** verificar código fonte real vs documentação do MVP
- **Testar** endpoints antes de implementar
- **Mapear** estruturas reais de dados das APIs
- **Priorizar** implementação real vs documentação
- **Documentar** divergências encontradas entre README e código

### ✅ VERIFICAÇÕES OBRIGATÓRIAS
- Conferir rotas reais vs documentadas
- Validar estrutura de dados vs modelos backend
- Verificar nomes de campos nas APIs vs documentação
- Confirmar fluxos de autenticação implementados vs descritos
- Checar endpoints existentes vs listados no README

### 📁 PADRÕES DE NOMENCLATURA
- **Pastas/Diretórios**: Convenção padrão em inglês (controllers, models, services, routes)
- **Arquivos de serviço**: servicoNome.ts (ex: servicoAutenticacao.ts)
- **Componentes React**: NomeComponente.tsx (ex: FormularioLogin.tsx)
- **Hooks customizados**: useNomeFuncionalidade.ts (ex: useAutenticacao.ts)
- **Tipos/Interfaces**: TipoNome ou NomeInterface (ex: DadosUsuario, CredenciaisLogin)
- **Funções utilitárias**: nomeAcao() (ex: validarEmail(), formatarData())
- **Constantes**: NOME_CONSTANTE (ex: URL_BASE_API, TIMEOUT_REQUEST)

### 🔄 MIGRAÇÃO MVP
- **NÃO** migrar estilos, componentes visuais ou tecnologias do MVP
- **Migrar APENAS** funcionalidades e lógica de negócio
- **Adaptar** para TypeScript + ShadCN UI + TailwindCSss
- **Manter** arquitetura local bem estruturada
- **Converter**: 
  - authService → servicoAutenticacao
  - impersonation → personificacao
  - AdminRoute → RotaAdministrativa
  - AlunoRoute → RotaAluno

---

## 📋 Convenções de Nomenclatura em Português
- **Arquivos**: `autenticacaoService.ts`, `formularioLogin.tsx`, `tabelaPlanos.tsx`
- **Variáveis**: `usuarioLogado`, `listaPlanos`, `metasConcluidas`
- **Funções**: `validarCredenciais()`, `criarInstancia()`, `buscarDados()`
- **Componentes**: `FormularioLogin`, `TabelaPlanos`, `CardMetrica`
- **Interfaces**: `IDadosUsuario`, `IConfiguracaoPlano`

## 🎨 Design System e Boas Práticas

### Design System Local (ShadCN UI)
- **SEMPRE** seguir o padrão de design system do projeto local
- **NUNCA** alterar o diretório `/components/ui/` dos componentes ShadCN configurados
- **SEMPRE** dar preferência aos componentes já prontos e configurados
- **REUTILIZAR** componentes existentes em `/components/ui/`:
  - Button, Card, Input, Table, Dialog, Sheet, etc.
- **MANTER** consistência visual com o tema e cores já estabelecidos
- **USAR** as variantes e props já configuradas nos componentes

### Boas Práticas de Programação
- **Clean Code**: Código limpo, legível e bem documentado
- **Princípios SOLID**:
  - Single Responsibility (responsabilidade única)
  - Open/Closed (aberto para extensão, fechado para modificação)
  - Liskov Substitution (substituição de Liskov)
  - Interface Segregation (segregação de interfaces)
  - Dependency Inversion (inversão de dependência)
- **DRY** (Don't Repeat Yourself): Evitar duplicação de código
- **KISS** (Keep It Simple, Stupid): Manter soluções simples
- **Separação de responsabilidades**: Cada arquivo/função com propósito único
- **Tipagem TypeScript forte**: Usar interfaces e tipos bem definidos
- **Componentização**: Criar componentes reutilizáveis e modulares
- **Error Handling**: Tratamento adequado de erros e estados de loading
- **Performance**: Otimizações como memoização quando necessário

### Estrutura de Componentes
```typescript
// Exemplo de estrutura ideal para componentes migrados
interface IPropsFormularioLogin {
  aoSubmeter: (dados: IDadosLogin) => Promise<void>;
  carregando?: boolean;
}

export function FormularioLogin({ aoSubmeter, carregando = false }: IPropsFormularioLogin) {
  // Usar hooks do projeto local
  // Usar componentes ShadCN existentes
  // Seguir padrões de validação já estabelecidos
}
```

---

## ⚠️ Alertas de Inconsistência

### 📚 **Documentação vs Código Real**
> **ATENÇÃO**: Nem tudo no README.md do MVP está 100% alinhado com o código implementado

#### 🔍 **Verificações Obrigatórias**
- [ ] **Conferir rotas reais** vs documentadas no arquivo de rotas
- [ ] **Validar estrutura de dados** vs modelos no backend
- [ ] **Verificar nomes de campos** nas APIs vs documentação
- [ ] **Confirmar fluxos de autenticação** implementados vs descritos
- [ ] **Checar endpoints** existentes vs listados no README

#### 📋 **Estratégia de Validação**
1. **Sempre consultar o código fonte** como fonte da verdade
2. **Testar endpoints** antes de implementar no local
3. **Mapear estruturas reais** de dados das APIs
4. **Documentar divergências** encontradas
5. **Priorizar implementação real** vs documentação

### 🐛 **Possíveis Inconsistências Identificadas**
- [ ] Nomes de rotas podem diferir entre documentação e implementação
- [ ] Estrutura de dados pode ter campos adicionais/diferentes
- [ ] Fluxos de autenticação podem ter validações extras
- [ ] Status codes e mensagens de erro podem variar
- [ ] Parâmetros de APIs podem ter nomes diferentes

---

## 🔐 Diferenças de Autenticação

### 📊 **MVP (Remoto)**
```javascript
// UM login único com seletor
{
  login: 'usuario',
  senha: 'senha123', 
  grupo: 'aluno|administrador'  // Select no formulário
}
// Redireciona após login baseado no grupo selecionado
```

### 🏠 **Projeto Local (Atual)**
```typescript
// DOIS logins separados
/login      → Login do aluno (sem seletor)
/loginAdm   → Login administrativo (com seletor de perfil?)
```

### 🎯 **Estratégia de Adaptação**
1. **Manter dois logins separados** (decisão do projeto local)
2. **Adaptar lógica de autenticação** para funcionar com ambos
3. **Implementar validação de perfil** em cada tela
4. **Preservar sistema de personificação** (impersonation)

---

## 🗺️ Mapeamento de Rotas

### 📈 **Rotas do MVP para Migrar**

#### **🔧 Administrativas**
```javascript
// MVP → Local (verificar implementação real)
/dashboard              → /dashboard ✅ (já existe)
/planos                 → /planos (listar planos)
/planos/cadastrar       → /planos/cadastrar
/planos/editar/:id      → /planos/editar/:id
/planos/:id/sprints     → /planos/:id/sprints
/sprints/cadastrar/:planoId → /sprints/cadastrar/:planoId
/sprints                → /sprints (listar sprints)
/sprints/editar/:id     → /sprints/editar/:id
/alunos/cadastrar       → /alunos/cadastrar
/disciplinas            → /disciplinas
/disciplinas/cadastrar  → /disciplinas/cadastrar
/acompanhar-sprints     → /acompanhar-sprints
```

#### **👨‍🎓 Do Aluno**
```javascript
// MVP → Local (verificar implementação real)
/aluno/dashboard        → /aluno/dashboard
/aluno/sprints          → /aluno/sprints
/aluno/estatisticas     → /aluno/estatisticas
/aluno/perfil           → /aluno/perfil
```

#### **🔒 Proteção de Rotas**
```typescript
// Implementar no projeto local
RotaAdministrativa    → Protege rotas administrativas
RotaAluno            → Protege rotas do aluno  
RotaPrivada          → Qualquer usuário autenticado
```

---

## 🧩 Funcionalidades para Migrar

### 🔑 **Sistema de Autenticação**
- [ ] **ServicoAutenticacao**: Migrar para TypeScript
- [ ] **Gerenciamento JWT**: Token, refresh, validação
- [ ] **Personificação**: Admin → Aluno (impersonation)
- [ ] **Armazenamento Local**: Gerenciamento de sessão
- [ ] **Guardas de Rota**: Proteção por perfil

### 📊 **Gestão de Planos** 
- [ ] **CRUD Planos Mestre**: Criar, Ler, Atualizar, Deletar
- [ ] **Listagem**: Grid com filtros e busca
- [ ] **Formulários**: Cadastro e edição
- [ ] **Validações**: Regras de negócio

### 🏃‍♂️ **Gestão de Sprints**
- [ ] **CRUD Sprints Mestre**: Vinculadas aos planos
- [ ] **Ordenação**: Arrastar e soltar sprints
- [ ] **Metadados**: Datas, status, descrições

### 🎯 **Gestão de Metas**
- [ ] **CRUD Metas Mestre**: Por sprint
- [ ] **Tipos**: teoria, questões, revisão, reforço
- [ ] **Relevância**: Sistema de priorização (1-5)
- [ ] **Acompanhamento**: Tempo estudado, desempenho

### 👥 **Gestão de Alunos**
- [ ] **Cadastro**: Informações completas
- [ ] **Associação**: Aluno → Plano Mestre
- [ ] **Instanciação**: Criação automática de instâncias
- [ ] **Acompanhamento**: Progresso individual

### 📚 **Gestão de Disciplinas**
- [ ] **CRUD Disciplinas**: Categorização de conteúdo
- [ ] **Associação**: Disciplina → Metas

### 📈 **Dashboard e Relatórios**
- [ ] **Dashboard Admin**: Visão geral do sistema
- [ ] **Dashboard Aluno**: Progresso pessoal
- [ ] **Estatísticas**: Gráficos e métricas
- [ ] **Acompanhamento**: Sprints em andamento

---

## 🔌 APIs para Integrar

### 🔐 **Autenticação**
```typescript
POST /auth/login          // Login unificado
POST /auth/register       // Registro
GET  /auth/validate       // Validar token
GET  /auth/me            // Dados do usuário
POST /auth/impersonate/:id // Personificação
```

### 📊 **Planos Mestre**
```typescript
GET    /planos            // Listar templates
POST   /planos            // Criar template  
GET    /planos/:id        // Buscar específico
PUT    /planos/:id        // Atualizar template
DELETE /planos/:id        // Excluir template
```

### 🏃‍♂️ **Sprints Mestre**
```typescript
GET    /sprints           // Listar templates
POST   /sprints           // Criar template
GET    /sprints/:id       // Buscar específico  
PUT    /sprints/:id       // Atualizar template
DELETE /sprints/:id       // Excluir template
PUT    /sprints/reordenar // Reordenar sprints
```

### 🎯 **Metas Mestre**
```typescript
PUT /sprints/metas/:id    // Atualizar meta específica
```

### 🏭 **Instanciação Automática**
```typescript
POST /planos-mestre/criar-instancia
{
  planoMestreId: number,
  idUsuario: number, 
  dataInicio: string,
  status: string,
  observacoes?: string
}
```

---

## 🎨 Adaptações de UI/UX

### 📋 **Componentes ShadCN a Usar**
```typescript
// Formulários
- Form, Input, Label, Select, Textarea, Checkbox
- Button, Card, Badge
- Dialog, Sheet, Drawer

// Navegação  
- Breadcrumb, Tabs, Sidebar
- Navigation Menu

// Dados
- Table, DataTable, Pagination
- Chart (Recharts integration)

// Feedback
- Toast (Sonner), Alert, Skeleton
- Progress, Spinner
```

### 🎭 **Adaptações Necessárias**
- [ ] **Formulários**: Converter para React Hook Form + Zod
- [ ] **Tabelas**: Usar TanStack Table com ShadCN
- [ ] **Gráficos**: Manter Recharts mas adaptar tema
- [ ] **Modais**: Substituir por Dialog/Sheet do ShadCN
- [ ] **Arrastar e Soltar**: Manter @dnd-kit mas adaptar estilos

---

## 📝 Lista de Verificação da Migração

### 🔄 **Ordem de Implementação**
1. [ ] **Fase 1**: Sistema de autenticação base
2. [ ] **Fase 2**: Proteção de rotas  
3. [ ] **Fase 3**: CRUD Planos Mestre
4. [ ] **Fase 4**: CRUD Sprints Mestre
5. [ ] **Fase 5**: CRUD Metas Mestre  
6. [ ] **Fase 6**: Gestão de Alunos
7. [ ] **Fase 7**: Sistema de instanciação
8. [ ] **Fase 8**: Dashboards e relatórios
9. [ ] **Fase 9**: Funcionalidades avançadas (personificação)
10. [ ] **Fase 10**: Testes e validação final

### ✅ **Critérios de Conclusão**
- [ ] Todas as funcionalidades do MVP migradas
- [ ] Testes funcionais passando
- [ ] Interface adaptada ao design system local
- [ ] Performance otimizada
- [ ] Documentação atualizada
- [ ] **Deletar este arquivo** 🗑️

---

## 🚀 Status Atual

**Iniciando Fase 1**: Sistema de autenticação base
**Próximo passo**: Implementar ServicoAutenticacao em TypeScript

---

*Arquivo criado em: ${new Date().toLocaleDateString('pt-BR')}*
*Última atualização: ${new Date().toLocaleDateString('pt-BR')}* 