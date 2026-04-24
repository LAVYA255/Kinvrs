import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { text: 'Enter.', color: 'bg-electric', hex: '#4207C5' },
  { text: 'Expand.', color: 'bg-aqua', hex: '#61cea0' },
  { text: 'Evolve.', color: 'bg-coral', hex: '#e8462a' },
  { text: 'Architects of possibility.', color: 'bg-gold', hex: '#f1c44c' },
  { text: 'The square that connects worlds.', color: 'bg-magenta', hex: '#df79e3' },
  { text: 'Unlocking the digital world.', color: 'bg-cyan2', hex: '#87eafa' },
];

export default function WhiteoutReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !stageRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const rows = stage.querySelectorAll<HTMLElement>('.wo-row');
    const rowText = stage.querySelectorAll<HTMLElement>('.wo-text');
    const rowDiamonds = stage.querySelectorAll<HTMLElement>('.wo-dot');
    const bigDiamond = stage.querySelector<HTMLElement>('.wo-big-diamond');
    const counter = stage.querySelector<HTMLElement>('.wo-counter');
    const hint = stage.querySelector<HTMLElement>('.wo-hint');
    const vlabel = stage.querySelector<HTMLElement>('.wo-vlabel');
    const counterWrap = stage.querySelector<HTMLElement>('.wo-counter-wrap');
    const inkwipe = stage.querySelector<HTMLElement>('.wo-inkwipe');
    const burst = stage.querySelector<HTMLElement>('.wo-burst');

    const ctx = gsap.context(() => {
      // Initial hidden state — text wiped to zero width, dots scaled out, ambient UI faded
      gsap.set(rowText, { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(rowDiamonds, { scale: 0, rotation: 0 });
      gsap.set(rows, { opacity: 1, y: 0 });
      if (bigDiamond) gsap.set(bigDiamond, { scale: 0, rotation: 0, opacity: 0 });
      if (counterWrap) gsap.set(counterWrap, { opacity: 0, y: -10 });
      if (hint) gsap.set(hint, { opacity: 0, y: 10 });
      if (vlabel) gsap.set(vlabel, { opacity: 0, x: 20 });
      if (burst) gsap.set(burst, { scale: 0, opacity: 0 });

      if (reduced) {
        gsap.set(rowText, { clipPath: 'inset(0 0 0 0)' });
        gsap.set(rowDiamonds, { scale: 1, rotation: 45 });
        if (bigDiamond) gsap.set(bigDiamond, { scale: 1, rotation: 45, opacity: 1 });
        if (counterWrap) gsap.set(counterWrap, { opacity: 1, y: 0 });
        if (hint) gsap.set(hint, { opacity: 1, y: 0 });
        if (vlabel) gsap.set(vlabel, { opacity: 1, x: 0 });
        return;
      }

      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const perTitle = 0.32;
      const introDur = 0.22;
      const wipeDur = 0.4;
      const totalPin = introDur + perTitle * rows.length + wipeDur;
      const pinMultiplier = isMobile ? 140 : 80;

      // Autoplay intro once on enter — completes fully regardless of scroll.
      // Stored so it can be reversed when scrolling back out.
      let introTl: gsap.core.Timeline | null = null;
      const playIntro = () => {
        if (introTl) { introTl.play(); return; }
        introTl = gsap.timeline();
        if (burst) {
          introTl.to(burst, { scale: 30, opacity: 0.6, ease: 'power3.out', duration: 0.5 }, 0)
                 .to(burst, { opacity: 0, ease: 'power2.in', duration: 0.35 }, 0.45);
        }
        if (bigDiamond) {
          introTl.fromTo(bigDiamond,
            { xPercent: -900, scale: 0.3, rotation: -180, opacity: 0 },
            { xPercent: 0, scale: 1, rotation: 45, opacity: 1, ease: 'back.out(1.4)', duration: 0.9 }, 0);
        }
        if (counterWrap) introTl.to(counterWrap, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6 }, 0.1);
        if (vlabel) introTl.to(vlabel, { opacity: 1, x: 0, ease: 'power2.out', duration: 0.6 }, 0.2);
        if (hint) introTl.to(hint, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6 }, 0.3);
      };
      const reverseIntro = () => { if (introTl) introTl.reverse(); };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalPin * pinMultiplier}%`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.5,
          fastScrollEnd: true,
          onEnter: () => {
            document.body.classList.add('nav-light');
            gsap.set('.hero-whiteout, .hero-puzzle', { display: 'none' });
            playIntro();
          },
          onEnterBack: () => {
            document.body.classList.add('nav-light');
            gsap.set('.hero-whiteout, .hero-puzzle', { display: 'none' });
            playIntro();
          },
          onUpdate: (self) => {
            // Re-play intro when scrolling forward past start, reverse when nearly out
            if (self.progress > 0.02 && introTl && introTl.reversed()) introTl.play();
            if (self.progress < 0.02 && introTl && !introTl.reversed() && introTl.progress() > 0) introTl.reverse();
          },
          onLeave: () => document.body.classList.remove('nav-light'),
          onLeaveBack: () => {
            document.body.classList.remove('nav-light');
            gsap.set('.hero-whiteout, .hero-puzzle', { display: 'block' });
            reverseIntro();
          },
        },
      });

      // Intro is autoplayed via playIntro() — reserve this gap in the scrub
      // timeline so titles don't start wiping until the intro has room to breathe.
      tl.to({}, { duration: introDur }, 0);

      // ——— TITLE REVEALS: each title wipes in (clip-path) per scroll increment,
      // its inline dot pops, and the big diamond shifts colour + re-angles.
      rows.forEach((row, i) => {
        const at = introDur + i * perTitle;
        const textEl = row.querySelector<HTMLElement>('.wo-text');
        const dotEl = row.querySelector<HTMLElement>('.wo-dot');
        if (textEl) {
          tl.to(textEl, {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'power3.inOut',
            duration: perTitle * 0.8,
          }, at);
        }
        if (dotEl) {
          tl.to(dotEl, {
            scale: 1,
            rotation: 45,
            ease: 'back.out(2)',
            duration: perTitle * 0.5,
          }, at);
        }
        if (bigDiamond) {
          tl.to(bigDiamond, {
            backgroundColor: lines[i].hex,
            rotation: 45 + (i + 1) * 36,
            scale: 1 + i * 0.05,
            ease: 'power2.out',
            duration: perTitle * 0.8,
          }, at);
        }
        if (counter) {
          tl.to(counter, {
            innerText: `0${i + 1}`,
            snap: { innerText: 1 },
            duration: perTitle * 0.3,
          }, at);
        }
      });

      // ——— WIPE OUT: the big diamond explodes, ink overlay locks the hand-off to About.
      const wipeAt = introDur + rows.length * perTitle + 0.05;
      tl.to(bigDiamond || {}, {
        scale: 50,
        rotation: '+=180',
        backgroundColor: '#26374A',
        ease: 'power3.in',
        duration: wipeDur * 0.75,
      }, wipeAt)
        .to([rows, counter, hint, vlabel].filter(Boolean) as Element[], {
          opacity: 0,
          ease: 'power2.in',
          duration: wipeDur * 0.5,
        }, wipeAt)
        .to(section, { backgroundColor: '#26374A', duration: wipeDur * 0.3, ease: 'none' }, wipeAt + wipeDur * 0.4)
        .to(inkwipe || {}, { opacity: 1, duration: wipeDur * 0.3, ease: 'none' }, wipeAt + wipeDur * 0.4);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white overflow-hidden"
      style={{ height: '100svh' }}
    >
      <div ref={stageRef} className="h-full w-full relative">
        {/* Center burst — radiating ring that announces the screen "opening" */}
        <div className="wo-burst absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          <div className="w-40 h-40 rounded-full border-2 border-electric/30"></div>
        </div>

        {/* Counter */}
        <div className="wo-counter-wrap absolute top-10 left-10 font-mono text-xs tracking-[0.3em] text-rich/50 z-10 will-change-transform">
          <span className="wo-counter">01</span> <span className="text-rich/30">/ 06</span>
        </div>

        {/* Right vertical label */}
        <div
          className="wo-vlabel absolute top-1/2 right-10 -translate-y-1/2 text-rich/30 font-mono text-xs tracking-[0.4em] uppercase z-10 will-change-transform"
          style={{ writingMode: 'vertical-rl' }}
        >
          Kinvrs — the square that connects
        </div>

        {/* Big color diamond — anchor on the right, becomes the dark wipe at the end */}
        <div className="absolute top-1/2 right-[12%] -translate-y-1/2 pointer-events-none z-0">
          <div
            className="wo-big-diamond w-40 h-40 md:w-60 md:h-60 will-change-transform flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#4207C5' }}
          >
            <img
              src="/logos/mark-black.png"
              alt=""
              className="w-3/5 h-3/5 object-contain pointer-events-none select-none"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.85, mixBlendMode: 'overlay' }}
              decoding="async"
            />
          </div>
        </div>

        {/* Titles */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container-k w-full">
            <ul className="space-y-4 md:space-y-5 max-w-2xl">
              {lines.map((l, i) => (
                <li
                  key={i}
                  className="wo-row flex items-center gap-5 md:gap-7 will-change-transform"
                >
                  <span className={`wo-dot inline-block w-3.5 h-3.5 md:w-5 md:h-5 ${l.color} shrink-0 will-change-transform`}></span>
                  <span
                    className="wo-text font-display font-bold text-3xl md:text-6xl tracking-tight text-rich leading-none"
                    style={{ clipPath: 'inset(0 100% 0 0)' }}
                  >
                    {l.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="wo-hint absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.4em] uppercase text-rich/40 z-10 will-change-transform">
          Scroll to continue
        </div>

        {/* Dark ink wipe for hand-off */}
        <div className="wo-inkwipe absolute inset-0 pointer-events-none z-20" style={{ opacity: 0, backgroundColor: '#26374A' }}></div>
      </div>
    </section>
  );
}
