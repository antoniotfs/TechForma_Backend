# Guia de Deploy no Railway

## Configuração Inicial

### 1. Verificar Variáveis de Ambiente no Railway

No painel do Railway, certifique-se de que:

1. **DATABASE_URL** está configurada automaticamente quando você adiciona o serviço PostgreSQL
2. **PORT** é definido automaticamente pelo Railway (não precisa configurar manualmente)

### 2. Ordem de Serviços

Certifique-se de que o serviço PostgreSQL está **antes** do serviço da aplicação no Railway. O Railway geralmente faz isso automaticamente, mas verifique.

### 3. Verificar Logs

Se o deploy falhar, verifique os logs no Railway:

- Vá em "Deployments" → Selecione o deployment → "View Logs"
- Procure por mensagens de erro relacionadas a:
  - `DATABASE_URL` não configurada
  - Conexão com banco de dados
  - Migrations

## Troubleshooting

### Problema: Loop infinito de conexão

**Solução:**
1. Verifique se o serviço PostgreSQL está rodando no Railway
2. Verifique se a variável `DATABASE_URL` está configurada corretamente
3. O script aguarda até 40 segundos (20 tentativas × 2s) antes de falhar
4. Se continuar falhando, verifique se o banco está realmente acessível

### Problema: Migrations falhando

**Solução:**
- O script continua mesmo se migrations falharem (pode ser que já estejam aplicadas)
- Para rodar migrations manualmente: `railway run npx prisma migrate deploy`

### Problema: Aplicação não inicia

**Solução:**
1. Verifique os logs do Railway
2. Teste a rota `/health` para verificar conexão com banco
3. Verifique se a porta está correta (Railway define automaticamente)

## Comandos Úteis

### Rodar migrations manualmente
```bash
railway run npx prisma migrate deploy
```

### Rodar seed
```bash
railway run npm run seed
```

### Ver logs em tempo real
```bash
railway logs
```

### Conectar ao banco via CLI
```bash
railway connect postgres
```

## Estrutura de Deploy

1. **Build**: Dockerfile instala dependências e gera Prisma Client
2. **Start**: Script `start.js`:
   - Aguarda banco estar disponível (até 40s)
   - Roda migrations
   - Inicia aplicação Express

## Health Check

A aplicação expõe uma rota `/health` que verifica:
- Status da aplicação
- Conexão com banco de dados

Acesse: `https://seu-projeto.up.railway.app/health`

