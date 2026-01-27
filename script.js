document.addEventListener("DOMContentLoaded", () => {
  let dados = [];
  let usuarios = [];
  let usuarioLogado = null;
  let grafico = null;
  let graficoPrevisao = null;

  function carregarUsuarios() {
    const salvos = localStorage.getItem('usuarios');
    if (salvos) {
      usuarios = JSON.parse(salvos);
      // Fallback: Se não for array ou estiver vazio
      if (!Array.isArray(usuarios) || usuarios.length === 0) {
        carregarDefaults();
      } else {
        // Fallback 2: Se os usuários essenciais (dev ou leon) não existirem, garante que eles sejam recriados
        const essencialExists = usuarios.some(u => u.usuario === 'dev') && usuarios.some(u => u.usuario === 'leon');
        if (!essencialExists) {
          console.warn("Usuários essenciais ausentes. Restaurando base...");
          carregarDefaults();
        }
      }
    } else {
      carregarDefaults();
    }
  }

  function carregarDefaults() {
    usuarios = [
      { usuario: "dev", senha: "dev123", nivel: 1 },
      { usuario: "leon", senha: "leon123", nivel: 1 },
      { usuario: "gestor", senha: "gestor123", nivel: 2 },
      { usuario: "func", senha: "func123", nivel: 3 }
    ];
    salvarUsuarios();
  }

  function salvarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  function carregarDadosLocal() {
    const dadosSalvos = localStorage.getItem('giroItens');
    if (dadosSalvos) {
      dados = JSON.parse(dadosSalvos);
    } else {
      dados = [];
      salvarDadosLocal();
    }
  }

  function salvarDadosLocal() {
    localStorage.setItem('giroItens', JSON.stringify(dados));
  }

  carregarUsuarios();
  carregarDadosLocal();

  // Verifica sessão ao carregar
  function verificarSessao() {
    console.log("Iniciando verificação de sessão...");
    const sessao = localStorage.getItem('usuarioLogado');
    const path = window.location.pathname;
    const pageObj = path.split('/').pop().toLowerCase();

    // Detecção mais robusta da página de login
    const isLoginPage = pageObj === 'index.html' ||
      pageObj === '' ||
      pageObj === 'projeto%20site' ||
      path === '/' ||
      path.endsWith('Projeto%20Site/');

    console.log("Página atual:", pageObj || "(index)", "| É tela de login?", isLoginPage);

    if (sessao) {
      try {
        usuarioLogado = JSON.parse(sessao);
        console.log("Sessão ativa encontrada para:", usuarioLogado.usuario);

        if (isLoginPage) {
          console.log("Redirecionando usuário logado para o cadastro...");
          window.location.href = 'cadastro.html';
        } else {
          setTimeout(() => {
            if (document.getElementById('nomeUsuario')) mostrarUsuarioLogado();
            aplicarPermissoes(usuarioLogado.nivel);
          }, 50);
        }
      } catch (e) {
        console.error("Erro ao ler sessão:", e);
        localStorage.removeItem('usuarioLogado');
        if (!isLoginPage) window.location.href = 'index.html';
      }
    } else {
      console.log("Nenhuma sessão encontrada.");
      if (!isLoginPage) {
        console.log("Acesso negado. Redirecionando para login...");
        window.location.href = 'index.html';
      }
    }
  }

  verificarSessao();

  const corpoTabela = document.getElementById('tabelaCorpo');

  function atualizarTabela() {
    atualizarTabelaFiltrada(dados);
  }

  const canvasGiro = document.getElementById('graficoGiro');
  if (canvasGiro) {
    const ctx = canvasGiro.getContext('2d');
    grafico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dados.map(item => item.produto),
        datasets: [{
          label: 'Quantidade Vendida',
          data: dados.map(item => item.quantidade),
          backgroundColor: '#0078D4',
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  const canvasPrevisao = document.getElementById('graficoPrevisao');
  if (canvasPrevisao) {
    const ctx2 = canvasPrevisao.getContext('2d');
    graficoPrevisao = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: dados.map(item => item.produto),
        datasets: [{
          label: 'Dias para vender estoque',
          data: dados.map(item => item.diasEstimados),
          backgroundColor: '#FFFFFF',
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // Só executa funções de interface se estiver em uma página que as possua
  if (corpoTabela) {
    console.log("Tabela detectada. Atualizando dados...");
    atualizarTabela();
  }

  if (document.getElementById('sugestoesPedidos')) {
    console.log("Painel de sugestões detectado. Gerando...");
    gerarSugestoesPedidos();
  }

  const formLogin = document.getElementById('formLogin');
  const telaLogin = document.getElementById('telaLogin');
  const painelPrincipal = document.getElementById('painelPrincipal');
  const erroLogin = document.getElementById('erroLogin');

  if (formLogin) {
    console.log("Formulário de login detectado. Aguardando submit...");
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();

      const usuarioInput = document.getElementById('usuario');
      const senhaInput = document.getElementById('senha');

      const nome = usuarioInput.value.trim().toLowerCase();
      const senha = senhaInput.value.trim();

      console.log("Tentativa de login:", { usuario: nome });

      // Garante que o usuário dev sempre exista no array antes da verificação
      const devExistente = usuarios.find(u => u.usuario === 'dev');
      if (!devExistente) {
        console.warn("Usuário 'dev' não encontrado na lista. Adicionando fallback...");
        usuarios.push({ usuario: "dev", senha: "dev123", nivel: 1 });
      }

      const encontrado = usuarios.find(u => u.usuario === nome && u.senha === senha);

      if (encontrado || (nome === "dev" && senha === "dev123")) {
        console.log("Autenticação bem-sucedida!");
        usuarioLogado = encontrado || { usuario: "dev", senha: "dev123", nivel: 1 };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

        if (erroLogin) erroLogin.style.display = "none";
        formLogin.classList.add('sucesso-anim');

        console.log("Salvando sessão e redirecionando...");
        setTimeout(() => {
          window.location.href = "cadastro.html";
        }, 300);
      } else {
        console.error("Autenticação falhou: Usuário ou senha incorretos.");
        if (erroLogin) {
          erroLogin.style.display = "flex";
          erroLogin.style.animation = 'none';
          void erroLogin.offsetWidth;
          erroLogin.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        }
        // Limpa campos para nova tentativa (opcional, melhor manter para o usuário corrigir)
        // senhaInput.value = "";
      }
    });
  }

  function aplicarPermissoes(nivel) {
    const relatoriosElem = document.getElementById('relatorios');
    if (nivel > 1 && relatoriosElem) relatoriosElem.style.display = "none";

    // Apenas Desenvolvedor (Nível 1) pode ver a lista de outros usuários
    if (nivel > 1) {
      const cardLista = document.getElementById('cardListaUsuarios');
      if (cardLista) cardLista.style.display = "none";
    }

    if (nivel > 2) {
      const botaoUsuarios = Array.from(document.querySelectorAll('.aba')).find(btn => btn.getAttribute('href') === 'usuarios.html' || btn.id === 'usuarios');
      if (botaoUsuarios) botaoUsuarios.style.display = "none";

      const sessaoUsuarios = document.getElementById('usuarios');
      if (sessaoUsuarios) sessaoUsuarios.style.display = "none";
    }
  }

  function mostrarUsuarioLogado() {
    document.getElementById('nomeUsuario').textContent = usuarioLogado.usuario;
    document.getElementById('nivelUsuario').textContent = `(Nível ${usuarioLogado.nivel})`;

    const perfilSalvo = localStorage.getItem(`perfil_${usuarioLogado.usuario}`);
    if (perfilSalvo) {
      const perfil = JSON.parse(perfilSalvo);
      document.getElementById('fotoTopo').src = perfil.foto || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJCNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTQuMmMtMi41IDAtNC43MS0xLjI4LTYtMy4yMi4wMy0xLjk5IDQtMy4wOCA2LTMuMDggMS45OSAwIDUuOTcgMS4wOSA2IDMuMDgtMS4yOSAxLjk0LTMuNSAzLjIyLTYgMy4yMnoiLz48L3N2Zz4=";
    }
  }

  // ===== SUGESTÕES DE PEDIDOS =====
  function gerarSugestoesPedidos() {
    const containerSugestoes = document.getElementById('sugestoesPedidos');
    if (!containerSugestoes) {
      console.log("Skipping gerarSugestoesPedidos: Container not found.");
      return;
    }

    if (dados.length === 0) {
      containerSugestoes.innerHTML = `
        <div class="sem-sugestoes">
          <i class="fas fa-inbox"></i>
          <p>Nenhum produto cadastrado. Adicione produtos para ver sugestões de pedidos.</p>
        </div>
      `;
      return;
    }

    // Ordena por quantidade vendida
    const produtosOrdenados = [...dados].sort((a, b) => b.quantidade - a.quantidade);

    containerSugestoes.innerHTML = "";

    produtosOrdenados.forEach((item, index) => {
      const urgencia = item.diasEstimados <= 7 ? 'Urgente' : item.diasEstimados <= 14 ? 'Alta' : 'Normal';
      const corUrgencia = item.diasEstimados <= 7 ? '#dc3545' : item.diasEstimados <= 14 ? '#ffc107' : '#28a745';

      // Calcula quantidade sugerida (quantidade vendida por semana * 2)
      const quantidadeSugerida = Math.ceil(item.quantidade / 7 * 2);
      const caixasSugeridas = Math.ceil(quantidadeSugerida / item.unidadesCaixa);
      const unidadesReaisDoPedido = caixasSugeridas * item.unidadesCaixa;
      const estoqueCaixas = Math.ceil(item.estoque / item.unidadesCaixa);

      const sugestaoHTML = `
        <div class="sugestao-card">
          <div class="sugestao-header">
            <div class="sugestao-titulo">${item.produto}</div>
            <div class="sugestao-badge" style="background: ${corUrgencia};">${urgencia}</div>
          </div>
          
          <div class="sugestao-stats">
            <div class="stat-item">
              <span class="stat-value">${item.quantidade}</span>
              <span class="stat-label">Saída/Semana</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${item.diasEstimados}</span>
              <span class="stat-label">Dias Estoque</span>
            </div>
          </div>

          <div class="sugestao-caixas">
            <div class="caixa-info">
              <span class="caixa-label">Estoque Atual:</span>
              <span class="caixa-valor">${estoqueCaixas} cxs (${item.estoque} un.)</span>
            </div>
            <div class="caixa-info">
              <span class="caixa-label">Un. por Caixa:</span>
              <span class="caixa-valor">${item.unidadesCaixa} unidades</span>
            </div>
          </div>
          
          <div class="sugestao-recomendacao">
            <strong>Sugestão:</strong> Pedir <strong>${caixasSugeridas} caixas</strong> (${unidadesReaisDoPedido} itens) <br>
            <small style="color: #42A5F5;">(Demanda real: ${quantidadeSugerida} itens)</small>
          </div>
        </div>
      `;

      containerSugestoes.innerHTML += sugestaoHTML;
    });
  }

  // ===== FUNÇÕES DE CÁLCULO DE VENDAS POR PERÍODO =====
  function calcularVendasPorPeriodo() {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const inicioTrimestre = new Date(hoje.getFullYear(), Math.floor(hoje.getMonth() / 3) * 3, 1);

    const vendas = {};

    dados.forEach(item => {
      const dataVenda = new Date(item.ultimaVenda.split('/').reverse().join('-'));

      if (!vendas[item.produto]) {
        vendas[item.produto] = {
          produto: item.produto,
          quantidade: item.quantidade,
          unidadesCaixa: item.unidadesCaixa,
          estoque: item.estoque,
          diasEstimados: item.diasEstimados,
          vendaDia: 0,
          vendaMes: 0,
          vendaTrimestre: 0,
          caixasEstoque: Math.ceil(item.estoque / item.unidadesCaixa)
        };
      }

      // Venda do dia
      if (dataVenda.toDateString() === hoje.toDateString()) {
        vendas[item.produto].vendaDia = item.quantidade;
      }

      // Venda do mês
      if (dataVenda >= inicioMes) {
        vendas[item.produto].vendaMes = item.quantidade;
      }

      // Venda do trimestre
      if (dataVenda >= inicioTrimestre) {
        vendas[item.produto].vendaTrimestre = item.quantidade;
      }
    });

    return Object.values(vendas);
  }

  // ===== EXPORTAR PARA EXCEL =====
  function exportarParaExcel() {
    console.log('Função exportarParaExcel chamada!');
    console.log('Dados disponíveis:', dados.length);

    if (dados.length === 0) {
      alert('Nenhum dado para exportar!');
      return;
    }

    const wb = XLSX.utils.book_new();
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');

    // ===== ABA 1: PRODUTOS =====
    const dadosExcel = dados.map(item => {
      const caixas = Math.ceil(item.estoque / item.unidadesCaixa);
      return {
        'Produto': item.produto,
        'Quantidade Vendida': item.quantidade,
        'Un. por Caixa': item.unidadesCaixa,
        'Última Venda': item.ultimaVenda,
        'Estoque (un.)': item.estoque,
        'Estoque (caixas)': caixas,
        'Previsão (dias)': item.diasEstimados
      };
    });

    const ws1 = XLSX.utils.json_to_sheet(dadosExcel);
    ws1['!cols'] = [
      { wch: 25 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, ws1, "Produtos");

    // ===== ABA 2: VENDAS POR PERÍODO =====
    const vendasPeriodo = calcularVendasPorPeriodo();
    const sugestoes = [];

    vendasPeriodo.forEach(venda => {
      const quantidadeSugerida = Math.ceil(venda.quantidade / 7 * 2);
      const caixasSugeridas = Math.ceil(quantidadeSugerida / venda.unidadesCaixa);
      const unidadesReaisDoPedido = caixasSugeridas * venda.unidadesCaixa;

      let urgencia = 'Normal';
      if (venda.diasEstimados <= 7) urgencia = 'Urgente';
      else if (venda.diasEstimados <= 14) urgencia = 'Alta';

      sugestoes.push({
        'Produto': venda.produto,
        'Estoque Atual (cxs)': venda.caixasEstoque,
        'Un. por Caixa': venda.unidadesCaixa,
        'Venda do Dia': venda.vendaDia,
        'Venda do Mês': venda.vendaMes,
        'Venda do Trimestre': venda.vendaTrimestre,
        'Saída Semanal': venda.quantidade,
        'Dias de Estoque': venda.diasEstimados,
        'Urgência': urgencia,
        'Caixas Sugeridas': caixasSugeridas,
        'Unidades da Caixa': unidadesReaisDoPedido,
        'Demanda Real': quantidadeSugerida
      });
    });

    const ws2 = XLSX.utils.json_to_sheet(sugestoes);
    ws2['!cols'] = [
      { wch: 25 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 }
    ];
    XLSX.utils.book_append_sheet(wb, ws2, "Sugestões de Pedidos");

    XLSX.writeFile(wb, `Relatorio_Giro_${dataAtual}.xlsx`);
  }

  // ===== EXPORTAR PARA PDF =====
  function exportarParaPDF() {
    console.log('Função exportarParaPDF chamada!');
    console.log('Dados disponíveis:', dados.length);

    // Tenta recarregar dados do localStorage se estiver vazio (fallback)
    if (!dados || dados.length === 0) {
      const dadosSalvos = localStorage.getItem('giroItens');
      if (dadosSalvos) {
        try {
          dados = JSON.parse(dadosSalvos);
          console.log('Dados recarregados do localStorage para exportação:', dados ? dados.length : 0);
        } catch (e) {
          console.error('Erro ao recarregar dados:', e);
        }
      }
    }

    if (!dados || dados.length === 0) {
      alert('Nenhum dado para exportar! Certifique-se de que há produtos cadastrados na tabela e tente adicionar um novo item para "despertar" o sistema.');
      return;
    }

    // Verify loading
    if (!window.jspdf) {
      throw new Error('Biblioteca jsPDF não encontrada. Verifique se o arquivo libs/jspdf.umd.min.js existe.');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // SHIM: Garantir que o plugin autoTable esteja anexado ao documento
    if (typeof doc.autoTable !== 'function') {
      console.warn('doc.autoTable não encontrado nativamente. Tentando aplicar Shim...');
      if (window.jspdf.API && typeof window.jspdf.API.autoTable === 'function') {
        // Se o plugin anexou ao objeto exportado mas não ao protótipo da classe
        Object.assign(doc, window.jspdf.API);
        console.log('Shim aplicado: doc agora tem autoTable via window.jspdf.API');
      } else {
        // Tenta encontrar em outros lugares comuns
        const possiblePlugin = Object.values(window.jspdf).find(v => typeof v === 'function' && v.name === 'autoTable');
        if (possiblePlugin) {
          doc.autoTable = possiblePlugin;
        } else {
          throw new Error('Plugin autoTable não carregado corretamente. Verifique libs/jspdf.plugin.autotable.min.js');
        }
      }
    }
    let yPosition = 20;

    // ===== CABEÇALHO =====
    doc.setFontSize(16);
    doc.text('RELATÓRIO DE GIRO DE ITENS', 14, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR');
    doc.text(`Data: ${dataAtual} | Hora: ${horaAtual}`, 14, yPosition);
    yPosition += 5;
    const nomeUsuario = usuarioLogado ? usuarioLogado.usuario : 'Sistema';
    doc.text(`Usuário: ${nomeUsuario}`, 14, yPosition);
    yPosition += 10;

    // ===== TABELA 1: PRODUTOS =====
    doc.setFontSize(12);
    doc.text('1. RELAÇÃO DE PRODUTOS', 14, yPosition);
    yPosition += 8;

    const colunas1 = ['Produto', 'Qtd. Vendida', 'Un./Caixa', 'Estoque (un.)', 'Estoque (cxs)', 'Previsão (dias)'];
    const linhas1 = dados.map(item => {
      const caixas = Math.ceil(item.estoque / item.unidadesCaixa);
      return [
        item.produto,
        item.quantidade.toString(),
        item.unidadesCaixa.toString(),
        item.estoque.toString(),
        caixas.toString(),
        item.diasEstimados.toString()
      ];
    });

    doc.autoTable({
      head: [colunas1],
      body: linhas1,
      startY: yPosition,
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [0, 120, 212],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // ===== TABELA 2: SUGESTÕES DE PEDIDOS =====
    const vendasPeriodo = calcularVendasPorPeriodo();
    const sugestoes = [];

    vendasPeriodo.forEach(venda => {
      const quantidadeSugerida = Math.ceil(venda.quantidade / 7 * 2);
      const caixasSugeridas = Math.ceil(quantidadeSugerida / venda.unidadesCaixa);
      const unidadesReaisDoPedido = caixasSugeridas * venda.unidadesCaixa;

      let urgencia = 'Normal';
      if (venda.diasEstimados <= 7) urgencia = 'URGENTE';
      else if (venda.diasEstimados <= 14) urgencia = 'ALTA';

      sugestoes.push([
        venda.produto,
        venda.diasEstimados.toString(),
        venda.quantidade.toString(),
        caixasSugeridas.toString() + ` (${unidadesReaisDoPedido} un.) \n[Demanda: ${quantidadeSugerida}]`,
        urgencia
      ]);
    });

    doc.setFontSize(12);
    doc.text('2. SUGESTÕES DE PEDIDOS', 14, yPosition);
    yPosition += 8;

    const colunas2 = ['Produto', 'Dias Estoque', 'Saída/Semana', 'Caixas Pedir', 'Urgência'];
    doc.autoTable({
      head: [colunas2],
      body: sugestoes,
      startY: yPosition,
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [40, 167, 69],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 250, 240]
      }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // ===== TABELA 3: VENDAS POR PERÍODO =====
    const colunasVendas = [];
    const linhasVendas = vendasPeriodo.map(venda => {
      return [
        venda.produto,
        venda.vendaDia.toString(),
        venda.vendaMes.toString(),
        venda.vendaTrimestre.toString(),
        venda.quantidade.toString()
      ];
    });

    doc.setFontSize(12);
    doc.text('3. VENDAS POR PERÍODO', 14, yPosition);
    yPosition += 8;

    const colunas3 = ['Produto', 'Venda Dia', 'Venda Mês', 'Venda Trimestre', 'Saída Semanal'];
    doc.autoTable({
      head: [colunas3],
      body: linhasVendas,
      startY: yPosition,
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [255, 193, 7],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [255, 248, 225]
      }
    });

    // ===== RODAPÉ =====
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    const dataArquivo = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    doc.save(`Relatorio_Giro_${dataArquivo}.pdf`);
  }

  // ===== GERENCIAR ABAS COM HASH =====
  // ===== GERENCIAR ABAS COM HASH - REMOVIDO =====
  // As páginas agora são arquivos separados.


  function inicializarEventos() {
    // Event listener para o botão de logout (funciona em qualquer página)
    const btnLogout = document.getElementById('logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
      });
    }

    // Gerenciamento de Tema com Persistência
    const btnTema = document.getElementById('alternarTema');
    const temaSalvo = localStorage.getItem('tema');

    // Aplica o tema salvo ao carregar
    if (temaSalvo === 'claro') {
      document.body.classList.add('claro');
    }

    if (btnTema) {
      btnTema.addEventListener('click', () => {
        document.body.classList.toggle('claro');
        const novoTema = document.body.classList.contains('claro') ? 'claro' : 'escuro';
        localStorage.setItem('tema', novoTema);
      });
    }

    // Filtros e outros eventos (se existirem na página)
    const btnFiltro = document.getElementById('aplicarFiltros');
    if (btnFiltro) btnFiltro.addEventListener('click', aplicarFiltro);

    const btnLimpar = document.getElementById('limparFiltros');
    if (btnLimpar) {
      btnLimpar.addEventListener('click', () => {
        const fNome = document.getElementById('filtroNome');
        const fData = document.getElementById('filtroData');
        if (fNome) fNome.value = "";
        if (fData) fData.value = "";
        atualizarTabela();
        const listaFull = typeof dados !== 'undefined' ? dados : [];
        if (typeof atualizarGraficoFiltrado === 'function') atualizarGraficoFiltrado(listaFull);
        if (typeof atualizarGraficoPrevisao === 'function') atualizarGraficoPrevisao(listaFull);
      });
    }

    const formNovoUsuario = document.getElementById('formNovoUsuario');
    if (formNovoUsuario) {
      formNovoUsuario.addEventListener('submit', function (e) {
        e.preventDefault();

        // Normalização: tudo para minúsculo
        const nome = document.getElementById('novoUsuario').value.trim().toLowerCase();
        const senha = document.getElementById('novaSenha').value.trim();
        const nivel = parseInt(document.getElementById('nivelNovoUsuario').value);
        const status = document.getElementById('cadastroStatus');

        if (!nome || !senha || isNaN(nivel)) {
          if (status) {
            status.textContent = "Preencha todos os campos.";
            status.style.color = "#ff3c3c";
            status.style.display = "block";
          }
          return;
        }

        const existe = usuarios.find(u => u.usuario.toLowerCase() === nome);
        if (existe) {
          if (status) {
            status.textContent = "Usuário já existe.";
            status.style.color = "#ff3c3c";
            status.style.display = "block";
          }
          return;
        }

        usuarios.push({ usuario: nome, senha, nivel });
        salvarUsuarios();

        // Atualiza a lista visual se a função existir
        if (typeof atualizarListaUsuarios === 'function') atualizarListaUsuarios();

        if (status) {
          status.textContent = `Usuário "${nome}" cadastrado com sucesso!`;
          status.style.color = "#4caf50";
          status.style.display = "block";
        }
        e.target.reset();
      });
    }

    const formP = document.getElementById('formPerfil');
    if (formP) {
      formP.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nomePerfil').value.trim();
        const email = document.getElementById('emailPerfil').value.trim();
        const telefone = document.getElementById('telefonePerfil').value.trim();
        const fotoPreview = document.getElementById('fotoPreview');
        const foto = fotoPreview ? fotoPreview.src : "";

        const perfil = { nome, email, telefone, foto };
        localStorage.setItem(`perfil_${usuarioLogado.usuario}`, JSON.stringify(perfil));

        const statusP = document.getElementById('statusPerfil');
        if (statusP) {
          statusP.textContent = "✓ Perfil atualizado com sucesso!";
          statusP.style.color = "#4caf50";
          statusP.style.display = "block";
          setTimeout(() => {
            if (statusP) statusP.style.display = "none";
          }, 3000);
        }
      });
    }

    const fotoInput = document.getElementById('fotoPerfil');
    if (fotoInput) {
      fotoInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
          // Valida tamanho (máx 5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert('A imagem não pode ter mais de 5MB');
            return;
          }

          // Valida tipo
          if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione uma imagem válida');
            return;
          }

          const reader = new FileReader();
          reader.onload = function (e) {
            // Resize image to avoid localStorage quota limits
            const img = new Image();
            img.onload = function () {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');

              // Define max dimensions (e.g. 300x300 for avatars)
              const MAX_WIDTH = 300;
              const MAX_HEIGHT = 300;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);

              const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);

              document.getElementById('fotoPreview').src = resizedDataUrl;
              document.getElementById('fotoTopo').src = resizedDataUrl;

              // Salva automaticamente
              const perfil = localStorage.getItem(`perfil_${usuarioLogado.usuario}`);
              const perfilObj = perfil ? JSON.parse(perfil) : { nome: '', email: '', telefone: '' };
              perfilObj.foto = resizedDataUrl;
              try {
                localStorage.setItem(`perfil_${usuarioLogado.usuario}`, JSON.stringify(perfilObj));
              } catch (err) {
                console.error("Erro ao salvar perfil (provavelmente imagem muito grande):", err);
                alert("A imagem selecionada é muito grande para salvar no navegador. Tente uma menor.");
              }
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const formProduto = document.getElementById('formProduto');
    if (formProduto) {
      formProduto.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('produto').value.trim();
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const unidadesCaixa = parseInt(document.getElementById('unidadesCaixa').value) || 1;
        const data = document.getElementById('dataVenda').value;
        const estoque = parseInt(document.getElementById('estoque').value);

        if (!nome || isNaN(quantidade) || !data || isNaN(estoque) || isNaN(unidadesCaixa)) return;

        const mediaDiaria = quantidade / 7;
        const diasEstimados = mediaDiaria > 0 ? Math.ceil(estoque / mediaDiaria) : 0;

        const dataPartes = data.split('-');
        const dataFormatada = `${dataPartes[2]}/${dataPartes[1]}/${dataPartes[0]}`;

        const novoItem = {
          produto: nome,
          quantidade,
          unidadesCaixa,
          ultimaVenda: dataFormatada,
          estoque,
          diasEstimados
        };

        dados.push(novoItem);
        salvarDadosLocal();
        atualizarTabela();

        // Atualização Segura de Gráficos
        if (typeof atualizarGraficoFiltrado === 'function') atualizarGraficoFiltrado(dados);
        if (typeof atualizarGraficoPrevisao === 'function') atualizarGraficoPrevisao(dados);

        if (typeof gerarSugestoesPedidos === 'function') gerarSugestoesPedidos();

        formProduto.reset();

        const msg = document.createElement('div');
        msg.className = 'mensagem-sucesso';
        msg.innerHTML = '<i class="fas fa-check-circle"></i> Produto cadastrado!';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
      });
    }


  }

  function aplicarFiltro() {
    const nome = document.getElementById('filtroNome').value.toLowerCase();
    const data = document.getElementById('filtroData').value;

    const filtrados = dados.filter(item => {
      const nomeMatch = item.produto.toLowerCase().includes(nome);
      const dataMatch = data ? item.ultimaVenda === new Date(data).toLocaleDateString('pt-BR') : true;
      return nomeMatch && dataMatch;
    });

    atualizarTabelaFiltrada(filtrados);
    atualizarGraficoFiltrado(filtrados);
    atualizarGraficoPrevisao(filtrados);
  }

  function atualizarTabelaFiltrada(lista) {
    if (!corpoTabela) return;
    corpoTabela.innerHTML = "";
    lista.forEach((item, indice) => {
      const estoque = parseInt(item.estoque) || 0;
      const unidadesCaixa = parseInt(item.unidadesCaixa) || 1;
      const quantidadeVendida = parseInt(item.quantidade) || 0;
      const caixas = Math.ceil(estoque / unidadesCaixa);

      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${item.produto || 'Sem nome'}</td>
        <td>${quantidadeVendida}</td>
        <td>${unidadesCaixa} un.</td>
        <td>${item.ultimaVenda || '-'}</td>
        <td>${estoque}</td>
        <td><strong>${caixas} cxs</strong></td>
        <td>${parseInt(item.diasEstimados) || 0} dias</td>
        <td style="text-align: center;">
          <button class="btn-acao btn-editar" data-indice="${indice}" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-acao btn-deletar" data-indice="${indice}" title="Deletar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      corpoTabela.appendChild(linha);
    });

    // Re-adicionar event listeners (necessário porque o innerHTML foi resetado)
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', function () {
        abrirModalEdicao(parseInt(this.getAttribute('data-indice')));
      });
    });

    document.querySelectorAll('.btn-deletar').forEach(btn => {
      btn.addEventListener('click', function () {
        deletarProduto(parseInt(this.getAttribute('data-indice')));
      });
    });
  }

  function atualizarGraficoFiltrado(lista) {
    if (grafico && grafico.data) {
      grafico.data.labels = lista.map(item => item.produto);
      grafico.data.datasets[0].data = lista.map(item => item.quantidade);
      grafico.update();
    }
  }

  function atualizarGraficoPrevisao(lista) {
    if (graficoPrevisao && graficoPrevisao.data) {
      graficoPrevisao.data.labels = lista.map(item => item.produto);
      graficoPrevisao.data.datasets[0].data = lista.map(item => item.diasEstimados);
      graficoPrevisao.update();
    }
  }

  // ===== FUNÇÕES DE EDIÇÃO =====
  let indiceProdutoEditando = null;

  function abrirModalEdicao(indice) {
    indiceProdutoEditando = indice;
    const produto = dados[indice];

    document.getElementById('editProduto').value = produto.produto || '';
    document.getElementById('editQuantidade').value = produto.quantidade || 0;
    document.getElementById('editUnidadesCaixa').value = produto.unidadesCaixa || 1;

    // Converte DD/MM/YYYY para YYYY-MM-DD para o input=date
    if (produto.ultimaVenda && produto.ultimaVenda.includes('/')) {
      const partes = produto.ultimaVenda.split('/');
      document.getElementById('editDataVenda').value = `${partes[2]}-${partes[1]}-${partes[0]}`;
    } else {
      document.getElementById('editDataVenda').value = '';
    }

    document.getElementById('editEstoque').value = produto.estoque || 0;

    document.getElementById('modalEditarProduto').classList.add('ativo');
  }

  function fecharModal() {
    document.getElementById('modalEditarProduto').classList.remove('ativo');
    indiceProdutoEditando = null;
  }

  function salvarEdicaoProduto(event) {
    event.preventDefault();

    if (indiceProdutoEditando === null) return;

    const produto = document.getElementById('editProduto').value.trim();
    const quantidade = parseInt(document.getElementById('editQuantidade').value) || 0;
    const unidadesCaixa = parseInt(document.getElementById('editUnidadesCaixa').value) || 1;
    const dataVenda = document.getElementById('editDataVenda').value;
    const estoque = parseInt(document.getElementById('editEstoque').value) || 0;

    if (!produto || quantidade <= 0 || estoque < 0) {
      alert('Preenchimento inválido. Verifique os dados.');
      return;
    }

    const mediaDiaria = quantidade / 7;
    const diasEstimados = mediaDiaria > 0 ? Math.ceil(estoque / mediaDiaria) : 0;

    // Formata data de YYYY-MM-DD para DD/MM/YYYY para salvar
    const dataPartes = dataVenda.split('-');
    const dataFormatada = dataPartes.length === 3 ? `${dataPartes[2]}/${dataPartes[1]}/${dataPartes[0]}` : dataVenda;

    // Atualizar o produto no array
    dados[indiceProdutoEditando] = {
      ...dados[indiceProdutoEditando],
      produto,
      quantidade,
      unidadesCaixa,
      ultimaVenda: dataFormatada,
      estoque,
      diasEstimados
    };

    salvarDadosLocal();
    fecharModal();

    // Atualizar as visualizações de forma segura
    atualizarTabela();
    if (typeof atualizarGraficoFiltrado === 'function') atualizarGraficoFiltrado(dados);
    if (typeof atualizarGraficoPrevisao === 'function') atualizarGraficoPrevisao(dados);

    // Mostrar mensagem de sucesso
    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem-sucesso';
    mensagem.innerHTML = '<i class="fas fa-check-circle"></i> Produto atualizado com sucesso!';
    document.body.appendChild(mensagem);
    setTimeout(() => mensagem.remove(), 3000);
  }

  function deletarProduto(indice) {
    const produto = dados[indice];
    if (confirm(`Deseja deletar o produto "${produto.produto}"?`)) {
      dados.splice(indice, 1);
      salvarDadosLocal();

      // Atualizar as visualizações de forma segura
      atualizarTabela();
      if (typeof atualizarGraficoFiltrado === 'function') atualizarGraficoFiltrado(dados);
      if (typeof atualizarGraficoPrevisao === 'function') atualizarGraficoPrevisao(dados);

      // Mostrar mensagem de sucesso
      const mensagem = document.createElement('div');
      mensagem.className = 'mensagem-sucesso';
      mensagem.innerHTML = '<i class="fas fa-trash-alt"></i> Produto deletado com sucesso!';
      document.body.appendChild(mensagem);
      setTimeout(() => mensagem.remove(), 3000);
    }
  }

  function atualizarTabelaFiltrada(lista) {
    if (!corpoTabela) return;
    corpoTabela.innerHTML = "";
    lista.forEach((item, indice) => {
      const estoque = parseInt(item.estoque) || 0;
      const unidadesCaixa = parseInt(item.unidadesCaixa) || 1;
      const quantidadeVendida = parseInt(item.quantidade) || 0;
      const caixas = Math.ceil(estoque / unidadesCaixa);

      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${item.produto || 'Sem nome'}</td>
        <td>${quantidadeVendida}</td>
        <td>${unidadesCaixa} un.</td>
        <td>${item.ultimaVenda || '-'}</td>
        <td>${estoque}</td>
        <td><strong>${caixas} cxs</strong></td>
        <td>${parseInt(item.diasEstimados) || 0} dias</td>
        <td style="text-align: center;">
          <button class="btn-acao btn-editar" data-indice="${indice}" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-acao btn-deletar" data-indice="${indice}" title="Deletar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      corpoTabela.appendChild(linha);
    });

    // Re-adicionar event listeners (necessário porque o innerHTML foi resetado)
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', function () {
        abrirModalEdicao(parseInt(this.getAttribute('data-indice')));
      });
    });

    document.querySelectorAll('.btn-deletar').forEach(btn => {
      btn.addEventListener('click', function () {
        deletarProduto(parseInt(this.getAttribute('data-indice')));
      });
    });
  }

  // Event listeners do modal (protegidos)
  const formEditar = document.getElementById('formEditarProduto');
  if (formEditar) formEditar.addEventListener('submit', salvarEdicaoProduto);

  const btnFecharModal = document.getElementById('btnFecharModal');
  if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);

  const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
  if (btnCancelarEdicao) btnCancelarEdicao.addEventListener('click', fecharModal);

  // Fechar modal ao clicar fora
  const modalEditar = document.getElementById('modalEditarProduto');
  if (modalEditar) {
    modalEditar.addEventListener('click', function (e) {
      if (e.target === this) {
        fecharModal();
      }
    });
  }

  // ===== LISTENERS DE EXPORTAÇÃO (GLOBAL) =====
  const btnExportarCSV = document.getElementById('exportarCSV');
  const btnExportarPDF = document.getElementById('exportarPDF');

  if (btnExportarCSV) {
    btnExportarCSV.addEventListener('click', function () {
      console.log('Botão Excel clicado');
      try {
        if (typeof XLSX === 'undefined') {
          throw new Error('Biblioteca XLSX não carregada. Verifique sua conexão com a internet ou os arquivos locais.');
        }
        exportarParaExcel();
      } catch (error) {
        console.error('Erro ao exportar Excel:', error);
        alert('Erro ao exportar Excel: ' + error.message);
      }
    });
  } else {
    console.warn('Botão exportarCSV não encontrado no DOM');
  }

  if (btnExportarPDF) {
    btnExportarPDF.addEventListener('click', function () {
      console.log('Botão PDF clicado');
      try {
        if (typeof window.jspdf === 'undefined') {
          throw new Error('Biblioteca jsPDF não carregada. Verifique sua conexão com a internet ou os arquivos locais.');
        }
        exportarParaPDF();
      } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        alert('Erro ao exportar PDF: ' + error.message);
      }
    });
  }

  // ATIVAÇÃO DOS EVENTOS GLOBAIS
  inicializarEventos();

  // Função para listar usuários na tela de gestão
  function atualizarListaUsuarios() {
    const corpo = document.getElementById('tabelaUsuariosCorpo');
    if (!corpo) return;

    // Segurança extra: se não for Desenvolvedor, nem tenta renderizar e esconde o card
    if (usuarioLogado && usuarioLogado.nivel > 1) {
      const cardLista = document.getElementById('cardListaUsuarios');
      if (cardLista) cardLista.style.display = "none";
      return;
    }

    corpo.innerHTML = "";
    usuarios.forEach((u, index) => {
      // Não permite deletar usuários protegidos (dev e leon)
      const isProtected = u.usuario === 'dev' || u.usuario.toLowerCase() === 'leon';
      const cargo = u.nivel === 1 ? '👨‍💻 Dev' : u.nivel === 2 ? '👔 Gestor' : '👷 Func.';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.usuario}</td>
        <td>${cargo}</td>
        <td style="text-align: center;">
          ${!isProtected ? `
            <button class="btn-acao btn-deletar delete-user" data-index="${index}" title="Excluir Usuário">
              <i class="fas fa-user-minus"></i>
            </button>
          ` : '<small>Protegido</small>'}
        </td>
      `;
      corpo.appendChild(tr);
    });

    // Eventos de exclusão de usuário
    document.querySelectorAll('.delete-user').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        if (confirm(`Deseja excluir o usuário ${usuarios[idx].usuario}?`)) {
          usuarios.splice(idx, 1);
          salvarUsuarios();
          atualizarListaUsuarios();
        }
      });
    });
  }

  // Inicializa a lista se estiver na página correta
  if (document.getElementById('tabelaUsuariosCorpo')) {
    atualizarListaUsuarios();
  }

  // Removidas funções duplicadas que foram movidas/corrigidas acima
});

