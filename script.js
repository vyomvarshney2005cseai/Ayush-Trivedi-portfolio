// ===== Ayush Trivedi — Portfolio interactions =====
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  document.getElementById('yr').textContent = new Date().getFullYear();

  // ---- Typing effect in hero ----
  const typed = document.querySelector('.typed');
  if (typed) {
    const words = typed.dataset.words.split('|');
    let w = 0, c = words[0].length, deleting = false;
    const tick = () => {
      const word = words[w];
      typed.textContent = word.slice(0, c);
      if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1800); }
      if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
      c += deleting ? -1 : 1;
      setTimeout(tick, deleting ? 60 : 110);
    };
    setTimeout(tick, 1500);
  }

  // ---- Reveal on scroll ----
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    revealObs.observe(el);
  });

  // ---- Animated counters ----
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
      const start = performance.now(), dur = 1400;
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.num[data-count]').forEach((el) => countObs.observe(el));

  // ---- Active nav highlight (sidebar + rail) ----
  const links = document.querySelectorAll('[data-target]');
  const sections = document.querySelectorAll('.section-anchor');
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('active', l.dataset.target === e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => navObs.observe(s));

  // ---- Mobile menu ----
  const sidebar = document.querySelector('.sidebar');
  document.querySelector('.menu-toggle').addEventListener('click', () => sidebar.classList.toggle('open'));
  document.querySelectorAll('.side-nav a').forEach((a) =>
    a.addEventListener('click', () => sidebar.classList.remove('open'))
  );

  // ---- Portfolio filter ----
  const buttons = document.querySelectorAll('.filters button');
  const cards = document.querySelectorAll('.card');
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    buttons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach((card) => {
      const show = f === 'all' || card.dataset.cat.split(' ').includes(f);
      card.classList.toggle('hide', !show);
      card.classList.remove('pop');
      if (show) { void card.offsetWidth; card.classList.add('pop'); }
    });
  }));

  // ---- Contact form (opens the visitor's mail app) ----
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const subject = encodeURIComponent(`Portfolio enquiry from ${d.get('name')}`);
    const body = encodeURIComponent(`${d.get('message')}\n\n— ${d.get('name')} (${d.get('email')})`);
    window.location.href = `mailto:ayush.trivedi@example.com?subject=${subject}&body=${body}`;
    form.querySelector('.form-note').textContent = 'Opening your mail app… thanks for reaching out!';
    form.reset();
  });
});
