import { Instagram, Youtube, Linkedin, Twitter, Mail } from 'lucide-react';
import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import ContactButton from './ContactButton';

const ABOUT_TEXT =
  'PLACEHOLDER_ABOUT_TEXT — passionate filmmaker and visual storyteller with a keen eye for compelling narratives and cinematic craft.';

const SOCIALS = [
  { icon: Instagram, href: 'https://PLACEHOLDER_INSTAGRAM', label: 'Instagram' },
  { icon: Youtube, href: 'https://PLACEHOLDER_YOUTUBE', label: 'YouTube' },
  { icon: Linkedin, href: 'https://PLACEHOLDER_LINKEDIN', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://PLACEHOLDER_X', label: 'X' },
  { icon: Mail, href: 'mailto:PLACEHOLDER_EMAIL', label: 'Email' },
];

export default function AboutSection() {
  return (
    <section
      id="about-section"
      className="-mt-10 sm:-mt-12 md:-mt-14 relative z-10 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-24 flex flex-col items-center gap-12"
      style={{ background: '#0c0c0c' }}
    >
      {/* heading */}
      <FadeIn>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          About me
        </h2>
      </FadeIn>

      {/* about text */}
      <FadeIn delay={0.1}>
        <AnimatedText
          text={ABOUT_TEXT}
          className="font-light text-center leading-relaxed"
          style={{
            color: '#D7E2EA',
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            maxWidth: '620px',
          }}
        />
      </FadeIn>

      {/* social row */}
      <FadeIn delay={0.15}>
        <div className="flex items-center gap-6 sm:gap-8">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="rounded-full p-3 sm:p-4 transition-colors duration-200 hover:bg-[#D7E2EA]/10"
              style={{ border: '2px solid #D7E2EA', color: '#D7E2EA', display: 'flex' }}
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </FadeIn>

      {/* contact CTA */}
      <FadeIn delay={0.2}>
        <ContactButton />
      </FadeIn>
    </section>
  );
}
