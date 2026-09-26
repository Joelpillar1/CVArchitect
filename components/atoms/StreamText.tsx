import { useEffect, useState } from 'react';

interface StreamTextProps {
  text: string;
  onProgress?: () => void;
  onDone?: () => void;
  speed?: number;
}

export function StreamText({
  text,
  onProgress,
  onDone,
  speed = 16,
}: StreamTextProps) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayed('');
    if (!text) {
      if (onDone) onDone();
      return;
    }

    const timer = setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (onProgress) onProgress();
      if (index >= text.length) {
        clearInterval(timer);
        if (onDone) onDone();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onProgress, onDone]);

  return <>{displayed}</>;
}
