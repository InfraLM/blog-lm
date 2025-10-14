# 🚀 Guia de Deploy no cPanel

Este guia explica como fazer o deploy do backend no cPanel.

---

## 📋 Pré-requisitos

- Acesso ao cPanel
- Node.js 18.x ou superior instalado no servidor
- Credenciais do banco de dados PostgreSQL

---

## 🔧 Configuração no cPanel

### Passo 1: Fazer Upload dos Arquivos

1. Acesse o **File Manager** no cPanel
2. Navegue até `public_html/home-e-blog-lm/`
3. Crie a pasta `backend` (se não existir)
4. Faça upload de todos os arquivos do backend:
   - `src/server.js`
   - `package.json`
   - `.env` (criar conforme `.env.example`)

### Passo 2: Configurar Node.js App

1. No cPanel, vá em **"Setup Node.js App"**
2. Clique em **"Create Application"** (ou edite a existente)
3. Configure:
   - **Node.js version:** `18.20.0` (ou mais recente 18.x)
   - **Application mode:** `Production`
   - **Application root:** `/home/SEU_USUARIO/public_html/home-e-blog-lm/backend`
   - **Application URL:** `liberdademedicaedu.com.br/home-e-blog-lm`
   - **Application startup file:** `src/server.js`

### Passo 3: Configurar Variáveis de Ambiente

No "Setup Node.js App", adicione as seguintes variáveis em **"Environment variables"**:

```
NODE_ENV=production
PORT=3001

DB_HOST=35.199.101.38
DB_PORT=5432
DB_NAME=liberdade-medica
DB_USER=vinilean
DB_PASSWORD=SUA_SENHA_AQUI

CORS_ORIGIN=https://liberdademedicaedu.com.br
FRONTEND_URL=https://liberdademedicaedu.com.br
```

### Passo 4: Instalar Dependências

1. No "Setup Node.js App", clique em **"Run NPM Install"**
2. Aguarde a instalação completar
3. Verifique se não há erros

### Passo 5: Iniciar o Backend

1. Clique em **"Restart"** (ou "Start" se for a primeira vez)
2. Aguarde alguns segundos
3. Verifique se o status mudou para **"Running"** (verde)

---

## ✅ Testar o Backend

### Teste 1: Health Check

Abra no navegador:
```
https://liberdademedicaedu.com.br/home-e-blog-lm/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2025-10-14T...",
  "database": "connected",
  "environment": "production"
}
```

### Teste 2: Listar Artigos

Abra no navegador:
```
https://liberdademedicaedu.com.br/home-e-blog-lm/api/articles
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [ ... array de artigos ... ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Teste 3: Artigo em Destaque

Abra no navegador:
```
https://liberdademedicaedu.com.br/home-e-blog-lm/api/articles/featured-main
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": { ... dados do artigo ... }
}
```

---

## 🐛 Troubleshooting

### Backend não inicia

1. Verifique os logs em **stderr.log** e **stdout.log**
2. Verifique se todas as variáveis de ambiente estão configuradas
3. Verifique se o Node.js está na versão 18.x
4. Tente rodar "Run NPM Install" novamente

### Erro de memória (Out of memory)

1. Verifique se o `package.json` tem a flag `--max-old-space-size=512`
2. Mude para Node.js 18.x (usa menos memória que 20.x)
3. Entre em contato com o suporte do cPanel para aumentar o limite de memória

### Banco de dados não conecta

1. Verifique se as credenciais estão corretas
2. Verifique se o IP do servidor está liberado no firewall do PostgreSQL
3. Teste a conexão manualmente usando `psql` ou outra ferramenta

### Rotas retornam 404

1. Verifique se o "Application URL" está configurado corretamente
2. Verifique se o backend está rodando (status "Running")
3. Verifique os logs para ver se há erros

---

## 📊 Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/home-e-blog-lm/health` | GET | Health check do backend |
| `/home-e-blog-lm/api/articles` | GET | Listar todos os artigos |
| `/home-e-blog-lm/api/articles/featured-main` | GET | Artigo em destaque principal |
| `/home-e-blog-lm/api/articles/recent` | GET | Artigos recentes |
| `/home-e-blog-lm/api/articles/slug/:slug` | GET | Buscar artigo por slug |
| `/home-e-blog-lm/api/articles/:id` | GET | Buscar artigo por ID |
| `/home-e-blog-lm/api/articles/categories` | GET | Listar categorias |

---

## 🔄 Atualizar o Backend

Para atualizar o backend:

1. Faça upload dos novos arquivos
2. No "Setup Node.js App", clique em "Run NPM Install"
3. Clique em "Restart"
4. Teste os endpoints

---

## 📝 Notas Importantes

- O backend usa **Client** simples do PostgreSQL (não Pool) para economizar memória
- As flags de otimização no `package.json` limitam o uso de memória a 512MB
- Todas as rotas têm o prefixo `/home-e-blog-lm` hardcoded
- O backend foi otimizado especificamente para rodar em ambientes com recursos limitados (cPanel)

---

## 🆘 Suporte

Se tiver problemas:

1. Verifique os logs no cPanel
2. Teste os endpoints manualmente
3. Verifique se todas as variáveis de ambiente estão configuradas
4. Entre em contato com o suporte técnico

---

**Última atualização:** 14 de outubro de 2025

