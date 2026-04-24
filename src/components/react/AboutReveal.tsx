import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const traits: { title: string; sub: string; hex: string; gradient: string; dark?: boolean }[] = [
  {
    title: 'Imaginative', sub: 'Future-focused', hex: '#FFFFFF', dark: true,
    gradient: 'linear-gradient(135deg, #ffffff 0%, #ffffff 45%, #d8d8e5 100%)',
  },
  {
    title: 'Curious', sub: 'Exploratory', hex: '#040223',
    // Deep navy with a faint violet lift at TL, dropping to pure rich navy at BR
    gradient: 'linear-gradient(135deg, #1a1540 0%, #0a0630 45%, #040223 100%)',
  },
  {
    title: 'Craft-driven', sub: 'Precise', hex: '#040223',
    gradient: 'linear-gradient(135deg, #1a1540 0%, #0a0630 45%, #040223 100%)',
  },
  {
    title: 'Bold', sub: 'Grounded', hex: '#FFFFFF', dark: true,
    gradient: 'linear-gradient(135deg, #ffffff 0%, #ffffff 45%, #d8d8e5 100%)',
  },
];

export default function AboutReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const section = sectionRef.current;

    const chip = section.querySelector<HTMLElement>('.ab-chip');
    const kicker = section.querySelector<HTMLElement>('.ab-kicker');
    const heading = section.querySelectorAll<HTMLElement>('.ab-heading-line');
    const paras = section.querySelectorAll<HTMLElement>('.ab-para');
    const quote = section.querySelector<HTMLElement>('.ab-quote');
    const traitCards = section.querySelectorAll<HTMLElement>('.ab-trait');
    const traitBars = section.querySelectorAll<HTMLElement>('.ab-trait-bar');
    const traitGlows = section.querySelectorAll<HTMLElement>('.ab-trait-glow');
    const bigDiamond = section.querySelector<HTMLElement>('.ab-diamond');
    const ring1 = section.querySelector<HTMLElement>('.ab-ring-1');
    const ring2 = section.querySelector<HTMLElement>('.ab-ring-2');
    const sweep = section.querySelector<HTMLElement>('.ab-sweep');
    const exitWipe = section.querySelector<HTMLElement>('.ab-exit-wipe');

    const ctx = gsap.context(() => {
      gsap.set([chip, kicker, ...paras, quote].filter(Boolean), { opacity: 0, y: 24 });
      gsap.set(heading, { opacity: 0, y: 20, clipPath: 'inset(0 100% 0 0)' });
      // K-mark pieces — start tiny, clustered at the container's center, then explode outward into their quadrants
      const cluster = [
        { xPercent: 50,  yPercent: 50  }, // TL → push down-right to meet at center
        { xPercent: -50, yPercent: 50  }, // TR → down-left
        { xPercent: 50,  yPercent: -50 }, // BL → up-right
        { xPercent: -50, yPercent: -50 }, // BR → up-left
      ];
      traitCards.forEach((c, i) => gsap.set(c, {
        opacity: 0, scale: 0.18, transformOrigin: '50% 50%', ...cluster[i],
      }));
      gsap.set(traitGlows, { opacity: 0 });
      if (bigDiamond) gsap.set(bigDiamond, { scale: 0, rotation: 0, opacity: 0 });
      if (ring1) gsap.set(ring1, { scale: 0.3, opacity: 0 });
      if (ring2) gsap.set(ring2, { scale: 0.6, opacity: 0 });
      if (sweep) gsap.set(sweep, { scaleX: 0, transformOrigin: 'left' });
      if (exitWipe) gsap.set(exitWipe, { yPercent: 100 });

      if (reduced) {
        gsap.set([chip, kicker, ...paras, quote].filter(Boolean), { opacity: 1, y: 0 });
        gsap.set(heading, { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)' });
        traitCards.forEach((c) => gsap.set(c, { opacity: 1, scale: 1, xPercent: 0, yPercent: 0 }));
        gsap.set(traitGlows, { opacity: 0.4 });
        if (bigDiamond) gsap.set(bigDiamond, { scale: 1, rotation: 45, opacity: 0.18 });
        if (ring1) gsap.set(ring1, { scale: 1, opacity: 0.6 });
        if (ring2) gsap.set(ring2, { scale: 1, opacity: 0.4 });
        return;
      }

      const entry = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 5%',
          scrub: 0.5,
          fastScrollEnd: true,
        },
      });

      // Ambient decoration materializes first
      if (ring1) entry.to(ring1, { scale: 1, opacity: 0.6, ease: 'power3.out', duration: 0.8 }, 0);
      if (ring2) entry.to(ring2, { scale: 1, opacity: 0.4, ease: 'power3.out', duration: 0.9 }, 0.05);
      if (bigDiamond) entry.to(bigDiamond, { scale: 1, rotation: 45, opacity: 0.18, ease: 'back.out(1.2)', duration: 1 }, 0);

      // Accent sweep under the heading
      if (sweep) entry.to(sweep, { scaleX: 1, ease: 'power3.inOut', duration: 0.7 }, 0.15);

      // Kicker + chip + heading cascade
      if (chip) entry.to(chip, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 }, 0.1);
      if (kicker) entry.to(kicker, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 }, 0.2);
      entry.to(heading, { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)', ease: 'power3.out', duration: 0.8, stagger: 0.12 }, 0.25);

      // Body copy
      entry.to(paras, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6, stagger: 0.12 }, 0.55);
      if (quote) entry.to(quote, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6 }, 0.8);

      // K-mark pieces snap into place from their corners, then glows ignite
      entry.to(traitCards, { opacity: 1, xPercent: 0, yPercent: 0, scale: 1, ease: 'back.out(1.4)', duration: 0.9, stagger: 0.08 }, 0.9);
      entry.to(traitGlows, { opacity: 1, ease: 'power2.out', duration: 0.6, stagger: 0.08 }, 1.1);

      // AMBIENT — slow perpetual motion on decoration
      if (bigDiamond) {
        gsap.to(bigDiamond, {
          rotation: '+=360', duration: 80, ease: 'none', repeat: -1,
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' },
        });
      }
      if (ring1) gsap.to(ring1, { rotation: 360, duration: 50, ease: 'none', repeat: -1 });
      if (ring2) gsap.to(ring2, { rotation: -360, duration: 70, ease: 'none', repeat: -1 });

      // Gentle glow pulse on each K piece
      traitGlows.forEach((g, i) => {
        gsap.to(g, {
          opacity: 0.55, duration: 2.4 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1,
          scrollTrigger: { trigger: g, start: 'top bottom', toggleActions: 'play pause resume pause' },
        });
      });

      // HOVER — each K-mark piece lifts, brightens, and drifts a touch outward toward its corner.
      // Sibling pieces recede slightly so the hovered shape feels like it's popping forward.
      const driftOut = [
        { x: -8, y: -8 }, // TL drifts up-left
        { x:  8, y: -8 }, // TR drifts up-right
        { x: -8, y:  8 }, // BL drifts down-left
        { x:  8, y:  8 }, // BR drifts down-right
      ];
      traitCards.forEach((card, i) => {
        const glow = traitGlows[i];
        card.style.cursor = 'pointer';
        const onEnter = () => {
          gsap.to(card, { ...driftOut[i], scale: 1.04, filter: 'brightness(1.15)', duration: 0.5, ease: 'power3.out' });
          if (glow) gsap.to(glow, { opacity: 0.85, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
          traitCards.forEach((other, j) => {
            if (j !== i) gsap.to(other, { scale: 0.97, filter: 'brightness(0.82)', duration: 0.5, ease: 'power3.out' });
          });
        };
        const onLeave = () => {
          gsap.to(card, { x: 0, y: 0, scale: 1, filter: 'brightness(1)', duration: 0.55, ease: 'power3.out' });
          if (glow) gsap.to(glow, { opacity: 0.4, duration: 0.6, ease: 'sine.inOut', overwrite: 'auto' });
          traitCards.forEach((other, j) => {
            if (j !== i) gsap.to(other, { scale: 1, filter: 'brightness(1)', duration: 0.55, ease: 'power3.out' });
          });
        };
        card.addEventListener('pointerenter', onEnter);
        card.addEventListener('pointerleave', onLeave);
      });

      // EXIT handled by the NEXT section's own entry animation — no gradient wipe here.

      // Nav light theme while About section is centered
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 40%',
        onEnter: () => document.body.classList.add('nav-light'),
        onEnterBack: () => document.body.classList.add('nav-light'),
        onLeave: () => document.body.classList.remove('nav-light'),
        onLeaveBack: () => document.body.classList.remove('nav-light'),
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative pt-24 md:pt-32 pb-32 md:pb-40 overflow-hidden">
      {/* Ambient decoration — rings + diamond */}
      <div className="ab-ring-1 absolute top-1/2 right-[4%] md:right-[8%] -translate-y-1/2 w-[320px] h-[320px] md:w-[560px] md:h-[560px] rounded-full border border-white/10 pointer-events-none will-change-transform"></div>
      <div className="ab-ring-2 absolute top-1/2 right-[8%] md:right-[12%] -translate-y-1/2 w-[220px] h-[220px] md:w-[380px] md:h-[380px] rounded-full border border-dashed border-white/5 pointer-events-none will-change-transform"></div>
      <div className="ab-diamond absolute top-1/2 right-[12%] md:right-[16%] -translate-y-1/2 w-40 h-40 md:w-64 md:h-64 pointer-events-none will-change-transform"
           style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))', border: '1px solid rgba(255,255,255,0.12)' }}></div>

      <div className="container-k relative z-10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-5">
            <div className="ab-chip chip mb-4 md:mb-6 will-change-transform"
                 style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#df79e3' }}></span>
              About Kinvrs
            </div>
            <div className="ab-kicker mb-3 md:mb-4 font-mono text-[11px] md:text-xs tracking-[0.35em] uppercase text-white/50 will-change-transform">
              Chapter 02 — Who we are
            </div>
            <h2 className="heading-lg text-white">
              <span className="block overflow-hidden"><span className="ab-heading-line inline-block">The</span></span>
              <span className="block overflow-hidden"><span className="ab-heading-line inline-block" style={{ background: 'linear-gradient(120deg,#87eafa 0%,#df79e3 55%,#f1c44c 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Creative</span></span>
              <span className="block overflow-hidden"><span className="ab-heading-line inline-block">Voyager.</span></span>
            </h2>
            {/* Accent sweep under heading */}
            <div className="ab-sweep mt-5 md:mt-6 h-[3px] w-40 md:w-56 rounded-full will-change-transform"
                 style={{ background: 'linear-gradient(90deg,#87eafa 0%,#df79e3 50%,#f1c44c 100%)' }}></div>
          </div>

          <div className="md:col-span-7 space-y-5 md:space-y-6 text-base md:text-lg text-white/75 leading-relaxed font-light">
            <p className="ab-para will-change-transform">
              Across today's digital world, ideas move fast and possibilities expand by the minute.
              Creators, teams and communities look for spaces where imagination can grow and
              technology quietly supports their ambition.
            </p>
            <p className="ab-para will-change-transform">
              This is where <span className="text-white font-medium">Kinvrs</span> steps in — turning complex
              infrastructure into something intuitive, reliable and full of creative potential.
            </p>
            <p className="ab-quote text-white/90 text-lg md:text-xl italic font-light border-l-2 pl-5 md:pl-6 will-change-transform"
               style={{ borderColor: '#df79e3' }}>
              "Boldly crafting tech infrastructure that powers play, creation,
              connection, and beyond."
            </p>

            {/* K-mark trait composition — each quadrant masked by the real asset, labels fit the solid bulk of each piece */}
            <div className="ab-kmark relative aspect-square w-full max-w-[460px] mx-auto md:mx-0 pt-6 select-none">
              <div className="relative w-full h-full grid grid-cols-2 grid-rows-2">
                {traits.map((t, i) => {
                  const pos = ['0% 0%', '100% 0%', '0% 100%', '100% 100%'][i]; // TL/TR/BL/BR
                  // Anchor labels over each shape's CENTER OF MASS — nudged diagonally
                  // toward the outer corner so the text always falls on the coloured piece
                  // and never spills into the narrow tapered tip of the parallelograms.
                  // TL → nudge toward TL; TR → nudge toward TR (fat top); BL → BL (fat bottom); BR → BR.
                  // Anchor labels firmly inside the solid area of each shape.
                  // Parallelograms (TR, BL) get pulled to their fat edge and a tighter label.
                  const anchor = [
                    { cx: 32, cy: 32, textAlign: 'center' as const },
                    { cx: 50, cy: 22, textAlign: 'center' as const },
                    { cx: 30, cy: 68, textAlign: 'center' as const },
                    { cx: 65, cy: 66, textAlign: 'center' as const },
                  ][i];
                  const titleCls = 'font-display font-bold text-base md:text-xl leading-[0.9] tracking-tight whitespace-nowrap';
                  const subCls   = 'font-mono text-[9px] md:text-[11px] tracking-[0.3em] uppercase mb-1';
                  const textColor = t.dark ? '#1a1208' : '#ffffff';
                  const subColor  = t.dark ? 'rgba(26,18,8,0.7)' : 'rgba(255,255,255,0.85)';
                  return (
                    <div key={t.title} className="ab-trait relative will-change-transform overflow-hidden">
                      <div className="absolute inset-0" style={{
                        backgroundColor: t.hex,
                        backgroundImage: t.gradient,
                        WebkitMaskImage: 'url(/logos/mark-black.png)',
                        maskImage: 'url(/logos/mark-black.png)',
                        WebkitMaskSize: '200% 200%',
                        maskSize: '200% 200%',
                        WebkitMaskPosition: pos,
                        maskPosition: pos,
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                      }}></div>
                      <div className="ab-trait-glow absolute inset-0 pointer-events-none" style={{
                        background: `radial-gradient(circle at ${['25% 25%','75% 25%','25% 75%','75% 75%'][i]}, rgba(255,255,255,0.4), transparent 55%)`,
                        WebkitMaskImage: 'url(/logos/mark-black.png)',
                        maskImage: 'url(/logos/mark-black.png)',
                        WebkitMaskSize: '200% 200%',
                        maskSize: '200% 200%',
                        WebkitMaskPosition: pos,
                        maskPosition: pos,
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        opacity: 0,
                      }}></div>
                      <div className="absolute z-10" style={{
                        left: `${anchor.cx}%`, top: `${anchor.cy}%`,
                        transform: 'translate(-50%, -50%)',
                        textAlign: anchor.textAlign, color: textColor,
                      }}>
                        <div className={subCls} style={{ color: subColor }}>{t.sub}</div>
                        <div className={titleCls}>{t.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
