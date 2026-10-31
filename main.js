/* ============================================================
   main.js — Portfólio Lucas Tino Gomes
   JS puro, sem frameworks.
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   1. ANIMAÇÕES DE SCROLL
   ══════════════════════════════════════════════════════════════ */

// 1a. Observer geral — aciona data-animate em todos os elementos
const animatedEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);

        // Dispara glitch nos títulos de seção ao entrar
        if (entry.target.matches('.section-header')) {
          glitchTitle(entry.target.querySelector('.section-header__title'));
        }

        // Dispara contagem nos stats ao entrar
        if (entry.target.matches('.sobre__stats')) {
          animateCounters(entry.target);
        }
      }
    });
  },
  { threshold: 0.12 }
);

animatedEls.forEach((el) => observer.observe(el));

// 1b. Stagger automático nos cards da galeria (sem precisar escrever --delay no HTML)
document.querySelectorAll('.projetos__grid .proj-card').forEach((card, i) => {
  card.style.setProperty('--delay', `${i * 0.08}s`);
  card.setAttribute('data-animate', 'scale-in');
  observer.observe(card);
});

// 1c. Barra de progresso de scroll
const scrollBar = document.getElementById('scroll-progress');

function updateScrollBar() {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  const pct      = total > 0 ? (scrolled / total) * 100 : 0;
  scrollBar.style.width = pct + '%';
}

// 1d. Parallax suave no hero
const heroContent = document.querySelector('.hero__content');

function updateParallax() {
  if (!heroContent) return;
  const y = window.scrollY;
  // Move o conteúdo 30% mais devagar que o scroll (efeito profundidade)
  heroContent.style.transform = `translateY(${y * 0.28}px)`;
}

// Listener único de scroll para tudo
window.addEventListener('scroll', () => {
  updateScrollBar();
  updateParallax();
  header.classList.toggle('nav--scrolled', window.scrollY > 40);
  highlightActiveLink();
}, { passive: true });

// Roda uma vez no load para estado inicial
updateScrollBar();

/* ══════════════════════════════════════════════════════════════
   1e. GLITCH nos títulos de seção
   ══════════════════════════════════════════════════════════════ */
function glitchTitle(el) {
  if (!el) return;
  el.setAttribute('data-text', el.textContent);
  el.classList.add('glitch-active');
  // Remove a classe após a animação (0.45s) para não ficar preso
  setTimeout(() => el.classList.remove('glitch-active'), 500);
}

/* ══════════════════════════════════════════════════════════════
   1f. CONTADOR animado nos stats
   ══════════════════════════════════════════════════════════════ */
function animateCounters(container) {
  container.querySelectorAll('.sobre__stat-num').forEach((el) => {
    const raw   = el.textContent.trim();
    const num   = parseInt(raw, 10);
    if (isNaN(num)) return;          // "∞" não anima

    const suffix = raw.replace(String(num), '');  // "+", "" etc.
    const dur    = 900;              // ms total
    const fps    = 60;
    const steps  = Math.round((dur / 1000) * fps);
    let   step   = 0;

    el.classList.add('counting');
    el.textContent = '0' + suffix;

    const interval = setInterval(() => {
      step++;
      // Easing out: accelera e desacelera
      const progress = step / steps;
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * num);
      el.textContent = current + suffix;

      if (step >= steps) {
        clearInterval(interval);
        el.textContent = raw;
        el.classList.remove('counting');
      }
    }, dur / steps);
  });
}

/* ══════════════════════════════════════════════════════════════
   2. TOGGLE MODO CLARO / ESCURO
   ══════════════════════════════════════════════════════════════ */
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

window.toggleTheme = function () {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
};

(function initTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
})();

/* ══════════════════════════════════════════════════════════════
   3. NAVEGAÇÃO
   ══════════════════════════════════════════════════════════════ */
const header      = document.getElementById('site-header');
const menuToggle  = document.getElementById('menuToggle');
const mobileMenu  = document.getElementById('mobileMenu');
const themeToggle = document.getElementById('themeToggle');
const navLinks    = document.querySelectorAll('.nav__link');
const sections    = document.querySelectorAll('section[id]');

// 3a. Entrada animada do header
window.addEventListener('load', () => {
  setTimeout(() => header.classList.add('nav--visible'), 200);
});

// 3b. Hamburger
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.setAttribute('aria-hidden', String(isOpen));
  mobileMenu.classList.toggle('is-open', !isOpen);
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
});

document.querySelectorAll('.nav__mobile-link').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  });
});

document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('is-open') && !header.contains(e.target)) {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  }
});

// 3c. Link ativo por seção
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) highlightActiveLink(entry.target.id);
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => sectionObserver.observe(s));

function highlightActiveLink(activeId) {
  navLinks.forEach((link) => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('is-active', href === activeId);
  });
}

themeToggle.addEventListener('click', window.toggleTheme);

/* ══════════════════════════════════════════════════════════════
   4. GALERIA — filtro por categoria
   ══════════════════════════════════════════════════════════════ */
const filtros   = document.querySelectorAll('.projetos__filtro');
const projCards = document.querySelectorAll('.proj-card');

filtros.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filtro = btn.dataset.filter;

    filtros.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    projCards.forEach((card) => {
      const mostrar = filtro === 'todos' || card.dataset.category === filtro;
      card.classList.toggle('is-hidden', !mostrar);
    });
  });
});

/* ══════════════════════════════════════════════════════════════
   5. VÍDEO "SOBRE MIM" — overlay some ao tocar
   ══════════════════════════════════════════════════════════════ */
const sobreVideo = document.querySelector('.sobre__video');

if (sobreVideo) {
  const overlay = sobreVideo.closest('.sobre__video-wrap')?.querySelector('.sobre__video-overlay');
  overlay?.addEventListener('click', () => {
    sobreVideo.play().catch(() => {});
  });

  sobreVideo.addEventListener('play', () => {
    sobreVideo.setAttribute('data-playing', '');
    if (heroVideo && !heroVideo.muted) {
      heroVideo.muted = true;
      if (heroMuteBtn) {
        heroMuteBtn.setAttribute('data-muted', 'true');
        heroMuteBtn.setAttribute('aria-label', 'Ativar som do vídeo');
        heroMuteBtn.setAttribute('title', 'Ativar som');
        const label = heroMuteBtn.querySelector('.hero__mute-label');
        if (label) label.textContent = 'Som';
      }
    }
  });

  sobreVideo.addEventListener('pause', () => {
    if (sobreVideo.currentTime < sobreVideo.duration) {
      sobreVideo.removeAttribute('data-playing');
    }
  });

  sobreVideo.addEventListener('ended', () => {
    sobreVideo.removeAttribute('data-playing');
  });
}

/* ══════════════════════════════════════════════════════════════
   5b. VÍDEO HERO — controle de som (mutar / desmutar)
   ══════════════════════════════════════════════════════════════ */
const heroVideo   = document.getElementById('heroVideo');
const heroMuteBtn = document.getElementById('heroMuteBtn');

if (heroVideo && heroMuteBtn) {
  heroVideo.muted = true;
  heroMuteBtn.setAttribute('data-muted', 'true');
  heroMuteBtn.setAttribute('aria-label', 'Ativar som do vídeo');
  heroMuteBtn.setAttribute('title', 'Ativar som');

  heroMuteBtn.addEventListener('click', () => {
    const willBeMuted = !heroVideo.muted;
    heroVideo.muted = willBeMuted;

    if (!willBeMuted && heroVideo.paused) {
      heroVideo.play().catch(() => {});
    }

    heroMuteBtn.setAttribute('data-muted', String(willBeMuted));
    heroMuteBtn.setAttribute(
      'aria-label',
      willBeMuted ? 'Ativar som do vídeo' : 'Desativar som do vídeo'
    );
    heroMuteBtn.setAttribute(
      'title',
      willBeMuted ? 'Ativar som' : 'Desativar som'
    );

    const label = heroMuteBtn.querySelector('.hero__mute-label');
    if (label) {
      label.textContent = willBeMuted ? 'Som' : 'Mutar';
    }
  });
}


/* ══════════════════════════════════════════════════════════════
   6. FORMULÁRIO DE CONTATO — validação client-side
   ══════════════════════════════════════════════════════════════ */

(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('cfSubmit');
  const success   = document.getElementById('cfSuccess');

  if (!form) return;

  /* Helpers */
  function getError(input) {
    const val = input.value.trim();

    if (input.required && val === '')
      return 'Este campo é obrigatório.';

    if (input.type === 'email' && val !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return 'Insira um e-mail válido.';

    if (input.minLength > 0 && val.length < input.minLength)
      return `Mínimo de ${input.minLength} caracteres.`;

    return '';
  }

  function showError(input, msg) {
    const field = input.closest('.form-field');
    const span  = field.querySelector('.form-error');
    input.classList.toggle('is-invalid', !!msg);
    input.classList.toggle('is-valid',   !msg && input.value.trim() !== '');
    span.textContent = msg;
    span.classList.toggle('is-visible', !!msg);
  }

  function validateField(input) {
    showError(input, getError(input));
    return !getError(input);
  }

  /* Validação em tempo real após primeiro erro */
  form.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) validateField(input);
    });
  });

  /* Envio */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    form.querySelectorAll('.form-input').forEach((input) => {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) return;

    /* Simula envio (sem backend) */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    setTimeout(() => {
      form.reset();
      form.querySelectorAll('.form-input').forEach((input) => {
        input.classList.remove('is-valid', 'is-invalid');
      });
      form.querySelectorAll('.form-error').forEach((span) => {
        span.textContent = '';
        span.classList.remove('is-visible');
      });
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar mensagem <span class="contato__submit-arrow" aria-hidden="true">→</span>';
      success.hidden = false;

      /* Esconde o sucesso após 5s */
      setTimeout(() => { success.hidden = true; }, 5000);
    }, 1200);
  });
})();

/* ══════════════════════════════════════════════════════════════
   7. ANO DINÂMICO NO RODAPÉ
   ══════════════════════════════════════════════════════════════ */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
