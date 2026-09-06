# API Higienize

Backend REST da Fase 01, desenvolvido com Node.js, Express e SQLite. Implementa cadastro e login com JWT, consulta de diaristas verificadas, solicitações, candidaturas, confirmação, mensagens e avaliações.

## Executar

1. Copie `.env.example` para `.env` e defina uma chave JWT segura.
2. Execute `npm install` e `npm start` nesta pasta.
3. Consulte `GET http://localhost:3000/health`.

Dados de demonstração: `laura@higienize.local` e `marcia@higienize.local`, senha `Higienize@123`.

## Regras aplicadas

- Somente diaristas verificadas e ativas podem candidatar-se.
- Solicitações exigem serviços, endereço, tamanho do imóvel e data futura.
- Uma diarista não pode ter dois serviços aceitos no mesmo horário.
- Somente o morador confirma a candidatura; a confirmação recusa as demais.
- Avaliações são únicas, de 1 a 5 estrelas, e liberadas só após a conclusão.
