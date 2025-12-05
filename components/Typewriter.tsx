import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 10, 
  onComplete,
  className = "" 
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  
  useEffect(() => {
    // Reset state when text changes
    setDisplayedText("");
    indexRef.current = 0;
    
    if (!text) return;

    const intervalId = setInterval(() => {
      // Increment index
      indexRef.current += 1;
      
      // Update slice
      if (indexRef.current > text.length) {
        clearInterval(intervalId);
        onComplete?.();
      } else {
        setDisplayedText(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  return <p className={className}>{displayedText}</p>;
};