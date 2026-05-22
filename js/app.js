/* Marca js-ready imediatamente para que o estado inicial do .reveal seja aplicado */
document.documentElement.classList.add('js-ready');

/* Reveal via IntersectionObserver — independente de GSAP/Lenis */
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

/* Lenis smooth scroll (opcional — só se a CDN carregar) */
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

/* GSAP + ScrollTrigger (opcional) */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  window.addEventListener('DOMContentLoaded', () => {
    gsap.utils.toArray('.float-card').forEach((el, i) => {
      const dir = parseFloat(el.dataset.float || 1);
      gsap.to(el, {
        y: 12 * dir,
        duration: 4 + (i * 0.3),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.25
      });
    });
  });
}

/* Scroll parallax (só se GSAP carregou) */
const parallaxBg = document.getElementById('parallaxBg');
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.to(parallaxBg, {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.blob.b1', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.blob.b2', { yPercent: 10,  ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* Mouse parallax — subtle */
const hero = document.getElementById('hero');
let mx = 0, my = 0, tx = 0, ty = 0;
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
  });
  function tick() {
    tx += (mx - tx) * 0.06;
    ty += (my - ty) * 0.06;
    if (parallaxBg) {
      parallaxBg.style.transform = `translate3d(${tx * -18}px, ${ty * -14}px, 0) scale(1.02)`;
    }
    document.querySelectorAll('.float-card').forEach((el, i) => {
      const depth = (i % 2 === 0 ? 1 : -1) * (6 + i * 1.4);
      el.style.translate = `${tx * depth}px ${ty * depth}px`;
    });
    requestAnimationFrame(tick);
  }
  tick();
}

/* Reduced motion fallback */
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  if (typeof gsap !== 'undefined') gsap.globalTimeline.timeScale(0);
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

/* Formulário de contato — feedback visual */
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
