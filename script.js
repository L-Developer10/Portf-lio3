// Portfólio Lucas Tino Gomes — JavaScript Puro (sem frameworks)
// Interações: tema, animações de scroll, formulário, cursor, navbar, menu mobile

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initHeroVideo();
    initScrollReveal();
    initScrollNavbar();
    initMobileMenu();
    initCustomCursor();
    initContactForm();
    initActiveNavLinks();
    initCounterAnimation();
    initSkillBars();
});

/* ── 1. TEMA CLARO / ESCURO (NOIR) ─────────────────────────────────────── */
function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const label = btn.querySelector('.theme-label');
    const html = document.documentElement;

    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);

    btn.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        label.textContent = theme === 'dark' ? 'MODO NOIR' : 'MODO CLARO';
    }
}

/* ── 2. VÍDEO HERO ──────────────────────────────────────────────────────── */
function initHeroVideo() {
    const video = document.querySelector('.hero-video');
    if (!video) return;
    video.muted = true;
    const p = video.play();
    if (p) p.catch(() => {});
}

/* ── 3. ANIMAÇÕES DE SCROLL (BRUSCO / COM IMPACTO) ─────────────────────── */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!elements.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elements.forEach(el => io.observe(el));
}

/* ── 4. NAVBAR COM SCROLL ───────────────────────────────────────────────── */
function initScrollNavbar() {
    const topBar = document.getElementById('top-bar');
    if (!topBar) return;

    let last = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > 60) {
            topBar.classList.add('scrolled');
        } else {
            topBar.classList.remove('scrolled');
        }
        last = y;
    }, { passive: true });
}

/* ── 5. MENU MOBILE (HAMBURGER) ─────────────────────────────────────────── */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    const links = mobileMenu.querySelectorAll('.mobile-nav-link');

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        mobileMenu.classList.toggle('open', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
        // Trava scroll enquanto menu está aberto
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fechar ao clicar em link
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    function closeMenu() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', true);
        document.body.style.overflow = '';
    }
}

/* ── 6. CURSOR PERSONALIZADO NOIR ───────────────────────────────────────── */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('custom-cursor-dot');
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Dot segue imediatamente
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // Cursor anel segue com lag suave
    function animate() {
        curX += (mouseX - curX) * 0.12;
        curY += (mouseY - curY) * 0.12;
        cursor.style.left = curX + 'px';
        cursor.style.top = curY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

/* ── 7. FORMULÁRIO DE CONTATO (VALIDAÇÃO SEM BACKEND) ──────────────────── */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = {
        nome:      { el: document.getElementById('form-nome'),     err: document.getElementById('error-nome') },
        email:     { el: document.getElementById('form-email'),    err: document.getElementById('error-email') },
        assunto:   { el: document.getElementById('form-assunto'),  err: document.getElementById('error-assunto') },
        mensagem:  { el: document.getElementById('form-mensagem'), err: document.getElementById('error-mensagem') },
    };
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    // Limpa erro ao digitar
    Object.values(fields).forEach(({ el, err }) => {
        el.addEventListener('input', () => {
            el.classList.remove('invalid');
            err.textContent = '';
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        // Validação
        const nome = fields.nome.el.value.trim();
        if (!nome || nome.length < 2) {
            showError(fields.nome, 'Por favor, insira seu nome completo.');
            valid = false;
        }

        const email = fields.email.el.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError(fields.email, 'Por favor, insira um e-mail válido.');
            valid = false;
        }

        const assunto = fields.assunto.el.value.trim();
        if (!assunto || assunto.length < 3) {
            showError(fields.assunto, 'Insira um assunto com pelo menos 3 caracteres.');
            valid = false;
        }

        const mensagem = fields.mensagem.el.value.trim();
        if (!mensagem || mensagem.length < 10) {
            showError(fields.mensagem, 'Sua mensagem precisa ter pelo menos 10 caracteres.');
            valid = false;
        }

        if (!valid) {
            feedback.textContent = 'Corrija os campos acima antes de enviar.';
            feedback.className = 'form-feedback error';
            return;
        }

        // Simula envio
        const cta = submitBtn.querySelector('.cta-text');
        const original = cta.textContent;
        cta.textContent = 'ENVIANDO...';
        submitBtn.disabled = true;

        setTimeout(() => {
            feedback.textContent = '✔ Mensagem enviada! Responderei em breve.';
            feedback.className = 'form-feedback success';
            form.reset();
            cta.textContent = original;
            submitBtn.disabled = false;

            // Limpa feedback após 5s
            setTimeout(() => { feedback.textContent = ''; feedback.className = 'form-feedback'; }, 5000);
        }, 1400);
    });

    function showError({ el, err }, msg) {
        el.classList.add('invalid');
        err.textContent = msg;
    }
}

/* ── 8. NAV LINKS ATIVOS (HIGHLIGHT AO ROLAR) ───────────────────────────── */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => io.observe(s));
}

/* ── 9. CONTADOR ANIMADO (SEÇÃO SOBRE) ──────────────────────────────────── */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => io.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1200;
    const step = target / (duration / 16);
    let current = 0;

    const tick = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current < target) requestAnimationFrame(tick);
        else el.textContent = target;
    };
    requestAnimationFrame(tick);
}

/* ── 10. BARRAS DE HABILIDADE ANIMADAS ──────────────────────────────────── */
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar[data-width]');
    if (!bars.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => io.observe(bar));
}
