document.addEventListener("DOMContentLoaded", () => {
  let dados = [];
  let usuarios = [];
  let usuarioLogado = null;

  function carregarUsuarios() {
    const salvos = localStorage.getItem('usuarios');
    if (salvos) {
      usuarios = JSON.parse(salvos);
    } else {
      usuarios = [
        { usuario: "dev", senha: "dev123", nivel: 1 },
        { usuario: "gestor", senha: "gestor123", nivel: 2 },
        { usuario: "func", senha: "func123", nivel: 3 }
      ];
      salvarUsuarios();
    }
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

  const corpoTabela = document.getElementById('tabelaCorpo');

  function atualizarTabela() {
    corpoTabela.innerHTML = "";
    dados.forEach(item => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${item.produto}</td>
        <td>${item.quantidade}</td>
        <td>${item.ultimaVenda}</td>
        <td>${item.estoque}</td>
        <td>${item.diasEstimados} dias</td>
      `;
      corpoTabela.appendChild(linha);
    });
  }

  const ctx = document.getElementById('graficoGiro').getContext('2d');
  const grafico = new Chart(ctx, {
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
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Giro de Itens',
          font: { size: 18 },
          color: '#0078D4'
        }
      }
    }
  });

  const ctx2 = document.getElementById('graficoPrevisao').getContext('2d');
  const graficoPrevisao = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: dados.map(item => item.produto),
      datasets: [{
        label: 'Dias para vender estoque',
        data: dados.map(item => item.diasEstimados),
        backgroundColor: '#333',
        borderRadius: 10
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Previsão de Vendas',
          color: '#0078D4',
          font: { size: 18 }
        }
      }
    }
  });

  atualizarTabela();

  const formLogin = document.getElementById('formLogin');
  const telaLogin = document.getElementById('telaLogin');
  const painelPrincipal = document.getElementById('painelPrincipal');
  const erroLogin = document.getElementById('erroLogin');

  formLogin.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();

    const encontrado = usuarios.find(u => u.usuario === nome && u.senha === senha);

    if (encontrado) {
      usuarioLogado = encontrado;
      telaLogin.style.display = "none";
      painelPrincipal.style.display = "block";
      erroLogin.style.display = "none";
      aplicarPermissoes(encontrado.nivel);
      mostrarUsuarioLogado();
      inicializarEventos();
    } else {
      erroLogin.style.display = "block";
    }
  });

  function aplicarPermissoes(nivel) {
    if (nivel > 1) document.getElementById('relatorios').style.display = "none";
    if (nivel > 2) {
      const formCadastro = document.getElementById('cadastro').querySelector('form');
      if (formCadastro) formCadastro.style.display = "none";
    }
    if (nivel > 1) document.getElementById('usuarios').style.display = "none";
  }

  function mostrarUsuarioLogado() {
    document.getElementById('nomeUsuario').textContent = usuarioLogado.usuario;
    document.getElementById('nivelUsuario').textContent = `(Nível ${usuarioLogado.nivel})`;

    const icone = document.getElementById('iconeNivel');
    icone.textContent =
      usuarioLogado.nivel === 1 ? '🧑‍💻' :
      usuarioLogado.nivel === 2 ? '👔' :
      '👷‍♂️';

    const perfilSalvo = localStorage.getItem(`perfil_${usuarioLogado.usuario}`);
    if (perfilSalvo) {
      const perfil = JSON.parse(perfilSalvo);
      document.getElementById('fotoTopo').src = perfil.foto || "https://via.placeholder.com/50";
    }
  }

  function inicializarEventos() {
    document.getElementById('logout').addEventListener('click', () => {
      usuarioLogado = null;
      painelPrincipal.style.display = "none";
      telaLogin.style.display = "block";
      erroLogin.style.display = "none";
      document.getElementById('usuario').value = "";
      document.getElementById('senha').value = "";

      document.querySelectorAll('.aba').forEach(b => b.classList.remove('ativa'));
      document.querySelector('[data-alvo="cadastro"]').classList.add('ativa');
      document.querySelectorAll('.conteudo-aba').forEach(secao => secao.classList.remove('ativa'));
      document.getElementById('cadastro').classList.add('ativa');
    });

    document.getElementById('alternarTema').addEventListener('click', () => {
      document.body.classList.toggle('claro');
    });

    document.querySelectorAll('.aba').forEach(botao => {
      botao.addEventListener('click', () => {
        document.querySelectorAll('.aba').forEach(b => b.classList.remove('ativa'));
        botao.classList.add('ativa');

        document.querySelectorAll('.conteudo-aba').forEach(secao => secao.classList.remove('ativa'));
        const alvo = botao.getAttribute('data-alvo');
        document.getElementById(alvo).classList.add('ativa');
      });
    });

    document.getElementById('aplicarFiltros').addEventListener('click', aplicarFiltro);
    document.getElementById('limparFiltros').addEventListener('click', () => {
      document.getElementById('filtroNome').value = "";
      document.getElementById('filtroData').value = "";
      atualizarTabela();
      atualizarGraficoFiltrado(dados);
      atualizarGraficoPrevisao(dados);
    });

    document.getElementById('formNovoUsuario').addEventListener('submit', function(e) {
      e.preventDefault();

      const nome = document.getElementById('novoUsuario').value.trim();
      const senha = document.getElementById('novaSenha').value.trim();
      const nivel = parseInt(document.getElementById('nivelNovoUsuario').value);
      const status = document.getElementById('cadastroStatus');

      if (!nome || !senha || isNaN(nivel)) {
        status.textContent = "Preencha todos os campos.";
        status.style.color = "#ff3c3c";
        return;
      }

      const existe = usuarios.find(u => u.usuario === nome);
      if (existe) {
        status.textContent = "Usuário já existe.";
        status.style.color = "#ff3c3c";
        return;
      }

      usuarios.push({ usuario: nome, senha, nivel });
      salvarUsuarios();

      status.textContent = `Usuário "${nome}" cadastrado com sucesso!`;
      status.style.color = "#4caf50";
      e.target.reset();
    });

    document.getElementById('formPerfil').addEventListener('submit', function(e) {
      e.preventDefault();

      const nome = document.getElementById('nomePerfil').value.trim();
      const email = document.getElementById('emailPerfil').value.trim();
      const telefone = document.getElementById('telefonePerfil').value.trim();
      const foto = document.getElementById('fotoPreview').src;

            const perfil = { nome, email, telefone, foto };
      localStorage.setItem(`perfil_${usuarioLogado.usuario}`, JSON.stringify(perfil));

      document.getElementById('statusPerfil').textContent = "Perfil atualizado com sucesso!";
      document.getElementById('statusPerfil').style.color = "#4caf50";
    });

    const fotoInput = document.getElementById('fotoPerfil');
    if (fotoInput) {
      fotoInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            document.getElementById('fotoPreview').src = e.target.result;
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
        const data = document.getElementById('dataVenda').value;
        const estoque = parseInt(document.getElementById('estoque').value);

        if (!nome || isNaN(quantidade) || !data || isNaN(estoque)) return;

        const diasEstimados = Math.ceil(estoque / (quantidade / 7));

        const novoItem = {
          produto: nome,
          quantidade,
          ultimaVenda: new Date(data).toLocaleDateString('pt-BR'),
          estoque,
          diasEstimados
        };

        dados.push(novoItem);
        salvarDadosLocal();
        atualizarTabela();

        grafico.data.labels.push(novoItem.produto);
        grafico.data.datasets[0].data.push(novoItem.quantidade);
        grafico.update();

        graficoPrevisao.data.labels.push(novoItem.produto);
        graficoPrevisao.data.datasets[0].data.push(novoItem.diasEstimados);
        graficoPrevisao.update();

        formProduto.reset();
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
    corpoTabela.innerHTML = "";
    lista.forEach(item => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${item.produto}</td>
        <td>${item.quantidade}</td>
        <td>${item.ultimaVenda}</td>
        <td>${item.estoque}</td>
        <td>${item.diasEstimados} dias</td>
      `;
      corpoTabela.appendChild(linha);
    });
  }

  function atualizarGraficoFiltrado(lista) {
    grafico.data.labels = lista.map(item => item.produto);
    grafico.data.datasets[0].data = lista.map(item => item.quantidade);
    grafico.update();
  }

  function atualizarGraficoPrevisao(lista) {
    graficoPrevisao.data.labels = lista.map(item => item.produto);
    graficoPrevisao.data.datasets[0].data = lista.map(item => item.diasEstimados);
    graficoPrevisao.update();
  }
});