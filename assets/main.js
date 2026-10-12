// Project X — shared page behaviour
(function () {
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Scroll reveal
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('in'));
  }

  // Work list: cursor-following preview (desktop, fine pointer only)
  const preview = document.querySelector('.preview');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (preview && fine) {
    const img = preview.querySelector('img');
    let x = 0, y = 0, px = 0, py = 0, raf = null;
    const loop = () => {
      px += (x - px) * 0.18; py += (y - py) * 0.18;
      preview.style.left = px + 'px'; preview.style.top = py + 'px';
      raf = Math.abs(x - px) + Math.abs(y - py) > 0.5 ? requestAnimationFrame(loop) : null;
    };
    document.querySelectorAll('.work-row').forEach(row => {
      row.addEventListener('mouseenter', e => {
        img.src = row.dataset.preview;
        img.alt = '';
        px = x = e.clientX + 240; py = y = e.clientY;
        preview.classList.add('on');
      });
      row.addEventListener('mousemove', e => {
        x = e.clientX + 240; y = e.clientY;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      row.addEventListener('mouseleave', () => preview.classList.remove('on'));
    });
  }

  // Pricing "Get started" buttons pre-select the plan in the enquiry form
  document.querySelectorAll('[data-plan]').forEach(btn => btn.addEventListener('click', () => {
    const radio = document.querySelector(`input[name="plan"][value="${btn.dataset.plan}"]`);
    if (radio) radio.checked = true;
  }));

  // Contact form -> Loopline CRM
  const form = document.querySelector('#enquiry');
  if (form) {
    const status = form.querySelector('.form-status');
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const details = [
        `Plan interest: ${d.get('plan')}`,
        d.get('business') && `Business: ${d.get('business')}`,
        d.get('website') && `Current website: ${d.get('website')}`,
      ].filter(Boolean);
      btn.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Sending…';
      try {
        const res = await fetch('https://loopline-ten.vercel.app/api/v1/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer loop_d3e4e803f7a25f93c4061f4275e8bd257378ceceb5d83072',
          },
          body: JSON.stringify({
            name: d.get('name'),
            email: d.get('email'),
            phone: d.get('phone') || undefined,
            message: details.join('\n') + '\n\n' + d.get('message'),
            source: 'projectx-site',
          }),
        });
        if (!res.ok) throw new Error('request failed');
        form.reset();
        status.className = 'form-status ok';
        status.textContent = 'Thanks! Your enquiry is in. We’ll get back to you within one business day.';
      } catch {
        status.className = 'form-status err';
        status.textContent = 'Something went wrong sending that. Please email keenanfrench13@gmail.com instead.';
      } finally {
        btn.disabled = false;
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
