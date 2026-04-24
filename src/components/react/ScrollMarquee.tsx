import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const phrases = [
  'Enter.',
  'Expand.',
  'Evolve.',
  'Architects of possibility.',
  'The square that connects worlds.',
  'Unlocking the digital world.',
];

const accents = ['bg-electric', 'bg-aqua', 'bg-coral', 'bg-gold', 'bg-magenta', 'bg-cyan2'];

export default function ScrollMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = sectionRef.current;
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      const setX = () => {
        const trackW = track.scrollWidth;
        const viewW = window.innerWidth;
        // Start: track sits off-screen to the right; End: exits to the left.
        return { from: viewW, to: -(trackW) };
      };

      const state = setX();
      gsap.set(track, { x: state.from });

      const tween = gsap.to(track, {
        x: state.to,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const onResize = () => {
        const s = setX();
        gsap.set(track, { x: s.from });
        tween.vars.x = s.to;
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 border-y border-white/10 bg-rich overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-20"></div>
      <div
        ref={trackRef}
        className="flex gap-16 whitespace-nowrap will-change-transform"
      >
        {phrases.map((p, i) => (
          <span
            key={i}
            className="font-display font-bold text-5xl md:text-7xl tracking-tight text-white/85 inline-flex items-center gap-10"
          >
            {p}
            <span className={`inline-block w-5 h-5 rotate-45 ${accents[i % accents.length]}`}></span>
          </span>
        ))}
      </div>
    </section>
  );
}
