import { useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import FadeIn from './FadeIn';

import video1 from '../videos/video1.mp4';
import video2 from '../videos/video2.mp4';
import video3 from '../videos/video3.mp4';
import video4 from '../videos/video4.mp4';
import video5 from '../videos/video5.mp4';
import video6 from '../videos/video6.mp4';

const WORK = [
  { src: video1, title: 'PLACEHOLDER_VIDEO_TITLE_1' },
  { src: video2, title: 'PLACEHOLDER_VIDEO_TITLE_2' },
  { src: video3, title: 'PLACEHOLDER_VIDEO_TITLE_3' },
  { src: video4, title: 'PLACEHOLDER_VIDEO_TITLE_4' },
  { src: video5, title: 'PLACEHOLDER_VIDEO_TITLE_5' },
  { src: video6, title: 'PLACEHOLDER_VIDEO_TITLE_6' },
];

const GOLD_GRADIENT =
  'linear-gradient(135deg, #FBE9A8 0%, #D4AF37 22%, #8A6D1D 48%, #F7E39C 68%, #B8860B 100%)';

const GOLD_SHADOW =
  '0 12px 45px rgba(212,175,55,0.25), inset 0 1px 2px rgba(255,255,255,0.4)';

function VideoPanel({
  src,
  title,
  index,
  total,
  containerProgress,
}: {
  src: string;
  title: string;
  index: number;
  total: number;
  containerProgress: MotionValue<number>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const isLast = index === total - 1;

  // Autoplay: subscribe to container scroll progress, play only the active panel.
  // IntersectionObserver is unreliable for sticky panels (they stay "intersecting"
  // once pinned), so we derive the active index from scroll position instead.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const checkActive = (p: number) => {
      const active = Math.min(Math.floor(p * total), total - 1);
      if (active === index) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    // Sync immediately in case progress already has a value (e.g. back-navigation)
    checkActive(containerProgress.get());
    const unsub = containerProgress.on('change', checkActive);
    return unsub;
  }, [containerProgress, index, total]);

  // Scale + dim: panel i gets covered as panel i+1 rises over it.
  // This transition spans the container's scroll segment [i/total, (i+1)/total].
  // The last panel is never covered, so its transforms are no-ops.
  const segStart = index / total;
  const segEnd = (index + 1) / total;

  const scale = useTransform(
    containerProgress,
    [segStart, segEnd],
    isLast ? [1, 1] : [1, 0.94]
  );
  const brightness = useTransform(
    containerProgress,
    [segStart, segEnd],
    isLast ? [1, 1] : [1, 0.5]
  );
  const filterValue = useTransform(brightness, (b) => `brightness(${b})`);

  const applyEffects = !reducedMotion && !isLast;

  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <section
      className="sticky top-0 h-screen w-full overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] relative"
      style={{ background: '#0c0c0c', zIndex: index + 1 }}
    >
      <motion.div
        className="w-full h-full flex flex-col items-center justify-center gap-6 px-4 py-16"
        style={applyEffects ? { scale, filter: filterValue } : {}}
      >
        {/* golden frame around video */}
        <div
          style={{
            padding: '4px',
            borderRadius: '24px',
            background: GOLD_GRADIENT,
            boxShadow: GOLD_SHADOW,
            flexShrink: 0,
          }}
        >
          <div style={{ background: '#0C0C0C', borderRadius: '20px', overflow: 'hidden' }}>
            <video
              ref={videoRef}
              src={src}
              muted
              loop
              playsInline
              preload="metadata"
              className="max-h-[68vh] md:max-h-[72vh] w-auto max-w-full object-contain block"
            />
          </div>
        </div>

        {/* golden pill around title */}
        <div
          style={{
            padding: '2px',
            borderRadius: '9999px',
            background: GOLD_GRADIENT,
            boxShadow: GOLD_SHADOW,
            flexShrink: 0,
          }}
        >
          <div
            className="px-6 py-2.5"
            style={{ background: '#0C0C0C', borderRadius: '9999px' }}
          >
            <p
              className="font-medium uppercase tracking-tight text-center whitespace-nowrap"
              style={{ color: '#D7E2EA', fontSize: 'clamp(1rem, 2.4vw, 1.8rem)' }}
            >
              {title}
            </p>
          </div>
        </div>
      </motion.div>

      {/* counter — stays outside the scaling wrapper so it doesn't shrink */}
      <span
        className="absolute top-6 right-6 font-light tracking-widest"
        style={{ color: '#D7E2EA', fontSize: 'clamp(0.75rem, 1.2vw, 1rem)', opacity: 0.5 }}
      >
        {counter}
      </span>
    </section>
  );
}

export default function WorkSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // (WORK.length + 1) * 100vh height gives exactly WORK.length equal scroll
  // segments of 100vh each, so segment i maps cleanly to progress [i/N, (i+1)/N].
  const { scrollYProgress: containerProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div id="work" style={{ background: '#0c0c0c' }}>
      {/* "Work" heading — normal flow, scrolls away before the stack begins */}
      <section
        className="h-screen w-full flex items-center justify-center"
        style={{ background: '#0c0c0c' }}
      >
        <FadeIn>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Work
          </h2>
        </FadeIn>
      </section>

      {/* Sticky stack container */}
      <div
        ref={containerRef}
        style={{ height: `${(WORK.length + 1) * 100}vh` }}
      >
        {WORK.map((item, i) => (
          <VideoPanel
            key={i}
            src={item.src}
            title={item.title}
            index={i}
            total={WORK.length}
            containerProgress={containerProgress}
          />
        ))}
      </div>
    </div>
  );
}
