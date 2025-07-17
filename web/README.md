# Sistema de Mentoria - ShadCN UI

Um sistema moderno de mentoria construído com React, TypeScript e ShadCN UI, apresentando um dashboard elegante e responsivo com suporte a dark mode.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server ultra-rápido
- **TailwindCSS v4** - Framework CSS utility-first
- **React Router DOM** - Roteamento para React

### UI/UX
- **ShadCN UI** - Componentes reutilizáveis e acessíveis
- **Lucide React** - Ícones modernos e minimalistas
- **Recharts** - Biblioteca para gráficos e visualização de dados
- **Tema Claude** - Tema personalizado do TweakCN

### Funcionalidades
- ✅ Dashboard responsivo com sidebar colapsível
- ✅ Sistema de dark/light mode com persistência
- ✅ Gráficos interativos e métricas
- ✅ Tabela de dados com ordenação e filtros
- ✅ Design system consistente com ShadCN UI
- ✅ Navegação fluida entre páginas

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**

## 🛠️ Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd sistema-mentoria-shadcn
```

2. **Navegue para a pasta web:**
```bash
cd web
```

3. **Instale as dependências:**
```bash
npm install
```

4. **Configure o ShadCN UI (se necessário):**
```bash
# Inicializar ShadCN UI
npx shadcn@latest init

# Adicionar tema Claude
npx shadcn@latest add https://tweakcn.com/r/themes/claude.json
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:5173`

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

## 📱 Estrutura do Projeto

```
web/
├── src/
│   ├── app/
│   │   └── dashboard/          # Página do dashboard
│   ├── components/
│   │   ├── ui/                # Componentes ShadCN UI
│   │   ├── theme-provider.tsx # Provider do sistema de temas
│   │   ├── mode-toggle.tsx    # Toggle dark/light mode
│   │   └── site-header.tsx    # Header do site
│   ├── lib/                   # Utilitários e configurações
│   ├── data/                  # Dados mockados
│   └── main.tsx              # Ponto de entrada
├── public/                    # Arquivos estáticos
└── package.json
```

## 🎨 Sistema de Temas

O projeto utiliza o **Tema Claude** do TweakCN, oferecendo:

- **Modo Claro**: Interface limpa com tons suaves
- **Modo Escuro**: Tema escuro elegante para reduzir fadiga visual
- **Modo Sistema**: Segue automaticamente a preferência do sistema operacional
- **Persistência**: Salva a escolha do usuário no localStorage

### Alternando Temas

Use o botão de toggle no header para alternar entre:
- ☀️ Light Mode
- 🌙 Dark Mode  
- 💻 System Mode

## 📊 Dashboard Features

### Métricas
- Cards com indicadores de performance
- Gráficos interativos de área
- Visualização de tendências

### Tabela de Dados
- Ordenação por colunas
- Filtros de busca
- Paginação
- 68 itens de exemplo

### Sidebar
- Navegação colapsível
- Ícones intuitivos
- Design responsivo

## 🛡️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build para produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter ESLint

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ usando React, TypeScript e ShadCN UI**
