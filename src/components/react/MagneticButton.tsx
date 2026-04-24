import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Props {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'ghost';
  className?: string;
}

export default function MagneticButton({ children, href = '#', variant = 'primary', className = '' }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const qx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    let frame = 0;
    let cx = 0, cy = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      cx = (e.clientX - (r.left + r.width / 2)) * 0.3;
      cy = (e.clientY - (r.top + r.height / 2)) * 0.3;
      if (!frame) frame = requestAnimationFrame(() => { qx(cx); qy(cy); frame = 0; });
    };
    const onLeave = () => { qx(0); qy(0); };
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const base = variant === 'primary' ? 'btn-primary' : 'btn-ghost';

  return (
    <a ref={ref} href={href} className={`${base} ${className} will-change-transform`}>
      {children}
    </a>
  );
}
