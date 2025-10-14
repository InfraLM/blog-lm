# 🚀 Guia de Build do Frontend

Este guia explica como fazer o build do frontend para produção.

---

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- pnpm instalado (`npm install -g pnpm`)
- Arquivo `.env.production` configurado

---

## 🔧 Configuração

### 1. Verificar o arquivo `.env.production`

O arquivo `.env.production` deve conter:

```env
VITE_API_URL=https://liberdademedicaedu.com.br/home-e-blog-lm
```

**Importante:** 
- NÃO adicione `/api` no final da URL
- O arquivo `api.js` já adiciona `/api` automaticamente
- A URL final será: `https://liberdademedicaedu.com.br/home-e-blog-lm/api/articles`

### 2. Verificar o arquivo `src/services/api.js`

O arquivo deve ter esta linha:

```javascript
const API_URL = import.meta.env.VITE_API_URL + '/api';
```

Isso garante que todas as requisições vão para:
- Desenvolvimento: `http://localhost:3001/api/...`
- Produção: `https://liberdademedicaedu.com.br/home-e-blog-lm/api/...`

---

## 🏗️ Fazer o Build

### Passo 1: Instalar dependências

```bash
cd frontend
pnpm install
```

### Passo 2: Limpar builds anteriores

```bash
rm -rf dist node_modules/.vite
```

### Passo 3: Fazer o build de produção

```bash
pnpm build
```

**Saída esperada:**
```
vite v5.x.x building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-abc123.css     12.34 kB │ gzip:  3.45 kB
dist/assets/index-def456.js     234.56 kB │ gzip: 78.90 kB
✓ built in 5.67s
```

### Passo 4: Verificar se NÃO há referências a localhost

```bash
grep -r "localhost:3001" dist/
```

**Resultado esperado:** Nenhuma saída (vazio)

Se aparecer alguma referência a `localhost:3001`, significa que:
- O arquivo `.env.production` não foi lido corretamente
- Há código hardcoded com `localhost:3001`

---

## 📦 Preparar para Upload

### Passo 1: Comprimir o dist

```bash
cd frontend
zip -r dist.zip dist/
```

### Passo 2: Verificar o conteúdo

```bash
unzip -l dist.zip
```

**Deve conter:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── [outras imagens/fontes]
└── [outros arquivos estáticos]
```

---

## 🚀 Deploy no cPanel

### Passo 1: Fazer upload do dist.zip

1. Acesse o **File Manager** no cPanel
2. Navegue até `public_html/home-e-blog-lm/`
3. Faça upload do `dist.zip`

### Passo 2: Extrair o conteúdo

1. Clique com botão direito em `dist.zip`
2. Selecione **"Extract"**
3. Extraia para o diretório atual

### Passo 3: Mover arquivos para a raiz

1. Entre na pasta `dist/`
2. Selecione TODOS os arquivos (index.html, assets/, etc)
3. Clique em **"Move"**
4. Mova para `/public_html/home-e-blog-lm/`
5. Confirme a substituição dos arquivos existentes

### Passo 4: Limpar arquivos antigos

1. Delete a pasta `dist/` vazia
2. Delete o arquivo `dist.zip`

---

## ✅ Testar o Frontend

### Teste 1: Acessar a página

Abra no navegador:
```
https://liberdademedicaedu.com.br/home-e-blog-lm/
```

### Teste 2: Verificar no DevTools

1. Abra o DevTools (F12)
2. Vá na aba **Network**
3. Recarregue a página
4. Procure por requisições para `/api/articles`

**URL esperada:**
```
https://liberdademedicaedu.com.br/home-e-blog-lm/api/articles
```

**NÃO deve aparecer:**
```
http://localhost:3001/api/articles  ❌
```

### Teste 3: Verificar no Console

1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Procure por logs de sucesso:

```
📋 Buscando artigos: https://liberdademedicaedu.com.br/home-e-blog-lm/api/articles
✅ Artigos recebidos: {success: true, data: Array(10)}
```

**NÃO deve aparecer:**
```
❌ Erro ao buscar artigos: TypeError: Failed to fetch
net::ERR_CONNECTION_REFUSED
```

---

## 🐛 Troubleshooting

### Problema: Build mostra localhost:3001

**Causa:** Arquivo `.env.production` não foi lido

**Solução:**
1. Verifique se o arquivo `.env.production` existe na raiz de `frontend/`
2. Verifique se o conteúdo está correto
3. Limpe o cache: `rm -rf node_modules/.vite dist/`
4. Rode o build novamente: `pnpm build`

### Problema: Frontend não carrega artigos

**Causa:** Backend não está respondendo

**Solução:**
1. Teste o backend diretamente: `https://liberdademedicaedu.com.br/home-e-blog-lm/health`
2. Verifique se o backend está rodando no cPanel
3. Verifique os logs do backend

### Problema: Erro de CORS

**Causa:** Backend não está configurado para aceitar requisições do frontend

**Solução:**
1. Verifique se a variável `CORS_ORIGIN` está configurada no backend
2. Deve ser: `CORS_ORIGIN=https://liberdademedicaedu.com.br`
3. Reinicie o backend no cPanel

### Problema: Página 404 ao recarregar

**Causa:** Servidor não está configurado para SPA (Single Page Application)

**Solução:**
1. No cPanel, crie um arquivo `.htaccess` em `public_html/home-e-blog-lm/`
2. Adicione:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /home-e-blog-lm/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /home-e-blog-lm/index.html [L]
</IfModule>
```

---

## 📊 Estrutura Final no Servidor

```
public_html/
└── home-e-blog-lm/
    ├── index.html (frontend)
    ├── assets/ (CSS, JS, imagens do frontend)
    ├── .htaccess (rewrite rules para SPA)
    │
    └── backend/
        ├── src/
        │   └── server.js
        ├── package.json
        └── node_modules/
```

---

## 🎯 Checklist de Deploy

- [ ] Arquivo `.env.production` configurado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Cache limpo (`rm -rf dist node_modules/.vite`)
- [ ] Build executado (`pnpm build`)
- [ ] Verificado que não há `localhost:3001` no dist
- [ ] `dist.zip` criado
- [ ] Upload feito para o cPanel
- [ ] Arquivos extraídos e movidos para a raiz
- [ ] Arquivo `.htaccess` criado (se necessário)
- [ ] Página testada no navegador
- [ ] DevTools verificado (Network e Console)
- [ ] Artigos carregando corretamente

---

## 📝 Notas Importantes

- O frontend é uma SPA (Single Page Application) React
- Usa Vite como bundler
- Todas as rotas são gerenciadas pelo React Router
- A API é chamada via `fetch` no arquivo `src/services/api.js`
- O build de produção é otimizado e minificado
- Imagens e assets são automaticamente otimizados

---

## 🔄 Atualizar o Frontend

Para atualizar o frontend:

1. Faça as mudanças no código
2. Rode `pnpm build`
3. Crie novo `dist.zip`
4. Faça upload e extraia no cPanel
5. Limpe o cache do navegador (Ctrl+Shift+R)

---

**Última atualização:** 14 de outubro de 2025

