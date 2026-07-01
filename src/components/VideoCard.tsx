import { useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface VideoCardProps {
  src: string;
  title: string;
  poster?: string;
}

export default function VideoCard({ src, title, poster }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);

  const handlePlay = () => {
    videoRef.current?.play();
    setPaused(false);
  };

  const handlePause = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPaused(true);
  };

  const handleTouch = () => {
    if (paused) {
      handlePlay();
    } else {
      handlePause();
    }
  };

  return (
    <div
      className="rounded-[32px] sm:rounded-[40px] md:rounded-[48px] p-3 sm:p-4 overflow-hidden"
      style={{ background: '#0c0c0c', border: '2px solid #D7E2EA' }}
    >
      <div
        className="relative"
        onMouseEnter={handlePlay}
        onMouseLeave={handlePause}
        onTouchEnd={handleTouch}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full aspect-video object-cover rounded-[24px] sm:rounded-[32px]"
        />
        {paused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-[24px] sm:rounded-[32px]">
            <div
              className="rounded-full p-4"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >
              <Play size={32} color="#D7E2EA" fill="#D7E2EA" />
            </div>
          </div>
        )}
      </div>
      <p
        className="mt-4 uppercase tracking-tight font-medium"
        style={{
          color: '#D7E2EA',
          fontSize: 'clamp(1rem, 2.2vw, 1.6rem)',
        }}
      >
        {title}
      </p>
    </div>
  );
}
