document.addEventListener('DOMContentLoaded', () => {
    // --- Validação do Formulário de Contato Aprimorada ---
    const contactForm = document.querySelector('form');

    if (contactForm) { // Verifica se o formulário existe na página
        contactForm.addEventListener('submit', (event) => {
            const nameInput = document.querySelector('#nome');
            const emailInput = document.querySelector('#email');
            const messageInput = document.querySelector('#mensagem');

            // Remove mensagens de erro anteriores
            clearErrorMessages();

            let hasError = false;

            if (!nameInput.value.trim()) {
                displayError(nameInput, 'Por favor, preencha seu nome.');
                hasError = true;
            }

            if (!emailInput.value.trim()) {
                displayError(emailInput, 'Por favor, preencha seu e-mail.');
                hasError = true;
            } else if (!isValidEmail(emailInput.value.trim())) {
                displayError(emailInput, 'Por favor, insira um e-mail válido.');
                hasError = true;
            }

            if (!messageInput.value.trim()) {
                displayError(messageInput, 'Por favor, preencha sua mensagem.');
                hasError = true;
            }

            if (hasError) {
                event.preventDefault(); // Impede o envio do formulário se houver erros
            } else {
                // Se tudo estiver OK, você pode adicionar lógica para enviar o formulário
                // alert('Mensagem enviada com sucesso! (Funcionalidade de envio precisa ser implementada no backend)');
                // Para demonstração, impedimos o envio aqui para que você possa ver a validação
                event.preventDefault(); 
                alert('Formulário validado com sucesso! (O envio real seria para um backend)');
                contactForm.reset(); // Limpa o formulário após validação bem-sucedida (opcional)
            }
        });
    }

    function displayError(inputElement, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '0.8em';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        inputElement.style.borderColor = 'red'; // Destaque visual no campo
    }

    function clearErrorMessages() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = ''); // Remove destaque visual
    }

    function isValidEmail(email) {
        // Regex para validação básica de e-mail
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // --- Contagem Regressiva para Promoção Aprimorada ---
    const promoElement = document.querySelector('#promo');

    if (promoElement) { // Verifica se o elemento da promoção existe
        // Define a data da promoção, você pode torná-la dinâmica (ex: via API)
        // Por exemplo, 30 dias a partir de hoje:
        // const promoEndDate = new Date();
        // promoEndDate.setDate(promoEndDate.getDate() + 30);
        // const promoDate = promoEndDate.getTime();

        // Ou use sua data fixa se preferir
        const promoDate = new Date('2025-12-31T23:59:59').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = promoDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                promoElement.innerHTML = '<span class="promo-ended">🎉 Promoção Encerrada! Fique ligado para as próximas! 🎉</span>';
                promoElement.style.color = '#888'; // Tom de cinza para indicar fim
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                promoElement.innerHTML = `
                    <span class="countdown-label">Oferta termina em:</span>
                    <span class="countdown-item">${days} <small>dias</small></span>
                    <span class="countdown-item">${hours} <small>horas</small></span>
                    <span class="countdown-item">${minutes} <small>minutos</small></span>
                    <span class="countdown-item">${seconds} <small>segundos</small></span>
                `;
            }
        };

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Chama a função uma vez para evitar delay inicial
    }

    // --- Funcionalidade Extra: Efeitos Visuais para Botões ---
    document.querySelectorAll('button, .btn, input[type="submit"]').forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)';
            button.style.transition = 'transform 0.2s ease-in-out';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });
    });

    // --- Funcionalidade Extra: Scroll Suave para Links de Âncora ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Funcionalidade Extra: Galeria de Imagens/Carrossel Básico (Exemplo) ---
    // Se você tiver uma galeria de produtos ou um carrossel,
    // adicione a lógica aqui. Exemplo de um carrossel simples:
    const carouselContainer = document.querySelector('.carousel-container'); // Adicione esta classe ao seu HTML
    if (carouselContainer) {
        let currentSlide = 0;
        const slides = carouselContainer.querySelectorAll('.carousel-item'); // Adicione esta classe às imagens/itens
        const totalSlides = slides.length;

        if (totalSlides > 0) {
            const showSlide = (index) => {
                slides.forEach((slide, i) => {
                    slide.style.display = (i === index) ? 'block' : 'none';
                });
            };

            const nextSlide = () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                showSlide(currentSlide);
            };

            // Automatic slide change every 5 seconds (adjust as needed)
            setInterval(nextSlide, 5000);
            showSlide(currentSlide); // Show the first slide initially
        }
    }
});
