// Builds Project X: index.html, work/<slug>.html, terms.html
// Run from the repo root:  node src/build.mjs
// Brand, prices and projects all live in this file. Edit here, rebuild, commit, push.
import { writeFileSync, mkdirSync } from 'node:fs';

const BRAND = 'Project X';
const SITE = 'https://keenanfrench.github.io/project-x-site/';
const EMAIL = 'keenanfrench13@gmail.com';

const PLANS = [
  { key: 'launch', name: 'Launch', for: 'For new businesses that need to look legit, fast.', setup: 1500, monthly: 199, shot: 'bellmont', eg: 'bellmont',
    features: ['One-page, conversion-focused website', 'Mobile-first design & copywriting', 'Hosting, SSL, backups & security', 'Enquiry form → CRM with instant phone alerts', 'On-page SEO setup', '1 website edit per month'] },
  { key: 'business', name: 'Business', for: 'For established businesses ready to grow.', setup: 3000, monthly: 299, shot: 'island-braider', eg: 'island-braider', featured: true,
    features: ['+Everything in Launch, plus:', 'Up to 6 pages', 'Online booking or scheduling built in', 'Google Business Profile setup & optimisation', 'Ongoing SEO tweaks', '3 website edits per month'] },
  { key: 'signature', name: 'Signature', for: 'For brands that want to be the one people remember.', setup: 5000, monthly: 599, shot: 'maplewood', eg: 'maplewood',
    features: ['+Everything in Business, plus:', 'Fully custom multi-page site', 'Signature animation or interactive 3D', 'A new page or section every quarter', 'Priority, same-day support', '5 website edits per month'] },
];

const PROJECTS = [
  {
    slug: 'maplewood', name: 'Maplewood Renovations', kind: 'Kitchen & bathroom renovations', tag: 'Concept', year: '2026', plan: 'Signature',
    url: 'https://keenanfrench.github.io/maplewood-renovations-site/', host: 'maplewood-renovations-site',
    summary: 'A six-page site for a premium Melbourne renovation builder, with an interactive 3D material board in the hero.',
    brief: 'Renovation buyers are spending $30–80k and are nervous about it. The site needed to feel premium but approachable, answer the big questions (cost, time, disruption) before anyone picks up the phone, and give kitchens and bathrooms their own room to sell.',
    approach: 'A calm, editorial look in stone, sage and brass, the palette of the finishes themselves. Kitchens and bathrooms each get a full page with honest price guides, a gallery and FAQs (marked up for Google). The hero swaps a stock photo for something no competitor has: a real-time 3D board of the materials, which visitors can tilt and pick up.',
    signature: 'An interactive Three.js “material board”: marble, oak, handmade-look tiles and brushed brass, all generated in code so nothing extra downloads. It follows the mouse, lifts a sample when tapped, and pauses when off-screen to save battery.',
    built: ['6 pages: Home, Kitchens, Bathrooms, Projects, About, Contact', 'Interactive 3D hero (Three.js)', 'Filterable project gallery', 'Price guide tables', 'FAQ schema for Google rich results', 'Mobile-first, no-build static site'],
    stack: 'HTML, CSS, Three.js',
    palette: [['Stone', '#EDE7DD'], ['Charcoal', '#221D19'], ['Sage', '#6E8465'], ['Deep sage', '#4B5E45'], ['Brass', '#B8955A']],
    fonts: [['Headings', 'Libre Baskerville'], ['Body', 'Karla']],
    shots: ['s1', 's2'],
    note: 'Concept project: Maplewood Renovations is a fictional business created to show what a Signature build looks like.',
  },
  {
    slug: 'fluff-co', name: 'Fluff & Co.', kind: 'Mobile dog grooming', tag: 'Concept', year: '2026', plan: 'Business',
    url: 'https://keenanfrench.github.io/project-x-site/demos/fluff-co/', host: 'project-x-site/demos/fluff-co',
    summary: 'A warm, playful site for a mobile dog groomer, with prices by dog size and a booking flow built around the van’s weekly route.',
    brief: 'The busiest groomers in Melbourne still hide their prices, bury surcharges in sliders and never say which suburbs they cover. Owners of nervous or elderly dogs want to know three things fast: what it costs for their dog, whether the van comes to them, and when.',
    approach: 'Cream, coral and plum with a rounded, friendly typeface, so it feels like a pet brand rather than a trade. Every price is printed and changes with one tap between small, medium and large. The van works one area a day, so the site turns that into a feature: “same street, same day”, a suburb checker and a booking flow that only offers real days on the route.',
    signature: 'A four-step booking flow (dog, groom, suburb and time, details) that only shows dates when the van is actually in your suburb, with booked slots crossed out. As you scroll, the illustrated van drives along its weekly route and lights up each day’s stops.',
    built: ['React single-page site', 'Price-by-size switcher', 'Route-aware booking flow', 'Suburb checker', 'Scroll-driven van animation', 'Sticky-stack “how it works” section'],
    stack: 'React, Vite, Tailwind, GSAP',
    palette: [['Cream', '#FFF7EE'], ['Coral', '#F26B5B'], ['Plum', '#2E2233'], ['Butter', '#FFD27A'], ['Sky', '#BFE3E0']],
    fonts: [['Headings', 'Fredoka'], ['Body', 'Nunito Sans']],
    shots: ['s1', 's2'],
    note: 'Concept project: Fluff & Co. is a fictional business created to show what a Business build looks like.',
  },
  {
    slug: 'tidewell', name: 'Tidewell Carpet Care', kind: 'Carpet & upholstery cleaning', tag: 'Concept', year: '2026', plan: 'Launch',
    url: 'https://keenanfrench.github.io/project-x-site/demos/tidewell/', host: 'project-x-site/demos/tidewell',
    summary: 'A one-page site for a carpet cleaner that shows the result before you scroll and the exact price before you call.',
    brief: 'Carpet cleaning is bought on two questions: will it actually look better, and what will it really cost? The top local operators answer neither. Their sites have no prices, guarantees worded three different ways, and long quote forms before you see a number.',
    approach: 'Navy and aqua for clean water and trust, with a bold grotesque headline. The hero is a draggable before and after, so the result is the first thing you see. Below it, prices are on the page: three packages and a build-your-own calculator, plus one clearly worded bond-back guarantee for renters.',
    signature: 'An instant price calculator. Tap a home size or add rooms, rugs, stairs and lounge seats, and a fixed, GST-inclusive price updates live. “Lock in this price” carries the exact quote into the booking form.',
    built: ['Conversion-focused one-page site', 'Drag to compare before and after', 'Live price calculator', 'End of lease guarantee section', 'Reviews carousel & FAQ', 'Sticky call and quote bar on mobile'],
    stack: 'HTML, GSAP, Swiper, Lenis',
    palette: [['Navy', '#0B2540'], ['Aqua', '#19B3C2'], ['Foam', '#EEF8F9'], ['Sun', '#FFC857'], ['Ink', '#06131F']],
    fonts: [['Headings', 'Bricolage Grotesque'], ['Body', 'DM Sans']],
    shots: ['s1', 's2'],
    note: 'Concept project: Tidewell Carpet Care is a fictional business created to show what a Launch build looks like.',
  },
  {
    slug: 'island-braider', name: 'Island Braider', kind: 'Hair braiding studio', tag: 'Client', year: '2026', plan: 'Business',
    url: 'https://keenanfrench.github.io/island-braider-site/', host: 'island-braider-site',
    summary: 'A real braiding studio in Richmond went from a bare booking page to a full brand site with live booking built in.',
    brief: 'Island Braider’s whole web presence was a third-party booking page: no story, no gallery, nothing that matched the elegant brand on her Instagram. She needed a proper home online without losing the booking system her clients already use.',
    approach: 'Warm espresso and bronze-gold to match her existing Instagram identity, with an editorial serif for a boutique feel. Her full menu (nine categories, around fifty styles, with real durations and prices) is laid out so clients can choose before they book. Instead of inventing reviews, the site points people to her real Instagram following.',
    signature: 'Her existing Acuity booking calendar is embedded live inside the site, so clients browse, choose and book without ever leaving the brand.',
    built: ['Brand-matched single-page site', 'Full service & price menu (~50 styles)', 'Live booking embedded', 'Instagram follow section', 'Smooth-scroll animation & galleries', 'Mobile-first for Instagram traffic'],
    stack: 'HTML, GSAP, Swiper, Lenis',
    palette: [['Espresso', '#1A140F'], ['Bronze gold', '#B8894C'], ['Light gold', '#D6AD75'], ['Cream', '#F4ECDC'], ['Ink', '#2A2119']],
    fonts: [['Headings', 'Playfair Display'], ['Body', 'Jost']],
    shots: ['s1', 's2'],
  },
  {
    slug: 'natilume', name: 'Natilume', kind: 'Photography & film studio', tag: 'Own brand', year: '2026', plan: 'Signature',
    url: 'https://keenanfrench.github.io/natilume-site/', host: 'natilume-site',
    summary: 'A cinematic launch site for a Melbourne production studio, wired into a live CRM that pings a phone the second an enquiry lands.',
    brief: 'A new photography and film studio needed to look established from day one and turn enquiries into booked shoots quickly, without any portfolio history to lean on.',
    approach: 'The whole identity is built around colour temperature: Tungsten orange, Daylight blue and Bone, the Kelvin scale every cinematographer works with. A custom aperture-iris animation sets the tone, and the process section scrolls like a production schedule.',
    signature: 'The contact form feeds straight into a custom lead CRM. Every enquiry lands in a dashboard and buzzes the owner’s phone within seconds. This is the same system every Project X plan includes.',
    built: ['React single-page app with legal pages', 'Custom aperture-iris animation', 'Scroll-driven process section', 'Contact form → CRM + instant phone alerts', 'Full brand identity system', 'Privacy & terms pages'],
    stack: 'React, Vite, Tailwind, GSAP',
    palette: [['Ink', '#121011'], ['Tungsten', '#E0913F'], ['Daylight', '#6F8798'], ['Bone', '#ECE6DC'], ['Ash', '#93897E']],
    fonts: [['Headings', 'Fraunces'], ['Body', 'Manrope']],
    shots: ['s2'],
  },
  {
    slug: 'bellmont', name: 'Bellmont Roofing Co.', kind: 'Roofing contractor', tag: 'Concept', year: '2026', plan: 'Launch',
    url: 'https://keenanfrench.github.io/bellmont-roofing-site/', host: 'bellmont-roofing-site',
    summary: 'A fast, confident one-page site for a heritage roofer, designed to turn a Google search into a booked inspection.',
    brief: 'Tradies get found on Google and judged in about five seconds. The site had to load instantly on a phone in a driveway, look like a business that has been around for decades, and make the next step obvious.',
    approach: 'Restraint over flash: deep navy and terracotta like the roofs themselves, a classic serif, and no heavy animation libraries. The page follows a simple sales story (who we are, how it works, proof, quote) with the call-to-action never more than a thumb away.',
    signature: 'Speed. It is a single lightweight page built for Core Web Vitals, so it loads fast on 4G and ranks well, the things that actually win local trades work.',
    built: ['Conversion-focused one-page site', '4-step process section', 'Project gallery', 'Reviews & trust signals', 'Sticky quote button on mobile', 'SEO-first, lightweight build'],
    stack: 'HTML, Tailwind CSS',
    palette: [['Navy', '#0F1720'], ['Terracotta', '#BF5B3E'], ['Off-white', '#F5F4F1']],
    fonts: [['Headings', 'Source Serif 4'], ['Body', 'Work Sans']],
    shots: ['s1', 's2'],
    note: 'Concept project: Bellmont Roofing Co. is a fictional business created to show what a Launch build looks like.',
  },
  {
    slug: 'ion-digital', name: 'ION Digital', kind: 'Paid ads agency', tag: 'Own brand', year: '2026', plan: 'Launch',
    url: 'https://keenanfrench.github.io/ion-digital-site/', host: 'ion-digital-site',
    summary: 'A sharp one-page site for a Meta, Google and TikTok ads agency, built in days to win its first clients.',
    brief: 'A brand-new ads agency needed to look credible to local service businesses (contractors, gyms, med spas) straight away, with one clear action: book a free ad audit.',
    approach: 'A dark charcoal base with a single electric-blue accent reads as modern and performance-driven. With no case studies yet, the site sells the method instead: a three-step process and an honest “our approach” section in place of made-up testimonials.',
    signature: 'Built and launched within days, then tuned for speed after launch by stripping heavy effects that caused scroll lag. Performance over decoration.',
    built: ['Single-page agency site', '3-step process section', 'Services & approach sections', 'Free audit enquiry form', 'Performance-tuned build', 'Mobile-first layout'],
    stack: 'HTML, GSAP',
    palette: [['Charcoal', '#1A1A2A'], ['Electric blue', '#0066FF'], ['White', '#FFFFFF']],
    fonts: [['Headings', 'Plus Jakarta Sans'], ['Body', 'Inter']],
    shots: ['s1', 's2'],
  },
];

const fmt = n => '$' + n.toLocaleString('en-AU');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const logo = `<svg class="logo-mark" viewBox="0 0 26 26" aria-hidden="true"><rect x=".5" y=".5" width="25" height="25" rx="7" fill="#fff"/><path d="M8 8l10 10M18 8L8 18" stroke="#0A0A0A" stroke-width="2.2" stroke-linecap="round"/></svg>`;

function page({ path, title, desc, body, root, nav }) {
  const r = root;
  const navLinks = [['work', `${r}index.html#work`, 'Work'], ['pricing', `${r}index.html#pricing`, 'Pricing'], ['process', `${r}index.html#process`, 'Process'], ['faq', `${r}index.html#faq`, 'FAQ']]
    .map(([k, h, l]) => `<a href="${h}"${k === nav ? ' aria-current="page"' : ''}>${l}</a>`).join('\n      ');
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path === 'index.html' ? '' : path}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}assets/work/maplewood-hero.jpg">
<meta name="theme-color" content="#0A0A0A">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(logo.replace('class="logo-mark" ', 'xmlns="http://www.w3.org/2000/svg" '))}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/styles.css">
</head>
<body>
<header class="site-header">
  <div class="wrap">
    <a class="logo" href="${r}index.html" aria-label="${BRAND} home">${logo}<span>${BRAND}</span></a>
    <button class="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="site-nav"><span></span><span></span></button>
    <nav class="nav" id="site-nav" aria-label="Main">
      ${navLinks}
      <a class="btn btn-white" href="${r}index.html#contact">Start a project <span class="arr">→</span></a>
    </nav>
  </div>
</header>
<main>
${body.trim()}
</main>
<footer class="site-footer">
  <div class="wrap">
    <span>© <span data-year>2026</span> ${BRAND}. Websites for local businesses · Melbourne, Australia</span>
    <nav aria-label="Footer">
      <a href="${r}index.html#work">Work</a>
      <a href="${r}index.html#pricing">Pricing</a>
      <a href="${r}terms.html">Plan terms</a>
      <a href="mailto:${EMAIL}">Email</a>
    </nav>
  </div>
</footer>
<script src="${r}assets/main.js" defer></script>
</body>
</html>
`;
}

// ---------- Home ----------
const workRows = PROJECTS.map((p, i) => `
      <a class="work-row reveal" href="work/${p.slug}.html" data-preview="assets/work/${p.slug}-hero.jpg">
        <figure class="thumb" style="margin:0"><img src="assets/work/${p.slug}-hero.jpg" alt="${esc(p.name)} website homepage" width="1440" height="900" loading="lazy"></figure>
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <h3>${p.name}</h3>
        <span class="kind">${p.kind}</span>
        <span class="tag">${p.tag}</span>
        <span class="go" aria-hidden="true">→</span>
      </a>`).join('');

const planCards = PLANS.map(pl => {
  const eg = PROJECTS.find(p => p.slug === pl.eg);
  const feats = pl.features.map(f => f.startsWith('+') ? `<li class="plus">${f.slice(1)}</li>` : `<li>${f}</li>`).join('\n            ');
  return `
      <article class="plan reveal${pl.featured ? ' featured' : ''}">
        ${pl.featured ? '<span class="badge">Most popular</span>' : ''}
        <div class="shot"><img src="assets/work/${pl.shot}-hero.jpg" alt="Example ${pl.name} website: ${esc(eg.name)}" width="1440" height="900" loading="lazy"></div>
        <div class="body">
          <h3>${pl.name}</h3>
          <p class="for">${pl.for}</p>
          <div class="price"><b>${fmt(pl.monthly)}</b><span>/ month</span></div>
          <p class="setup">+ <b>${fmt(pl.setup)}</b> one-off setup</p>
          <a class="btn ${pl.featured ? 'btn-white' : 'btn-line'}" href="#contact" data-plan="${pl.name}">Get started <span class="arr">→</span></a>
          <ul>
            ${feats}
          </ul>
          <p class="eg">Example: <a href="work/${eg.slug}.html">${eg.name}</a></p>
        </div>
      </article>`;
}).join('');

const faqs = [
  ['Why a monthly fee instead of a one-off price?', 'Most websites go stale the day they launch. Your monthly plan covers hosting, security, backups, your CRM with phone alerts, and real edits every month, so the site keeps working for you. It also keeps the upfront cost low.'],
  ['Is there a minimum term?', 'Yes, 12 months. After that it rolls month-to-month and you can cancel any time with 30 days’ notice. Longer or custom terms can be negotiated.'],
  ['Who owns the website?', 'We do, while you’re on a plan. That’s what keeps the monthly price low. You can buy the site outright at any time for six months of your plan fee. Your logo, photos and written content are always yours.'],
  ['What happens if I cancel?', 'If you don’t buy the site, it goes offline at the end of your term. Your content stays yours and we’ll hand it back on request.'],
  ['What counts as an “edit”?', 'A small change of up to about 30 minutes: swapping photos, updating prices or opening hours, changing text, adding a review. Bigger changes like new pages are quoted separately or included in Signature.'],
  ['How long does a build take?', 'Launch sites are usually live in 1–2 weeks, Business in 2–4 weeks, and Signature in 4–8 weeks, depending on how quickly we get your content.'],
  ['Do I need to supply photos and copy?', 'Your own photos are always best, and we’ll tell you exactly what to shoot. We write the website copy for you and can source professional stock photos to fill gaps.'],
];

const home = page({
  path: 'index.html', root: '', nav: '',
  title: `${BRAND}: Websites for local businesses, built and looked after`,
  desc: 'Project X designs, builds and looks after websites for local businesses, with a built-in lead CRM and instant phone alerts. Plans from $199/month.',
  body: `
<section class="hero">
  <div class="wrap">
    <span class="label">Web design studio · Melbourne</span>
    <h1>Websites that win work,<br><span class="grey">and keep winning it.</span></h1>
    <div class="hero-row">
      <p class="lede">We design, build and look after websites for local businesses. Every site comes with hosting, a lead CRM that pings your phone, and monthly edits, all for one simple plan.</p>
      <div class="hero-actions">
        <a class="btn btn-white" href="#contact">Start a project <span class="arr">→</span></a>
        <a class="btn btn-line" href="#work">See the work</a>
      </div>
    </div>
    <div class="hero-meta">
      <div><b>From ${fmt(PLANS[0].monthly)}/mo</b><span>Hosting, CRM &amp; edits included</span></div>
      <div><b>1–8 weeks</b><span>From kickoff to launch</span></div>
      <div><b>Seconds</b><span>From enquiry to your phone</span></div>
    </div>
  </div>
</section>

<section class="section" id="work" style="padding-top:60px">
  <div class="wrap">
    <div class="work-head">
      <div>
        <span class="label">Selected work</span>
        <h2 style="margin-top:20px">Recent projects.</h2>
      </div>
      <p class="muted" style="max-width:40ch;margin:0">Client sites, our own brands and concept builds. Each one is designed from scratch, not a template.</p>
    </div>
    <div class="work-list">${workRows}
    </div>
  </div>
  <div class="preview" aria-hidden="true"><img src="assets/work/maplewood-hero.jpg" alt=""></div>
</section>

<section class="section" style="border-top:1px solid var(--line)">
  <div class="wrap">
    <span class="label">What you get</span>
    <h2 class="reveal" style="margin-top:20px;max-width:18ch">Not just a website. A system that brings in work.</h2>
    <div class="offer">
      <div class="reveal"><span class="n">01</span><h3>Designed to convert</h3><p>Custom design and copy built around one goal: turning visitors into enquiries. Fast, mobile-first and set up for Google from day one.</p></div>
      <div class="reveal"><span class="n">02</span><h3>Leads straight to your phone</h3><p>Every enquiry lands in your own CRM dashboard and sends an instant notification to your phone, so you can reply before your competitors do.</p></div>
      <div class="reveal"><span class="n">03</span><h3>Looked after, every month</h3><p>Hosting, security, backups and monthly edits are all handled. Text us a change and it’s done. No developer invoices, no logins to forget.</p></div>
    </div>
  </div>
</section>

<section class="section" id="process" style="border-top:1px solid var(--line)">
  <div class="wrap">
    <span class="label">Process</span>
    <h2 class="reveal" style="margin-top:20px">Four steps to launch.</h2>
    <div class="steps">
      <div class="step reveal"><span class="t">Step 01 · Call</span><h3>Discovery</h3><p>A 20-minute call about your business, your customers and what a new enquiry is worth to you.</p></div>
      <div class="step reveal"><span class="t">Step 02 · Design</span><h3>Concept</h3><p>We design your homepage first. You give feedback, we refine it, and nothing gets built until you love it.</p></div>
      <div class="step reveal"><span class="t">Step 03 · Build</span><h3>Build &amp; connect</h3><p>Every page is built, your CRM and phone alerts connected, and the site tested on every device.</p></div>
      <div class="step reveal"><span class="t">Step 04 · Launch</span><h3>Launch &amp; care</h3><p>We go live on your domain, then look after it every month with edits, updates and support.</p></div>
    </div>
  </div>
</section>

<section class="section" id="pricing" style="border-top:1px solid var(--line)">
  <div class="wrap">
    <span class="label">Pricing</span>
    <h2 class="reveal" style="margin-top:20px">Simple plans. Everything included.</h2>
    <p class="lede reveal">A low one-off setup fee, then one monthly plan that covers hosting, your CRM, security and edits. Prices in AUD.</p>
    <div class="pricing">${planCards}
    </div>
    <div class="price-notes">
      <div><b>12-month minimum</b>Then month-to-month, cancel any time with 30 days’ notice.</div>
      <div><b>Own it any time</b>Buy your site outright for six months of your plan fee.</div>
      <div><b>No surprise invoices</b>Hosting, SSL, security and backups are always included.</div>
    </div>
    <div class="soon reveal">
      <div><span class="label">Coming soon to plans</span><p class="muted" style="margin:8px 0 0">More automations are on the way, at no extra cost to existing plans.</p></div>
      <ul><li>Missed-call text-back</li><li>Automatic Google review requests</li><li>AI website chat assistant</li></ul>
    </div>
    <p class="muted" style="margin-top:24px;font-size:.9rem">Full details in the <a href="terms.html" style="color:var(--text);border-bottom:1px solid var(--line-2)">plan terms</a>.</p>
  </div>
</section>

<section class="section" id="faq" style="border-top:1px solid var(--line)">
  <div class="wrap faq-grid">
    <div>
      <span class="label">FAQ</span>
      <h2 style="margin-top:20px">Questions, answered.</h2>
    </div>
    <div class="faq">
      ${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" id="contact" style="border-top:1px solid var(--line)">
  <div class="wrap contact">
    <div>
      <span class="label">Start a project</span>
      <h2 style="margin-top:20px">Tell us about your business.</h2>
      <p class="lede">Fill this in and we’ll come back within one business day with ideas and the plan we’d recommend. No obligation.</p>
      <div class="contact-side" style="margin-top:40px">
        <div class="item"><span>Email</span><a href="mailto:${EMAIL}">${EMAIL}</a></div>
        <div class="item"><span>Based in</span>Melbourne, working Australia-wide</div>
        <div class="item"><span>Response time</span>Within one business day</div>
      </div>
    </div>
    <form class="form" id="enquiry" novalidate>
      <div><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required maxlength="200"></div>
      <div><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" maxlength="50"></div>
      <div><label for="f-biz">Business name</label><input id="f-biz" name="business" autocomplete="organization"></div>
      <div class="full"><label for="f-site">Current website (if any)</label><input id="f-site" name="website" placeholder="www.yourbusiness.com.au"></div>
      <fieldset class="full" style="border:0;padding:0;margin:0">
        <legend style="font-size:.82rem;color:var(--muted);margin-bottom:8px">Plan you’re interested in</legend>
        <div class="chips">
          ${PLANS.map((pl, i) => `<label><input type="radio" name="plan" value="${pl.name}"${i === 1 ? ' checked' : ''}><span>${pl.name}</span></label>`).join('\n          ')}
          <label><input type="radio" name="plan" value="Not sure"><span>Not sure yet</span></label>
        </div>
      </fieldset>
      <div class="full"><label for="f-msg">What do you need?</label><textarea id="f-msg" name="message" required maxlength="4500" placeholder="Tell us about your business and what you want the website to do…"></textarea></div>
      <div class="full"><button class="btn btn-white" type="submit">Send enquiry <span class="arr">→</span></button></div>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
`,
});
writeFileSync(new URL('../index.html', import.meta.url), home);
console.log('built index.html');

// ---------- Case studies ----------
mkdirSync(new URL('../work/', import.meta.url), { recursive: true });
PROJECTS.forEach((p, i) => {
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const shots = p.shots.map(s => `<div class="browser"><div class="bar"><i></i><i></i><i></i></div><img src="../assets/work/${p.slug}-${s}.jpg" alt="${esc(p.name)} website section" width="1440" height="900" loading="lazy"></div>`).join('\n      ');
  const html = page({
    path: `work/${p.slug}.html`, root: '../', nav: 'work',
    title: `${p.name}: case study | ${BRAND}`,
    desc: p.summary,
    body: `
<section class="cs-hero">
  <div class="wrap">
    <a class="back" href="../index.html#work">← All work</a>
    <span class="label">${p.tag} · ${p.kind}</span>
    <h1>${p.name}</h1>
    <p class="lede">${p.summary}</p>
    <div class="cs-facts">
      <div><span>Type</span><p>${p.tag === 'Client' ? 'Client project' : p.tag === 'Own brand' ? 'Our own brand' : 'Concept build'}</p></div>
      <div><span>Plan level</span><p>${p.plan}</p></div>
      <div><span>Year</span><p>${p.year}</p></div>
      <div><span>Built with</span><p>${p.stack}</p></div>
      <a class="btn btn-white" href="${p.url}" target="_blank" rel="noopener">Visit live site <span class="arr">↗</span></a>
    </div>
  </div>
</section>

<section class="wrap" style="padding-bottom:40px">
  <div class="browser reveal"><div class="bar"><i></i><i></i><i></i><em>keenanfrench.github.io/${p.host}</em></div><img src="../assets/work/${p.slug}-hero.jpg" alt="${esc(p.name)} homepage" width="1440" height="900"></div>
</section>

<div class="wrap">
  <section class="cs-block reveal"><span class="label">The brief</span><div><p>${p.brief}</p></div></section>
  <section class="cs-block reveal"><span class="label">The approach</span><div><p>${p.approach}</p></div></section>
  <section class="cs-block reveal"><span class="label">Design system</span>
    <div>
      <div class="swatches">
        ${p.palette.map(([n, h]) => `<div class="sw"><i style="background:${h}"></i><b>${n}</b><span>${h}</span></div>`).join('\n        ')}
      </div>
      <div class="fonts">
        ${p.fonts.map(([r, f]) => `<div><span>${r}</span><b>${f}</b></div>`).join('\n        ')}
      </div>
    </div>
  </section>
  <section class="cs-block reveal"><span class="label">Signature feature</span><div><p>${p.signature}</p></div></section>
  <section class="cs-block reveal"><span class="label">What was built</span><div><ul class="list">${p.built.map(b => `<li>${b}</li>`).join('')}</ul></div></section>
  <section class="cs-block"><span class="label">Screens</span>
    <div class="screens">
      <div class="stack">${shots}</div>
      <div class="phone"><img src="../assets/work/${p.slug}-mobile.jpg" alt="${esc(p.name)} on mobile" width="780" height="1688" loading="lazy"></div>
    </div>
  </section>
  ${p.note ? `<p class="disclaimer">${p.note}</p>` : ''}
  <div style="padding:60px 0 20px;display:flex;gap:12px;flex-wrap:wrap">
    <a class="btn btn-white" href="../index.html#contact">Want one like this? <span class="arr">→</span></a>
    <a class="btn btn-line" href="../index.html#pricing">See the ${p.plan} plan</a>
  </div>
  <a class="next" href="${next.slug}.html"><span>Next project</span><h2>${next.name} →</h2></a>
</div>
`,
  });
  writeFileSync(new URL(`../work/${p.slug}.html`, import.meta.url), html);
  console.log('built work/' + p.slug + '.html');
});

// ---------- Terms ----------
const terms = page({
  path: 'terms.html', root: '', nav: '',
  title: `Plan terms | ${BRAND}`,
  desc: 'How Project X website plans work: setup fees, monthly plans, minimum term, ownership, buyout and cancellation.',
  body: `
<section class="cs-hero">
  <div class="wrap prose">
    <a class="back" href="index.html#pricing">← Back to pricing</a>
    <span class="label">Plan terms</span>
    <h1 style="font-size:clamp(2.4rem,5vw,4rem)">How our plans work.</h1>
    <p class="lede">A plain-English summary of how our website plans work. Your signed service agreement sets out the full terms and takes priority over this page.</p>

    <h2>Plans &amp; pricing</h2>
    <table class="tbl">
      <tr><th>Plan</th><th>Setup (one-off)</th><th>Monthly</th><th>Edits / month</th><th>Buyout</th></tr>
      ${PLANS.map((pl, i) => `<tr><td>${pl.name}</td><td>${fmt(pl.setup)}</td><td>${fmt(pl.monthly)}</td><td>${[1, 3, 5][i]}</td><td>${fmt(pl.monthly * 6)}</td></tr>`).join('\n      ')}
    </table>
    <p>All prices are in Australian dollars. The setup fee is invoiced when your project starts. Monthly fees are billed in advance from the date your site goes live.</p>

    <h2>What every plan includes</h2>
    <ul>
      <li>Website hosting, SSL certificate, security updates and backups</li>
      <li>Your enquiry form connected to a lead CRM, with instant phone notifications</li>
      <li>Monthly website edits (see below)</li>
      <li>Support by email or message</li>
    </ul>

    <h2>Minimum term</h2>
    <p>Every plan has a <strong>12-month minimum term</strong>, starting on your launch date. After 12 months your plan continues month-to-month and can be cancelled with 30 days’ written notice. Different terms can be negotiated and will be written into your agreement.</p>

    <h2>Edits</h2>
    <p>An edit is a small change of up to about 30 minutes of work, such as updating text, prices, opening hours or photos. Unused edits don’t roll over to the next month. Larger work (new pages, new features, redesigns) is quoted separately, except where your plan includes it.</p>

    <h2>Who owns the website</h2>
    <ul>
      <li>While you’re on a plan, ${BRAND} owns the website’s design, code and build. This is what keeps the setup fee low.</li>
      <li><strong>Your content is always yours:</strong> your logo, brand name, photos you supply and your business information.</li>
      <li><strong>Buyout:</strong> you can buy the website outright at any time for <strong>six months of your monthly plan fee</strong>. Once paid, ownership of the site transfers to you and we’ll hand over all files.</li>
    </ul>

    <h2>If you cancel</h2>
    <ul>
      <li>If you cancel without buying the site, it is taken offline at the end of your term or notice period.</li>
      <li>We return your content (text, photos, logo) on request.</li>
      <li>${BRAND} may keep the design as a portfolio piece or reuse the design and code as a template, with all of your branding, photos and content removed.</li>
    </ul>

    <h2>Domains</h2>
    <p>Your domain name should be registered in your business’s name. We can set it up and manage it for you, but it stays yours whatever happens with your plan.</p>

    <p class="disclaimer" style="margin-top:50px">This page is a summary for convenience and is not a contract. The service agreement you sign before your project starts sets out the binding terms.</p>
  </div>
</section>
`,
});
writeFileSync(new URL('../terms.html', import.meta.url), terms);
console.log('built terms.html');
