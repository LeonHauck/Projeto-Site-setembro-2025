# 📦 SISTEMA DE CAIXAS - DOCUMENTAÇÃO

## O que foi implementado?

Adicionamos um sistema completo para rastrear unidades e caixas de produtos. Agora você pode:

✅ Indicar quantas unidades vêm por caixa  
✅ Ver quantidade total de caixas no estoque  
✅ Receber sugestões em caixas (não apenas unidades)  
✅ Exportar dados com informações de caixas  

---

## 📝 COMO USAR

### 1. Cadastrar Produto com Caixas

**Aba: Cadastro**

```
Nome do Produto:        Notebook
Quantidade Vendida:     10 (unidades por semana)
Unidades por Caixa:     12 (novo campo!)
Data da Venda:          25/01/2026
Estoque Atual:          120 unidades
```

✅ Clique em **"Adicionar Produto"**

---

### 2. Visualizar Estoque em Caixas

**Aba: Tabela**

A tabela agora mostra:

```
Produto  | Qtd.Vendida | Un. por Caixa | Última Venda | Estoque | Caixas | Previsão
---------|-------------|---------------|--------------|---------|--------|----------
Notebook | 10          | 12            | 25/01/2026   | 120     | 10 cxs | 84 dias
```

- **Estoque**: Mostra em unidades (120)
- **Caixas**: Calcula automaticamente (10 caixas de 12 = 120)

---

### 3. Sugestões de Pedidos com Caixas

**Aba: Gráficos → Sugestões de Pedidos**

Cada card mostra:

```
┌─────────────────────────────┐
│ NOTEBOOK         [NORMAL]   │
├─────────────────────────────┤
│ Saída/Semana: 10 un.        │
│ Dias Estoque: 84 dias       │
├─────────────────────────────┤
│ Estoque Atual:              │
│   10 cxs (120 unidades)     │
│ Un. por Caixa: 12 unidades  │
├─────────────────────────────┤
│ Sugestão: Pedir 2 caixas    │
│           (24 unidades)     │
└─────────────────────────────┘
```

**Como funciona:**
1. Sistema calcula: saída semanal × 2 semanas = 20 unidades
2. Divide por unidades por caixa: 20 ÷ 12 = 1.67 → **2 caixas**
3. Mostra claramente: "2 caixas (24 unidades)"

---

### 4. Exportar com Dados de Caixas

#### **Excel**
Clique em **Relatórios → Excel / CSV**

Arquivo inclui:
```
Produto | Qtd. Vendida | Un. por Caixa | Última Venda | Estoque (un.) | Estoque (caixas) | Previsão
--------|--------------|---------------|--------------|---------------|-----------------|----------
Notebook| 10           | 12            | 25/01/2026   | 120           | 10              | 84 dias
```

#### **PDF**
Clique em **Relatórios → PDF**

Relatório inclui coluna de caixas

---

## 🧮 CÁLCULOS AUTOMÁTICOS

### Fórmula de Caixas no Estoque
```
Caixas = ARREDONDAR_PARA_CIMA(Estoque ÷ Un. por Caixa)

Exemplo:
- Estoque: 120 unidades
- Un. por Caixa: 12
- Resultado: 120 ÷ 12 = 10 caixas
```

### Fórmula de Sugestão de Pedido
```
Un. Sugeridas = ARREDONDAR_PARA_CIMA(Saída Semanal × 2)
Caixas Sugeridas = ARREDONDAR_PARA_CIMA(Un. Sugeridas ÷ Un. por Caixa)

Exemplo:
- Saída/Semana: 10 unidades
- Un. Sugeridas: 10 × 2 = 20 unidades
- Un. por Caixa: 12
- Caixas Sugeridas: 20 ÷ 12 = 1.67 → 2 caixas (24 unidades)
```

---

## 📊 GRÁFICOS COM UNIDADES

Os gráficos agora especificam claramente:

- **"Gráfico de Giro (em Unidades)"**
  - Mostra quantidade vendida por semana
  - Unidade: unidades

- **"Previsão de Vendas (em Dias)"**
  - Mostra dias até esgotar estoque
  - Unidade: dias

---

## 🎯 CAMPOS DO FORMULÁRIO

### Campo Novo: "Unidades por Caixa"

```
Label:       Unidades por Caixa
Ícone:       📦 (box-open)
Tipo:        Número
Mín:         1
Padrão:      1 (se não preenchido)
Obrigatório: Sim
```

**Exemplos:**
- Bebidas: 12 unidades/caixa
- Produtos eletrônicos: 1 unidade/caixa
- Parafusos: 100 unidades/caixa

---

## 💾 ESTRUTURA DE DADOS

Cada produto agora armazena:

```javascript
{
  produto: "Notebook",
  quantidade: 10,           // Saída por semana (unidades)
  unidadesCaixa: 12,        // NOVO: Un. por caixa
  ultimaVenda: "25/01/2026",
  estoque: 120,             // Em unidades
  diasEstimados: 84
}
```

---

## 📱 COMPATIBILIDADE

✅ Funciona com produtos existentes (valor padrão: 1)  
✅ Funciona com novos produtos  
✅ Compatível com importação de dados  
✅ Salvo no localStorage  

---

## 🔄 MIGRAÇÃO DE DADOS ANTIGOS

Se você tinha produtos cadastrados antes:

1. Abra um produto na tabela
2. Veja coluna "Cxs" (caixas)
3. Se vir "? cxs", é porque unidade/caixa = 1 (padrão)
4. Para corrigir, adicione novamente o produto com valor correto

---

## 📝 EXEMPLOS PRÁTICOS

### Exemplo 1: Bebidas
```
Produto: Refrigerante
Qtd. Vendida: 24 unidades/semana
Un. por Caixa: 12
Estoque: 144 unidades = 12 caixas

Sugestão: 
- Saída × 2 = 24 × 2 = 48 unidades
- 48 ÷ 12 = 4 caixas (48 unidades)
```

### Exemplo 2: Eletrônicos
```
Produto: Notebook
Qtd. Vendida: 10 unidades/semana
Un. por Caixa: 1
Estoque: 100 unidades = 100 caixas

Sugestão:
- Saída × 2 = 10 × 2 = 20 unidades
- 20 ÷ 1 = 20 caixas (20 unidades)
```

### Exemplo 3: Parafusos
```
Produto: Parafuso M8
Qtd. Vendida: 500 unidades/semana
Un. por Caixa: 100
Estoque: 2000 unidades = 20 caixas

Sugestão:
- Saída × 2 = 500 × 2 = 1000 unidades
- 1000 ÷ 100 = 10 caixas (1000 unidades)
```

---

## ✨ MELHORIAS VISUAIS

✅ Ícones de caixa em campos relevantes  
✅ Cores destacadas para informações de caixas  
✅ Cards de sugestão com seção de caixas  
✅ Tabelas com coluna de caixas bem visível  

---

## 🚀 TESTE AGORA!

1. Vá para **Cadastro**
2. Preencha incluindo **"Unidades por Caixa"**
3. Vá para **Tabela** → Veja coluna "Cxs"
4. Vá para **Gráficos** → Veja sugestão em caixas
5. Vá para **Relatórios** → Exporte com dados de caixas

---

**Sistema de caixas totalmente integrado!** 📦
