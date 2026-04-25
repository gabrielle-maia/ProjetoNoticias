# Projeto Notícias

Este projeto é composto por um backend (API) em Node.js com TypeScript e um frontend em React Native (Expo) que consome essa API.

---

## COMO EXECUTAR O PROJETO

### 1. Rodar o Backend (API)

Abra o terminal e entre na pasta do backend:

cd projeto-noticias-api/backend

Instale as dependências:

npm install

Execute a API:

npx ts-node-dev src/server.ts

Se tudo estiver correto, aparecerá:

API rodando em http://localhost:3000

Teste no navegador:

http://localhost:3000/noticias

---

### 2. Rodar o App (Frontend)

Abra outro terminal (sem fechar o backend) e entre na pasta do app:

cd app-noticias

Instale as dependências:

npm install

Execute o app:

npx expo start

No terminal, pressione:

w

Isso abrirá o app no navegador.

---

## CONFIGURAÇÃO IMPORTANTE

No arquivo:

app-noticias/app/services/api.ts

A URL deve estar assim:

baseURL: "http://localhost:3000"

---

## FUNCIONALIDADES

O sistema permite:

- Criar notícias
- Listar notícias
- Editar notícias
- Excluir notícias

Os dados são salvos em banco SQLite.

---

## OBSERVAÇÕES

- O backend deve estar rodando antes do app
- O projeto foi testado via navegador (Expo Web)
- A API está funcionando com persistência de dados
- Ao abrir entre como autor no login adicione o que deseja e volte para HOME, entre como super Admin no login, selecione painel do editor, publicar/despublicar e publique sua noticia, quando voltar ao home, ela vai aparecer la
