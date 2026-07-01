import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScroll, useMotionValueEvent } from 'framer-motion';

export default function HeroSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [metaReady, setMetaReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => setMetaReady(true);
    v.addEventListener('loadedmetadata', onMeta);
    return () => v.removeEventListener('loadedmetadata', onMeta);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (isMobile) return;
    const v = videoRef.current;
    if (!v || !metaReady || !v.duration || Number.isNaN(v.duration)) return;
    requestAnimationFrame(() => {
      v.currentTime = p * v.duration;
    });
  });

  return (
    <div ref={outerRef} className="h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* soft overlay for legibility */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* video */}
        {isMobile ? (
          <video
            ref={videoRef}
            src="/videos/opening.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src="/videos/opening.mp4"
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
        )}

        {/* kicker */}
        <motion.div
          className="absolute bottom-12 left-0 right-0 z-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p
            className="font-light uppercase tracking-widest text-xs sm:text-sm"
            style={{ color: '#D7E2EA' }}
          >
            PLACEHOLDER_ROLE
          </p>
        </motion.div>
      </div>
    </div>
  );
}
