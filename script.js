// Espera o conteúdo da página carregar completamente antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÃO INICIAL ---
    // Objeto que vai armazenar os produtos e quantidades do pedido.
    const pedido = {};
    const numeroWhatsApp = '559600000000'; // SUBSTITUA PELO SEU NÚMERO com código do país e DDD

    // --- GERAÇÃO DINÂMICA DO PEDIDO (A GRANDE NOVIDADE) ---

    // Seleciona todos os botões de adicionar ao pedido no cardápio.
    document.querySelectorAll('.btn-adicionar').forEach(button => {
        button.addEventListener('click', () => {
            const cardProduto = button.closest('.card-produto');
            const nomeProduto = cardProduto.dataset.nome; // Pega o nome do data-attribute
            const precoProduto = parseFloat(cardProduto.dataset.preco); // Pega o preço do data-attribute

            adicionarAoPedido(nomeProduto, precoProduto);
        });
    });

    /**
     * Adiciona um produto ao objeto 'pedido' ou incrementa sua quantidade.
     * @param {string} nome - O nome do produto.
     * @param {number} preco - O preço do produto.
     */
    function adicionarAoPedido(nome, preco) {
        if (pedido[nome]) {
            pedido[nome].quantidade++;
        } else {
            pedido[nome] = {
                quantidade: 1,
                preco: preco
            };
        }
        // console.log(pedido); // Linha para testar e ver o objeto do pedido no console.
        atualizarResumoDoPedido();
    }

    /**
     * Atualiza a seção de resumo do pedido na página com os itens, quantidades e total.
     */
    function atualizarResumoDoPedido() {
        const resumoContainer = document.getElementById('resumo-pedido');
        const listaItens = document.getElementById('lista-itens-pedido');
        const totalPedidoEl = document.getElementById('total-pedido');

        if (!resumoContainer || !listaItens || !totalPedidoEl) return;

        listaItens.innerHTML = ''; // Limpa a lista antes de atualizar
        let total = 0;

        // Cria a lista de itens no resumo
        for (const nomeProduto in pedido) {
            const item = pedido[nomeProduto];
            const li = document.createElement('li');
            li.textContent = `${item.quantidade}x ${nomeProduto} - R$ ${(item.quantidade * item.preco).toFixed(2)}`;
            listaItens.appendChild(li);
            total += item.quantidade * item.preco;
        }

        // Atualiza o valor total
        totalPedidoEl.textContent = `R$ ${total.toFixed(2)}`;

        // Mostra a seção de resumo se ela estiver escondida
        if (Object.keys(pedido).length > 0) {
            resumoContainer.style.display = 'block';
        } else {
            resumoContainer.style.display = 'none';
        }
    }

    // Adiciona o evento de clique ao botão de finalizar o pedido
    const btnFinalizar = document.getElementById('btn-finalizar-pedido');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', gerarLinkWhatsApp);
    }
    
    /**
     * Gera e abre o link do WhatsApp com a mensagem do pedido formatada.
     */
    function gerarLinkWhatsApp() {
        if (Object.keys(pedido).length === 0) {
            alert("Seu carrinho está vazio. Adicione alguns doces antes de finalizar!");
            return;
        }

        let mensagem = 'Olá, M-doces! Gostaria de fazer o seguinte pedido:\n\n';
        let total = 0;

        for (const nomeProduto in pedido) {
            const item = pedido[nomeProduto];
            mensagem += `▪️ ${item.quantidade}x ${nomeProduto}\n`;
            total += item.quantidade * item.preco;
        }

        mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;
        
        // Codifica a mensagem para ser usada em uma URL
        const mensagemCodificada = encodeURIComponent(mensagem);
        const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
        
        // Abre o link em uma nova aba
        window.open(linkWhatsApp, '_blank');
    }


    // --- VALIDAÇÃO DO FORMULÁRIO DE CONTATO (REFINADO) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão para controlarmos via JS
            
            clearErrorMessages(); // Limpa erros anteriores
            let isValid = true;

            const nameInput = document.querySelector('#nome');
            const emailInput = document.querySelector('#email');
            const messageInput = document.querySelector('#mensagem');
            
            if (!nameInput.value.trim()) {
                displayError(nameInput, 'Por favor, preencha seu nome.');
                isValid = false;
            }
            if (!isValidEmail(emailInput.value.trim())) {
                displayError(emailInput, 'Por favor, insira um e-mail válido.');
                isValid = false;
            }
            if (!messageInput.value.trim()) {
                displayError(messageInput, 'Por favor, escreva sua mensagem.');
                isValid = false;
            }

            if (isValid) {
                // Aqui você integraria com um serviço como Formspree, se quisesse receber o e-mail
                alert('Mensagem enviada com sucesso! (Simulação)');
                contactForm.reset();
            }
        });
    }

    function displayError(inputElement, message) {
        inputElement.classList.add('has-error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        inputElement.parentElement.appendChild(errorDiv);
    }

    function clearErrorMessages() {
        document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    
    // --- EFEITOS GERAIS E MELHORIAS DE UX ---
    // A melhor prática é mover efeitos de HOVER (mouse sobre) para o CSS.
    // O efeito de scroll suave para âncoras é mantido pois é uma funcionalidade.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
