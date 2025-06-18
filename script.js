document.addEventListener('DOMContentLoaded', () => {
  // Validação do formulário de contato
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    const nome = document.querySelector('#nome').value;
    const email = document.querySelector('#email').value;
    const mensagem = document.querySelector('#mensagem').value;

    if (!nome || !email || !mensagem) {
      e.preventDefault();
      alert('Por favor, preencha todos os campos.');
    }
  });

  // Contagem regressiva para promoção
  const promoDate = new Date('2025-12-31T23:59:59').getTime();
  const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = promoDate - now;

    if (distance < 0) {
      clearInterval(countdown);
      document.querySelector('#promo').innerHTML = 'Promoção encerrada';
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.querySelector('#promo').innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  }, 1000);
});
