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
    alert('Seu carrinho está vazio. Adicione produtos antes de finalizar.');
    return;
  }

  if (!nomeCliente || !endereco || !formaPagamento) {
    alert('Por favor, preencha seu nome, endereço e escolha a forma de pagamento.');
    return;
  }

  // Cria objeto pedido
  const idPedido = gerarIdPedido();
  const pedido = {
    id: idPedido,
    cliente: nomeCliente,
    endereco,
    formaPagamento,
    observacoes,
    itens: carrinho.map(item => {
      const prod = produtos.find(p => p.id === item.id);
      return {
        id: item.id,
        nome: prod ? prod.nome : 'Produto removido',
        quantidade: item.quantidade,
        precoUnit: prod ? prod.preco : 0,
        precoTotal: prod ? prod.preco * item.quantidade : 0,
      };
    }),
    total: carrinho.reduce((acc, item) => {
      const prod = produtos.find(p => p.id === item.id);
      return acc + (prod ? prod.preco * item.quantidade : 0);
    }, 0),
    status: 0, // 0: Recebido, 1: Em preparo, 2: Saiu para entrega, 3: Entregue
    dataHora: new Date().toISOString(),
  };

  pedidos.push(pedido);
  localStorage.setItem('mdoces-pedidos', JSON.stringify(pedidos));

  // Limpa carrinho e formulário
  carrinho = [];
  salvarCarrinho();
  renderCarrinho();
  limparFormulario();

  alert(`Pedido recebido com sucesso! Seu número de acompanhamento é: ${idPedido}`);

  // Atualiza lista de acompanhamento com o pedido novo
  renderStatusPedidos();
}

// Limpa os campos do formulário
function limparFormulario() {
  const nomeInput = document.getElementById('nome-cliente');
  const enderecoInput = document.getElementById('endereco');
  const pagamentoSelect = document.getElementById('forma-pagamento');
  const observacoesInput = document.getElementById('observacoes');

  if (nomeInput) nomeInput.value = '';
  if (enderecoInput) enderecoInput.value = '';
  if (pagamentoSelect) pagamentoSelect.selectedIndex = 0;
  if (observacoesInput) observacoesInput.value = '';

  // Atualiza quantidades na tela
  categorias.forEach(cat => {
    produtos.filter(p => p.categoria === cat).forEach(produto => {
      atualizarQuantidadeTela(produto.id);
    });
  });
}

// Renderiza a lista de pedidos para acompanhamento
function renderStatusPedidos() {
  const container = document.getElementById('status-pedidos');
  if (!container) return;

  container.innerHTML = '<h2>Acompanhamento dos seus pedidos</h2>';

  if (pedidos.length === 0) {
    container.innerHTML += '<p>Nenhum pedido realizado ainda.</p>';
    return;
  }

  pedidos.slice().reverse().forEach(pedido => {
    const div = document.createElement('div');
    div.className = 'pedido-status';

    const statusTexto = ['Pedido recebido', 'Em preparo', 'Saiu para entrega', 'Entregue'];
    const statusClasse = ['status-0', 'status-1', 'status-2', 'status-3'];

    div.innerHTML = `
      <h3>Pedido: ${pedido.id}</h3>
      <p><strong>Cliente:</strong> ${pedido.cliente}</p>
      <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
      <p><strong>Status:</strong> <span class="status-badge ${statusClasse[pedido.status]}">${statusTexto[pedido.status]}</span></p>
      <p><strong>Data:</strong> ${new Date(pedido.dataHora).toLocaleString('pt-BR')}</p>
    `;

    container.appendChild(div);
  });
}

// --- Admin: Atualizar status de pedido ---
function atualizarStatusPedido(idPedido, novoStatus) {
  const pedido = pedidos.find(p => p.id === idPedido);
  if (!pedido) return;

  if (novoStatus >= 0 && novoStatus <= 3) {
    pedido.status = novoStatus;
    localStorage.setItem('mdoces-pedidos', JSON.stringify(pedidos));
    renderStatusPedidos();
  }
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  renderProdutos();
  renderCarrinho();

  if (document.getElementById('status-pedidos')) {
    renderStatusPedidos();
  }
});
