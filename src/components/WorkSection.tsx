import { useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
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
}: {
  src: string;
  title: string;
  index: number;
  total: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  // IntersectionObserver autoplay
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Parallax: track the panel as it moves through the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 0.5, 1], [120, 0, -120]);
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.4, 1, 1, 0.4]
  );

  const springY = useSpring(rawY, { stiffness: 120, damping: 25 });

  const y = reducedMotion ? 0 : springY;
  const opacity = reducedMotion ? 1 : rawOpacity;

  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: '#0c0c0c', scrollSnapAlign: 'start' }}
    >
      {/* parallax wrapper — only this moves, not the section */}
      <motion.div
        style={{ y, opacity }}
        className="flex flex-col items-center gap-6"
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

      {/* counter — top right, outside the parallax wrapper */}
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
  return (
    <div
      id="work"
      style={{ background: '#0c0c0c', scrollSnapType: 'y proximity' }}
    >
      {/* "Work" heading panel */}
      <section
        className="w-full flex items-center justify-center"
        style={{ height: '100svh', background: '#0c0c0c', scrollSnapAlign: 'start' }}
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

      {WORK.map((item, i) => (
        <VideoPanel
          key={i}
          src={item.src}
          title={item.title}
          index={i}
          total={WORK.length}
        />
      ))}
    </div>
  );
}
