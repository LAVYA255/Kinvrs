import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Declarative scroll-reveal runner. Attaches GSAP animations to any element
 * carrying `data-reveal`, `data-reveal-stagger`, or `data-reveal-parallax`.
 * Mount once near the top of the page.
 */
export default function ScrollReveal() {
  useEffect(() => {
    // Honor reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Single reveals — fromTo so missed triggers still leave content visible
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const dir = el.dataset.reveal || 'up';
        const fromVars: gsap.TweenVars = { opacity: 0 };
        const toVars: gsap.TweenVars = { opacity: 1, duration: 1, ease: 'power3.out', overwrite: 'auto' };
        if (dir === 'up') { fromVars.y = 60; toVars.y = 0; }
        if (dir === 'down') { fromVars.y = -60; toVars.y = 0; }
        if (dir === 'left') { fromVars.x = 60; toVars.x = 0; }
        if (dir === 'right') { fromVars.x = -60; toVars.x = 0; }
        if (dir === 'scale') { fromVars.scale = 0.92; fromVars.y = 30; toVars.scale = 1; toVars.y = 0; }

        gsap.fromTo(el, fromVars, {
          ...toVars,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        });
      });

      // Staggered children — same failsafe pattern
      gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((parent) => {
        const children = Array.from(parent.children) as HTMLElement[];
        gsap.fromTo(children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            overwrite: 'auto',
            scrollTrigger: {
              trigger: parent,
              start: 'top 90%',
              once: true,
            },
          }
        );
      });

      // Parallax
      gsap.utils.toArray<HTMLElement>('[data-reveal-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.revealParallax || '0.2');
        gsap.to(el, {
          yPercent: -speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Section headline splits: words slide up
      gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
        const text = el.textContent || '';
        el.innerHTML = text
          .split(' ')
          .map(
            (w) =>
              `<span class="inline-block overflow-hidden align-bottom"><span class="inline-block will-change-transform" data-word>${w}&nbsp;</span></span>`
          )
          .join('');
        const words = el.querySelectorAll<HTMLElement>('[data-word]');
        gsap.from(words, {
          yPercent: 110,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.04,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });
    });

    // Refresh once window+fonts settle so measurements are correct after Hero/Whiteout pins mount
    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 300);
    const t2 = window.setTimeout(refresh, 900);
    window.addEventListener('load', refresh);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return null;
}
