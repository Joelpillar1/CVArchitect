import { useState, useEffect } from 'react';

export const DEFAULT_AGENT_PROMPTS = [
  "Upload your resume...",
  "Paste job description...",
  "Tailor resume for target role...",
  "Optimize bullets for ATS screening...",
  "Fix weak bullet points with impact metrics...",
  "Generate a tailored cover letter..."
];

/**
 * Custom React hook that produces a typewriter / streaming text animation
 * through an array of prompt strings. Perfect for empty-state input placeholders.
 */
export function useStreamingPlaceholder(
  prompts: string[] = DEFAULT_AGENT_PROMPTS,
  typingSpeed = 45,
  deletingSpeed = 20,
  pauseDuration = 2000
) {
  const [displayedText, setDisplayedText] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPrompt = prompts[promptIndex % prompts.length];

    if (!isDeleting) {
      if (displayedText.length < currentPrompt.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentPrompt.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentPrompt.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setPromptIndex((prev) => (prev + 1) % prompts.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, promptIndex, isDeleting, prompts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayedText;
}
