# 🎯 Guia: Edição de Produtos

## Como Editar a Quantidade de Unidades por Caixa (Sua Prioridade)

### Passo 1: Acesse a Aba Tabela
1. Faça login no sistema
2. Clique na aba **"📋 Tabela"** no topo

### Passo 2: Localize o Produto
- Procure na tabela o produto que deseja editar
- Você verá uma coluna **"Ações"** no final de cada linha

### Passo 3: Abra o Modal de Edição
- Clique no ícone de **editar (✏️)** na coluna "Ações"
- Um modal elegante aparecerá com os dados do produto

### Passo 4: Edite os Dados
O modal contém 5 campos principais:
1. **Nome do Produto** - Edite o nome se necessário
2. **Quantidade Vendida** - Última quantidade vendida
3. **Unidades por Caixa** ⭐ - ESTE É O CAMPO PRINCIPAL
   - Digite o número de unidades que vêm em cada caixa
   - Exemplo: Se uma caixa tem 12 unidades, digite `12`
4. **Data da Venda** - Data da última venda
5. **Estoque Atual** - Quantidade atual em unidades (não em caixas)

### Passo 5: Salve as Alterações
1. Clique no botão verde **"💾 Salvar Alterações"**
2. Uma mensagem de sucesso aparecerá
3. A tabela será atualizada automaticamente
4. Os gráficos e sugestões serão recalculados

### Passo 6: Veja as Atualizações
Após salvar:
- ✅ A coluna "Caixas" será recalculada automaticamente
- ✅ As sugestões de pedidos mostrarão a nova quantidade de caixas
- ✅ Os dados estão salvos no localStorage
- ✅ Permanecem salvos ao recarregar a página

## Exemplo Prático

### Cenário: Atualizar uma Bebida
**Produto Original:**
- Nome: Suco 1L
- Quantidade Vendida: 30
- Unidades por Caixa: 12 (ANTIGO)
- Estoque: 120 unidades
- Caixas: 10 caixas (120 / 12 = 10)

**Você Descobriu que:**
- Na verdade a caixa tem 20 unidades, não 12!

**Processo:**
1. Clique editar na linha do Suco
2. No campo "Unidades por Caixa", mude de `12` para `20`
3. Clique "Salvar Alterações"

**Resultado Automático:**
- Caixas em estoque: 6 caixas (120 / 20 = 6) ✓
- Sugestão de pedido recalculada com 20 un/caixa ✓
- Tudo sincronizado ✓

## Deletar um Produto

Se precisar remover um produto:

### Passo 1: Localize o Produto
- Acesse a aba **Tabela**
- Encontre o produto que deseja deletar

### Passo 2: Clique em Deletar
- Clique no ícone de **deletar (🗑️)** na coluna "Ações"

### Passo 3: Confirme
- Um diálogo pedirá confirmação
- Clique **"OK"** para confirmar a deleção
- O produto será removido imediatamente

## Avisos Importantes

⚠️ **Campos Obrigatórios:**
- Nome do Produto - Não pode estar vazio
- Quantidade Vendida - Deve ser um número válido
- Unidades por Caixa - Mínimo 1, necessário para cálculos
- Data da Venda - Obrigatória para rastreamento
- Estoque Atual - Deve ser um número válido

❌ **Não é Possível:**
- Deixar campos vazios
- Colocar números negativos no estoque
- Colocar 0 na quantidade de unidades por caixa

⚠️ **Atualizações Automáticas:**
Ao editar, SEMPRE são atualizados:
- Cálculo de caixas em estoque
- Previsão de dias de estoque
- Sugestões de pedidos
- Gráficos
- Dados no localStorage

## Cálculos Automáticos

### Quando Você Edita o Estoque
```
Caixas em Estoque = ceil(Estoque / Unidades por Caixa)
Dias Estimados = ceil(Estoque / (Quantidade Vendida / 7))
```

### Quando Você Edita Unidades por Caixa
```
TODA a tabela é recalculada
Sugestões de pedidos são regeneradas
Gráficos são atualizados
```

## Mensagens de Feedback

### ✅ Sucesso
Uma mensagem verde aparecerá no canto inferior direito:
- "Produto atualizado com sucesso!"
- "Produto deletado com sucesso!"

### ❌ Erro
Se houver algum problema:
- Um alerta aparecerá
- Verifique se todos os campos estão preenchidos corretamente

## Acessando Dados Editados em Outros Lugares

Os dados editados aparecem automaticamente em:
- **Tabela**: Coluna "Caixas" atualizada
- **Gráficos**: Novos dados refletem nas sugestões
- **Relatórios**: Exportar PDF/Excel mostra dados atualizados
- **localStorage**: Salvos permanentemente

## Recuperação de Dados

Se você deletar algo por engano:
- ⚠️ NÃO há undo/refazer automático
- ✅ Você pode adicionar o produto novamente
- 💡 Dica: Mantenha backups regulares em Excel

## Atalhos e Dicas

### Fechar o Modal
- Clique em "Cancelar"
- Clique no X do modal
- Clique fora do modal
- Todos cancelam sem salvar

### Campos com Ícones
Cada campo tem um ícone que indica seu tipo:
- 📦 Nome do Produto
- 📦 Quantidade Vendida (sacos/caixas vendidos)
- 📦 Unidades por Caixa
- 📅 Data da Venda
- 🏢 Estoque Atual

## Problemas Comuns

### P: Editei mas os dados não atualizaram
**R:** Verifique se clicou "Salvar Alterações" (não "Cancelar")

### P: Meus dados sumiram ao recarregar a página
**R:** Verifique se o localStorage não foi limpo. Os dados são salvos automaticamente.

### P: Os gráficos não estão mostrando a atualização
**R:** Alguns navegadores precisam recarregar. Pressione F5 para recarregar a página.

### P: Qual é a diferença entre "Quantidade Vendida" e "Unidades por Caixa"?
**R:**
- **Quantidade Vendida**: Quanto você vende por semana (usada para previsão)
- **Unidades por Caixa**: Quantas unidades vêm em cada caixa (usada para cálculo de caixas)

Exemplo: Se você vende 30 unidades por semana e cada caixa tem 12 unidades:
- Quantidade Vendida: 30
- Unidades por Caixa: 12
- Caixas Vendidas por Semana: 30 ÷ 12 = 2.5 caixas/semana

## 📞 Precisa de Ajuda?

Consulte também:
- `README.md` - Visão geral do sistema
- `EDICAO.md` - Documentação técnica de edição
- `FUNCIONALIDADES.md` - Lista completa de funcionalidades
- `CAIXAS.md` - Explicação do sistema de caixas

