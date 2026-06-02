document.documentElement.classList.add('js-ready');

/* Reveal via IntersectionObserver */
(function () {
  const items = document.querySelectorAll('[data-rv]');
  const heroItems = document.querySelectorAll('#hero [data-rv]');

  heroItems.forEach((el, i) => {
    el.style.animationDelay = (0.25 + i * 0.09) + 's';
    el.classList.add('is-visible');
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  items.forEach(el => {
    if (el.closest('#hero')) return;
    io.observe(el);
  });
})();

/* Mouse parallax — only on hover-capable devices, paused when hero is off-screen */
const hero = document.getElementById('hero');
const parallaxBg = document.getElementById('parallaxBg');
const floatCards = document.querySelectorAll('.float-card');
let mx = 0, my = 0, tx = 0, ty = 0;
let rafId = null;
const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (hero && hasHover) {
  let heroVisible = true;

  const heroObserver = new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
    if (!heroVisible && rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (heroVisible && !rafId) { rafId = requestAnimationFrame(tick); }
  });
  heroObserver.observe(hero);

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
  }, { passive: true });

  function tick() {
    tx += (mx - tx) * 0.06;
    ty += (my - ty) * 0.06;
    if (parallaxBg) {
      parallaxBg.style.transform = `translate3d(${tx * -18}px, ${ty * -14}px, 0) scale(1.02)`;
    }
    floatCards.forEach((el, i) => {
      const depth = (i % 2 === 0 ? 1 : -1) * (6 + i * 1.4);
      el.style.translate = `${tx * depth}px ${ty * depth}px`;
    });
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}

/* Reduced motion fallback */
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-rv]').forEach(el => {
    el.style.animation = 'none';
    el.style.opacity = 1; el.style.transform = 'none'; el.style.filter = 'none';
  });
}

/* Hamburger menu toggle */
(function () {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* Banner LGPD */
(function () {
  const banner = document.getElementById('lgpd-banner');
  if (!banner) return;
  if (localStorage.getItem('turm-lgpd')) { banner.classList.add('hidden'); return; }
  function closeBanner() { banner.classList.add('hidden'); localStorage.setItem('turm-lgpd', '1'); }
  const accept = document.getElementById('lgpd-accept');
  const dismiss = document.getElementById('lgpd-dismiss');
  if (accept) accept.addEventListener('click', closeBanner);
  if (dismiss) dismiss.addEventListener('click', closeBanner);
})();

/* Three.js globe — carregado apenas em desktop (≥980px) */
if (window.matchMedia('(min-width: 980px)').matches) {
  const s1 = document.createElement('script');
  s1.src = 'js/vendor/three.min.js';
  s1.onload = function () {
    const s2 = document.createElement('script');
    s2.src = 'js/globe.js';
    document.body.appendChild(s2);
  };
  document.body.appendChild(s1);
}

/* Formulário de contato */
(function () {
  const form = document.getElementById('contato-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const orig = btn.textContent;
    btn.textContent = 'Mensagem enviada! Falaremos em breve.';
    btn.style.background = 'linear-gradient(180deg,#4ade80 0%,#16a34a 100%)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
})();
