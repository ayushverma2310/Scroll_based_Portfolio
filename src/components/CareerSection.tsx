import { useRef, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { PersonStanding } from 'lucide-react';

const GOLD_GRADIENT =
  'linear-gradient(135deg, #FBE9A8 0%, #D4AF37 22%, #8A6D1D 48%, #F7E39C 68%, #B8860B 100%)';

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
      style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.55))' }}
    >
      <defs>
        <linearGradient id="ladder-gold" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="100" y2="760">
          <stop offset="0%" stopColor="#FBE9A8" />
          <stop offset="22%" stopColor="#D4AF37" />
          <stop offset="48%" stopColor="#8A6D1D" />
          <stop offset="68%" stopColor="#F7E39C" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>

      {/* side rails */}
      <line x1="20" y1="40" x2="20" y2="760" stroke="url(#ladder-gold)" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="40" x2="80" y2="760" stroke="url(#ladder-gold)" strokeWidth="4" strokeLinecap="round" />

      {/* rungs */}
      {rungYs.map((y, i) => (
        <line
          key={i}
          x1="20"
          y1={y}
          x2="80"
          y2={y}
          stroke="url(#ladder-gold)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
    </svg>
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
          ? 'h-screen w-full flex flex-col justify-center px-6 sm:px-10 md:px-16'
          : 'w-full'
      }
    >
      {heading}
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col gap-4"
      >
        <span
          className="font-black tracking-tight leading-none"
          style={{
            background: GOLD_GRADIENT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            opacity: 0.85,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <h3
          className="font-medium uppercase tracking-tight"
          style={{ color: '#D7E2EA', fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
        >
          {title}
        </h3>

        <p
          className="font-light uppercase tracking-wide"
          style={{ color: '#D4AF37', fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)' }}
        >
          {company} — {dates}
        </p>

        <p
          className="font-light leading-relaxed"
          style={{ color: '#D7E2EA', fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)', maxWidth: '640px', opacity: 0.85 }}
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
      <div className="flex h-full w-full">
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
                color: '#D4AF37',
                filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.7))',
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
                    className="hero-heading font-black uppercase leading-none tracking-tight mb-8"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
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
