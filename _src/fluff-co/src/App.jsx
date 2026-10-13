import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight, ArrowUpRight, Award, Bath, Calendar, Camera, Check, CheckCircle2, ChevronLeft, Clock,
  Droplets, Ear, HeartPulse, Mail, MapPin, Menu, PawPrint, Phone, Scissors, ShieldCheck, Sparkles,
  Star, Wind, X,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ data */
const PHONE = '0411 000 000'
const PHONE_TEL = '0411000000'
const EMAIL = 'hello@fluffandco.com.au'
const img = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const NAV = [
  { label: 'Prices', href: '#prices' },
  { label: 'How it works', href: '#how' },
  { label: 'Where we go', href: '#route' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
]

const SIZES = [
  { key: 's', label: 'Small', kg: 'Up to 10 kg', eg: 'Toy poodle, Maltese, Shih tzu' },
  { key: 'm', label: 'Medium', kg: '10 to 20 kg', eg: 'Cavoodle, Spoodle, Cocker spaniel' },
  { key: 'l', label: 'Large', kg: '20 to 35 kg', eg: 'Groodle, Labradoodle, Border collie' },
]

const SERVICES = [
  { key: 'bath', icon: Bath, name: 'Bath & Tidy', time: '60 min', prices: [75, 90, 110], text: 'Warm hydrobath, hand blow-dry, brush out, nails, ears, and a tidy of face, feet and bottom.' },
  { key: 'full', icon: Scissors, name: 'Full Groom', time: '90 min', prices: [105, 125, 150], text: 'Everything in Bath & Tidy, plus a full clip or scissor to the style you want, all over.' },
  { key: 'teddy', icon: Sparkles, name: 'Teddy Bear Cut', time: '2 hr', prices: [120, 140, 165], popular: true, text: 'Our oodle speciality. Fully hand scissored with the round face, fluffy legs and soft finish.' },
  { key: 'deshed', icon: Wind, name: 'De-shed Treatment', time: '90 min', prices: [95, 115, 140], text: 'For double coats. Deep conditioning and a high velocity dry that lifts out the loose undercoat.' },
  { key: 'puppy', icon: PawPrint, name: 'Puppy Intro', time: '45 min', prices: [65, 65, 65], text: 'Under 6 months. A gentle first bath, face and feet tidy, and lots of treats. Same price any size.' },
  { key: 'nails', icon: Ear, name: 'Nails & Ears', time: '20 min', prices: [35, 35, 35], text: 'A quick visit between grooms: nail clip and file, ear clean and paw pad trim.' },
]

const ROUTE = [
  { d: 1, day: 'Mon', full: 'Monday', areas: ['Brighton', 'Brighton East'] },
  { d: 2, day: 'Tue', full: 'Tuesday', areas: ['Hampton', 'Sandringham', 'Black Rock'] },
  { d: 3, day: 'Wed', full: 'Wednesday', areas: ['Bentleigh', 'McKinnon', 'Ormond'] },
  { d: 4, day: 'Thu', full: 'Thursday', areas: ['Cheltenham', 'Mentone', 'Highett'] },
  { d: 5, day: 'Fri', full: 'Friday', areas: ['Elwood', 'Elsternwick', 'Caulfield South'] },
  { d: 6, day: 'Sat', full: 'Saturday', areas: ['Beaumaris', 'Mordialloc', 'Parkdale'] },
]
const ALL_SUBURBS = ROUTE.flatMap(r => r.areas.map(a => ({ suburb: a, ...r }))).sort((a, b) => a.suburb.localeCompare(b.suburb))
const SLOTS = ['8:00am', '9:30am', '11:00am', '12:30pm', '2:00pm', '3:30pm']

const REVIEWS = [
  { name: 'Sophie L.', dog: 'Biscuit, cavoodle', suburb: 'Hampton', text: 'Biscuit used to shake the whole drive to the salon. Now he trots out to the van like he owns it. The teddy bear cut is perfect every single time.' },
  { name: 'Dan & Mei', dog: 'Otis, groodle', suburb: 'Bentleigh', text: 'Two kids, two jobs, zero time. Tom texts when he is 15 minutes away, Otis goes out fluffy and comes back fluffier. Honestly the easiest thing in our week.' },
  { name: 'Margaret H.', dog: 'Pip, Maltese, 13', suburb: 'Beaumaris', text: 'Pip is old and arthritic and a salon is too much for her now. Tom takes it slow, lets her rest, and lifts her in and out. I trust him completely.' },
  { name: 'Ravi K.', dog: 'Luna, husky', suburb: 'Mentone', text: 'The de-shed treatment is the real deal. A whole bin bag of undercoat came out and my couch has never been happier. Price was exactly what the website said.' },
  { name: 'Ellie W.', dog: 'Maple, spoodle pup', suburb: 'Elwood', text: 'We booked the puppy intro so Maple would grow up liking grooming. It worked. She now thinks the van is a treat dispenser on wheels.' },
]

const FAQS = [
  ['Do I need to be home?', 'Someone needs to hand your dog over and pick them up, but you do not need to wait around. Most owners carry on working inside. We just need a parking spot near your front door, the van has its own water and power.'],
  ['What if my dog is matted?', 'We check the coat at the door before we start. If there is matting that needs extra time, we tell you the cost upfront ($1.50 a minute) or suggest a shorter clip instead. Nothing extra happens without your OK.'],
  ['My dog is anxious or elderly. Can you help?', 'Yes, and it is one of the biggest reasons people choose mobile grooming. One dog at a time, no cages, no other barking dogs, and breaks whenever they need one. We never use sedation.'],
  ['How often should my dog be groomed?', 'Oodles and other non-shedding coats every 6 to 8 weeks keeps them mat free. Short coats and double coats every 8 to 12 weeks. We can book you in on a repeat so you never lose your spot.'],
  ['How do I pay?', 'Card or Apple Pay at the van once your dog is back with you. No deposits for regulars. A $30 fee applies if you cancel with less than 24 hours notice.'],
  ['Which suburbs do you cover?', 'Melbourne bayside and the south east, on a set day each week. Use the suburb checker above, or call us if you are just outside the area.'],
]

const GALLERY = [
  { id: '1678153184494-1f6fc14a673d', alt: 'Small fluffy dog wearing a green bandana after grooming', name: 'Rosie', cut: 'Puppy trim' },
  { id: '1610961039566-f695fe01830a', alt: 'Black poodle standing on grass after a fresh clip', name: 'Bear', cut: 'Lamb clip' },
  { id: '1790712083949-7a51023ae3e8', alt: 'Fluffy golden puppy sitting on the lawn', name: 'Honey', cut: 'Puppy intro' },
  { id: '1733964659477-35534815c626', alt: 'Small white dog wrapped in a towel after a bath', name: 'Snow', cut: 'Bath & tidy' },
  { id: '1610915077866-790eac1f5eee', alt: 'Curly brown oodle sitting on a white blanket', name: 'Coco', cut: 'Teddy bear cut' },
  { id: '1582296132414-e2cf48e292bc', alt: 'Fluffy apricot oodle resting after a groom', name: 'Milo', cut: 'Face & feet tidy' },
  { id: '1583534778255-5d67d3dcf95d', alt: 'Dachshund sitting in a bath', name: 'Frank', cut: 'Bath & tidy' },
]

/* ------------------------------------------------------------------ helpers */
const money = n => '$' + n
function nextDates(weekday, count = 3) {
  const out = []
  const d = new Date(); d.setHours(0, 0, 0, 0)
  for (let i = 1; out.length < count && i < 40; i++) {
    const x = new Date(d); x.setDate(d.getDate() + i)
    if (x.getDay() === weekday) out.push(x)
  }
  return out
}
const fmtDate = d => d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
// deterministic "already booked" slots so the calendar looks lived in
const isTaken = (date, slot) => ((date.getDate() * 7 + SLOTS.indexOf(slot) * 13) % 5) < 2
const usePrefersReduced = () => useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

/* ------------------------------------------------------------------ brand */
function Logo({ light = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
        <PawPrint className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className={`font-display text-xl font-semibold leading-none ${light ? 'text-white' : 'text-ink'}`}>
        Fluff &amp; Co.
        <span className={`block font-mono text-[10px] font-normal uppercase tracking-[0.2em] ${light ? 'text-white/60' : 'text-muted'}`}>Mobile dog grooming</span>
      </span>
    </span>
  )
}

/* the van: used in hero card, feature card and the route drive */
function Van({ className = '', moving = true }) {
  return (
    <svg viewBox="0 0 260 130" className={className} role="img" aria-label="The Fluff and Co. grooming van">
      <ellipse cx="130" cy="122" rx="112" ry="6" fill="#2E2233" opacity=".12" />
      <path d="M20 40 Q20 22 38 22 H170 Q186 22 194 34 L222 70 Q236 72 240 86 V100 Q240 108 232 108 H28 Q20 108 20 100 Z" fill="#F26B5B" />
      <path d="M20 84 H240 V100 Q240 108 232 108 H28 Q20 108 20 100 Z" fill="#D9503F" />
      <path d="M180 36 H190 L212 68 H180 Z" fill="#BFE3E0" stroke="#FFF7EE" strokeWidth="3" />
      <rect x="122" y="36" width="50" height="34" rx="8" fill="#BFE3E0" stroke="#FFF7EE" strokeWidth="3" />
      {/* dog in the window */}
      <g>
        <ellipse cx="147" cy="62" rx="14" ry="12" fill="#C98A55" />
        <g className="animate-wag" style={{ transformBox: "fill-box", transformOrigin: "50% 15%" }}><ellipse cx="135" cy="58" rx="5" ry="10" fill="#9B6235" /></g>
        <ellipse cx="159" cy="58" rx="5" ry="10" fill="#9B6235" />
        <circle cx="142" cy="60" r="2" fill="#2E2233" /><circle cx="152" cy="60" r="2" fill="#2E2233" />
        <ellipse cx="147" cy="66" rx="3.4" ry="2.4" fill="#2E2233" />
        <path d="M144 70 Q147 75 150 70" fill="#F26B5B" />
      </g>
      <text x="32" y="60" fontFamily="Fredoka, sans-serif" fontWeight="600" fontSize="15" fill="#FFF7EE">Fluff &amp; Co.</text>
      <text x="33" y="74" fontFamily="DM Mono, monospace" fontSize="6.4" fill="#FFF7EE" opacity=".85" letterSpacing="1">MOBILE GROOMING</text>
      <circle cx="40" cy="31" r="4" fill="#FFD27A" opacity=".9" /><circle cx="52" cy="29" r="2.6" fill="#FFF7EE" opacity=".8" />
      {[70, 200].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy="108" r="17" fill="#2E2233" />
          <g className={moving ? 'animate-wheel' : ''} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx={cx} cy="108" r="7.5" fill="#FFF7EE" />
            <rect x={cx - 1.5} y="101" width="3" height="14" rx="1.5" fill="#776A73" />
          </g>
        </g>
      ))}
      <rect x="232" y="78" width="9" height="7" rx="2" fill="#FFD27A" />
    </svg>
  )
}

/* signature animation: soap bubbles + paw prints rising (re-skin of the reference water drops) */
function Bubbles({ count = 9, className = '' }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: (i * 37) % 100, size: 10 + ((i * 13) % 26), delay: (i * 0.73) % 6, dur: 5 + ((i * 1.7) % 4), paw: i % 4 === 3,
  })), [count])
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      {items.map((b, i) => (
        <span key={i} className="absolute bottom-0 animate-rise" style={{ left: `${b.left}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}>
          {b.paw
            ? <PawPrint style={{ width: b.size, height: b.size }} className="text-primary-light" />
            : <span className="block rounded-full border border-white/70 bg-gradient-to-br from-white/60 via-sky/20 to-transparent shadow-[inset_-2px_-3px_6px_rgba(255,255,255,.5)]" style={{ width: b.size, height: b.size }} />}
        </span>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ nav */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-3 py-2 pl-4 transition-all duration-500 ${scrolled ? 'glass shadow-xl shadow-ink/5' : 'bg-transparent'}`} aria-label="Main">
        <a href="#home" aria-label="Fluff and Co. home"><Logo light={!scrolled} /></a>
        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map(n => (
            <a key={n.href} href={n.href} className={`text-sm font-semibold transition-colors hover:text-primary ${scrolled ? 'text-ink' : 'text-white/90'}`}>{n.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href={`tel:${PHONE_TEL}`} className={`hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold sm:flex ${scrolled ? 'text-ink' : 'text-white'}`}><Phone className="h-4 w-4" />{PHONE}</a>
          <a href="#book" className="magnetic-btn hidden rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 sm:inline-flex">Book a groom</a>
          <button onClick={() => setOpen(true)} className={`grid h-11 w-11 place-items-center rounded-full lg:hidden ${scrolled ? 'bg-ink text-white' : 'bg-white/15 text-white'}`} aria-label="Open menu" aria-expanded={open}><Menu className="h-5 w-5" /></button>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink px-6 pb-10 pt-5 text-white" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between"><Logo light /><button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10" aria-label="Close menu"><X className="h-5 w-5" /></button></div>
          <div className="mt-14 flex flex-col gap-5">
            {NAV.map(n => <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-display text-4xl font-medium">{n.label}</a>)}
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <a href="#book" onClick={() => setOpen(false)} className="rounded-full bg-primary py-4 text-center font-bold">Book a groom</a>
            <a href={`tel:${PHONE_TEL}`} className="rounded-full border border-white/25 py-4 text-center font-bold">Call {PHONE}</a>
          </div>
        </div>
      )}
    </header>
  )
}

/* ------------------------------------------------------------------ hero */
function Hero() {
  const ref = useRef(null)
  const next = useMemo(() => {
    const today = new Date().getDay()
    const r = ROUTE.find(x => x.d > today) || ROUTE[0]
    return { day: r.full, area: r.areas[0] }
  }, [])
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-line-1', { y: 40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
      gsap.from('.hero-line-2', { y: 60, opacity: 0, duration: 1.2, delay: 0.4, ease: 'power3.out' })
      gsap.from('.hero-meta, .hero-cta', { y: 24, opacity: 0, duration: 0.8, delay: 0.7, stagger: 0.12, ease: 'power3.out' })
      gsap.from('.hero-card', { x: 40, opacity: 0, duration: 1, delay: 1, ease: 'power3.out' })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="home" ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-deep">
      <img src={img('1535914191444-2a3b177956c7', 2000)} alt="" className="absolute inset-0 h-full w-full object-cover object-[60%_30%] brightness-[0.72]" fetchpriority="high" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/45 to-deep/10" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-deep/80 to-transparent" />
      <Bubbles count={12} className="right-0 top-24 h-[60vh] w-1/2 sm:w-2/5" />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 lg:pb-24">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_.8fr]">
          <div>
            <p className="hero-meta mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent ring-pulse" /> Melbourne bayside · 6 days a week
            </p>
            <h1 className="font-display text-[2.9rem] font-semibold leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-[5.6rem]">
              <span className="hero-line-1 block">The salon comes</span>
              <span className="hero-line-2 block text-primary-light">to your driveway.</span>
            </h1>
            <p className="hero-meta mt-7 max-w-xl text-lg leading-relaxed text-white/80">
              Cage-free, one-on-one grooming in our fitted-out van. No car trips, no waiting room, no other dogs. Just a warm bath and a groomer who knows your dog by name.
            </p>
            <div className="hero-cta mt-9 flex flex-wrap gap-3">
              <a href="#book" className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-white shadow-lg shadow-primary/30">Book a groom <ArrowUpRight className="h-4 w-4" /></a>
              <a href="#prices" className="magnetic-btn glass-dark inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 font-bold text-white">See prices</a>
            </div>
            <div className="hero-meta mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="flex items-center gap-1.5"><span className="flex text-accent">{[0, 1, 2, 3, 4].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}</span> 4.9 from 310 Google reviews</span>
              <span>Oodle specialists</span>
              <span>No sedation, ever</span>
            </div>
          </div>
          <div className="hero-card glass hidden rounded-4xl p-5 shadow-2xl lg:block">
            <div className="rounded-3xl bg-sky/60 px-3 pb-1 pt-4"><Van className="w-full" /></div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Next free spot</p>
                <p className="font-display text-xl font-semibold">{next.day}, {next.area}</p>
              </div>
              <a href="#book" className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white" aria-label="Book this spot"><ArrowRight className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ features */
function IncludedShuffler() {
  const items = [
    { tag: 'Bath', label: 'Warm hydrobath at 34°C with oatmeal shampoo', meta: '15 min' },
    { tag: 'Dry', label: 'Hand blow-dry and brush out, never cage dried', meta: '20 min' },
    { tag: 'Care', label: 'Nails clipped and filed, ears cleaned, pads trimmed', meta: '10 min' },
    { tag: 'Finish', label: 'A spritz of cologne and a fresh bandana or bow', meta: '2 min' },
  ]
  const [stack, setStack] = useState(items)
  useEffect(() => {
    const t = setInterval(() => setStack(p => { const n = [...p]; n.unshift(n.pop()); return n }), 2800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="relative h-44 w-full">
      {stack.map((it, i) => (
        <div key={it.tag} className="absolute inset-0 rounded-3xl border border-divider bg-white p-5 shadow-md"
          style={{ transform: `translate(${i * 12}px, ${i * 12}px) scale(${1 - i * 0.05})`, zIndex: 10 - i, opacity: i > 2 ? 0 : 1 - i * 0.25, transition: 'transform .7s cubic-bezier(.34,1.56,.64,1), opacity .6s' }}>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary-dark">{it.tag}</span>
            <span className="font-mono text-xs text-muted">{it.meta}</span>
          </div>
          <p className="mt-4 font-display text-lg font-medium leading-tight">{it.label}</p>
          <div className="mt-3 flex gap-1">{Array.from({ length: 20 }).map((_, k) => <span key={k} className="h-1 w-1 rounded-full" style={{ background: k < 20 - i * 5 ? '#F26B5B' : '#EEDFD2' }} />)}</div>
        </div>
      ))}
    </div>
  )
}

function VanCard() {
  return (
    <div className="relative h-44 overflow-hidden rounded-3xl bg-sky/50">
      <Bubbles count={8} className="inset-x-6 bottom-16 top-0" />
      <div className="absolute inset-x-0 bottom-4 h-1 rounded-full bg-ink/10" />
      <div className="absolute inset-x-0 bottom-2 flex justify-center"><Van className="w-56 animate-float" /></div>
    </div>
  )
}

function RouteScheduler() {
  const [active, setActive] = useState(1)
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % ROUTE.length), 1800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="h-44 rounded-3xl border border-divider bg-white p-4">
      <div className="grid grid-cols-6 gap-1.5">
        {ROUTE.map((r, i) => (
          <div key={r.day} className={`relative rounded-xl p-2 text-center transition-all duration-500 ${i === active ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-background'}`}>
            <p className="font-mono text-[10px] uppercase">{r.day}</p>
            <PawPrint className={`mx-auto mt-1 h-4 w-4 ${i === active ? 'text-white' : 'text-primary-light'}`} />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-background p-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{ROUTE[active].full}</p>
        <p className="mt-1 font-display text-base font-medium leading-tight">{ROUTE[active].areas.join(', ')}</p>
      </div>
    </div>
  )
}

function Features() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', { y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  const cards = [
    { k: 'A', title: 'Everything included', text: 'Every groom comes with the full spa routine. No surprise extras at the door.', body: <IncludedShuffler /> },
    { k: 'B', title: 'Our van, your driveway', text: 'Hot water, power and a dryer on board. We just need a parking spot near your door.', body: <VanCard /> },
    { k: 'C', title: 'Same street, same day', text: 'We groom one area each day, so your regular spot is the same day every visit.', body: <RouteScheduler /> },
  ]
  return (
    <section ref={ref} className="paw-bg relative px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary-dark">01 / Why mobile</span>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Calmer dogs. <span className="text-primary">Easier mornings.</span>
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map(c => (
            <article key={c.k} className="feature-card rounded-4xl border border-divider bg-surface p-6 shadow-xl shadow-ink/[0.03]">
              {c.body}
              <h3 className="mt-6 font-display text-2xl font-semibold">{c.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ pillars */
function CountUp({ end, suffix = '', decimals = 0, duration = 1800 }) {
  const [v, setV] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    let raf
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = t => {
        const p = Math.min(1, (t - t0) / duration)
        setV(end * (1 - Math.pow(1 - p, 4)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [end, duration])
  return <span ref={ref}>{v.toLocaleString('en-AU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
}

function Pillars() {
  const items = [
    { end: 9, suffix: '', label: 'Years grooming bayside dogs' },
    { end: 6400, suffix: '+', label: 'Grooms in the van' },
    { end: 1, suffix: '', label: 'Dog at a time, always' },
    { end: 4.9, suffix: '', decimals: 1, label: 'Google rating, 310 reviews' },
  ]
  return (
    <section className="px-5 pb-8 sm:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-4xl bg-divider md:grid-cols-4">
        {items.map(i => (
          <div key={i.label} className="bg-surface p-7 sm:p-9">
            <p className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl"><CountUp end={i.end} suffix={i.suffix} decimals={i.decimals} /></p>
            <p className="mt-2 text-sm font-semibold text-muted">{i.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ protocol (sticky stack) */
function Protocol() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card')
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return
        gsap.to(card, {
          scrollTrigger: { trigger: card, start: 'top top+=100', endTrigger: cards[cards.length - 1], end: 'top top+=120', scrub: 1 },
          scale: 0.92, filter: 'blur(6px) saturate(0.7)', opacity: 0.5, ease: 'none',
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  const steps = [
    { num: '01', title: 'We park outside', tag: 'Fifteen minute heads up.', text: 'You get a text when we are on our way. We pull up outside, say hello, and check the coat together so you know exactly what is happening and what it costs.', image: '1597046600818-1bd04816dd3e', alt: 'Happy cavoodle with a blue collar on the grass' },
    { num: '02', title: 'One-on-one in the van', tag: 'No cages. No queue.', text: 'Your dog is the only dog in the van, start to finish. Warm bath, hand dry, then a careful hand scissor. If they need a breather, they get one.', image: '1719464454959-9cf304ef4774', alt: 'Groomer hand scissoring a small white dog' },
    { num: '03', title: 'Back to you, fluffy', tag: 'Same spot next time.', text: 'Most grooms take 60 to 120 minutes. We hand them back at your door, show you the photos, and pop your next visit in on the same day of the week.', image: '1611173622933-91942d394b04', alt: 'Pomeranian wrapped in a pink towel after a bath' },
  ]
  return (
    <section id="how" ref={ref} className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto mb-14 max-w-6xl px-1 sm:px-2">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary-dark">02 / How it works</span>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Three steps. <span className="text-primary">Zero car trips.</span>
        </h2>
      </div>
      <div className="space-y-8">
        {steps.map(s => (
          <article key={s.num} className="protocol-card sticky top-24 mx-auto max-w-6xl overflow-hidden rounded-5xl border border-divider bg-gradient-to-br from-surface to-background shadow-2xl shadow-primary/5 sm:top-28">
            <div className="grid min-h-[56vh] lg:min-h-[64vh] lg:grid-cols-5">
              <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-3 lg:p-14">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">Step {s.num}</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-primary-dark">Fluff &amp; Co. way</span>
                </div>
                <div className="my-10">
                  <span className="-mb-3 block font-display text-[6rem] font-bold leading-none text-primary/15 sm:text-[9rem]">{s.num}</span>
                  <h3 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl">{s.title}</h3>
                  <p className="mt-3 font-display text-2xl text-primary">{s.tag}</p>
                </div>
                <p className="max-w-lg text-lg leading-relaxed text-muted">{s.text}</p>
              </div>
              <div className="relative min-h-[280px] overflow-hidden bg-deep lg:col-span-2 lg:min-h-full">
                <img src={img(s.image, 1000)} alt={s.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/50 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/90 py-1.5 pl-3 pr-4 shadow-lg backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /><span className="font-mono text-[10px] uppercase tracking-widest">Step {s.num}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ prices */
function Prices() {
  const [size, setSize] = useState(1)
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.price-tile', { opacity: 0, y: 30, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="prices" ref={ref} className="bg-deep px-5 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary-light">03 / Prices</span>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">Priced by size. <span className="text-primary-light">Printed right here.</span></h2>
            <p className="mt-5 max-w-xl text-white/70">Pick your dog's size and every price updates. No travel fee inside our area, and nothing extra without your OK.</p>
          </div>
          <div role="radiogroup" aria-label="Dog size" className="flex rounded-full bg-white/10 p-1.5">
            {SIZES.map((s, i) => (
              <button key={s.key} role="radio" aria-checked={size === i} onClick={() => setSize(i)}
                className={`rounded-full px-4 py-2.5 text-left transition-all sm:px-6 ${size === i ? 'bg-primary text-white shadow-lg' : 'text-white/75 hover:text-white'}`}>
                <span className="block font-display text-base font-semibold leading-none">{s.label}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider opacity-80">{s.kg}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-white/50">Like a {SIZES[size].eg}</p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-4xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(s => {
            const Icon = s.icon
            return (
              <article key={s.key} className={`price-tile group relative flex flex-col p-7 transition-colors sm:p-8 ${s.popular ? 'bg-primary' : 'bg-deep hover:bg-[#3a2c40]'}`}>
                {s.popular && <span className="absolute right-6 top-6 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-ink">Most booked</span>}
                <Icon className={`h-7 w-7 ${s.popular ? 'text-white' : 'text-primary-light'}`} />
                <h3 className="mt-5 font-display text-2xl font-semibold">{s.name}</h3>
                <p className={`mt-2 flex-1 text-[15px] leading-relaxed ${s.popular ? 'text-white/90' : 'text-white/65'}`}>{s.text}</p>
                <div className="mt-6 flex items-end justify-between">
                  <p className="font-display text-5xl font-semibold tracking-tight" aria-live="polite">{money(s.prices[size])}</p>
                  <span className={`flex items-center gap-1.5 font-mono text-xs ${s.popular ? 'text-white/85' : 'text-white/55'}`}><Clock className="h-3.5 w-3.5" />{s.time}</span>
                </div>
              </article>
            )
          })}
        </div>
        <div className="mt-8 grid gap-4 text-sm text-white/70 md:grid-cols-3">
          <p className="flex gap-3"><Check className="h-5 w-5 flex-none text-primary-light" /> Over 35 kg? Call us for a price. We groom big dogs too.</p>
          <p className="flex gap-3"><Check className="h-5 w-5 flex-none text-primary-light" /> Matting is checked at the door. Extra time is $1.50 a minute, only with your OK.</p>
          <p className="flex gap-3"><Check className="h-5 w-5 flex-none text-primary-light" /> Add teeth brushing to any groom for $12.</p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ route drive (signature #2) */
function RouteDrive() {
  const ref = useRef(null)
  const vanRef = useRef(null)
  const roadRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [q, setQ] = useState('')
  const reduced = usePrefersReduced()
  useEffect(() => {
    if (reduced) { setProgress(1); return }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: roadRef.current, start: 'top 92%', end: 'top 30%', scrub: 0.6,
        onUpdate: self => {
          gsap.set(vanRef.current, { left: `${self.progress * 100}%`, xPercent: -100 * self.progress })
          setProgress(Math.round(self.progress * 100) / 100)
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [reduced])
  const match = q.trim().length > 1 ? ALL_SUBURBS.find(s => s.suburb.toLowerCase().startsWith(q.trim().toLowerCase())) : null
  return (
    <section id="route" ref={ref} className="overflow-hidden bg-sky/40 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary-dark">04 / Where we go</span>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">One area a day. <span className="text-primary">Every week.</span></h2>
            <p className="mt-5 max-w-lg text-lg text-muted">Grouping our route by suburb keeps travel down, so there is no travel fee and we are never late because we drove across town.</p>
          </div>
          <div className="rounded-4xl bg-white p-6 shadow-xl shadow-ink/5">
            <label htmlFor="suburb" className="font-display text-lg font-semibold">Do you come to my suburb?</label>
            <div className="mt-3 flex items-center gap-2 rounded-full border border-divider bg-background px-4 py-3 focus-within:border-primary">
              <MapPin className="h-5 w-5 text-primary" />
              <input id="suburb" list="suburbs" value={q} onChange={e => setQ(e.target.value)} placeholder="Start typing, e.g. Hampton" className="w-full bg-transparent outline-none placeholder:text-muted/70" autoComplete="address-level2" />
              <datalist id="suburbs">{ALL_SUBURBS.map(s => <option key={s.suburb} value={s.suburb} />)}</datalist>
            </div>
            <p className="mt-3 min-h-[48px] text-[15px]" aria-live="polite">
              {match ? <span className="flex gap-2 text-ink"><CheckCircle2 className="h-5 w-5 flex-none text-primary" /> Yes! We are in <b className="mx-1">{match.suburb}</b> every <b className="ml-1">{match.full}</b>.</span>
                : q.trim().length > 2 ? <span className="text-muted">Not on our route yet. Call {PHONE} and we will let you know if we can squeeze you in.</span>
                  : <span className="text-muted">We cover 17 suburbs across bayside and the south east.</span>}
            </p>
          </div>
        </div>

        {/* the road */}
        <div ref={roadRef} className="relative mt-20 pb-6">
          <div className="relative mx-2 h-3 rounded-full bg-ink/80 sm:mx-10">
            <div className="absolute inset-y-1/2 left-0 right-0 -translate-y-1/2 border-t-2 border-dashed border-accent/80" />
            <div ref={vanRef} className="absolute bottom-1 z-10 w-36 sm:w-48" style={{ left: reduced ? '100%' : '0%', transform: reduced ? 'translateX(-100%)' : undefined }}>
              <Van className="w-full" />
            </div>
          </div>
          <div className="mx-2 mt-6 grid grid-cols-3 gap-y-8 sm:mx-10 sm:grid-cols-6">
            {ROUTE.map((r, i) => {
              const reached = progress >= (i + 0.5) / ROUTE.length - 0.04
              return (
                <div key={r.day} className={`text-center transition-all duration-500 ${reached ? 'opacity-100' : 'opacity-40'}`}>
                  <span className={`mx-auto grid h-11 w-11 place-items-center rounded-full font-mono text-xs font-medium transition-colors duration-500 ${reached ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-muted'}`}>{r.day}</span>
                  <p className="mt-3 px-1 text-sm font-semibold leading-snug">{r.areas.join(', ')}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ booking */
function Booking() {
  const [step, setStep] = useState(0)
  const [b, setB] = useState({ dog: '', size: 1, service: 'teddy', suburb: '', date: null, slot: '', name: '', phone: '', notes: '' })
  const [err, setErr] = useState('')
  const [status, setStatus] = useState('idle')
  const set = (k, v) => { setB(p => ({ ...p, [k]: v })); setErr('') }
  const svc = SERVICES.find(s => s.key === b.service)
  const area = ALL_SUBURBS.find(s => s.suburb === b.suburb)
  const dates = useMemo(() => area ? nextDates(area.d, 3) : [], [area])
  const labels = ['Your dog', 'Service', 'Suburb & time', 'Your details']

  const next = () => {
    if (step === 0 && !b.dog.trim()) return setErr('What is your dog called?')
    if (step === 2 && (!b.date || !b.slot)) return setErr('Pick a date and a time.')
    if (step === 3) {
      if (!b.name.trim() || b.phone.replace(/\D/g, '').length < 8) return setErr('We need your name and a mobile number to confirm by text.')
      setStatus('sending'); setTimeout(() => setStatus('sent'), 1100); return
    }
    setStep(s => s + 1)
  }

  if (status === 'sent') {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10"><CheckCircle2 className="h-9 w-9 text-primary" /></span>
        <h3 className="mt-5 font-display text-3xl font-semibold">{b.dog} is booked in!</h3>
        <p className="mt-2 text-lg">{svc.name} · {fmtDate(b.date)} at {b.slot} · {b.suburb}</p>
        <p className="mt-1 font-display text-2xl text-primary">{money(svc.prices[b.size])}</p>
        <p className="mt-6 max-w-sm text-sm text-muted">This is a portfolio demo, so nothing was actually booked. On a live site the request lands in the owner's CRM and pings their phone.</p>
        <button onClick={() => { setStatus('idle'); setStep(0); setB(p => ({ ...p, date: null, slot: '' })) }} className="mt-6 text-sm font-bold text-primary underline underline-offset-4">Book another dog</button>
      </div>
    )
  }

  const chip = (on) => `rounded-2xl border-2 p-4 text-left transition-all ${on ? 'border-primary bg-primary/5 shadow-md' : 'border-divider bg-white hover:border-primary-light'}`
  return (
    <div>
      <ol className="mb-8 flex gap-2" aria-label="Booking steps">
        {labels.map((l, i) => (
          <li key={l} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors duration-500 ${i <= step ? 'bg-primary' : 'bg-divider'}`} />
            <p className={`mt-2 hidden font-mono text-[10px] uppercase tracking-widest sm:block ${i === step ? 'text-ink' : 'text-muted'}`}>{i + 1}. {l}</p>
          </li>
        ))}
      </ol>

      <div className="min-h-[300px]">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="dog" className="font-display text-xl font-semibold">What's your dog's name?</label>
              <input id="dog" value={b.dog} onChange={e => set('dog', e.target.value)} placeholder="e.g. Biscuit" className="mt-3 w-full rounded-2xl border-2 border-divider bg-white px-5 py-4 text-lg outline-none focus:border-primary" />
            </div>
            <fieldset>
              <legend className="font-display text-xl font-semibold">How big are they?</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {SIZES.map((s, i) => (
                  <button type="button" key={s.key} onClick={() => set('size', i)} className={chip(b.size === i)} aria-pressed={b.size === i}>
                    <span className="block font-display text-lg font-semibold">{s.label}</span>
                    <span className="block text-sm text-muted">{s.kg}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="font-display text-xl font-semibold">What does {b.dog || 'your dog'} need?</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {SERVICES.map(s => (
                <button type="button" key={s.key} onClick={() => set('service', s.key)} className={chip(b.service === s.key)} aria-pressed={b.service === s.key}>
                  <span className="flex items-center justify-between"><span className="font-display text-lg font-semibold">{s.name}</span><span className="font-display text-lg text-primary">{money(s.prices[b.size])}</span></span>
                  <span className="block text-sm text-muted">{s.time}{s.popular ? ' · Most booked' : ''}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="b-sub" className="font-display text-xl font-semibold">Which suburb are you in?</label>
              <select id="b-sub" value={b.suburb} onChange={e => { set('suburb', e.target.value); setB(p => ({ ...p, suburb: e.target.value, date: null, slot: '' })) }} className="mt-3 w-full rounded-2xl border-2 border-divider bg-white px-5 py-4 text-lg outline-none focus:border-primary">
                <option value="">Choose your suburb</option>
                {ALL_SUBURBS.map(s => <option key={s.suburb} value={s.suburb}>{s.suburb} ({s.full}s)</option>)}
              </select>
            </div>
            {area && (
              <div>
                <p className="font-display text-xl font-semibold">We're in {area.suburb} on {area.full}s. Pick a time:</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {dates.map(d => (
                    <div key={d.toISOString()} className={`rounded-2xl border-2 p-3 ${b.date && b.date.getTime() === d.getTime() ? 'border-primary' : 'border-divider'} bg-white`}>
                      <p className="flex items-center gap-2 font-display font-semibold"><Calendar className="h-4 w-4 text-primary" />{fmtDate(d)}</p>
                      <div className="mt-2 grid grid-cols-3 gap-1.5">
                        {SLOTS.map(sl => {
                          const taken = isTaken(d, sl)
                          const on = b.date && b.date.getTime() === d.getTime() && b.slot === sl
                          return (
                            <button type="button" key={sl} disabled={taken} onClick={() => { setB(p => ({ ...p, date: d, slot: sl })); setErr('') }}
                              className={`rounded-lg py-1.5 font-mono text-[11px] transition-colors ${taken ? 'cursor-not-allowed bg-background text-muted/50 line-through' : on ? 'bg-primary text-white' : 'bg-background hover:bg-primary-light/50'}`}
                              aria-label={`${fmtDate(d)} ${sl}${taken ? ' (booked)' : ''}`}>{sl.replace(':00', '')}</button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-background p-5 sm:col-span-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Your booking</p>
              <p className="mt-1 font-display text-xl font-semibold">{b.dog}: {svc.name}, {SIZES[b.size].label.toLowerCase()}</p>
              <p className="text-muted">{fmtDate(b.date)} at {b.slot}, {b.suburb} · <b className="text-ink">{money(svc.prices[b.size])}</b> paid at the van</p>
            </div>
            <div><label htmlFor="b-name" className="text-sm font-bold">Your name</label><input id="b-name" autoComplete="name" value={b.name} onChange={e => set('name', e.target.value)} className="mt-2 w-full rounded-2xl border-2 border-divider bg-white px-4 py-3.5 outline-none focus:border-primary" /></div>
            <div><label htmlFor="b-phone" className="text-sm font-bold">Mobile</label><input id="b-phone" type="tel" autoComplete="tel" value={b.phone} onChange={e => set('phone', e.target.value)} className="mt-2 w-full rounded-2xl border-2 border-divider bg-white px-4 py-3.5 outline-none focus:border-primary" /></div>
            <div className="sm:col-span-2"><label htmlFor="b-notes" className="text-sm font-bold">Anything we should know? (optional)</label><textarea id="b-notes" rows={3} value={b.notes} onChange={e => set('notes', e.target.value)} placeholder="Nervous of dryers, sore hips, gate code..." className="mt-2 w-full rounded-2xl border-2 border-divider bg-white px-4 py-3.5 outline-none focus:border-primary" /></div>
          </div>
        )}
      </div>

      <p className="mt-4 min-h-[24px] text-sm font-semibold text-primary-dark" role="alert">{err}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        {step > 0 ? <button type="button" onClick={() => { setStep(s => s - 1); setErr('') }} className="inline-flex items-center gap-1 rounded-full px-4 py-3 font-bold text-muted hover:text-ink"><ChevronLeft className="h-4 w-4" /> Back</button> : <span />}
        <button type="button" onClick={next} disabled={status === 'sending'} className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-white shadow-lg shadow-primary/30 disabled:opacity-70">
          {status === 'sending' ? 'Booking...' : step === 3 ? 'Confirm booking' : 'Next'} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function BookSection() {
  return (
    <section id="book" className="paw-bg px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary-dark">05 / Book</span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">Book in <span className="text-primary">under a minute.</span></h2>
          <p className="mt-5 text-lg text-muted">Pick a real time on our route. We confirm by text, and you pay at the van once your dog is back with you.</p>
          <ul className="mt-8 space-y-3">
            {['No deposit for regulars', 'Free reschedule up to 24 hours before', 'Repeat bookings on the same day each visit'].map(t => (
              <li key={t} className="flex items-center gap-3 font-semibold"><span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10"><Check className="h-4 w-4 text-primary" /></span>{t}</li>
            ))}
          </ul>
          <div className="mt-10 rounded-3xl bg-ink p-6 text-white">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">Rather talk?</p>
            <a href={`tel:${PHONE_TEL}`} className="mt-2 flex items-center gap-3 font-display text-3xl font-semibold"><Phone className="h-6 w-6 text-primary-light" />{PHONE}</a>
            <p className="mt-1 text-sm text-white/60">Mon to Sat, 7:30am to 5pm. Texts welcome.</p>
          </div>
        </div>
        <div className="rounded-5xl border border-divider bg-surface p-6 shadow-2xl shadow-ink/5 sm:p-10">
          <Booking />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ groomer + trust */
function Groomer() {
  const badges = [
    { icon: Award, title: 'Cert III qualified', text: 'Companion Animal Services, plus 9 years in salons and vans.' },
    { icon: HeartPulse, title: 'Pet first aid trained', text: 'Renewed every year. The van carries a full canine first aid kit.' },
    { icon: ShieldCheck, title: 'Fully insured', text: 'Public liability and care, custody and control cover.' },
  ]
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.trust-badge', { opacity: 0, y: 24, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-5xl bg-primary-light">
            <img src={img('1528846104175-4fd300ee59da', 1000)} alt="Tom brushing a fluffy white dog" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-2 rotate-3 rounded-3xl bg-accent px-5 py-4 shadow-xl sm:-right-6">
            <p className="font-display text-lg font-semibold leading-tight">"No two dogs<br />get the same groom."</p>
          </div>
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary-dark">06 / Your groomer</span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">Hi, I'm Tom.</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">I spent five years in busy salons watching nervous dogs wait in cages for hours. So I built a van where that never happens. Every dog gets my full attention from the first brush to the last treat, and I groom the same dogs on the same street every few weeks. They know the van. Most of them run to it.</p>
          <div className="mt-10 grid gap-4">
            {badges.map(b => {
              const Icon = b.icon
              return (
                <div key={b.title} className="trust-badge flex gap-4 rounded-3xl border border-divider bg-surface p-5">
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-primary/10"><Icon className="h-6 w-6 text-primary" /></span>
                  <div><p className="font-display text-lg font-semibold">{b.title}</p><p className="text-sm text-muted">{b.text}</p></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ gallery + reviews */
function Gallery() {
  return (
    <section className="px-5 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary-dark">07 / Fresh out of the van</span>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">This week's good dogs.</h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 rounded-full border border-divider bg-white px-5 py-3 text-sm font-bold"><Camera className="h-4 w-4 text-primary" /> @fluffandco.grooming</a>
        </div>
        <div className="mt-10 grid grid-flow-dense auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[250px] sm:gap-4 md:grid-cols-3">
          {GALLERY.map((g, i) => (
            <figure key={g.id} className={`group relative m-0 overflow-hidden rounded-4xl bg-primary-light ${i === 0 ? 'row-span-2' : i === 3 ? 'col-span-2' : i === 6 ? 'col-span-2 md:col-span-1' : ''}`}>
              <img src={img(g.id, 900)} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold backdrop-blur">{g.name} <span className="font-normal text-muted">· {g.cut}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  const row = [...REVIEWS, ...REVIEWS]
  return (
    <section id="reviews" className="overflow-hidden bg-primary py-24 text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/75">08 / Reviews</span>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">310 reviews. <span className="text-ink/80">4.9 stars.</span></h2>
      </div>
      <div className="group mt-12 flex w-max gap-5 px-5 [animation:marquee_60s_linear_infinite] hover:[animation-play-state:paused]">
        {row.map((r, i) => (
          <figure key={i} className="m-0 w-[300px] flex-none rounded-4xl bg-white p-7 text-ink shadow-xl sm:w-[380px]" aria-hidden={i >= REVIEWS.length}>
            <div className="flex text-accent-dark">{[0, 1, 2, 3, 4].map(k => <Star key={k} className="h-4 w-4 fill-current" />)}</div>
            <blockquote className="mt-4 text-[15px] leading-relaxed">{r.text}</blockquote>
            <figcaption className="mt-5 border-t border-divider pt-4">
              <p className="font-display font-semibold">{r.name}</p>
              <p className="text-sm text-muted">{r.dog} · {r.suburb}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary-dark">09 / FAQ</span>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">Good questions.</h2>
          <p className="mt-4 text-muted">Text {PHONE} anytime. Tom replies between dogs.</p>
        </div>
        <div className="divide-y divide-divider rounded-4xl border border-divider bg-surface px-6 sm:px-8">
          {FAQS.map(([q, a], i) => (
            <details key={q} className="group py-5" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {q}<span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-primary/10 text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ cta + footer */
function Cta() {
  return (
    <section className="px-5 pb-24 sm:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-6xl bg-ink px-6 py-16 text-center text-white sm:px-16 sm:py-20">
        <Bubbles count={10} className="inset-x-0 bottom-0 top-0" />
        <Droplets className="mx-auto h-10 w-10 text-primary-light" />
        <h2 className="relative mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">Your dog's next groom is <span className="text-primary-light">one tap away.</span></h2>
        <p className="relative mx-auto mt-5 max-w-xl text-white/70">Spring books out fast. Grab your regular spot on our route before it goes.</p>
        <div className="relative mt-9 flex flex-wrap justify-center gap-3">
          <a href="#book" className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-bold shadow-lg shadow-primary/30">Book a groom <ArrowUpRight className="h-4 w-4" /></a>
          <a href={`tel:${PHONE_TEL}`} className="magnetic-btn inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 font-bold"><Phone className="h-4 w-4" /> {PHONE}</a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const today = ROUTE.find(r => r.d === new Date().getDay())
  return (
    <footer className="bg-deep px-5 pb-28 pt-16 text-white sm:px-8 sm:pb-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">Cage-free mobile dog grooming for Melbourne's bayside and south east. One dog at a time, since 2017.</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400 ring-pulse" />{today ? `On the road today: ${today.areas[0]}` : 'Back on the road Monday'}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-light">Grooms</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">{SERVICES.map(s => <li key={s.key}><a href="#prices" className="hover:text-white">{s.name}</a></li>)}</ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-light">Route</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">{ROUTE.map(r => <li key={r.day}><span className="inline-block w-10 font-mono text-xs text-white/45">{r.day}</span>{r.areas[0]}</li>)}</ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-light">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li><a href={`tel:${PHONE_TEL}`} className="flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4" />{PHONE}</a></li>
            <li><a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4" />{EMAIL}</a></li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4" />Mon to Sat, 7:30am to 5pm</li>
            <li className="flex items-center gap-2"><Droplets className="h-4 w-4" />No sedation, ever</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-white/45">
        © {new Date().getFullYear()} Fluff &amp; Co. Mobile Dog Grooming.<br />
        Portfolio concept: a fictional business. Website design &amp; build by <a href="../../index.html" className="text-white/70 underline">Onyx Studios</a>.
      </div>
    </footer>
  )
}

function MobileBar() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-[1fr_1.5fr] gap-2 rounded-full bg-ink/95 p-1.5 shadow-2xl backdrop-blur sm:hidden">
      <a href={`tel:${PHONE_TEL}`} className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white"><Phone className="h-4 w-4" />Call</a>
      <a href="#book" className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-white">Book a groom <ArrowRight className="h-4 w-4" /></a>
    </div>
  )
}

/* ------------------------------------------------------------------ app */
export default function App() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => { clearTimeout(id); window.removeEventListener('load', onLoad) }
  }, [])
  return (
    <div className="relative">
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pillars />
        <Protocol />
        <Prices />
        <RouteDrive />
        <BookSection />
        <Groomer />
        <Gallery />
        <Reviews />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <MobileBar />
    </div>
  )
}
