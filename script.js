
const produtos = JSON.parse(localStorage.getItem("produtos")) || [
  { nome: "Brigadeiro", descricao: "Clássico doce de chocolate", preco: 2.5, imagem: "https://via.placeholder.com/200" },
  { nome: "Beijinho", descricao: "Doce de coco com cravo", preco: 2.5, imagem: "https://via.placeholder.com/200" },
  { nome: "Cajuzinho", descricao: "Amendoim e chocolate", preco: 2.5, imagem: "https://via.placeholder.com/200" },
  { nome: "Bicho de pé", descricao: "Doce rosa de morango", preco: 2.5, imagem: "https://via.placeholder.com/200" },
  { nome: "Trufa", descricao: "Chocolate recheado", preco: 3, imagem: "https://via.placeholder.com/200" },
  { nome: "Cupcake", descricao: "Bolinho com cobertura", preco: 5, imagem: "https://via.placeholder.com/200" },
  { nome: "Pudim", descricao: "Tradicional com calda", preco: 6, imagem: "https://via.placeholder.com/200" },
  { nome: "Torta de Limão", descricao: "Refrescante e cremosa", preco: 7, imagem: "https://via.placeholder.com/200" },
  { nome: "Cheesecake", descricao: "Com calda de frutas vermelhas", preco: 8, imagem: "https://via.placeholder.com/200" },
  { nome: "Brownie", descricao: "Chocolate intenso", preco: 5, imagem: "https://via.placeholder.com/200" }
];

const carrinho = [];
const produtosEl = document.getElementById("produtos");
const carrinhoEl = document.getElementById("itens-carrinho");
const totalEl = document.getElementById("total");
const enderecoEl = document.getElementById("endereco");
const pagamentoEl = document.getElementById("forma-pagamento");
const observacoesEl = document.getElementById("observacoes");

enderecoEl.value = localStorage.getItem("endereco") || "";
enderecoEl.addEventListener("input", () => {
  localStorage.setItem("endereco", enderecoEl.value);
});

function renderProdutos() {
  produtosEl.innerHTML = "";
  produtos.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "produto";
    el.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p>${p.descricao}</p>
      <strong>R$ ${p.preco.toFixed(2)}</strong><br>
      <button onclick="adicionarAoCarrinho(${i})">Adicionar</button>
    `;
    produtosEl.appendChild(el);
  });
}

function adicionarAoCarrinho(i) {
  carrinho.push(produtos[i]);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  carrinhoEl.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, index) => {
    total += item.preco;
    const li = document.createElement("li");
    li.textContent = item.nome + " - R$ " + item.preco.toFixed(2);
    carrinhoEl.appendChild(li);
  });
  totalEl.textContent = "Total: R$ " + total.toFixed(2);
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  if (!enderecoEl.value) {
    alert("Digite seu endereço antes de finalizar o pedido.");
    return;
  }
  if (!pagamentoEl.value) {
    alert("Selecione a forma de pagamento.");
    return;
  }

  const resumoPedido = "Pedido MDoces:\n" +
    carrinho.map(i => "- " + i.nome).join("\n") +
    "\nTotal: R$ " + carrinho.reduce((t, i) => t + i.preco, 0).toFixed(2) +
    "\nEndereço: " + enderecoEl.value +
    "\nForma de pagamento: " + pagamentoEl.value +
    (observacoesEl.value ? ("\nObservações: " + observacoesEl.value) : "");
    
  if (confirm("Confirme seu pedido:\n\n" + resumoPedido.replace(/\\n/g, "\n"))) {
    const mensagem = encodeURIComponent(resumoPedido);
    window.open("https://wa.me/SEU_NUMERO?text=" + mensagem, "_blank");
  }
}

renderProdutos();
atualizarCarrinho();
