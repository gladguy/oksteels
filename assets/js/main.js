/* ============================================
   OK STEELS — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Sticky Navbar ----
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Hamburger Menu ----
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- Active Nav Link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    // Always strip any hardcoded active class first
    link.classList.remove('active');
    const href = (link.getAttribute('href') || '').split('#')[0]; // strip hash
    const page = href || 'index.html';
    if (page === currentPage || (currentPage === '' && page === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Scroll Reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const dur = 1800;
          const step = target / (dur / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = prefix + Math.floor(current).toLocaleString('en-IN') + suffix;
          }, 16);
          countObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObs.observe(el));
  }

  // ---- Enquiry Form ----
  const form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('#name').value.trim();
      const phone = form.querySelector('#phone').value.trim();
      const product = form.querySelector('#product').value;

      if (!name) { showError(form, '#name', 'Please enter your name.'); return; }
      if (!phone || !/^\+?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
        showError(form, '#phone', 'Please enter a valid Indian mobile number.'); return;
      }
      if (!product) { showError(form, '#product', 'Please select a product.'); return; }

      // Compose WhatsApp message as fallback enquiry
      const msg = `Hi OK Steels! I'd like to enquire about ${product}.\nName: ${name}\nPhone: ${phone}`;
      const encodedMsg = encodeURIComponent(msg);

      // Show success message
      const successDiv = form.querySelector('.form-success');
      if (successDiv) {
        form.querySelectorAll('.form-group, .form-row').forEach(el => el.style.display = 'none');
        form.querySelector('.form-submit').style.display = 'none';
        successDiv.style.display = 'block';
      }

      // Open WhatsApp after short delay
      setTimeout(() => {
        window.open(`https://wa.me/919894433229?text=${encodedMsg}`, '_blank');
      }, 800);
    });

    // Clear error on input
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => {
        el.style.borderColor = '';
        el.style.boxShadow = '';
        const err = el.parentElement.querySelector('.field-error');
        if (err) err.remove();
      });
    });
  }

  function showError(form, selector, msg) {
    const el = form.querySelector(selector);
    if (!el) return;
    el.style.borderColor = '#e53935';
    el.style.boxShadow = '0 0 0 3px rgba(229,57,53,0.12)';
    const existing = el.parentElement.querySelector('.field-error');
    if (existing) existing.remove();
    const errEl = document.createElement('span');
    errEl.className = 'field-error';
    errEl.style.cssText = 'font-size:0.78rem;color:#e53935;margin-top:4px;display:block';
    errEl.textContent = msg;
    el.parentElement.appendChild(errEl);
    el.focus();
  }

  // ---- Smooth Anchor Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
