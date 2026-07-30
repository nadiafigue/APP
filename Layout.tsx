
import React, { useState, useEffect, useCallback } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  label?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, className, label }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'es-ES';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  if (!recognition) return null;

  return (
    <button
      onClick={toggleListening}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
      } ${className}`}
      title={isListening ? 'Detener escucha' : 'Hablar'}
    >
      <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
      {label && <span>{label}</span>}
    </button>
  );
};

export default VoiceInput;
