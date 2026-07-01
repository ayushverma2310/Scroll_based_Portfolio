import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.loop = true;
    audio.volume = 0.4;
    audio.muted = true;
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      audio.muted = false;
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Unable to start background audio', error);
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/background.mp3" loop muted />
      <button
        type="button"
        onClick={() => void togglePlayback()}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#D7E2EA]/30 bg-black/40 text-[#D7E2EA] backdrop-blur transition hover:bg-[#D7E2EA]/10"
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
}
