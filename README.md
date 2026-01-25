# 📊 Painel de Giro de Itens - Versão Profissional 2.5

Sistema profissional de gerenciamento de estoque com análise de vendas, sugestões de pedidos, edição de produtos e exportação de relatórios.

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação e Perfil
- **Login seguro** com 3 níveis de usuário (Desenvolvedor, Gestor, Funcionário)
- **Perfil de usuário** editável com:
  - Upload de foto de perfil (máx 5MB)
  - Informações pessoais (nome, email, telefone)
  - Sincronização automática com foto no header
  - Salvo em localStorage

### ✅ Gerenciamento de Produtos (NOVO!)
- **Adicionar produtos** com:
  - Nome do produto
  - Quantidade vendida
  - **Unidades por caixa** (para cálculo automático)
  - Data da última venda
  - Estoque atual
  - Cálculo automático de dias até esgotar
- **🆕 EDITAR produtos existentes** em tempo real:
  - Modal elegante e intuitivo
  - Botão de editar em cada linha da tabela
  - Recalcula automaticamente todas as previsões
  - Atualiza gráficos e sugestões
- **🆕 DELETAR produtos** com confirmação
- Edição em tempo real dos gráficos

### ✅ Abas Funcionais
Todas as abas estão completamente funcionais:
1. **Cadastro** - Adicionar novos produtos
2. **Gráficos** - Visualizar vendas e previsões
3. **Tabela** - Listar todos os produtos COM EDIÇÃO (NOVO!)
4. **Relatórios** - Filtrar dados e exportar
5. **Usuários** - Gerenciar usuários (Desenvolvedor apenas)
6. **Perfil** - Editar informações pessoais

### ✅ Análise e Sugestões de Pedidos
A seção **Gráficos** inclui **Sugestões de Pedidos** com:
- **Classificação por urgência**: Urgente (≤7 dias), Alta (≤14 dias), Normal
- **Cálculo automático** de quantidade recomendada
- **Cálculo de caixas necessárias** baseado em unidades/caixa
- **Cards visualmente organizados** com:
  - Saída semanal estimada
  - Dias restantes de estoque
  - Quantidade sugerida para novo pedido
  - **Quantidade de caixas sugeridas**

**Fórmula de sugestão:**
```
Quantidade Sugerida = (Quantidade Vendida por Semana) × 2
Caixas Sugeridas = ceil(Quantidade Sugerida / Unidades por Caixa)
```

### ✅ Sistema de Caixas (NOVO!)
- Cada produto tem uma configuração de **unidades por caixa**
- Cálculo automático: `Caixas = ceil(Estoque / Unidades por Caixa)`
- Exibido em:
  - Tabela de produtos (coluna dedicada)
  - Sugestões de pedidos
  - Relatórios PDF e Excel

### ✅ Exportação de Relatórios

#### **Excel/CSV**
- Clique em **"Exportar para Excel"** na aba Relatórios
- Exporta todos os dados em formato `.xlsx`
- Incluem:
  - Produto
  - Quantidade Vendida
  - Última Venda
  - Estoque Atual
  - Previsão (dias)
- Arquivo nomeado: `Relatorio_Giro_DD-MM-YYYY.xlsx`

#### **PDF**
- Clique em **"PDF"** na aba Relatórios
- Gera relatório completo com:
  - Cabeçalho com data, hora e usuário
  - Tabela formatada profissionalmente
  - Numeração de páginas
  - Rodapé com informações
- Arquivo nomeado: `Relatorio_Giro_DD-MM-YYYY.pdf`

### ✅ Filtros Avançados
- **Filtro por nome**: Busca produtos por nome (case-insensitive)
- **Filtro por data**: Filtra por data de última venda
- **Botão Aplicar**: Atualiza gráficos e tabela
- **Botão Limpar**: Reseta filtros e mostra todos os dados

### ✅ Tema Claro/Escuro
- Clique na **lua (🌙)** no header para alternar temas
- Tema claro: Background azul claro
- Tema escuro: Background escuro com textos claros
- Preferência mantida durante a sessão

## 🔐 Credenciais de Teste

| Usuário | Senha | Nível | Permissões |
|---------|-------|-------|-----------|
| `dev` | `dev123` | 1 | Acesso total (Desenvolvedor) |
| `gestor` | `gestor123` | 2 | Ver cadastro, gráficos e tabela |
| `func` | `func123` | 3 | Apenas visualização |

## 📱 Responsividade

- ✅ **Desktop** (1920px+): Layout completo
- ✅ **Tablet** (768px-1024px): Layout adaptado
- ✅ **Mobile** (320px-767px): Layout otimizado

## 🗂️ Estrutura de Dados

Todos os dados são salvos no **localStorage** do navegador:

- **`usuarios`**: Lista de usuários do sistema
- **`giroItens`**: Lista de produtos com vendas
- **`perfil_[usuario]`**: Perfil individual de cada usuário

## 🎨 Cores e Design

- **Cor Primária**: Azul Microsoft (#0078D4)
- **Sucesso**: Verde (#28a745)
- **Perigo**: Vermelho (#dc3545)
- **Design**: Gradientes, sombras e animações modernas

## 🔧 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Gráficos**: Chart.js
- **Exportação**: 
  - jsPDF (PDF)
  - jsPDF AutoTable (Tabelas em PDF)
  - XLSX/SheetJS (Excel)
- **Ícones**: Font Awesome 6.4.0
- **Armazenamento**: localStorage

## 📋 Como Usar

### 1. Login
- Acesse a página inicial
- Insira usuário e senha
- Clique em "Entrar"

### 2. Adicionar Produtos
1. Vá para aba **Cadastro**
2. Preencha os campos:
   - Nome do produto
   - Quantidade vendida
   - Data da venda
   - Estoque atual
3. Clique em **Adicionar Produto**

### 3. Visualizar Sugestões
1. Vá para aba **Gráficos**
2. Veja os gráficos de vendas e previsão
3. Análise as **Sugestões de Pedidos** abaixo
4. Use as recomendações para fazer novos pedidos

### 4. Exportar Relatórios
1. Vá para aba **Relatórios**
2. (Opcional) Aplique filtros
3. Clique em:
   - **Excel / CSV** para arquivo Excel
   - **PDF** para relatório em PDF

### 5. Editar Perfil
1. Vá para aba **Perfil**
2. Clique em **Trocar Foto** para upload
3. Preencha informações pessoais
4. Clique em **Salvar Alterações**

## ⚙️ Limitações

- Máximo 5MB por imagem de perfil
- Apenas formatos de imagem válidos (.jpg, .png, etc)
- Dados salvos localmente (máx ~10MB por navegador)
- Sem sincronização em nuvem

## 🐛 Troubleshooting

### Foto não atualiza?
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Verifique se a imagem tem menos de 5MB

### Exportação não funciona?
- Ative JavaScript no navegador
- Tente um navegador mais recente
- Verifique se há dados cadastrados

### Filtros não funcionam?
- Limpe os filtros e tente novamente
- Verifique a escrita exata do nome do produto

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ por Leon**  
**Versão 1.0 | 2025**
