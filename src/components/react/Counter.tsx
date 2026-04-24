import { useEffect, useRef } from 'react';
import { animate as aniAnimate } from 'animejs';

interface Props {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export default function Counter({ to, suffix = '', prefix = '', decimals = 0, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const obj = { v: 0 };
            aniAnimate(obj, {
              v: to,
              duration: 1800,
              ease: 'outExpo',
              onUpdate: () => {
                el.textContent = `${prefix}${obj.v.toFixed(decimals)}${suffix}`;
              },
            });
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, suffix, prefix, decimals]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
