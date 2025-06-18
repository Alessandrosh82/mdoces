// script.js

// Espera o conteúdo da página carregar completamente antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos (Cash the DOM) ---
    const productsListContainer = document.getElementById('produtos-cardapio');
    const loadingMessage = document.getElementById('loading-products-message');
    const noProductsMessage = document.getElementById('no-products-message');

    const cartIcon = document.getElementById('open-cart-modal');
    const cartCountSpan = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button'); // Botão de fechar do modal do carrinho
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalSpan = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutForm = document.getElementById('checkout-form');
    const customerPhoneInput = document.getElementById('customer-phone'); // Input de telefone do checkout

    const contactForm = document.getElementById('contact-form'); // Formulário de contato

    // --- Variáveis de Estado Global ---
    let cart = JSON.parse(localStorage.getItem('mdoces_cart')) || []; // Carrinho de compras
    let allProducts = []; // Para armazenar todos os produtos carregados do localStorage

    const numeroWhatsAppDoceria = '5596999999999'; // SEU NÚMERO DE WHATSAPP COM DDI (55) E DDD (96), APENAS NÚMEROS.

    // --- Funções Auxiliares ---

    /**
     * Formata um valor numérico para a representação de moeda brasileira.
     * @param {number} value - O valor a ser formatado.
     * @returns {string} - O valor formatado como "R$ X.XX".
     */
    function formatCurrency(value) {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }

    // --- Lógica do Carrinho de Compras (Modal) ---

    /**
     * Salva o estado atual do carrinho no localStorage.
     */
    function saveCart() {
        localStorage.setItem('mdoces_cart', JSON.stringify(cart));
    }

    /**
     * Atualiza o contador de itens no ícone do carrinho.
     */
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        cartCountSpan.style.display = totalItems > 0 ? 'block' : 'none'; // Mostra/esconde o contador
    }

    /**
     * Calcula e atualiza o valor total do carrinho.
     */
    function calculateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalSpan.textContent = `Total: ${formatCurrency(total)}`;
    }

    /**
     * Renderiza (desenha) os itens no modal do carrinho.
     */
    function renderCartItems() {
        cartItemsList.innerHTML = ''; // Limpa a lista antes de renderizar
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsList.style.display = 'none';
            checkoutForm.style.display = 'none'; // Esconde o formulário de checkout
        } else {
            emptyCartMessage.style.display = 'none';
            cartItemsList.style.display = 'block';
            checkoutForm.style.display = 'block'; // Mostra o formulário de checkout
            cart.forEach(item => {
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.innerHTML = `
                    <div class="cart-item-info">
                        <span class="item-name">${item.name} (x${item.quantity})</span>
                        <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}" aria-label="Remover ${item.name} do carrinho">Remover</button>
                `;
                cartItemsList.appendChild(li);
            });
        }
        calculateCartTotal(); // Recalcula o total a cada renderização
    }

    /**
     * Adiciona um produto ao carrinho. Se já existir, incrementa a quantidade.
     * @param {string} productId - O ID único do produto.
     */
    function addToCart(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: product.id,
                    name: product.nome,
                    price: product.preco,
                    quantity: 1
                });
            }
            saveCart();
            updateCartCount();
            alert(`${product.nome} adicionado ao carrinho!`);
        } else {
            alert('Erro: Produto não encontrado.');
        }
    }

    /**
     * Remove um item do carrinho.
     * @param {string} productId - O ID do produto a ser removido.
     */
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        renderCartItems(); // Atualiza a exibição do carrinho
    }

    // --- Carregamento e Exibição dos Produtos ---

    /**
     * Carrega os produtos do localStorage e os exibe na seção de cardápio.
     */
    function loadProductsFromLocalStorage() {
        loadingMessage.style.display = 'block'; // Mostra a mensagem de carregamento
        productsListContainer.innerHTML = ''; // Limpa qualquer conteúdo anterior
        noProductsMessage.style.display = 'none'; // Esconde a mensagem de "sem produtos"

        setTimeout(() => { // Simula um pequeno atraso para carregamento (UX)
            const products = JSON.parse(localStorage.getItem('mdoces_products')) || [];
            allProducts = products; // Armazena os produtos para uso no carrinho

            loadingMessage.style.display = 'none'; // Esconde a mensagem de carregamento

            if (products.length === 0) {
                noProductsMessage.style.display = 'block';
                noProductsMessage.textContent = 'Ainda não temos produtos cadastrados. Por favor, acesse o painel administrativo para adicioná-los!';
            } else {
                products.forEach(prod => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'produto'; // Usa a classe CSS 'produto'
                    productDiv.setAttribute('data-id', prod.id); // Adiciona o data-id para identificação
                    productDiv.innerHTML = `
                        <img src="${prod.imagem}" alt="${prod.nome}" onerror="this.onerror=null;this.src='https://via.placeholder.com/250x180?text=Imagem+N/D';" />
                        <h3>${prod.nome}</h3>
                        <p class="description">${prod.descricao}</p>
                        <p class="price">${formatCurrency(prod.preco)}</p>
                        <button class="btn add-to-cart-btn" data-product-id="${prod.id}" aria-label="Adicionar ${prod.nome} ao carrinho">Adicionar ao carrinho</button>
                    `;
                    productsListContainer.appendChild(productDiv);
                });
                // Adicionar listeners para os botões "Adicionar ao carrinho" recém-criados
                document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const productId = button.dataset.productId;
                        addToCart(productId);
                    });
                });
            }
        }, 500); // Carrega após 0.5 segundos
    }

    // --- Lógica de Finalização do Pedido (WhatsApp) ---

    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.');
            return;
        }

        const customerName = document.getElementById('customer-name').value.trim();
        const customerAddress = document.getElementById('customer-address').value.trim();
        const customerPhone = customerPhoneInput.value.replace(/\D/g, ''); // Pega apenas dígitos do telefone
        const paymentMethod = document.getElementById('payment-method').value;
        const orderNotes = document.getElementById('order-notes').value.trim();

        if (!customerName || !customerAddress || !customerPhone || !paymentMethod) {
            alert('Por favor, preencha todos os campos obrigatórios do formulário de finalização do pedido.');
            return;
        }

        if (customerPhone.length < 10) { // Validação simples para DDD + 8 ou 9 dígitos
            alert('Por favor, insira um número de telefone válido com DDD (ex: 96999999999).');
            return;
        }

        let orderSummary = `Olá! Meu nome é *${customerName}* e gostaria de fazer um pedido da MDoces Delivery.\n\n`;
        orderSummary += `*Itens do Pedido:*\n`;
        cart.forEach(item => {
            orderSummary += `- ${item.name} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}\n`;
        });
        orderSummary += `\n*Total do Pedido: ${cartTotalSpan.textContent}*\n\n`;
        orderSummary += `*Detalhes para Entrega:*\n`;
        orderSummary += `Endereço: ${customerAddress}\n`;
        orderSummary += `Telefone: ${customerPhoneInput.value}\n`; // Usa o telefone formatado para a mensagem
        orderSummary += `Forma de Pagamento: ${paymentMethod}\n`;
        if (orderNotes) {
            orderSummary += `Observações: ${orderNotes}\n`;
        }

        const whatsappUrl = `https://wa.me/${numeroWhatsAppDoceria}?text=${encodeURIComponent(orderSummary)}`;

        window.open(whatsappUrl, '_blank'); // Abre o WhatsApp em uma nova aba

        // Limpa o carrinho e o formulário após o pedido
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems();
        checkoutForm.reset();
        cartModal.style.display = 'none'; // Fecha o modal
        alert('Seu pedido foi enviado para o WhatsApp da doceria! Entraremos em contato em breve.');
    });

    // --- Validação e Envio do Formulário de Contato ---

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão

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
                // Em um ambiente real, você enviaria esses dados para um serviço de backend
                // Ex: fetch('URL_DO_SEU_BACKEND', { method: 'POST', body: JSON.stringify({ nome, email, assunto, mensagem }) })
                console.log('Dados do Formulário de Contato:', {
                    nome: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    assunto: document.querySelector('#assunto').value.trim(),
                    mensagem: messageInput.value.trim()
                });
                alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
                contactForm.reset();
            }
        });
    }

    /**
     * Exibe uma mensagem de erro abaixo do input.
     * @param {HTMLElement} inputElement - O elemento input que tem o erro.
     * @param {string} message - A mensagem de erro a ser exibida.
     */
    function displayError(inputElement, message) {
        inputElement.classList.add('has-error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        inputElement.parentElement.appendChild(errorDiv);
    }

    /**
     * Remove todas as mensagens de erro e classes de erro dos inputs.
     */
    function clearErrorMessages() {
        document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    /**
     * Valida um endereço de e-mail usando uma expressão regular simples.
     * @param {string} email - O e-mail a ser validado.
     * @returns {boolean} - True se o e-mail for válido, false caso contrário.
     */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // --- Efeitos Gerais e Melhorias de UX ---

    // Scroll suave para links de âncora
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

    // Formatação do Telefone no Checkout
    customerPhoneInput.addEventListener('input', (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue = `(${value.substring(0, 2)}`;
        }
        if (value.length > 2) {
            formattedValue += `) ${value.substring(2, 7)}`;
        }
        if (value.length > 7) {
            formattedValue += `-${value.substring(7, 11)}`;
        }
        event.target.value = formattedValue;
    });


    // --- Inicialização da Página ---

    // Carrega os produtos e atualiza o carrinho ao carregar a página
    loadProductsFromLocalStorage();
    updateCartCount();

    // Opcional: Recarrega os produtos e o carrinho se houver alteração no localStorage (útil para desenvolvimento/administração)
    window.addEventListener('storage', (event) => {
        if (event.key === 'mdoces_products' || event.key === 'mdoces_cart') {
            loadProductsFromLocalStorage(); // Recarrega a lista de produtos (caso haja atualização)
            updateCartCount(); // Atualiza a contagem do carrinho
            renderCartItems(); // Atualiza a lista do carrinho no modal
        }
    });

    // --- Event Listeners para o Modal do Carrinho ---

    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex'; // Usar flex para centralizar
        renderCartItems(); // Renderiza os itens sempre que o modal é aberto
    });

    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) { // Fecha o modal se clicar fora dele
            cartModal.style.display = 'none';
        }
    });

    cartItemsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const productId = event.target.dataset.id;
            removeFromCart(productId);
        }
    });

}); // Fim do DOMContentLoaded
