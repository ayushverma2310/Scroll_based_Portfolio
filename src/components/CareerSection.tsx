import { useEffect, useRef, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
} from 'framer-motion';
import { PersonStanding } from 'lucide-react';

const CUBE_VIDEO_SRC = '/videos/cube.mp4';

const BLUE_GRADIENT = 'linear-gradient(180deg, #7FDBFF 0%, #29B6F6 45%, #1565C0 100%)';
const BLUE_GLOW = 'rgba(41,182,246,0.5)';

// cube playback-rate response to scroll speed
const CUBE_IDLE_RATE = 0.75;
const CUBE_MAX_RATE = 2.5;
const CUBE_VELOCITY_SENSITIVITY = 0.15; // px/frame of scroll -> playbackRate added on top of idle
const CUBE_RATE_LERP = 0.15;

const RUNG_COUNT = 6;
const RAIL_TOP_MARGIN = 7.5; // % — keep in sync with person top range below
const RAIL_BOTTOM_MARGIN = 7.5;

const EXPERIENCES = [
  {
    title: 'CAREER_TITLE_1',
    company: 'CAREER_COMPANY_1',
    dates: 'CAREER_DATES_1',
    desc: 'CAREER_DESC_1',
  },
  {
    title: 'CAREER_TITLE_2',
    company: 'CAREER_COMPANY_2',
    dates: 'CAREER_DATES_2',
    desc: 'CAREER_DESC_2',
  },
  {
    title: 'CAREER_TITLE_3',
    company: 'CAREER_COMPANY_3',
    dates: 'CAREER_DATES_3',
    desc: 'CAREER_DESC_3',
  },
  {
    title: 'CAREER_TITLE_4',
    company: 'CAREER_COMPANY_4',
    dates: 'CAREER_DATES_4',
    desc: 'CAREER_DESC_4',
  },
];

function Ladder() {
  // evenly spaced rungs between the rail margins, in viewBox units (0-800 tall)
  const usable = 800 - 60 - 60;
  const rungYs = Array.from({ length: RUNG_COUNT }, (_, i) => 60 + (i * usable) / (RUNG_COUNT - 1));

  return (
    <svg
      viewBox="0 0 100 800"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      style={{ filter: `drop-shadow(0 0 8px ${BLUE_GLOW})` }}
    >
      <defs>
        <linearGradient id="ladder-blue" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="100" y2="760">
          <stop offset="0%" stopColor="#7FDBFF" />
          <stop offset="45%" stopColor="#29B6F6" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
      </defs>

      {/* side rails */}
      <line x1="20" y1="40" x2="20" y2="760" stroke="url(#ladder-blue)" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="40" x2="80" y2="760" stroke="url(#ladder-blue)" strokeWidth="4" strokeLinecap="round" />

      {/* rungs */}
      {rungYs.map((y, i) => (
        <line
          key={i}
          x1="20"
          y1={y}
          x2="80"
          y2={y}
          stroke="url(#ladder-blue)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function CubeBackground() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(containerRef, { amount: 0 });

  // Drives the cube's playback rate from scroll speed: idle drift when still,
  // spins up while actively scrolling, eases back down when scrolling stops.
  // Never scrubs currentTime — only playbackRate — so playback stays continuous.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setRate = (rate: number) => {
      try {
        video.playbackRate = rate;
      } catch {
        // some browsers reject out-of-range playbackRate values
      }
    };

    if (reducedMotion || !inView) {
      setRate(CUBE_IDLE_RATE);
      return;
    }

    let currentRate = CUBE_IDLE_RATE;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let rafId: number;

    const tick = (time: number) => {
      const dt = Math.max(time - lastTime, 1);
      const scrollY = window.scrollY;
      const velocity = (Math.abs(scrollY - lastScrollY) / dt) * 16; // px per ~frame
      lastScrollY = scrollY;
      lastTime = time;

      const targetRate = Math.min(
        CUBE_MAX_RATE,
        Math.max(CUBE_IDLE_RATE, CUBE_IDLE_RATE + velocity * CUBE_VELOCITY_SENSITIVITY)
      );

      currentRate += (targetRate - currentRate) * CUBE_RATE_LERP;
      currentRate = Math.min(CUBE_MAX_RATE, Math.max(CUBE_IDLE_RATE, currentRate));
      setRate(currentRate);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, reducedMotion]);

  return (
    // Layout-only wrappers — no opacity/transform/filter/z-index on anything between
    // this and the section's own #0C0C0C background. Any of those would create a
    // stacking context that isolates the video's mix-blend-mode from the true page
    // background, making its dark frame render as an opaque box instead of dropping out.
    <div className="absolute inset-0 pointer-events-none">
      <div ref={containerRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={CUBE_VIDEO_SRC}
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            mixBlendMode: 'screen',
            opacity: 0.8,
            // crushes the clip's dark-blue marbled background toward true black so
            // screen blend can drop it out, while the bright neon cube stays punchy
            filter: 'brightness(1.15) contrast(1.35) saturate(1.1)',
          }}
        />

        {/* radial vignette — masks any leftover rectangular edge glow from the clip
            into the page background rather than leaving a visible hard edge */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 0%, transparent 38%, #0C0C0C 92%)',
          }}
        />
      </div>
    </div>
  );
}

function CareerCard({
  index,
  title,
  company,
  dates,
  desc,
  heading,
  fullScreen = true,
}: {
  index: number;
  title: string;
  company: string;
  dates: string;
  desc: string;
  heading?: ReactNode;
  fullScreen?: boolean;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={
        fullScreen
          ? 'relative z-10 pointer-events-none h-screen w-full flex flex-col justify-center px-6 sm:px-10 md:px-16'
          : 'relative z-10 pointer-events-none w-full'
      }
    >
      {/* pinned to the top of the block, clear of the cube's center so it never overlaps it */}
      {heading && (
        <div className="absolute top-8 sm:top-12 md:top-16 left-6 sm:left-10 md:left-16">
          {heading}
        </div>
      )}

      {/* no background/blur/border here — text sits directly over the cube video */}
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col gap-4 self-start"
      >
        <span
          className="font-black tracking-tight leading-none"
          style={{
            background: BLUE_GRADIENT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            filter: `drop-shadow(0 0 16px ${BLUE_GLOW})`,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <h3
          className="font-medium uppercase tracking-tight"
          style={{
            color: '#D7E2EA',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}
        >
          {title}
        </h3>

        <p
          className="font-light uppercase tracking-wide"
          style={{
            background: BLUE_GRADIENT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)',
            filter: `drop-shadow(0 0 10px ${BLUE_GLOW})`,
          }}
        >
          {company} — {dates}
        </p>

        <p
          className="font-light leading-relaxed"
          style={{
            color: '#D7E2EA',
            fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)',
            maxWidth: '640px',
            opacity: 0.85,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}
        >
          {desc}
        </p>
      </motion.div>
    </div>
  );
}

export default function CareerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // bottom of ladder (near last rung) -> top of ladder (near first rung)
  const rawTop = useTransform(
    scrollYProgress,
    [0, 1],
    [100 - RAIL_BOTTOM_MARGIN - 3, RAIL_TOP_MARGIN + 3]
  );
  const springTop = useSpring(rawTop, { stiffness: 120, damping: 25 });
  const topPercent = useTransform(springTop, (v) => `${v}%`);

  return (
    <section
      ref={sectionRef}
      id="career"
      className="relative h-[400vh] w-full"
      style={{ background: '#0C0C0C' }}
    >
      {/* full-bleed cube video, pinned behind the whole section. Sits directly on the
          section (no z-index on it or its wrappers) so its mix-blend-mode reads
          against the section's own #0C0C0C background; the content row below is
          explicitly raised with z-10 to stay on top. */}
      <CubeBackground />

      <div className="relative z-10 flex h-full w-full">
        {/* LEFT rail — sticky ladder + climbing person */}
        <div
          className="hidden sm:block sticky top-0 h-screen shrink-0"
          style={{ width: 'clamp(80px, 14vw, 200px)' }}
        >
          <div className="relative h-full w-full">
            <Ladder />
            <motion.div
              className="absolute left-1/2"
              style={{
                top: reducedMotion ? '50%' : topPercent,
                transform: 'translate(-50%, -50%)',
                color: '#29B6F6',
                filter: `drop-shadow(0 0 8px ${BLUE_GLOW})`,
              }}
            >
              <PersonStanding size={28} strokeWidth={2.2} />
            </motion.div>
          </div>
        </div>

        {/* RIGHT content column — 4 experiences */}
        <div className="flex-1 flex flex-col">
          {EXPERIENCES.map((exp, i) => (
            <CareerCard
              key={i}
              index={i}
              {...exp}
              heading={
                i === 0 ? (
                  <h2
                    className="hero-heading font-black uppercase leading-none tracking-tight"
                    style={{ fontSize: 'clamp(2rem, 6vw, 72px)' }}
                  >
                    Career
                  </h2>
                ) : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
