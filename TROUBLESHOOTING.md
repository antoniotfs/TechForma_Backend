# Troubleshooting - Problemas Comuns

## Problema: POST retorna HTML do Swagger ao invés de JSON

### Possíveis causas e soluções:

#### 1. **URL incorreta no Postman**
- ✅ **Correto**: `http://localhost:3001/instituicoes` ou `https://seu-projeto.up.railway.app/instituicoes`
- ❌ **Errado**: `http://localhost:3001/docs/instituicoes`

**Verificação:**
- No Postman, verifique a URL completa na barra de endereço
- Deve terminar com `/instituicoes` (não `/docs/instituicoes`)

#### 2. **Método HTTP incorreto**
- Certifique-se de que o dropdown do método está em **POST**
- Não pode estar em GET, OPTIONS, ou outro método

**Verificação:**
- No Postman, verifique o dropdown à esquerda da URL
- Deve estar selecionado **POST**

#### 3. **Body não configurado**
- O body deve estar em formato JSON
- O header `Content-Type: application/json` deve estar presente

**Configuração no Postman:**
1. Vá na aba "Body"
2. Selecione "raw"
3. No dropdown ao lado, selecione "JSON"
4. Cole o JSON no campo

**Exemplo de Body:**
```json
{
  "id": "nova-instituicao",
  "nome": "Nova Instituição de Tecnologia",
  "logoUrl": "/nova-instituicao.jpg",
  "siteUrl": "https://www.novainstituicao.com.br",
  "descricao": "Uma nova instituição focada em tecnologia e inovação"
}
```

#### 4. **Headers faltando**
Certifique-se de que o header está presente:
```
Content-Type: application/json
```

**No Postman:**
1. Vá na aba "Headers"
2. Adicione:
   - Key: `Content-Type`
   - Value: `application/json`

#### 5. **Preflight OPTIONS (CORS)**
O Postman pode estar fazendo uma requisição OPTIONS primeiro (preflight CORS). Isso é normal e não deve afetar o POST.

**Verificação:**
- Olhe os logs do servidor
- Você deve ver primeiro um `OPTIONS /instituicoes`
- Depois um `POST /instituicoes`

#### 6. **Servidor redirecionando**
Se o servidor estiver redirecionando, pode ser problema de configuração.

**Solução:**
- Reinicie o servidor
- Verifique os logs para ver qual rota está sendo chamada

### Passo a passo para testar no Postman:

1. **Crie uma nova requisição:**
   - Método: `POST`
   - URL: `{{baseUrl}}/instituicoes`

2. **Configure o Body:**
   - Tab: "Body"
   - Selecionar: "raw"
   - Tipo: "JSON"
   - Conteúdo:
   ```json
   {
     "id": "teste-instituicao",
     "nome": "Instituição de Teste"
   }
   ```

3. **Configure Headers:**
   - Tab: "Headers"
   - Adicione: `Content-Type: application/json`

4. **Verifique a variável baseUrl:**
   - Vá em "Variables" da collection
   - Certifique-se de que `baseUrl` está configurada corretamente
   - Exemplo: `http://localhost:3001` ou sua URL do Railway

5. **Envie a requisição:**
   - Clique em "Send"
   - Verifique os logs do servidor

### Logs esperados no servidor:

```
[2024-11-27T...] OPTIONS /instituicoes
[2024-11-27T...] POST /instituicoes
[POST /instituicoes] Criando nova instituição: { id: '...', nome: '...' }
```

### Resposta esperada:

**Sucesso (201):**
```json
{
  "id": "teste-instituicao",
  "nome": "Instituição de Teste",
  "logoUrl": null,
  "siteUrl": null,
  "descricao": null
}
```

**Erro (400):**
```json
{
  "error": "Unique constraint failed on the fields: (`id`)"
}
```

## Outros problemas comuns

### Problema: CORS Error
**Solução:** O CORS já está configurado no código. Se ainda houver problemas, verifique se o servidor está rodando.

### Problema: 404 Not Found
**Solução:** Verifique se a URL está correta e se o servidor está rodando.

### Problema: 500 Internal Server Error
**Solução:** Verifique os logs do servidor para ver o erro específico.

## Como obter ajuda

Se o problema persistir:
1. Copie os logs completos do servidor
2. Copie a requisição exata do Postman (incluindo URL, método, headers, body)
3. Verifique a resposta completa retornada pelo servidor

