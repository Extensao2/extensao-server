# Sistema de Aprendizagem API

API RESTful para gerenciamento de recursos de aprendizagem e eventos, construída com Express.js e MongoDB.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login com sessões baseadas em cookies
- **Recursos**: CRUD completo para recursos de aprendizagem com busca por título
- **Eventos**: Gerenciamento completo de eventos com data e descrição
- **Validação**: Validação robusta de dados de entrada
- **Base64**: Suporte a conteúdo em formato base64 para recursos

## 📋 Pré-requisitos

- Node.js 18+ 
- Docker e Docker Compose (para banco de dados)
- MongoDB (rodando via Docker)

## 🛠️ Instalação

1. **Clone o repositório e instale dependências:**
```bash
npm install
```

2. **Configure variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Inicie o MongoDB via Docker:**
```bash
docker-compose up -d mongodb
```

4. **Inicie a aplicação:**
```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm start
```

## 🐳 Docker

Para rodar toda a aplicação com Docker:

```bash
docker-compose up -d
```

## 📚 API Endpoints

### Autenticação
- `POST /api/v1/login` - Login do usuário
- `POST /api/v1/logout` - Logout do usuário
- `POST /api/v1/register` - Registro de usuário (para desenvolvimento)

### Recursos
- `PUT /api/v1/resource` - Criar recurso
- `GET /api/v1/resource/:id` - Obter recurso por ID
- `PATCH /api/v1/resource/:id` - Atualizar recurso
- `DELETE /api/v1/resource/:id` - Deletar recurso
- `GET /api/v1/resources/search?title=texto` - Buscar recursos

### Eventos
- `GET /api/v1/eventos` - Listar todos os eventos
- `POST /api/v1/eventos` - Criar evento
- `GET /api/v1/eventos/:id` - Obter evento por ID
- `PUT /api/v1/eventos/:id` - Atualizar evento
- `DELETE /api/v1/eventos/:id` - Deletar evento

## 🔒 Autenticação

A API usa autenticação baseada em sessões com cookies. Após o login bem-sucedido, um cookie `session_id` é definido automaticamente.

### Exemplo de Login:
```json
POST /api/v1/login
{
  "username": "usuario",
  "password": "senha123"
}
```

## 📝 Exemplos de Uso

### Criar um Recurso:
```json
PUT /api/v1/resource
{
  "title": "Introdução ao JavaScript",
  "content": "Y29udGXDum RvIGN1cnNvIGVtIGJhc2U2NA=="
}
```

### Criar um Evento:
```json
POST /api/v1/eventos
{
  "nome": "Workshop de React",
  "data": "2024-02-15T14:30:00Z",
  "descricao": "Workshop introdutório sobre React.js"
}
```

## 🏗️ Estrutura do Projeto

```
src/
├── config/          # Configurações (database)
├── middleware/      # Middlewares (auth, errorHandler)
├── models/          # Modelos do MongoDB
├── routes/          # Rotas da API
└── server.js        # Arquivo principal
```

## 🚦 Status da API

Verifique se a API está funcionando:
```
GET /api/v1/health
```

## 🔧 Variáveis de Ambiente

```env
MONGODB_URI=mongodb://localhost:27017/sistema-aprendizagem
SESSION_SECRET=your-super-secret-session-key
PORT=3000
NODE_ENV=development
```

## 📦 Dependências Principais

- **Express.js**: Framework web
- **Mongoose**: ODM para MongoDB
- **express-session**: Gerenciamento de sessões
- **express-validator**: Validação de dados
- **bcryptjs**: Hash de senhas
- **uuid**: Geração de IDs únicos