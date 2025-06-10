// Carregar produtos do localStorage ou usar lista inicial
const produtos = JSON.parse(localStorage.getItem("produtos")) || [
  { id: 1, nome: "Brigadeiro", descricao: "Clássico doce de chocolate", preco: 2.5, imagem: "https://via.placeholder.com/200", categoria: "Docinhos" },
  { id: 2, nome: "Beijinho", descricao: "Doce de coco com cravo", preco: 2.5, imagem: "https://via.placeholder.com/200", categoria: "Docinhos" },
  { id: 3, nome: "Torta de Limão", descricao: "Refrescante e cremosa", preco: 7, imagem: "https://via.placeholder.com/200", categoria: "Tortas" },
  { id: 4, nome: "Cheesecake", descricao: "Com calda de frutas vermelhas", preco: 8, imagem: "https://via.placeholder.com/200", categoria: "Tortas" },
  { id: 5, nome: "Brownie", descricao: "Chocolate intenso", preco: 5, imagem: "https://via.placeholder.com/200", categoria: "Bolos" },
];

// Carregar carrinho do localStorage ou iniciar vazio
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const produtosEl = document.getElementById("produtos");
const carrinhoEl = document.getElementById("itens-carrinho");
const totalEl = document.getElementById("total");
const enderecoEl = document.getElementById("endereco");
const pagamentoEl = document.getElementById("forma-pagamento");
const observacoesEl = document.getElementById("observacoes");

// Carregar endereço salvo no localStorage
enderecoEl.value = localStorage.getItem("endereco") || "";
enderecoEl.addEventListener("input", () => {
  localStorage.setItem("endereco", enderecoEl.value);
});

// Agrupa produtos por categoria para exibição organizada
function agruparPorCategoria(produtos) {
  return produtos.reduce((acc, produto) => {
    if (!acc[produto.categoria]) acc[produto.categoria] = [];
    acc[produto.categoria].push(produto);
    return acc;
  }, {});
}

// Renderiza produtos no HTML, organizados por categoria
function renderProdutos() {
  produtosEl.innerHTML = "";
  const categorias = agruparPorCategoria(produtos);

  for (const categoria in categorias) {
    const secao = document.createElement("section");
    const titulo = document.createElement("h2");
    titulo.textContent = categoria;
    secao.appendChild(titulo);

    categorias[categoria].forEach((p) => {
      const el = document.createElement("div");
      el.className = "produto";
      el.innerHTML = `
        <img src="${p.imagem}" alt="${p.nome}">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <strong>R$ ${p.preco.toFixed(2)}</strong><br>
        <button onclick="adicionarAoCarrinho(${p.id})">Adicionar</button>
      `;
      secao.appendChild(el);
    });

    produtosEl.appendChild(secao);
  }
}

// Adiciona produto ao carrinho pelo id, incrementando quantidade se já existe
function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  const itemExistente = carrinho.find(item => item.id === id);
  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  salvarCarrinho();
  atualizarCarrinho();
}

// Remove item do carrinho pelo índice
function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
}

// Atualiza quantidade de um item no carrinho, removendo se quantidade <= 0
function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    removerDoCarrinho(index);
  } else {
    salvarCarrinho();
    atualizarCarrinho();
  }
}

// Atualiza o HTML do carrinho e calcula total
function atualizarCarrinho() {
  carrinhoEl.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}
      <button onclick="alterarQuantidade(${index}, -1)">-</button>
      <button onclick="alterarQuantidade(${index}, 1)">+</button>
      <button onclick="removerDoCarrinho(${index})">Remover</button>
    `;
    carrinhoEl.appendChild(li);
  });

  totalEl.textContent = "Total: R$ " + total.toFixed(2);
}

// Salva carrinho no localStorage para persistência
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Finaliza pedido: valida dados, gera resumo e abre WhatsApp
function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  if (!enderecoEl.value.trim()) {
    alert("Digite seu endereço antes de finalizar o pedido.");
    return;
  }
  if (!pagamentoEl.value) {
    alert("Selecione a forma de pagamento.");
    return;
  }

  const resumoPedido = "🍬 Pedido MDoces:\n" +
    carrinho.map(i => `- ${i.nome} x ${i.quantidade} = R$ ${(i.preco * i.quantidade).toFixed(2)}`).join("\n") +
    `\nTotal: R$ ${carrinho.reduce((t, i) => t + i.preco * i.quantidade, 0).toFixed(2)}` +
    `\n📍 Endereço: ${enderecoEl.value}` +
    `\n💳 Pagamento: ${pagamentoEl.value}` +
    (observacoesEl.value ? `\n📝 Observações: ${observacoesEl.value}` : "");

  if (confirm("Confirme seu pedido:\n\n" + resumoPedido)) {
    const mensagem = encodeURIComponent(resumoPedido);
    // Substitua SEU_NUMERO pelo seu número no formato internacional, ex: 5511999999999
    window.open("https://wa.me/96988019993?text=" + mensagem, "_blank");
  }
}

// Inicialização
renderProdutos();
atualizarCarrinho();
