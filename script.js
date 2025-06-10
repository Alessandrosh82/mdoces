<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MDoces Delivery</title>
<style>
  /* Reset básico */
  * {
    box-sizing: border-box;
  }
  body {
    font-family: Arial, sans-serif;
    background: #f9f9f9;
    color: #222;
    margin: 0; padding: 0 10px 40px;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  h1 {
    text-align: center;
    margin: 20px 0;
    color: #2c3e50;
  }
  section {
    margin-bottom: 30px;
  }
  h2 {
    border-bottom: 2px solid #3f51b5;
    padding-bottom: 6px;
    color: #3f51b5;
  }
  .produto {
    display: flex;
    align-items: center;
    background: white;
    margin: 10px 0;
    border-radius: 6px;
    box-shadow: 0 1px 3px #ccc;
    padding: 10px;
  }
  .produto img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
    margin-right: 15px;
    flex-shrink: 0;
  }
  .produto > div:first-child {
    flex-grow: 1;
  }
  .produto h3 {
    margin: 0 0 6px;
    font-size: 1.1em;
  }
  .produto p {
    margin: 0 0 6px;
    font-size: 0.9em;
    color: #555;
  }
  .produto strong {
    color: #000;
    font-weight: 700;
  }
  .quantidade-container {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .quantidade-container button {
    background: #3f51b5;
    border: none;
    color: white;
    font-weight: bold;
    font-size: 1.2em;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
  }
  .quantidade-container span {
    margin: 0 8px;
    min-width: 20px;
    text-align: center;
    font-weight: 600;
  }
  .produto button[onclick^="adicionarAoCarrinho"] {
    margin-left: 10px;
    background: #2196f3;
    border: none;
    color: white;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
  }
  .produto button[onclick^="adicionarAoCarrinho"]:hover {
    background: #1769aa;
  }

  /* Carrinho */
  #carrinho-container {
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 4px #bbb;
    padding: 15px;
    margin-bottom: 30px;
  }
  #carrinho-container h2 {
    margin-top: 0;
  }
  #itens-carrinho {
    list-style: none;
    padding-left: 0;
    margin: 0 0 10px;
  }
  #itens-carrinho li {
    padding: 6px 8px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #itens-carrinho li button {
    background: transparent;
    border: none;
    color: #c62828;
    font-size: 1.2em;
    cursor: pointer;
    line-height: 1;
  }
  #total {
    font-weight: bold;
    font-size: 1.2em;
    text-align: right;
  }

  /* Formulário finalização */
  form#finalizar-pedido {
    background: white;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 1px 4px #bbb;
    margin-bottom: 30px;
  }
  form#finalizar-pedido label {
    display: block;
    margin-top: 10px;
    font-weight: 600;
  }
  form#finalizar-pedido input[type="text"],
  form#finalizar-pedido select,
  form#finalizar-pedido textarea {
    width: 100%;
    padding: 8px 6px;
    margin-top: 4px;
    border-radius: 4px;
    border: 1px solid #bbb;
    font-size: 1em;
    font-family: inherit;
    resize: vertical;
  }
  form#finalizar-pedido textarea {
    min-height: 60px;
  }
  form#finalizar-pedido button[type="button"] {
    margin-top: 15px;
    background: #4caf50;
    color: white;
    font-weight: 700;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background 0.3s;
  }
  form#finalizar-pedido button[type="button"]:hover {
    background: #388e3c;
  }

  /* Status pedidos */
  #status-pedidos {
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 4px #bbb;
    padding: 15px;
    margin-bottom: 30px;
  }
  #status-pedidos h2 {
    margin-top: 0;
  }
  .pedido-status {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }
  .pedido-status:last-child {
    border-bottom: none;
  }
  .pedido-status h3 {
    margin: 0 0 6px;
    color: #3f51b5;
  }
  .pedido-status p {
    margin: 4px 0;
    font-size: 0.9em;
  }
  .status-badge {
    padding: 2px 8px;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    font-size: 0.85em;
  }
  .status-0 { background: #2196f3; }
  .status-1 { background: #ff9800; }
  .status-2 { background: #9c27b0; }
  .status-3 { background: #4caf50; }

  /* Botões para atualizar status - exemplo admin */
  .btn-status-update {
    margin-left: 5px;
    padding: 2px 6px;
    font-size: 0.8em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: white;
  }
  .btn-status-update[data-status="0"] { background: #2196f3; }
  .btn-status-update[data-status="1"] { background: #ff9800; }
  .btn-status-update[data-status="2"] { background: #9c27b0; }
  .btn-status-update[data-status="3"] { background: #4caf50; }
</style>
</head>
<body>

<h1>MDoces Delivery</h1>

<!-- Produtos agrupados -->
<div id="produtos"></div>

<!-- Carrinho -->
<div id="carrinho-container" aria-live="polite" aria-label="Carrinho de compras">
  <h2>Seu Carrinho</h2>
  <ul id="itens-carrinho"></ul>
  <div id="total">Total: R$ 0.00</div>
</div>

<!-- Formulário para finalizar pedido -->
<form id="finalizar-pedido" onsubmit="return false;">
  <h2>Finalizar Pedido</h2>
  <label for="nome-cliente">Nome:</label>
  <input type="text" id="nome-cliente" required placeholder="Seu nome completo" />

  <label for="endereco">Endereço:</label>
  <input type="text" id="endereco" required placeholder="Rua, número, bairro, cidade" />

  <label for="forma-pagamento">Forma de pagamento:</label>
  <select id="forma-pagamento" required>
    <option value="">-- Selecione --</option>
    <option value="Dinheiro">Dinheiro</option>
    <option value="Cartão">Cartão</option>
    <option value="Pix">Pix</option>
  </select>

  <label for="observacoes">Observações (opcional):</label>
  <textarea id="observacoes" placeholder="Exemplo: Entregar após 18h"></textarea>

  <button type="button" onclick="finalizarPedido()">Enviar Pedido</button>
</form>

<!-- Status dos pedidos (acompanhe aqui) -->
<div id="status-pedidos" aria-live="polite" aria-label="Status dos pedidos"></div>

<script>
  // Seu JS atualizado incorporado aqui
  // Produtos exemplo — pode ser carregado de localStorage/admin futuramente
  let produtos = [
    {
      id: 'doc1',
      nome: 'Brigadeiro Gourmet',
      descricao: 'Delicioso brigadeiro feito com chocolate belga.',
      preco: 6.5,
      categoria: 'Doces',
      imagem: 'https://i.imgur.com/YxTxL5D.jpg',
    },
    {
      id: 'doc2',
      nome: 'Beijinho de Coco',
      descricao: 'Tradicional beijinho com coco ralado fresco.',
      preco: 6.0,
      categoria: 'Doces',
      imagem: 'https://i.imgur.com/Zu3ntNp.jpg',
    },
    {
      id: 'bolo1',
      nome: 'Bolo de Cenoura',
      descricao: 'Bolo macio de cenoura com cobertura de chocolate.',
      preco: 30.0,
      categoria: 'Bolos',
      imagem: 'https://i.imgur.com/5ZWkmXc.jpg',
    },
    {
      id: 'bolo2',
      nome: 'Bolo de Chocolate',
      descricao: 'Bolo de chocolate com recheio de brigadeiro.',
      preco: 35.0,
      categoria: 'Bolos',
      imagem: 'https://i.imgur.com/k0ysI4q.jpg',
    },
  ];

  // Categorias extraídas automaticamente
  function getCategorias() {
    return [...new Set(produtos.map(p => p.categoria))];
  }

  let categorias = getCategorias();

  // Estado do carrinho e pedidos
  let carrinho = JSON.parse(localStorage.getItem('mdoces-carrinho')) || [];
  let pedidos = JSON.parse(localStorage.getItem('mdoces-pedidos')) || [];

  // Renderiza produtos por categoria no container #produtos
  function renderProdutos() {
    const container = document.getElementById('produtos');
    if (!container) return;

    categorias = getCategorias(); // Atualiza categorias caso produtos mudem
    container.innerHTML = '';

    categorias.forEach(cat => {
      const section = document.createElement('section');
      const h2 = document.createElement('h2');
      h2.textContent = cat;
      section.appendChild(h2);

      produtos.filter(p => p.categoria === cat).forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto';

        div.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}" />
          <div>
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <strong>R$ ${produto.preco.toFixed(2)}</strong>
          </div>
          <div class="quantidade-container">
            <button aria-label="Diminuir quantidade" onclick="alterarQuantidade('${produto.id}', -1)">-</button>
            <span id="qtd-${produto.id}">${getQuantidade(produto.id)}</span>
            <button aria-label="Aumentar quantidade" onclick="alterarQuantidade('${produto.id}', 1)">+</button>
          </div>
          <button onclick="adicionarAoCarrinho('${produto.id}')">Adicionar</button>
        `;

        section.appendChild(div);
      });

      container.appendChild(section);
    });
  }

  // Retorna quantidade atual no carrinho do produto pelo id
  function getQuantidade(produtoId) {
    const item = carrinho.find(i => i.id === produtoId);
    return item ? item.quantidade : 0;
  }

  // Altera quantidade no carrinho (pode ser positivo ou negativo)
  function alterarQuantidade(produtoId, delta) {
    const index = carrinho.findIndex(i => i.id === produtoId);

    if (index === -1 && delta > 0) {
      carrinho.push({ id: produtoId, quantidade: delta });
    } else if (index !== -1) {
      carrinho[index].quantidade += delta;
      if (carrinho[index].quantidade < 1) {
        carrinho.splice(index, 1);
      }
    }

    salvarCarrinho();
    atualizarQuantidadeTela(produtoId);
    renderCarrinho();
  }

  // Adiciona um produto no carrinho (quantidade +1)
  function adicionarAoCarrinho(produtoId) {
    alterarQuantidade(produtoId, 1);
  }

  // Atualiza a quantidade mostrada no produto
  function atualizarQuantidadeTela(produtoId) {
    const span = document.getElementById(`qtd-${produtoId}`);
    if (span) {
      span.textContent = getQuantidade(produtoId);
    }
  }

  // Renderiza os itens do carrinho na tela e total
  function renderCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    if (!lista) return;

    lista.innerHTML = '';

    if (carrinho.length === 0) {
      lista.innerHTML = '<li>Seu carrinho está vazio.</li>';
    } else {
      carrinho.forEach(item => {
        const produto = produtos.find(p => p.id === item.id);
        if (!produto) return;

        const li = document.createElement('li');
        li.innerHTML = `
          ${produto.nome} x${item.quantidade} 
          <button aria-label="Remover item" onclick="removerDoCarrinho('${item.id}')">✕</button>
        `;
        lista.appendChild(li);
      });
    }

    atualizarTotal();
  }

  // Remove item do carrinho
  function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(i => i.id !== produtoId);
    salvarCarrinho();
    renderCarrinho();
    atualizarQuantidadeTela(produtoId);
  }

  // Atualiza o total do pedido
  function atualizarTotal() {
    const total = carrinho.reduce((acc, item) => {
      const produto = produtos.find(p => p.id === item.id);
      return produto ? acc + produto.preco * item.quantidade : acc;
    }, 0);

    const elTotal = document.getElementById('total');
    if (elTotal) {
      elTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
    }
  }

  // Salva o carrinho no localStorage
  function salvarCarrinho() {
    localStorage.setItem('mdoces-carrinho', JSON.stringify(carrinho));
  }

  // Gera ID único simples para pedido
  function gerarIdPedido() {
    return 'PED-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7).toUpperCase();
  }

  // Função para finalizar pedido
  function finalizarPedido() {
    const nomeCliente = document.getElementById('nome-cliente').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const formaPagamento = document.getElementById('forma-pagamento').value;
    const observacoes = document.getElementById('observacoes').value.trim();

    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio. Adicione produtos para finalizar o pedido.');
      return;
    }
    if (!nomeCliente || !endereco || !formaPagamento) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const pedidoId = gerarIdPedido();
    const dataHora = new Date().toISOString();

    const pedido = {
      id: pedidoId,
      cliente: nomeCliente,
      endereco,
      formaPagamento,
      observacoes,
      produtos: JSON.parse(JSON.stringify(carrinho)),
      dataHora,
      status: 0, // 0 = recebido
    };

    pedidos.push(pedido);
    salvarPedidos();

    // Limpa carrinho e formulário
    carrinho = [];
    salvarCarrinho();
    renderCarrinho();
    renderProdutos(); // Atualiza as quantidades na tela
    document.getElementById('finalizar-pedido').reset();

    alert(`Pedido enviado com sucesso!\nSeu número de pedido: ${pedidoId}`);

    // Atualiza status dos pedidos na tela
    renderStatusPedidos();
  }

  // Salva pedidos no localStorage
  function salvarPedidos() {
    localStorage.setItem('mdoces-pedidos', JSON.stringify(pedidos));
  }

  // Atualiza status dos pedidos na tela
  function renderStatusPedidos() {
    const container = document.getElementById('status-pedidos');
    if (!container) return;

    container.innerHTML = '<h2>Status dos Pedidos</h2>';

    if (pedidos.length === 0) {
      container.innerHTML += '<p>Nenhum pedido realizado ainda.</p>';
      return;
    }

    pedidos.forEach(pedido => {
      const div = document.createElement('div');
      div.className = 'pedido-status';

      // Busca nomes dos produtos e quantidades
      let produtosTexto = pedido.produtos.map(item => {
        const p = produtos.find(prod => prod.id === item.id);
        if (!p) return '';
        return `${p.nome} x${item.quantidade}`;
      }).join(', ');

      // Status texto e cor
      let statusTexto = '';
      let statusClass = '';
      switch (pedido.status) {
        case 0: statusTexto = 'Pedido Recebido'; statusClass = 'status-0'; break;
        case 1: statusTexto = 'Em Preparo'; statusClass = 'status-1'; break;
        case 2: statusTexto = 'Saiu para Entrega'; statusClass = 'status-2'; break;
        case 3: statusTexto = 'Entregue'; statusClass = 'status-3'; break;
        default: statusTexto = 'Status desconhecido'; statusClass = '';
      }

      div.innerHTML = `
        <h3>Pedido ${pedido.id}</h3>
        <p><strong>Cliente:</strong> ${pedido.cliente}</p>
        <p><strong>Produtos:</strong> ${produtosTexto}</p>
        <p><strong>Endereço:</strong> ${pedido.endereco}</p>
        <p><strong>Pagamento:</strong> ${pedido.formaPagamento}</p>
        <p><strong>Observações:</strong> ${pedido.observacoes || '-'}</p>
        <p><strong>Data:</strong> ${new Date(pedido.dataHora).toLocaleString('pt-BR')}</p>
        <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${statusTexto}</span></p>
      `;

      container.appendChild(div);
    });
  }

  // Inicializações
  renderProdutos();
  renderCarrinho();
  renderStatusPedidos();

</script>

</body>
</html>
