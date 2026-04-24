import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mount = root.querySelector<HTMLElement>('.hero-k-wrap');
    const tilt = root.querySelector<HTMLElement>('.hero-k-tilt');
    const img = root.querySelector<HTMLElement>('.k-mark-img');
    if (!mount || !tilt || !img) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { opacity: 0, scale: 0.6, rotate: -8 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: 'expo.out', delay: 0.2 }
      );
      gsap.from('.hero-line', {
        yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.1,
      });

      if (reduced) return;

      gsap.to(img, { y: -14, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      gsap.to('.orbit-dot', { rotation: 360, duration: 22, ease: 'none', repeat: -1 });
      gsap.to('.orbit-dot-rev', { rotation: -360, duration: 30, ease: 'none', repeat: -1 });
      gsap.to('.orbit-ring-slow', { rotation: 360, duration: 60, ease: 'none', repeat: -1 });

      const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.6, ease: 'power3.out' });

      let scrolling = false;
      let scrollTimer: number | null = null;
      const markScrolling = () => {
        scrolling = true;
        if (scrollTimer) window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => (scrolling = false), 120);
      };
      window.addEventListener('scroll', markScrolling, { passive: true });

      let frame = 0;
      const onMove = (e: PointerEvent) => {
        if (scrolling) return;
        const rect = mount.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        if (!frame) {
          frame = requestAnimationFrame(() => {
            ry(nx * 12);
            rx(-ny * 9);
            frame = 0;
          });
        }
      };
      const onLeave = () => { rx(0); ry(0); };
      mount.addEventListener('pointermove', onMove, { passive: true });
      mount.addEventListener('pointerleave', onLeave);

      /**
       * OUTRO — Hero is pinned. As user scrolls, the K zooms in from its
       * position until it fills the viewport in white. No vertical drift —
       * pure scale. Hero text fades as the whiteout takes over.
       */
      const hero = document.getElementById('hero');
      const heroText = hero?.querySelector<HTMLElement>('.container-k');

      const whiteoutOverlay = document.querySelector<HTMLElement>('.hero-whiteout');
      const puzzleWrap = document.querySelector<HTMLElement>('.hero-puzzle');
      const puzzleBlocks = document.querySelectorAll<HTMLElement>('.hero-puzzle-block');

      puzzleBlocks.forEach((b) => {
        const dir = b.classList.contains('from-top') ? { y: '-110%' }
          : b.classList.contains('from-bottom') ? { y: '110%' }
          : b.classList.contains('from-left') ? { x: '-110%' }
          : { x: '110%' };
        gsap.set(b, dir);
      });

      // Compute delta to move mount's center to viewport center
      const getCenterOffset = () => {
        const rect = mount.getBoundingClientRect();
        return {
          dx: window.innerWidth / 2 - (rect.left + rect.width / 2),
          dy: window.innerHeight / 2 - (rect.top + rect.height / 2),
        };
      };
      let offset = getCenterOffset();
      let puzzleFired = false;
      let sealFired = false;


      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero || root,
          start: 'top top',
          end: isMobile ? '+=38%' : '+=15%',
          scrub: 0.3,
          pin: hero || root,
          pinSpacing: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onRefresh: () => {
            offset = getCenterOffset();
            tl.invalidate();
          },
          onUpdate: (self) => {
            if (self.progress > 0.5) document.body.classList.add('nav-light');
            else document.body.classList.remove('nav-light');

            // Autoplay puzzle once progress crosses threshold — completes regardless of scroll
            if (self.progress > 0.55 && !puzzleFired) {
              puzzleFired = true;
              if (puzzleWrap) {
                gsap.to(puzzleWrap, { opacity: 1, duration: 0.15, ease: 'none' });
                gsap.to(puzzleBlocks, {
                  x: 0, y: 0,
                  ease: 'power3.out',
                  duration: 0.7,
                  stagger: { each: 0.02, from: 'random' },
                });
              }
            }
            if (self.progress > 0.72 && !sealFired) {
              sealFired = true;
              if (whiteoutOverlay) gsap.to(whiteoutOverlay, { opacity: 1, duration: 0.4, ease: 'power2.in' });
              gsap.to(img, { opacity: 0, duration: 0.3, ease: 'none', delay: 0.2 });
            }
            // Reverse on scroll back up
            if (self.progress < 0.5 && puzzleFired) {
              puzzleFired = false;
              if (puzzleWrap) {
                gsap.to(puzzleWrap, { opacity: 0, duration: 0.2 });
                puzzleBlocks.forEach((b) => {
                  const dir = b.classList.contains('from-top') ? { y: '-110%', x: 0 }
                    : b.classList.contains('from-bottom') ? { y: '110%', x: 0 }
                    : b.classList.contains('from-left') ? { x: '-110%', y: 0 }
                    : { x: '110%', y: 0 };
                  gsap.to(b, { ...dir, duration: 0.3, ease: 'power2.in' });
                });
              }
            }
            if (self.progress < 0.68 && sealFired) {
              sealFired = false;
              if (whiteoutOverlay) gsap.to(whiteoutOverlay, { opacity: 0, duration: 0.25 });
              gsap.to(img, { opacity: 1, duration: 0.2 });
            }
          },
          onLeave: () => document.body.classList.add('nav-light'),
        },
      });

      // Phase 1 (0.0–0.45): K rotates and glides to screen center
      tl.to(mount, {
          x: () => offset.dx,
          y: () => offset.dy,
          rotation: 180,
          opacity: 1,
          ease: 'power2.inOut',
          force3D: true,
          duration: 0.45,
        }, 0)
        .to('.orbit-dot, .orbit-dot-rev, .orbit-ring-slow, .hero-k-tilt > div:not(:last-child)', {
          opacity: 0, ease: 'none', duration: 0.25,
        }, 0.1)
        .to(heroText || {}, { opacity: 0, ease: 'none', duration: 0.3 }, 0.05)
        // Phase 2 (0.45–0.8): K enlarges to fill
        .to(img, { scale: 3.5, ease: 'power2.in', force3D: true, duration: 0.35 }, 0.45);

      // Puzzle + overlay seal fire via onUpdate thresholds above — they autoplay
      // to completion instead of being tied to scrub position.

      return () => {
        window.removeEventListener('scroll', markScrolling);
        mount.removeEventListener('pointermove', onMove);
        mount.removeEventListener('pointerleave', onLeave);
        if (scrollTimer) window.clearTimeout(scrollTimer);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 pointer-events-none">
      {/* Static glows */}
      <div className="absolute top-1/4 -left-24 w-80 h-80 bg-electric/25 rounded-full blur-[80px]"></div>
      <div className="absolute -bottom-20 right-0 w-96 h-96 bg-magenta/15 rounded-full blur-[90px]"></div>

      {/* Interactive K — fixed, large orbits */}
      <div
        className="hero-k-wrap fixed top-[6vh] md:top-[10vh] right-[-6vw] md:right-[5vw] w-[220px] md:w-[480px] lg:w-[540px] aspect-square pointer-events-none md:pointer-events-auto will-change-transform z-10 md:z-40 opacity-60 md:opacity-100"
        style={{ perspective: 1200, transformOrigin: 'center center' }}
      >
        <div
          className="hero-k-tilt relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Large orbit rings — extend beyond the K */}
          <div className="orbit-ring-slow absolute -inset-16 rounded-full border border-white/5"></div>
          <div className="absolute -inset-8 rounded-full border border-white/10"></div>
          <div className="absolute inset-0 rounded-full border border-white/10"></div>
          <div className="absolute inset-8 rounded-full border border-dashed border-white/15"></div>
          <div className="absolute inset-20 rounded-full border border-white/5"></div>

          {/* Rotating accent rings (outer + inner) */}
          <div className="orbit-dot absolute -inset-16">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-aqua rotate-45"></span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-coral"></span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gold rotate-45"></span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-magenta"></span>
          </div>
          <div className="orbit-dot-rev absolute inset-4">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gold rotate-12"></span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-magenta rotate-45"></span>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-cyan2"></span>
          </div>

          {/* The brand mark — WHITE via filter */}
          <div className="absolute inset-0 flex items-center justify-center p-14 md:p-20">
            <img
              src="/logos/mark-black.png"
              width={705}
              height={713}
              alt=""
              className="k-mark-img w-full h-full object-contain"
              style={{
                opacity: 0,
                filter: 'brightness(0) invert(1)',
                imageRendering: 'auto',
              }}
              decoding="async"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
