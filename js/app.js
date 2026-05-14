document.addEventListener('DOMContentLoaded', () => {

  // ---- NAV SCROLL EFFECT (home page only) ----
  const nav = document.getElementById('nav');
  if (nav && !nav.classList.contains('nav--scrolled')) {
    const handleScroll = () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // ---- MOBILE NAV TOGGLE ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ---- STAT COUNTER ANIMATION ----
  const statNums = document.querySelectorAll('.hero__stat-num');
  let statsCounted = false;

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count);
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (statNums.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNums.forEach(el => animateCount(el));
        }
      });
    }, { threshold: 0.5 });
    const statsContainer = document.querySelector('.hero__stats');
    if (statsContainer) statsObserver.observe(statsContainer);
  }

  // ---- BUSINESS CARD BUILDER ----
  const createCard = (biz) => {
    const card = document.createElement('div');
    card.className = 'biz-card fade-in';
    card.dataset.category = biz.category;

    let metaHTML = `<span>📍 ${biz.address}</span>`;
    if (biz.phone) {
      metaHTML += `<span>📞 <a href="tel:${biz.phone.replace(/[^0-9]/g, '')}">${biz.phone}</a></span>`;
    }

    card.innerHTML = `
      <span class="biz-card__category">${biz.categoryLabel}</span>
      <h3 class="biz-card__name">${biz.name}</h3>
      <p class="biz-card__desc">${biz.description}</p>
      <div class="biz-card__meta">${metaHTML}</div>
    `;
    return card;
  };

  // ---- DIRECTORY PAGE ----
  const directoryGrid = document.getElementById('directoryGrid');
  const directoryEmpty = document.getElementById('directoryEmpty');
  const searchInput = document.getElementById('directorySearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const directoryCount = document.getElementById('directoryCount');

  if (directoryGrid && typeof businesses !== 'undefined') {
    let activeFilter = 'all';

    const renderDirectory = () => {
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const filtered = businesses.filter(biz => {
        const matchesFilter = activeFilter === 'all' || biz.category === activeFilter;
        const matchesSearch = !searchTerm ||
          biz.name.toLowerCase().includes(searchTerm) ||
          biz.description.toLowerCase().includes(searchTerm) ||
          biz.categoryLabel.toLowerCase().includes(searchTerm) ||
          biz.address.toLowerCase().includes(searchTerm);
        return matchesFilter && matchesSearch;
      });

      directoryGrid.innerHTML = '';

      if (filtered.length === 0) {
        if (directoryEmpty) directoryEmpty.style.display = 'block';
        if (directoryCount) directoryCount.textContent = '';
      } else {
        if (directoryEmpty) directoryEmpty.style.display = 'none';
        if (directoryCount) {
          directoryCount.textContent = `Showing ${filtered.length} of ${businesses.length} businesses`;
        }
        filtered.forEach((biz, i) => {
          const card = createCard(biz);
          directoryGrid.appendChild(card);
          setTimeout(() => card.classList.add('visible'), 50 * i);
        });
      }
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderDirectory();
      });
    });

    if (searchInput) searchInput.addEventListener('input', renderDirectory);
    renderDirectory();
  }

  // ---- FEATURED GRID (home page) ----
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid && typeof businesses !== 'undefined') {
    const featured = businesses.filter(b => b.phone);
    featured.forEach((biz, i) => {
      const card = createCard(biz);
      featuredGrid.appendChild(card);
      setTimeout(() => card.classList.add('visible'), 80 * i);
    });
  }

  // ---- SCROLL ANIMATIONS ----
  const fadeEls = document.querySelectorAll(
    '.visit__card, .event-card, .timeline__item, .association__card, .map-callout__inner, .highlight-card, .info-card, .impact__item, .arch-section__inner, .events__submit-inner'
  );
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => fadeObserver.observe(el));

  // ---- SMOOTH SCROLL FOR HASH LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = (nav ? nav.offsetHeight : 0) + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- CONTACT FORM ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      alert(`Thanks, ${name}! Your message has been received. We'll be in touch soon.`);
      contactForm.reset();
    });
  }

});
