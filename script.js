/**
 * script.js - MDoces Delivery
 * Código limpo, organizado e autoexplicativo
 */

// --- Dados iniciais ---

// Produtos pré-cadastrados padrão (substituíveis pelo admin)
const produtosDefault = [
  { id: 1, nome: "Brigadeiro", descricao: "Clássico doce de chocolate", preco: 2.5, imagem: "https://via.placeholder.com/200", categoria: "Docinhos" },
  { id: 2, nome: "Beijinho", descricao: "Doce de coco com cravo", preco: 2.5, imagem: "https://via.placeholder.com/200", categoria: "Docinhos" },
  { id: 3, nome: "Torta de Limão", descricao: "Refrescante e cremosa", preco: 7, imagem: "https://via.placeholder.com/200", categoria: "Tortas" },
  { id: 4, nome: "Cheesecake", descricao: "Com calda de frutas vermelhas", preco: 8, imagem: "https://via.placeholder.com/200", categoria: "Tortas" },
  { id: 5, nome: "Brownie", descricao: "Chocolate intenso", preco: 5, imagem: "https://via.placeholder.com/200", categoria: "Bolos" },
];

// Recupera produtos salvos no localStorage ou usa os padrões
const produtos = JSON.parse(localStorage.getItem("produtos")) || produtosDefault;

// Carrinho de compras salvo no localStorage ou vazio
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Número do WhatsApp para pedidos (pode ser alterado na área administrativa)
let numeroWhatsapp = localStorage.getItem("whatsapp") || "96988019993";

// Objeto para controlar quantidades temporárias antes de adicionar ao carrinho
const quantidadesTemp = {};

// --- Elementos DOM ---
const produtosEl = document.getElementById("produtos");
const carrinhoEl = document.getElementById("itens-carrinho");
const totalEl = document.getElementById("total");
const nomeClienteEl = document.getElementById("nome-cliente");
const enderecoEl = document.getElementById("endereco");
const pagamentoEl = document.getElementById("forma-pagamento");
const observacoesEl = document.getElementById("observacoes");

// --- Inicialização ---

// Preenche o campo endereço com valor salvo (se houver) e atualiza localStorage quando muda
enderecoEl.value = localStorage.getItem("endereco") || "";
enderecoEl.addEventListener("input", () => {
  localStorage.setItem("endereco", enderecoEl.value);
});

// --- Funções principais ---

/**
 * Agrupa os produtos por categoria em um objeto
 * @param {Array} listaProdutos
 * @returns {Object} categorias agrupadas
 */
function agruparPorCategoria(listaProdutos) {
  return listaProdutos.reduce((acc, produto) => {
    if (!acc[produto.categoria]) acc[produto.categoria] = [];
    acc[produto.categoria].push(produto);
    return acc;
  }, {});
}

/**
 * Renderiza a lista de produtos agrupados por categoria, com controles de quantidade e botão adicionar
 */
function renderProdutos() {
  produtosEl.innerHTML = "";
  const categorias = agruparPorCategoria(produtos);

  for (const categoria in categorias) {
    const secao = document.createElement("section");
    const titulo = document.createElement("h2");
    titulo.textContent = categoria;
    secao.appendChild(titulo);

    categorias[categoria].forEach((produto) => {
      const el = document.createElement("div");
      el.className = "produto";

      el.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}" />
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <strong>R$ ${produto.preco.toFixed(2)}</strong>
        <div class="quantidade-container">
          <button aria-label="Diminuir quantidade" onclick="alterarQuantidadeTemp(${produto.id}, -1)">-</button>
          <span id="quantidade-${produto.id}">0</span>
          <button aria-label="Aumentar quantidade" onclick="alterarQuantidadeTemp(${produto.id}, 1)">+</button>
        </div>
        <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao carrinho</button>
      `;

      secao.appendChild(el);
    });

    produtosEl.appendChild(secao);
  }
}

/**
 * Altera a quantidade temporária de um produto antes de adicioná-lo ao carrinho
 * @param {number} id - ID do produto
 * @param {number} delta - incremento (+1 ou -1)
 */
function alterarQuantidadeTemp(id, delta) {
  quantidadesTemp[id] = (quantidadesTemp[id] || 0) + delta;
  if (quantidadesTemp[id] < 0) quantidadesTemp[id] = 0;

  const quantidadeSpan = document.getElementById(`quantidade-${id}`);
  if (quantidadeSpan) quantidadeSpan.textContent = quantidadesTemp[id];
}

/**
 * Adiciona o produto com a quantidade temporária selecionada ao carrinho
 * @param {number} id - ID do produto
 */
function adicionarAoCarrinho(id) {
  const quantidade = quantidadesTemp[id] || 0;
  if (quantidade === 0) {
    alert("Selecione ao menos 1 unidade para adicionar.");
    return;
  }

  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  // Atualiza quantidade se o produto já está no carrinho
  const itemExistente = carrinho.find(item => item.id === id);
  if (itemExistente) {
    itemExistente.quantidade += quantidade;
  } else {
    carrinho.push({ ...produto, quantidade });
  }

  // Reseta quantidade temporária no display
  quantidadesTemp[id] = 0;
  const quantidadeSpan = document.getElementById(`quantidade-${id}`);
  if (quantidadeSpan) quantidadeSpan.textContent = "0";

  salvarCarrinho();
  atualizarCarrinho();
}

/**
 * Remove um item do carrinho pelo índice
 * @param {number} index
 */
function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
}

/**
 * Altera a quantidade de um item no carrinho (incrementa ou decrementa)
 * Remove o item se a quantidade chegar a zero
 * @param {number} index
 * @param {number} delta
 */
function alterarQuantidade(index, delta) {
  if (!carrinho[index]) return;
  carrinho[index].quantidade += delta;

  if (carrinho[index].quantidade <= 0) {
    removerDoCarrinho(index);
  } else {
    salvarCarrinho();
    atualizarCarrinho();
  }
}

/**
 * Atualiza a lista do carrinho no DOM e o total do pedido
 */
function atualizarCarrinho() {
  carrinhoEl.innerHTML = "";

  if (carrinho.length === 0) {
    carrinhoEl.innerHTML = "<li>Carrinho vazio.</li>";
    totalEl.textContent = "Total: R$ 0,00";
    return;
  }

  let total = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${item.quantidade}x ${item.nome}</span>
      <span>
        R$ ${(item.preco * item.quantidade).toFixed(2)}
        <button aria-label="Diminuir quantidade" onclick="alterarQuantidade(${index}, -1)">-</button>
        <button aria-label="Aumentar quantidade" onclick="alterarQuantidade(${index}, 1)">+</button>
        <button aria-label="Remover item" onclick="removerDoCarrinho(${index})">✕</button>
      </span>
    `;

    carrinhoEl.appendChild(li);
    total += item.preco * item.quantidade;
  });

  totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
}

/**
 * Salva o carrinho no localStorage para persistência
 */
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

/**
 * Valida os dados do pedido e gera a mensagem formatada para enviar via WhatsApp
 * Abre o WhatsApp web com a mensagem pronta para envio
 */
function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  if (!nomeClienteEl.value.trim()) {
    alert("Por favor, digite seu nome.");
    nomeClienteEl.focus();
    return;
  }
  if (!enderecoEl.value.trim()) {
    alert("Por favor, informe seu endereço de entrega.");
    enderecoEl.focus();
    return;
  }
  if (!pagamentoEl.value) {
    alert("Por favor, selecione a forma de pagamento.");
    pagamentoEl.focus();
    return;
  }

  // Monta mensagem detalhada do pedido
  let mensagem = `Olá, gostaria de fazer um pedido:\n\n*Itens:*\n`;
  carrinho.forEach(item => {
    mensagem += `- ${item.quantidade} x ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2)})\n`;
  });

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  mensagem += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
  mensagem += `*Nome:* ${nomeClienteEl.value.trim()}\n`;
  mensagem += `*Endereço:* ${enderecoEl.value.trim()}\n`;
  mensagem += `*Pagamento:* ${pagamentoEl.value}\n`;

  const obs = observacoesEl.value.trim();
  if (obs) mensagem += `*Observações:* ${obs}\n`;

  mensagem += `\nObrigado!`;

  // Envia para o WhatsApp
  const url = `https://wa.me/55${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");

  // Opcional: limpar carrinho após enviar pedido
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
}

// --- Inicializa a página ---
renderProdutos();
atualizarCarrinho();

// --- Exponha funções para o escopo global para uso nos botões inline ---
window.alterarQuantidadeTemp = alterarQuantidadeTemp;
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.alterarQuantidade = alterarQuantidade;
window.finalizarPedido = finalizarPedido;
