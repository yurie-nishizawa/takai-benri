// 信州おたすけ便利屋 助さん — main.js
(function () {
  // Mobile menu toggle
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // Year
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Works filter
  const chips = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');
  if (chips.length && cards.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const f = chip.dataset.filter;
        cards.forEach(card => {
          const show = f === 'all' || card.dataset.category === f;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Contact form placeholder handler
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('[data-form-message]');
      if (msg) {
        msg.classList.add('show');
        msg.textContent = 'お問い合わせありがとうございます。内容を確認のうえ、2営業日以内にご連絡いたします。';
      }
      form.reset();
      window.scrollTo({ top: form.offsetTop - 40, behavior: 'smooth' });
    });
  }
})();
