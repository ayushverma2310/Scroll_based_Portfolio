import AnimatedText from './AnimatedText';
import FadeIn from './FadeIn';
import ContactButton from './ContactButton';

const BIO_1 =
  'PLACEHOLDER_BIO_PARAGRAPH_1 — a passionate creator, storyteller, and visual artist dedicated to crafting compelling narratives through every frame.';

const BIO_2 =
  'PLACEHOLDER_BIO_PARAGRAPH_2 — more about my journey, inspirations, and the work that drives me forward.';

export default function BioSection() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24"
      style={{ background: '#0c0c0c' }}
    >
      <div
        className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 w-full"
        style={{ maxWidth: '800px' }}
      >
        {/* heading */}
        <div className="overflow-hidden w-full text-center">
          <FadeIn delay={0.15} y={40}>
            <h1
              className="hero-heading font-black uppercase tracking-tight leading-none text-center"
              style={{ fontSize: 'clamp(2.5rem, 9vw, 130px)' }}
            >
              Hi, i am<br />prateeshta sinha
            </h1>
          </FadeIn>
        </div>

        {/* bio paragraphs */}
        <div className="flex flex-col items-center gap-8 w-full">
          <AnimatedText
            text={BIO_1}
            className="font-medium text-center leading-relaxed"
            style={{
              color: '#D7E2EA',
              fontSize: 'clamp(1rem, 2vw, 1.35rem)',
              maxWidth: '620px',
            }}
          />
          <AnimatedText
            text={BIO_2}
            className="font-medium text-center leading-relaxed"
            style={{
              color: '#D7E2EA',
              fontSize: 'clamp(1rem, 2vw, 1.35rem)',
              maxWidth: '620px',
            }}
          />
        </div>

        {/* contact CTA */}
        <div className="mt-4 sm:mt-6">
          <FadeIn delay={0.2}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
