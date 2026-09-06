# Higienize

Plataforma web para contratação segura de diaristas em condomínios. O projeto aproxima moradores e profissionais verificadas, organizando solicitações, candidaturas, comunicação e avaliações em um único ambiente.

Desenvolvido como parte do Projeto Integrador - 6º período, Fase 01.

## Funcionalidades

- Cadastro e autenticação de clientes e diaristas.
- Controle de acesso por perfil com JSON Web Token.
- Consulta de diaristas verificadas e ativas.
- Criação e acompanhamento de solicitações de serviço.
- Candidatura de diaristas e confirmação pelo cliente.
- Mensagens associadas a cada solicitação.
- Avaliações após a conclusão do atendimento.
- Regras para evitar conflitos de agenda e candidaturas indevidas.

## Arquitetura

```text
Frontend (HTML, CSS e JavaScript)
              |
              v
API REST (Node.js e Express)
              |
              v
Banco de dados relacional (SQLite)
```

## Estrutura do repositório

```text
.
├── frontend/              # Interface, estilos, scripts e imagens
├── backend/               # API REST e regras de negócio
│   ├── src/config/        # Configuração e criação do banco
│   ├── src/middleware/    # Autenticação, autorização e erros
│   ├── src/routes/        # Endpoints da API
│   └── src/services/      # Regras de negócio
└── docs/                  # Documento da entrega da Fase 01
```

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Frontend | HTML5, CSS3 e JavaScript ES6+ |
| Backend | Node.js e Express |
| Banco de dados | SQLite e better-sqlite3 |
| Segurança | bcryptjs e JSON Web Token |
| Ferramentas | Git, GitHub, Visual Studio Code e Figma |

## Como executar o backend

Pré-requisito: Node.js instalado.

```bash
cd backend
copy .env.example .env
npm install
npm start
```

A API estará disponível em `http://localhost:3000`.

### Testes rápidos

| Rota | Finalidade |
|---|---|
| `GET /health` | Verifica se a API está disponível. |
| `GET /api/diaristas` | Lista as diaristas verificadas cadastradas. |
| `POST /api/auth/register` | Cadastra cliente ou diarista. |
| `POST /api/auth/login` | Autentica o usuário e retorna o token JWT. |

Dados de demonstração: `laura@higienize.local` ou `marcia@higienize.local` com a senha `Higienize@123`.

## Documentação

O documento atualizado da Fase 01 está disponível em [`docs/`](docs/).

## Equipe

- Arthur Firmino Martins - Gerente de Projeto e Documentação
- Carlos Magno da Silva - Desenvolvimento Backend e Banco de Dados
- Lucas Lima da Silva - Desenvolvimento Frontend e Interface
- Lucas Resende - Análise de Requisitos
