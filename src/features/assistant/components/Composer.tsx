'use client';

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { CloseIcon, MicIcon, PlusIcon, SendIcon } from '@/ui/icons';
import { cx } from '@/ui/cx';
import { preparePhoto, type ChosenPhoto } from '../photo';
import { canListen, listen, type Recogniser } from '../speech';
import { MAX_MESSAGE_CHARS } from '../use-chat';
import styles from './Assistant.module.css';

interface Props {
  onSend: (text: string, photo?: ChosenPhoto) => void;
  busy: boolean;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
}

// The message box at the foot of the panel, with + to add a photo. Enter sends; Shift+Enter
// starts a new line.
export function Composer({ onSend, busy, inputRef }: Props) {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<ChosenPhoto | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const [voice] = useState(canListen);
  const recogniser = useRef<Recogniser | null>(null);
  const [listening, setListening] = useState(false);
  const ready = (text.trim().length > 0 || photo !== null) && !busy;

  const stopListening = () => {
    recogniser.current?.stop();
    recogniser.current = null;
    setListening(false);
  };

  const toggleListening = () => {
    if (listening) return stopListening();
    setProblem(null);
    const before = text.trim();
    recogniser.current = listen(
      (words) => setText(before ? `${before} ${words}` : words),
      (stopped) => {
        recogniser.current = null;
        setListening(false);
        if (stopped) setProblem(stopped);
      },
    );
    setListening(recogniser.current !== null);
  };

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!ready) return;
    stopListening();
    onSend(text, photo ?? undefined);
    setText('');
    setPhoto(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) submit(event);
  };

  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setProblem(null);
    try {
      setPhoto(await preparePhoto(file));
      inputRef?.current?.focus();
    } catch {
      setProblem("That photo couldn't be opened. Try a JPEG or PNG.");
    }
  };

  return (
    <form className={styles.composerWrap} onSubmit={submit}>
      {(photo || problem) && (
        <div className={styles.attachment}>
          {photo && (
            <span className={styles.attachedPhoto}>
              {/* eslint-disable-next-line @next/next/no-img-element -- a local preview */}
              <img src={photo.thumb} alt="The photo you're sending" />
              <button type="button" onClick={() => setPhoto(null)} aria-label="Remove the photo">
                <CloseIcon width={14} height={14} />
              </button>
            </span>
          )}
          {problem && (
            <span className={styles.cardProblem} role="alert">
              {problem}
            </span>
          )}
        </div>
      )}
      <div className={styles.composer}>
        <button
          type="button"
          className={styles.attach}
          onClick={() => picker.current?.click()}
          disabled={busy}
          aria-label="Add a photo"
          title="Add a photo of your garden"
        >
          <PlusIcon />
        </button>
        <input
          ref={picker}
          type="file"
          accept="image/*"
          className={styles.hidden}
          tabIndex={-1}
          onChange={choose}
        />
        <label className={styles.composerField}>
          <span className={styles.hidden}>Your message</span>
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            maxLength={MAX_MESSAGE_CHARS}
            placeholder={
              listening
                ? 'Listening…'
                : photo
                  ? 'Say something about it (optional)…'
                  : 'Write a message…'
            }
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </label>
        {voice && (
          <button
            type="button"
            className={cx(styles.attach, listening && styles.listening)}
            onClick={toggleListening}
            disabled={busy}
            aria-pressed={listening}
            aria-label={listening ? 'Stop listening' : 'Talk instead of typing'}
            title={listening ? 'Stop listening' : 'Talk instead of typing'}
          >
            <MicIcon />
          </button>
        )}
        <button
          type="submit"
          className={cx(styles.send, ready && styles.sendReady)}
          disabled={!ready}
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
}
