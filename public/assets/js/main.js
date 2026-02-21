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

  // ============================================
  // VIDEO POPUP — one-time autoplay on homepage
  // ============================================
  const popup = document.getElementById('video-popup');
  const popupVid = document.getElementById('popup-video');
  const closeBtn = document.getElementById('vp-close-btn');
  const skipBtn = document.getElementById('vp-skip-btn');
  const watchBtn = document.getElementById('hero-watch-btn');

  const STORAGE_KEY = 'oks_intro_played';

  function openPopup() {
    if (!popup) return;
    popup.hidden = false;
    document.body.style.overflow = 'hidden';
    // Small delay so the animation plays after display
    setTimeout(() => {
      popupVid.play().catch(() => { });
    }, 350);
  }

  function closePopup() {
    if (!popup) return;
    popupVid.pause();
    popupVid.currentTime = 0;
    popup.hidden = true;
    document.body.style.overflow = '';
    localStorage.setItem(STORAGE_KEY, '1');
  }

  // Auto-open popup only on homepage and only if not previously played
  const isHome = ['', '/', 'index.html'].includes(
    window.location.pathname.split('/').pop()
  );
  if (popup && isHome && !localStorage.getItem(STORAGE_KEY)) {
    // Give the page a beat to fully render first
    setTimeout(openPopup, 800);
  }

  // Close on X button
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  // Close on Skip
  if (skipBtn) skipBtn.addEventListener('click', closePopup);
  // Close on overlay backdrop click (not on the vp-box)
  if (popup) {
    popup.addEventListener('click', e => {
      if (e.target === popup) closePopup();
    });
  }
  // Esc key closes popup
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup && !popup.hidden) closePopup();
  });
  // When video finishes mark as played
  if (popupVid) {
    popupVid.addEventListener('ended', () => {
      closePopup();
    });
  }

  // Hero "Watch Video" button always re-opens popup
  if (watchBtn) {
    watchBtn.addEventListener('click', openPopup);
  }

  // ============================================
  // BACKGROUND VIDEO — sound toggle
  // ============================================
  const bgVid = document.getElementById('inline-video');
  const soundBtn = document.getElementById('sound-toggle-btn');
  const iconMuted = document.getElementById('icon-muted');
  const iconSound = document.getElementById('icon-sound');

  function setMuteState(muted) {
    if (!bgVid) return;
    bgVid.muted = muted;
    if (iconMuted) iconMuted.style.display = muted ? '' : 'none';
    if (iconSound) iconSound.style.display = muted ? 'none' : '';
    if (soundBtn) soundBtn.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video');
  }

  // Sound toggle button
  if (soundBtn && bgVid) {
    soundBtn.addEventListener('click', e => {
      e.stopPropagation(); // don't bubble to page click handler
      setMuteState(!bgVid.muted);
    });
  }

  // Optional: clicking anywhere on the video section also unmutes (first time)
  const bgSection = document.getElementById('brand-video');
  let pageClickUnmuted = false;
  if (bgSection && bgVid) {
    bgSection.addEventListener('click', e => {
      // Only unmute on section click if not already unmuted and not clicking the button
      if (!pageClickUnmuted && bgVid.muted) {
        setMuteState(false);
        pageClickUnmuted = true;
      }
    });
  }

  // ============================================
  // PRODUCT IMAGE SWITCHER (products.html)
  // ============================================
  document.querySelectorAll('.prod-card[data-img]').forEach(card => {
    card.addEventListener('click', () => {
      const imgId = card.dataset.img;
      const newSrc = card.dataset.src;
      const newCap = card.dataset.cap;
      const img = document.getElementById(imgId);
      const cap = document.getElementById(imgId + '-cap');
      if (!img || !newSrc) return;

      // Deactivate sibling cards in same group
      const group = card.closest('.prod-group');
      if (group) {
        group.querySelectorAll('.prod-card[data-img]').forEach(c => c.classList.remove('active'));
      }
      card.classList.add('active');

      // Crossfade image
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = newSrc;
        img.onload = () => { img.style.opacity = '1'; };
        if (cap && newCap) cap.innerHTML = newCap;
      }, 200);
    });
  });

  // Dynamic Year Update
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});


