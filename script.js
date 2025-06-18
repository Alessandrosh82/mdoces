document.addEventListener('DOMContentLoaded', () => {
    // --- Validação do Formulário de Contato Aprimorada ---
    const contactForm = document.querySelector('.contact-form'); // Seletor ajustado para a classe do formulário

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
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            formGroup.appendChild(errorDiv);
        } else {
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        }
        inputElement.style.borderColor = 'red';
    }

    function clearErrorMessages() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = '');
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // --- Funcionalidade Extra: Efeitos Visuais para Botões ---
    document.querySelectorAll('.btn').forEach(button => {
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
});
