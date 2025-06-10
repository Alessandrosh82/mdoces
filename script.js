// Script do MDoces Delivery

let produtos = JSON.parse(localStorage.getItem('mdoces-produtos')) || [];
let carrinho = JSON.parse(localStorage.getItem('mdoces-carrinho')) || [];
let pedidos = JSON.parse(localStorage.getItem('mdoces-pedidos')) || [];

// Obter categorias únicas
function getCategorias() {
  return [...new Set(produtos.map(p => p.categoria))];
}

function salvarCarrinho() {
  localStorage.setItem('mdoces-carrinho', JSON.stringify(carrinho));
}

function salvarPedidos() {
  localStorage.setItem('mdoces-pedidos', JSON.stringify(pedidos));
}

function renderProdutos() {
  const container = document.getElementById('produtos');
  if (!container) return;
  container.innerHTML = '';

  const categorias = getCategorias();
  categorias.forEach(categoria => {
    const section = document.createElement('section');
    const h2 = document.createElement('h2');
    h2.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    section.appendChild(h2);

    produtos
      .filter(p => p.categoria === categoria)
      .forEach(produto => {
        if (!produto.nome || !produto.preco || !produto.imagem) return;

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
            <button onclick="alterarQuantidade('${produto.id}', -1)">-</button>
            <span id="qtd-${produto.id}">${getQuantidade(produto.id)}</span>
            <button onclick="alterarQuantidade('${produto.id}', 1)">+</button>
          </div>
          <button onclick="adicionarAoCarrinho('${produto.id}')">Adicionar</button>
        `;
        section.appendChild(div);
      });

    container.appendChild(section);
  });
}

function getQuantidade(produtoId) {
  const item = carrinho.find(i => i.id === produtoId);
  return item ? item.quantidade : 0;
}

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

function adicionarAoCarrinho(produtoId) {
  const index = carrinho.findIndex(i => i.id === produtoId);
  if (index === -1) {
    carrinho.push({ id: produtoId, quantidade: 1 });
  } else {
    carrinho[index].quantidade += 1;
  }
  salvarCarrinho();
  atualizarQuantidadeTela(produtoId);
  renderCarrinho();
}

function atualizarQuantidadeTela(produtoId) {
  const span = document.getElementById(`qtd-${produtoId}`);
  if (span) {
    span.textContent = getQuantidade(produtoId);
  }
}

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
        ${produto.nome} x${item.quantidade} - R$ ${(produto.preco * item.quantidade).toFixed(2)}
        <button onclick="removerDoCarrinho('${produto.id}')">✕</button>
      `;
      lista.appendChild(li);
    });
  }
  atualizarTotal();
}

function removerDoCarrinho(produtoId) {
  carrinho = carrinho.filter(i => i.id !== produtoId);
  salvarCarrinho();
  renderCarrinho();
  atualizarQuantidadeTela(produtoId);
}

function atualizarTotal() {
  const total = carrinho.reduce((acc, item) => {
    const produto = produtos.find(p => p.id === item.id);
    return produto ? acc + produto.preco * item.quantidade : acc;
  }, 0);
  const totalEl = document.getElementById('total');
  if (totalEl) {
    totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
  }
}

function finalizarPedido() {
  const nome = document.getElementById('nome-cliente').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const pagamento = document.getElementById('forma-pagamento').value;
  const observacoes = document.getElementById('observacoes').value.trim();

  if (!nome || !endereco || !pagamento || carrinho.length === 0) {
    alert('Preencha todos os campos e adicione ao menos um item.');
    return;
  }
  if (nome.length < 2 || endereco.length < 5) {
    alert('Preencha nome e endereço corretamente.');
    return;
  }

  const total = carrinho.reduce((soma, item) => {
    const p = produtos.find(p => p.id === item.id);
    return p ? soma + p.preco * item.quantidade : soma;
  }, 0);

  const pedido = {
    id: Date.now(),
    nome,
    endereco,
    pagamento,
    observacoes,
    carrinho: [...carrinho],
    status: 0,
    criadoEm: new Date().toISOString(),
    total
  };

  pedidos.push(pedido);
  salvarPedidos();

  carrinho = [];
  salvarCarrinho();

  renderCarrinho();
  renderStatusPedidos();

  // Resetar o formulário (ID do form deve ser "form-pedido")
  const form = document.getElementById('form-pedido');
  if (form) form.reset();

  // Salvar a forma de pagamento para próxima vez
  localStorage.setItem('mdoces-pagamento', pagamento);

  alert('Pedido enviado com sucesso!');
  enviarPedidoWhatsApp(pedido);
}

function renderStatusPedidos() {
  const container = document.getElementById('status-pedidos');
  if (!container) return;
  container.innerHTML = '<h2>Status dos Pedidos</h2>';

  const statusTextos = ['Pendente', 'Em preparo', 'Saiu para entrega', 'Entregue'];

  pedidos.slice().reverse().forEach(pedido => {
    const div = document.createElement('div');
    div.className = 'pedido-status';
    const produtosTexto = pedido.carrinho.map(item => {
      const prod = produtos.find(p => p.id === item.id);
      return prod ? `${prod.nome} x${item.quantidade}` : '';
    }).filter(Boolean).join(', ');

    const data = new Date(pedido.criadoEm).toLocaleString('pt-BR');

    div.innerHTML = `
      <h3>${pedido.nome}</h3>
      <p><strong>Data:</strong> ${data}</p>
      <p><strong>Endereço:</strong> ${pedido.endereco}</p>
      <p><strong>Pagamento:</strong> ${pedido.pagamento}</p>
      <p><strong>Observações:</strong> ${pedido.observacoes || 'Nenhuma'}</p>
      <p><strong>Itens:</strong> ${produtosTexto}</p>
      <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
      <p><span class="status-badge status-${pedido.status}">${statusTextos[pedido.status] || 'Desconhecido'}</span></p>
    `;

    container.appendChild(div);
  });
}

function enviarPedidoWhatsApp(pedido) {
  const numero = localStorage.getItem('mdoces-whatsapp') || '5581999999999';
  const texto = [
    `Novo pedido de ${pedido.nome}!`,
    `Endereço: ${pedido.endereco}`,
    `Pagamento: ${pedido.pagamento}`,
    pedido.observacoes ? `Obs: ${pedido.observacoes}` : '',
    'Itens:',
    ...pedido.carrinho.map(item => {
      const p = produtos.find(p => p.id === item.id);
      return p ? `- ${p.nome} x${item.quantidade}` : '';
    }),
    '',
    `Total: R$ ${pedido.total.toFixed(2)}`
  ].filter(Boolean).join('\n');

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

// Ao carregar, pré-carregar forma de pagamento se disponível
window.addEventListener('DOMContentLoaded', () => {
  const pagamentoSalvo = localStorage.getItem('mdoces-pagamento');
  if (pagamentoSalvo) {
    const formaPagamento = document.getElementById('forma-pagamento');
    if (formaPagamento) formaPagamento.value = pagamentoSalvo;
  }
});

// Inicialização
renderProdutos();
renderCarrinho();
renderStatusPedidos();
