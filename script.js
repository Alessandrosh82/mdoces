// Script otimizado para MDoces Delivery - gerencia produtos, carrinho e pedidos

// --- Dados carregados do localStorage ou inicializados vazios ---
let carrinho = JSON.parse(localStorage.getItem('mdoces-carrinho')) || [];
let pedidos = JSON.parse(localStorage.getItem('mdoces-pedidos')) || [];

// --- Lista fixa de produtos ---
const produtos = [
  {
    id: 1,
    nome: "Brigadeiro Gourmet",
    descricao: "Brigadeiro tradicional feito com chocolate belga.",
    preco: 2.5,
    imagem: "https://via.placeholder.com/100x100",
    categoria: "Doces"
  },
  {
    id: 2,
    nome: "Beijinho",
    descricao: "Docinho de coco com leite condensado.",
    preco: 2.5,
    imagem: "https://via.placeholder.com/100x100",
    categoria: "Doces"
  },
  {
    id: 3,
    nome: "Bolo de Pote",
    descricao: "Camadas de bolo e recheio de leite ninho com morango.",
    preco: 8.0,
    imagem: "https://via.placeholder.com/100x100",
    categoria: "Bolos"
  }
];

function getCategorias() {
  return [...new Set(produtos.map(p => p.categoria))].filter(c => c);
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
    section.className = 'categoria-section';

    const h2 = document.createElement('h2');
    h2.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    section.appendChild(h2);

    produtos
      .filter(p => p.categoria === categoria && p.nome && p.preco != null && p.imagem)
      .forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />
          <div class="info-produto">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao || ''}</p>
            <strong>R$ ${produto.preco.toFixed(2).replace('.', ',')}</strong>
          </div>
          <div class="quantidade-container" aria-label="Controle de quantidade para ${produto.nome}">
            <button type="button" aria-label="Diminuir quantidade" onclick="alterarQuantidade('${produto.id}', -1)">−</button>
            <span id="qtd-${produto.id}">${getQuantidade(produto.id)}</span>
            <button type="button" aria-label="Aumentar quantidade" onclick="alterarQuantidade('${produto.id}', 1)">+</button>
          </div>
          <button class="btn-adicionar" type="button" onclick="adicionarAoCarrinho('${produto.id}')">Adicionar</button>
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
      li.className = 'item-carrinho';
      li.innerHTML = `
        ${produto.nome} x${item.quantidade} - R$ ${(produto.preco * item.quantidade).toFixed(2).replace('.', ',')}
        <button type="button" aria-label="Remover ${produto.nome} do carrinho" onclick="removerDoCarrinho('${produto.id}')">✕</button>
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
    totalEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  }
}

function enviarPedido() {
  const nome = document.getElementById('nome')?.value.trim();
  const numero = document.getElementById('numero')?.value.trim();
  const endereco = document.getElementById('endereco')?.value.trim();
  const observacao = document.getElementById('observacao')?.value.trim();

  if (!nome || !numero || !endereco || carrinho.length === 0) {
    alert('Por favor, preencha todos os campos obrigatórios e adicione ao menos um item ao carrinho.');
    return;
  }

  const total = carrinho.reduce((soma, item) => {
    const p = produtos.find(p => p.id === item.id);
    return p ? soma + p.preco * item.quantidade : soma;
  }, 0);

  const texto = [
    `Novo pedido de ${nome}`,
    `Endereço: ${endereco}`,
    ...(observacao ? [`Obs: ${observacao}`] : []),
    '',
    'Itens:',
    ...carrinho.map(item => {
      const p = produtos.find(p => p.id === item.id);
      return p ? `- ${p.nome} x${item.quantidade}` : '';
    }),
    '',
    `Total: R$ ${total.toFixed(2).replace('.', ',')}`
  ].join('\n');

  const url = `https://wa.me/55${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');

  carrinho = [];
  salvarCarrinho();
  renderCarrinho();
  document.getElementById('form-pedido')?.reset();
}

window.addEventListener('DOMContentLoaded', () => {
  renderProdutos();
  renderCarrinho();
});
