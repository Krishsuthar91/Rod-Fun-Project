import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children, baseOpacity = 0.1, baseRotation = 3, blurStrength = 4,
  containerClassName = '', textClassName = '',
}) {
  const containerRef = useRef(null);

  const words = useMemo(
    () => String(children).split(/(\s+)/).map((w, i) =>
      /^\s+$/.test(w) ? w : <span className="word inline-block" key={i}>{w}</span>),
    [children]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const wordEls = el.querySelectorAll('.word');
    const trigger = { trigger: el, scroller: window, scrub: true };

    const ctx = gsap.context(() => {
      gsap.fromTo(el, { transformOrigin: '0% 50%', rotate: baseRotation },
        { rotate: 0, ease: 'none', scrollTrigger: { ...trigger, start: 'top bottom', end: 'bottom bottom' } });
      gsap.fromTo(wordEls, { opacity: baseOpacity, willChange: 'opacity' },
        { opacity: 1, ease: 'none', stagger: 0.05,
          scrollTrigger: { ...trigger, start: 'top bottom-=20%', end: 'bottom bottom' } });
      gsap.fromTo(wordEls, { filter: `blur(${blurStrength}px)` },
        { filter: 'blur(0px)', ease: 'none', stagger: 0.05,
          scrollTrigger: { ...trigger, start: 'top bottom-=20%', end: 'bottom bottom' } });
    }, el);
    return () => ctx.revert();
  }, [baseOpacity, baseRotation, blurStrength]);

  return (
    <h2 ref={containerRef} className={containerClassName}>
      <span className={textClassName}>{words}</span>
    </h2>
  );
}
