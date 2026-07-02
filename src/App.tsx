import HeroSection from './components/HeroSection';
import BioSection from './components/BioSection';
import WorkSection from './components/WorkSection';
import CareerSection from './components/CareerSection';
import AboutSection from './components/AboutSection';
import MusicToggle from './components/MusicToggle';

export default function App() {
  return (
    <div
      style={{
        background: '#0c0c0c',
        fontFamily: "'Kanit', sans-serif",
        overflowX: 'clip',
      }}
    >
      <HeroSection />
      <BioSection />
      <WorkSection />
      <CareerSection />
      <AboutSection />
      <MusicToggle />
    </div>
  );
}
