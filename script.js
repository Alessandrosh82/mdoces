// Script otimizado para MDoces Delivery - gerencia produtos, carrinho e pedidos

// Carrega dados do localStorage ou inicializa arrays vazios
let produtos = JSON.parse(localStorage.getItem('mdoces-produtos')) || [];
let carrinho = JSON.parse(localStorage.getItem('mdoces-carrinho')) || [];
let pedidos = JSON.parse(localStorage.getItem('mdoces-pedidos')) || [];

// Obtém as categorias únicas dos produtos
function getCategorias() {
  return [...new Set(produtos.map(p => p.categoria))];
}

// Salva carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem('mdoces-carrinho', JSON.stringify(carrinho));
}

// Salva pedidos no localStorage
function salvarPedidos() {
  localStorage.setItem('mdoces-pedidos', JSON.stringify(pedidos));
}

// Renderiza os produtos organizados por categoria
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
          <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />
          <div class="info-produto">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao || ''}</p>
            <strong>R$ ${produto.preco.toFixed(2).replace('.', ',')}</strong>
          </div>
          <div class="quantidade-container">
            <button aria-label="Diminuir quantidade" onclick="alterarQuantidade('${produto.id}', -1)">−</button>
            <span id="qtd-${produto.id}">${getQuantidade(produto.id)}</span>
            <button aria-label="Aumentar quantidade" onclick="alterarQuantidade('${produto.id}', 1)">+</button>
          </div>
          <button class="btn-adicionar" onclick="adicionarAoCarrinho('${produto.id}')">Adicionar</button>
        `;
        section.appendChild(div);
      });

    container.appendChild(section);
  });
}

// Retorna a quantidade do produto no carrinho
function getQuantidade(produtoId) {
  const item = carrinho.find(i => i.id === produtoId);
  return item ? item.quantidade : 0;
}

// Altera a quantidade do produto no carrinho, adicionando ou removendo
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

// Adiciona um item ao carrinho (quantidade +1)
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

// Atualiza a quantidade exibida na tela para um produto específico
function atualizarQuantidadeTela(produtoId) {
  const span = document.getElementById(`qtd-${produtoId}`);
  if (span) {
    span.textContent = getQuantidade(produtoId);
  }
}

// Renderiza o conteúdo do carrinho na tela
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
      li.className = 'item-carrinho';
      li.innerHTML = `
        ${produto.nome} x${item.quantidade} - R$ ${(produto.preco * item.quantidade).toFixed(2).replace('.', ',')}
        <button aria-label="Remover ${produto.nome} do carrinho" onclick="removerDoCarrinho('${produto.id}')">✕</button>
      `;
      lista.appendChild(li);
    });
  }
  atualizarTotal();
}

// Remove produto do carrinho
function removerDoCarrinho(produtoId) {
  carrinho = carrinho.filter(i => i.id !== produtoId);
  salvarCarrinho();
  renderCarrinho();
  atualizarQuantidadeTela(produtoId);
}

// Atualiza o valor total do pedido
function atualizarTotal() {
  const total = carrinho.reduce((acc, item) => {
    const produto = produtos.find(p => p.id === item.id);
    return produto ? acc + produto.preco * item.quantidade : acc;
  }, 0);
  const totalEl = document.getElementById('total');
  if (totalEl) {
    totalEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  }
}

// Finaliza o pedido: valida dados, salva e envia via WhatsApp
function finalizarPedido() {
  const nome = document.getElementById('nome-cliente')?.value.trim();
  const endereco = document.getElementById('endereco')?.value.trim();
  const pagamento = document.getElementById('forma-pagamento')?.value;
  const observacoes = document.getElementById('observacoes')?.value.trim();

  if (!nome || !endereco || !pagamento || carrinho.length === 0) {
    alert('Preencha todos os campos e adicione ao menos um item.');
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

  document.getElementById('form-pedido')?.reset();

  localStorage.setItem('mdoces-pagamento', pagamento);

  alert('Pedido enviado com sucesso!');
  enviarPedidoWhatsApp(pedido);
}

// Renderiza a lista de status dos pedidos
function renderStatusPedidos() {
  const container = document.getElementById('status-pedidos');
  if (!container) return;

  container.innerHTML = '<h2>Status dos Pedidos</h2>';
  const statusTextos = ['Pendente', 'Em preparo', 'Saiu para entrega', 'Entregue'];

  pedidos.slice().reverse().forEach(pedido => {
    const div = document.createElement('div');
    div.className = 'pedido-status';

    const produtosTexto = pedido.carrinho
      .map(item => {
        const prod = produtos.find(p => p.id === item.id);
        return prod ? `${prod.nome} x${item.quantidade}` : '';
      })
      .filter(Boolean)
      .join(', ');

    const data = new Date(pedido.criadoEm).toLocaleString('pt-BR');

    div.innerHTML = `
      <h3>${pedido.nome}</h3>
      <p><strong>Data:</strong> ${data}</p>
      <p><strong>Endereço:</strong> ${pedido.endereco}</p>
      <p><strong>Pagamento:</strong> ${pedido.pagamento}</p>
      <p><strong>Observações:</strong> ${pedido.observacoes || 'Nenhuma'}</p>
      <p><strong>Itens:</strong> ${produtosTexto}</p>
      <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2).replace('.', ',')}</p>
      <p><span class="status-badge status-${pedido.status}">${statusTextos[pedido.status] || 'Desconhecido'}</span></p>
    `;

    container.appendChild(div);
  });
}

// Abre o WhatsApp com a mensagem do pedido formatada
function enviarPedidoWhatsApp(pedido) {
  const numero = localStorage.getItem('mdoces-whatsapp') || '5581999999999'; // Atualize para seu número
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
    `Total: R$ ${pedido.total.toFixed(2).replace('.', ',')}`
  ]
    .filter(Boolean)
    .join('\n');

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

// Ao carregar a página, recupera forma de pagamento salva
window.addEventListener('DOMContentLoaded', () => {
  const pagamentoSalvo = localStorage.getItem('mdoces-pagamento');
  if (pagamentoSalvo) {
    const formaPagamento = document.getElementById('forma-pagamento');
    if (formaPagamento) formaPagamento.value = pagamentoSalvo;
  }

  renderProdutos();
  renderCarrinho();
  renderStatusPedidos();
});
