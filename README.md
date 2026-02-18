# Gerenciador de Tarefas (Task Manager)

Sistema completo para gerenciamento de tarefas, com funcionalidades de criação, edição, exclusão e reordenação, além de validação de duplicidade e destaque para tarefas de alto custo.

**[🚀 ACESSAR PROJETO ONLINE](https://sistema-tarefas-sage.vercel.app/)**  


## ✨ Funcionalidades

- **CRUD Completo:** Crie, Leia, Atualize e Delete tarefas.
- **Reordenação:** Altere a ordem de apresentação das tarefas (Botões).
- **Destaque de Custo:** Tarefas com custo ≥ R$ 1.000,00 são destacadas em amarelo.
- **Validação:** Impede o cadastro de tarefas com nomes duplicados.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React + Vite (Hospedado na Vercel)
- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL (Hospedado na Neon.tech)

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js instalado
- Docker (opcional, para rodar banco localmente) ou uma URL de banco Postgres externo.

### 1. Clone o repositório
\`\`\`bash
git clone https://github.com/cesaraugustt/sistema-tarefas.git
cd sistema-tarefas
\`\`\`

### 2. Configure as Variáveis de Ambiente
Crie um arquivo \`.env\` na pasta \`server\`:
\`\`\`env
# Exemplo para banco local ou Neon
DATABASE_URL=postgres://user:pass@host:5432/db_name
PORT=3001
\`\`\`

### 3. Instale as Dependências
Na raiz do projeto, execute:
\`\`\`bash
npm run install:all
\`\`\`
*(Isso instalará dependências da raiz, do server e do client)*

### 4. Inicie o Projeto
\`\`\`bash
npm start
\`\`\`
- O **Frontend** rodará em \`http://localhost:5173\`
- O **Backend** rodará em \`http://localhost:3001\`

## 📦 Deploy

O projeto está configurado para deploy automático na **Vercel** com banco de dados **Neon**.

1. **Vercel:** Conecte o repositório GitHub. O arquivo \`vercel.json\` cuidará da configuração de rotas e Serverless Functions.
2. **Neon:** Crie um banco Postgres e adicione a \`DATABASE_URL\` nas variáveis de ambiente da Vercel.

---
Desenvolvido por Cesar.
