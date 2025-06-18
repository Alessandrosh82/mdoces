// script.js

// Garante que o script só execute após o DOM estar completamente carregado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Seletores de Elementos (Cached DOM Elements) ---
    // Agrupamento de elementos para melhor organização e performance.
    const DOMElements = {
        // Seção de Cardápio
        productsListContainer: document.getElementById('produtos-cardapio'),
        loadingMessage: document.getElementById('loading-products-message'),
        noProductsMessage: document.getElementById('no-products-message'),

        // Carrinho e Modal
        cartIcon: document.getElementById('open-cart-modal'),
        cartCountSpan: document.getElementById('cart-count'),
        cartModal: document.getElementById('cart-modal'),
        closeButton: document.querySelector('.close-button'),
        cartItemsList: document.getElementById('cart-items-list'),
        cartTotalSpan: document.getElementById('cart-total'),
        emptyCartMessage: document.getElementById('empty-cart-message'),

        // Formulário de Checkout (dentro do modal do carrinho)
        checkoutForm: document.getElementById('checkout-form'),
        customerPhoneInput: document.getElementById('customer-phone'),

        // Formulário de Contato
        contactForm: document.getElementById('contact-form')
    };

    // --- 2. Variáveis de Estado Global ---
    // Gerenciam o estado do aplicativo.
    let cart = JSON.parse(localStorage.getItem('mdoces_cart')) || []; // Carrinho persistente
    let allProducts = []; // Produtos carregados do localStorage (para acesso rápido)

    // Número de WhatsApp da Doceria (APENAS NÚMEROS: DDI+DDD+TELEFONE)
    const WHATSAPP_NUMBER = '5596999999999'; // Exemplo: 55 (Brasil) 96 (DDD Amapá) 999999999 (Seu número)

    // --- 3. Funções Auxiliares Comuns ---

    /**
     * Formata um valor numérico para o padrão de moeda brasileira (R$ X.XX).
     * @param {number} value - O valor a ser formatado.
     * @returns {string} - Valor formatado.
     */
    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    /**
     * Exibe uma mensagem de erro abaixo de um campo de formulário.
     * @param {HTMLElement} inputElement - O campo de entrada com erro.
     * @param {string} message - A mensagem de erro.
     */
    const displayError = (inputElement, message) => {
        inputElement.classList.add('has-error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        // Insere a mensagem de erro depois do input, mas antes do próximo elemento se houver
        inputElement.parentElement.insertBefore(errorDiv, inputElement.nextSibling);
    };

    /**
     * Remove todas as mensagens de erro e classes 'has-error' dos formulários.
     */
    const clearErrorMessages = () => {
        document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    };

    /**
     * Valida um endereço de e-mail básico.
     * @param {string} email - O e-mail a ser validado.
     * @returns {boolean} - True se for um e-mail válido, false caso contrário.
     */
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // --- 4. Lógica do Carrinho de Compras ---

    /** Salva o estado atual do carrinho no localStorage. */
    const saveCart = () => localStorage.setItem('mdoces_cart', JSON.stringify(cart));

    /** Atualiza o contador de itens no ícone do carrinho. */
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        DOMElements.cartCountSpan.textContent = totalItems;
        DOMElements.cartCountSpan.style.display = totalItems > 0 ? 'block' : 'none';
        DOMElements.cartCountSpan.setAttribute('aria-label', `${totalItems} itens no carrinho`);
    };

    /** Calcula e atualiza o valor total exibido no modal do carrinho. */
    const calculateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        DOMElements.cartTotalSpan.textContent = `Total: ${formatCurrency(total)}`;
    };

    /** Renderiza os itens do carrinho no modal. */
    const renderCartItems = () => {
        DOMElements.cartItemsList.innerHTML = ''; // Limpa a lista existente

        if (cart.length === 0) {
            DOMElements.emptyCartMessage.style.display = 'block';
            DOMElements.cartItemsList.style.display = 'none';
            DOMElements.checkoutForm.style.display = 'none';
        } else {
            DOMElements.emptyCartMessage.style.display = 'none';
            DOMElements.cartItemsList.style.display = 'block';
            DOMElements.checkoutForm.style.display = 'block'; // Mostra o formulário de checkout

            cart.forEach(item => {
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.setAttribute('aria-label', `${item.quantity} ${item.name}`);
                li.innerHTML = `
                    <div class="cart-item-info">
                        <span class="item-name">${item.name} <span class="item-quantity">(x${item.quantity})</span></span>
                        <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
                    </div>
                    <button class="remove-item-btn btn-icon" data-id="${item.id}" aria-label="Remover ${item.name} do carrinho">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                DOMElements.cartItemsList.appendChild(li);
            });
        }
        calculateCartTotal();
    };

    /**
     * Adiciona um produto ao carrinho ou incrementa sua quantidade.
     * @param {string} productId - ID único do produto.
     */
    const addToCart = (productId) => {
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
            // Feedback visual mais suave: poderia ser um toast notification
            alert(`${product.nome} adicionado ao carrinho!`);
        } else {
            console.error(`Erro: Produto com ID ${productId} não encontrado.`);
            alert('Não foi possível adicionar o produto ao carrinho. Tente novamente.');
        }
    };

    /**
     * Remove um item específico do carrinho.
     * @param {string} productId - ID do produto a ser removido.
     */
    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        renderCartItems();
    };

    // --- 5. Carregamento e Exibição dos Produtos no Cardápio ---

    /**
     * Carrega os produtos do localStorage e os renderiza na seção de cardápio.
     */
    const loadProductsFromLocalStorage = () => {
        DOMElements.loadingMessage.style.display = 'block';
        DOMElements.productsListContainer.innerHTML = '';
        DOMElements.noProductsMessage.style.display = 'none';

        // Simula um pequeno atraso para UX (como se estivesse carregando de um servidor)
        setTimeout(() => {
            const products = JSON.parse(localStorage.getItem('mdoces_products')) || [];
            allProducts = products; // Salva para uso nas funções do carrinho

            DOMElements.loadingMessage.style.display = 'none';

            if (products.length === 0) {
                DOMElements.noProductsMessage.style.display = 'block';
            } else {
                products.forEach(prod => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'produto-card'; // Classe para estilização de cada card de produto
                    productDiv.setAttribute('data-id', prod.id); // Para fácil identificação

                    productDiv.innerHTML = `
                        <img src="${prod.imagem}" alt="${prod.nome}" onerror="this.onerror=null;this.src='https://via.placeholder.com/250x180?text=Imagem+N/D'" loading="lazy" />
                        <h3>${prod.nome}</h3>
                        <p class="description">${prod.descricao}</p>
                        <p class="price">${formatCurrency(prod.preco)}</p>
                        <button class="btn primary-btn add-to-cart-btn" data-product-id="${prod.id}" aria-label="Adicionar ${prod.nome} ao carrinho">Adicionar ao carrinho</button>
                    `;
                    DOMElements.productsListContainer.appendChild(productDiv);
                });
                // Adiciona listeners para os botões "Adicionar ao carrinho" recém-criados
                document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const productId = button.dataset.productId;
                        addToCart(productId);
                    });
                });
            }
        }, 700); // Atraso levemente aumentado para simular carregamento
    };

    // --- 6. Lógica de Finalização do Pedido (WhatsApp) ---

    DOMElements.checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.');
            return;
        }

        clearErrorMessages(); // Limpa erros anteriores do formulário de checkout
        let isValidCheckout = true;

        const customerName = document.getElementById('customer-name');
        const customerAddress = document.getElementById('customer-address');
        const customerPhone = DOMElements.customerPhoneInput;
        const paymentMethod = document.getElementById('payment-method');
        const orderNotes = document.getElementById('order-notes');

        // Validação dos campos do checkout
        if (!customerName.value.trim()) {
            displayError(customerName, 'Por favor, preencha seu nome.');
            isValidCheckout = false;
        }
        if (!customerAddress.value.trim()) {
            displayError(customerAddress, 'Por favor, preencha seu endereço.');
            isValidCheckout = false;
        }
        // Remove tudo que não é dígito para validar o tamanho do telefone
        const cleanPhone = customerPhone.value.replace(/\D/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 11) { // Min 10 (DDD+8 dígitos) Max 11 (DDD+9 dígitos)
            displayError(customerPhone, 'Por favor, insira um telefone válido com DDD (ex: 96991234567).');
            isValidCheckout = false;
        }
        if (!paymentMethod.value) {
            displayError(paymentMethod, 'Por favor, selecione uma forma de pagamento.');
            isValidCheckout = false;
        }

        if (!isValidCheckout) {
            alert('Por favor, corrija os campos destacados para finalizar o pedido.');
            return;
        }

        // Constrói a mensagem do WhatsApp
        let orderSummary = `Olá! Meu nome é *${customerName.value.trim()}* e gostaria de fazer um pedido da MDoces Delivery.\n\n`;
        orderSummary += `*Itens do Pedido:*\n`;
        cart.forEach(item => {
            orderSummary += `- ${item.name} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}\n`;
        });
        orderSummary += `\n*Total do Pedido: ${DOMElements.cartTotalSpan.textContent}*\n\n`;
        orderSummary += `*Detalhes para Entrega:*\n`;
        orderSummary += `Endereço: ${customerAddress.value.trim()}\n`;
        orderSummary += `Telefone: ${customerPhone.value}\n`;
        orderSummary += `Forma de Pagamento: ${paymentMethod.value}\n`;
        if (orderNotes.value.trim()) {
            orderSummary += `Observações: ${orderNotes.value.trim()}\n`;
        }
        orderSummary += `\n_Este pedido foi gerado automaticamente pelo site._`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderSummary)}`;

        window.open(whatsappUrl, '_blank'); // Abre o WhatsApp em uma nova aba

        // Limpa o carrinho e o formulário após o pedido ser enviado
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems(); // Re-renderiza o carrinho para mostrar que está vazio
        DOMElements.checkoutForm.reset();
        DOMElements.cartModal.style.display = 'none'; // Fecha o modal
        alert('Seu pedido foi enviado para o WhatsApp da doceria! Entraremos em contato em breve para confirmar.');
    });

    // --- 7. Validação e Envio do Formulário de Contato ---

    if (DOMElements.contactForm) {
        DOMElements.contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            clearErrorMessages();
            let isValidContact = true;

            const nameInput = document.getElementById('nome');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('mensagem');
            const subjectInput = document.getElementById('assunto'); // Adicionado o assunto

            if (!nameInput.value.trim()) {
                displayError(nameInput, 'Por favor, preencha seu nome.');
                isValidContact = false;
            }
            if (!isValidEmail(emailInput.value.trim())) {
                displayError(emailInput, 'Por favor, insira um e-mail válido.');
                isValidContact = false;
            }
            if (!messageInput.value.trim()) {
                displayError(messageInput, 'Por favor, escreva sua mensagem.');
                isValidContact = false;
            }

            if (isValidContact) {
                // Em um cenário real, você integraria aqui um serviço de backend
                // (e.g., Formspree, Netlify Forms, sua própria API) para receber os e-mails.
                // Por enquanto, apenas exibe no console e alerta o usuário.
                console.log('Dados do Formulário de Contato:', {
                    nome: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    assunto: subjectInput.value.trim(),
                    mensagem: messageInput.value.trim()
                });
                alert('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');
                DOMElements.contactForm.reset(); // Limpa o formulário após o envio
            } else {
                alert('Por favor, corrija os campos destacados no formulário de contato.');
            }
        });
    }

    // --- 8. Efeitos Gerais e Melhorias de UX ---

    // Scroll suave para links de âncora (navegação interna)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Evita o comportamento padrão do link
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth' // Rolagem suave
                });
            }
        });
    });

    // Formatação do Telefone no campo de checkout (máscara simples)
    if (DOMElements.customerPhoneInput) {
        DOMElements.customerPhoneInput.addEventListener('input', (event) => {
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
    }

    // --- 9. Inicialização da Página ---

    /** Função para carregar tudo que precisa ao iniciar a página. */
    const initializePage = () => {
        loadProductsFromLocalStorage(); // Carrega e exibe os produtos
        updateCartCount(); // Atualiza o contador do carrinho
        // Não renderiza o carrinho aqui, apenas quando o modal é aberto.
    };

    initializePage(); // Chama a função de inicialização

    // Opcional: Monitora mudanças no localStorage para atualizar UI (útil para o admin)
    window.addEventListener('storage', (event) => {
        // Se 'mdoces_products' ou 'mdoces_cart' foram alterados em outra aba/janela
        if (event.key === 'mdoces_products' || event.key === 'mdoces_cart') {
            initializePage(); // Recarrega produtos e atualiza carrinho
            if (DOMElements.cartModal.style.display === 'flex') { // Se o modal estiver aberto, atualiza também
                renderCartItems();
            }
        }
    });

    // --- 10. Event Listeners para o Modal do Carrinho ---

    DOMElements.cartIcon.addEventListener('click', () => {
        DOMElements.cartModal.style.display = 'flex'; // Abre o modal (usando flex para centralizar)
        renderCartItems(); // Renderiza os itens do carrinho sempre que o modal é aberto
    });

    DOMElements.closeButton.addEventListener('click', () => {
        DOMElements.cartModal.style.display = 'none'; // Fecha o modal
    });

    // Fecha o modal se o usuário clicar fora do conteúdo do modal
    window.addEventListener('click', (event) => {
        if (event.target === DOMElements.cartModal) {
            DOMElements.cartModal.style.display = 'none';
        }
    });

    // Delegação de evento para os botões de remover item do carrinho
    DOMElements.cartItemsList.addEventListener('click', (event) => {
        if (event.target.closest('.remove-item-btn')) { // Usa closest para pegar o botão mesmo clicando no ícone
            const productId = event.target.closest('.remove-item-btn').dataset.id;
            removeFromCart(productId);
        }
    });

}); // Fim do DOMContentLoaded
