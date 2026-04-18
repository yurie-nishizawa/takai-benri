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

  // Works: フィルター + ページネーション + アコーディオン
  (function () {
    const ITEMS_PER_PAGE = 6;
    const grid = document.querySelector('[data-filter-grid]') || document.querySelector('.work-grid');
    const paginationEl = document.getElementById('works-pagination');
    if (!grid) return;

    const chips = document.querySelectorAll('[data-filter]');
    let currentFilter = 'all';
    let currentPage = 1;

    // アコーディオン
    grid.addEventListener('click', function (e) {
      const summary = e.target.closest('.work-card-summary');
      if (!summary) return;
      const card = summary.closest('.work-card');
      if (!card) return;
      const isHidden = !card.classList.contains('is-open');
      // 全部閉じる
      grid.querySelectorAll('.work-card.is-open').forEach(function (c) {
        c.classList.remove('is-open');
      });
      // クリックしたものを開く（既に開いていたら閉じたまま）
      if (isHidden) card.classList.add('is-open');
    });

    function getFilteredCards() {
      const all = Array.from(grid.querySelectorAll('.work-card'));
      if (currentFilter === 'all') return all;
      return all.filter(function (c) {
        return c.dataset.category === currentFilter;
      });
    }

    function renderPage() {
      const filtered = getFilteredCards();
      const all = Array.from(grid.querySelectorAll('.work-card'));
      const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const visible = new Set(filtered.slice(start, end));

      all.forEach(function (card) {
        card.style.display = visible.has(card) ? '' : 'none';
      });

      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      if (!paginationEl) return;
      paginationEl.innerHTML = '';
      if (totalPages <= 1) return;

      const prev = document.createElement('button');
      prev.className = 'pagination-btn';
      prev.textContent = '← 前へ';
      prev.disabled = currentPage === 1;
      prev.addEventListener('click', function () {
        currentPage--;
        renderPage();
        window.scrollTo({ top: grid.offsetTop - 80, behavior: 'smooth' });
      });
      paginationEl.appendChild(prev);

      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.addEventListener('click', (function (page) {
          return function () {
            currentPage = page;
            renderPage();
            window.scrollTo({ top: grid.offsetTop - 80, behavior: 'smooth' });
          };
        })(i));
        paginationEl.appendChild(btn);
      }

      const next = document.createElement('button');
      next.className = 'pagination-btn';
      next.textContent = '次へ →';
      next.disabled = currentPage === totalPages;
      next.addEventListener('click', function () {
        currentPage++;
        renderPage();
        window.scrollTo({ top: grid.offsetTop - 80, behavior: 'smooth' });
      });
      paginationEl.appendChild(next);
    }

    // フィルターチップ
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        currentFilter = chip.dataset.filter;
        currentPage = 1;
        renderPage();
      });
    });

    renderPage();
  })();

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
