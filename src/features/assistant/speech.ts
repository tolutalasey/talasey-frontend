// Speaking instead of typing, with the browser's own speech recognition. Chrome, Edge and Safari
// have it; elsewhere the mic button doesn't show.

interface SpeechResult {
  readonly length: number;
  [index: number]: { transcript: string };
}

interface SpeechEvent {
  readonly results: { readonly length: number; [index: number]: SpeechResult };
}

export interface Recogniser {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start(): void;
  stop(): void;
}

type RecogniserClass = new () => Recogniser;

function recogniserClass(): RecogniserClass | null {
  if (typeof window === 'undefined') return null;
  const scope = window as unknown as {
    SpeechRecognition?: RecogniserClass;
    webkitSpeechRecognition?: RecogniserClass;
  };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

export const canListen = () => recogniserClass() !== null;

// Starts listening and passes on everything heard so far each time it changes.
export function listen(onWords: (words: string) => void, onStop: (problem?: string) => void) {
  const Recognition = recogniserClass();
  if (!Recognition) return null;
  const recogniser = new Recognition();
  recogniser.lang = 'en-GB';
  recogniser.interimResults = true;
  recogniser.continuous = false;
  recogniser.onresult = (event) => {
    let words = '';
    for (let index = 0; index < event.results.length; index++) {
      words += event.results[index]?.[0]?.transcript ?? '';
    }
    onWords(words);
  };
  recogniser.onerror = (event) =>
    onStop(
      event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? 'Allow the microphone in your browser to talk to Tala.'
        : undefined,
    );
  recogniser.onend = () => onStop();
  recogniser.start();
  return recogniser;
}
