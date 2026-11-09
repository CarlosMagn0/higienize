# Higienize

Plataforma web para aproximar moradores e profissionais de limpeza, permitindo consultar diaristas, solicitar serviços, enviar candidaturas, trocar mensagens e avaliar atendimentos.

Desenvolvido como parte do Projeto Integrador do 6º período. Na Fase 02, os principais fluxos do frontend foram integrados à API REST do backend.

## Funcionalidades integradas

- Cadastro e login de moradores e diaristas.
- Autenticação por JSON Web Token (JWT) e controle de acesso por perfil.
- Consulta de diaristas verificadas e ativas, incluindo seus perfis.
- Criação e consulta de solicitações de serviço.
- Candidatura de diaristas e aceite de uma candidatura pelo morador responsável.
- Conclusão de serviços agendados.
- Envio e consulta de mensagens vinculadas a solicitações.
- Publicação de avaliações após a conclusão do serviço.
- Validações no backend para proteger os dados e aplicar as regras de negócio.

Nesta versão, cancelamento de solicitações, notificações e consulta geral da conta por `/api/me` não estão implementados.

## Arquitetura

O frontend é executado no navegador e envia requisições HTTP para a API. Durante o desenvolvimento local, a interface e o backend são executados separadamente. O backend habilita CORS para permitir essa comunicação.

```text
Frontend — HTML, CSS e JavaScript
          │
          │ HTTP, JSON e fetch
          ▼
API REST — Node.js e Express
          │
          │ better-sqlite3
          ▼
Banco de dados — SQLite
```

As rotas protegidas recebem um token JWT no cabeçalho `Authorization: Bearer`. O backend valida a autenticação, as permissões do usuário e as regras de negócio antes de consultar ou alterar os dados.

## Estrutura do repositório

```text
.
├── frontend/                  # Páginas, estilos, scripts e imagens
├── backend/
│   └── src/
│       ├── config/            # Configuração do banco de dados
│       ├── controllers/       # Controle das requisições
│       ├── middleware/        # Autenticação, autorização e erros
│       ├── repositories/      # Acesso e consultas aos dados
│       ├── routes/            # Rotas da API REST
│       ├── services/          # Regras de negócio
│       ├── seed.js            # Dados iniciais de demonstração
│       └── server.js          # Inicialização do servidor
├── docs/                      # Documento de especificação do projeto
└── README.md
```

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Frontend | HTML5, CSS3 e JavaScript ES6+ |
| Backend | Node.js e Express |
| Comunicação | API REST, HTTP, JSON e fetch |
| Banco de dados | SQLite e better-sqlite3 |
| Segurança | bcryptjs e JSON Web Token |
| Configuração e integração | dotenv e cors |
| Ferramentas | Visual Studio Code, Git, GitHub e Figma |

## Como executar

Pré-requisitos: Node.js instalado e dependências disponíveis.

No PowerShell, a partir da pasta raiz do projeto:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm start
```

Se necessário, edite `backend/.env` e substitua o valor de `JWT_SECRET` por uma chave própria para o ambiente local.

A API será iniciada em `http://localhost:3000`. O endpoint `GET /health` verifica se o servidor está disponível.

Para abrir a interface, execute `frontend/index.html` com uma extensão de servidor local, como o Live Server do Visual Studio Code. O frontend está configurado para chamar a API em `http://127.0.0.1:3000/api`.

## Endpoints principais

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/health` | Verifica a disponibilidade da API |
| POST | `/api/auth/register` | Cadastra morador ou diarista |
| POST | `/api/auth/login` | Autentica o usuário e retorna um JWT |
| GET | `/api/diaristas` | Consulta diaristas verificadas e ativas |
| GET | `/api/diaristas/:id` | Consulta o perfil de uma diarista |
| POST | `/api/solicitacoes` | Cria uma solicitação de serviço |
| GET | `/api/solicitacoes` | Consulta solicitações conforme o perfil e as permissões |
| POST | `/api/solicitacoes/:id/candidaturas` | Registra uma candidatura |
| PATCH | `/api/solicitacoes/:id/candidaturas/:applicationId/aceitar` | Aceita uma candidatura |
| PATCH | `/api/solicitacoes/:id/concluir` | Registra a conclusão do serviço |
| GET / POST | `/api/solicitacoes/:id/mensagens` | Consulta ou envia mensagens da solicitação |
| POST | `/api/solicitacoes/:id/avaliacoes` | Registra uma avaliação após a conclusão |

As rotas protegidas exigem o token JWT no cabeçalho `Authorization: Bearer`.

## Dados de demonstração

Quando o banco de dados está vazio, a inicialização cria contas de demonstração:

- Moradora: `laura@higienize.local`
- Diarista: `marcia@higienize.local`
- Senha: `Higienize@123`

O seed cria essas contas somente quando ainda não há usuários no banco.

## Documentação

O documento de especificação do projeto está na pasta `docs/`. 

## Equipe

- Arthur Firmino Martins — Gerente de Projeto e Documentação
- Carlos Magno da Silva — Desenvolvimento Backend e Banco de Dados
- Lucas Lima da Silva — Desenvolvimento Frontend e Interface
- Lucas Resende — Análise de Requisitos