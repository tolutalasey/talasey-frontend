'use client';

import Form from 'next/form';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AREA_PARAM } from '../answers';
import type { FinderQuestion } from '../finder';
import { PRODUCT_FINDER_PATH } from '../paths';
import styles from './ProductFinder.module.css';

interface Props {
  questions: FinderQuestion[];
  // The answers already given, by question, when changing them on the results page.
  values: Record<string, string>;
  area: string;
  // One question at a time, or every question at once.
  stepped: boolean;
}

const noChanges = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    noChanges,
    () => true,
    () => false,
  );

// A plain form that sends the answers in the address, so it works without JavaScript. With it,
// the questions come one at a time and choosing an answer moves on to the next.
export function FinderForm({ questions, values, area, stepped }: Props) {
  const hydrated = useHydrated();
  const oneAtATime = stepped && hydrated;
  const steps = questions.length + 1;
  const [step, setStep] = useState(0);
  const headings = useRef<(HTMLElement | null)[]>([]);
  const moved = useRef(false);

  useEffect(() => {
    if (moved.current) headings.current[step]?.focus();
  }, [step]);

  const goTo = (next: number) => {
    moved.current = true;
    setStep(Math.max(0, Math.min(next, steps - 1)));
  };
  const showing = (index: number) => !oneAtATime || index === step;

  return (
    <Form action={PRODUCT_FINDER_PATH} className={styles.form}>
      {oneAtATime && (
        <div className={styles.progress}>
          <p aria-live="polite">
            Question {step + 1} of {steps}
          </p>
          <div className={styles.bar} aria-hidden="true">
            <span style={{ width: `${((step + 1) / steps) * 100}%` }} />
          </div>
        </div>
      )}

      {questions.map((question, index) => (
        <fieldset key={question.key} className={`frame ${styles.step}`} hidden={!showing(index)}>
          <legend
            ref={(element) => {
              headings.current[index] = element;
            }}
            tabIndex={-1}
          >
            {question.title}
          </legend>
          <div className={styles.cards}>
            {question.answers.map((answer) => (
              <label key={answer.value} className={styles.card}>
                <input
                  type="radio"
                  name={question.key}
                  value={answer.value}
                  defaultChecked={values[question.key] === answer.value}
                  onChange={oneAtATime ? () => goTo(index + 1) : undefined}
                />
                <strong>{answer.label}</strong>
                {answer.hint && <small>{answer.hint}</small>}
              </label>
            ))}
          </div>
          {oneAtATime && (
            <div className={styles.stepActions}>
              {index > 0 && (
                <button type="button" className="button-secondary" onClick={() => goTo(index - 1)}>
                  Back
                </button>
              )}
              <button type="button" className={styles.skip} onClick={() => goTo(index + 1)}>
                Skip this question
              </button>
            </div>
          )}
        </fieldset>
      ))}

      <fieldset className={`frame ${styles.step}`} hidden={!showing(questions.length)}>
        <legend
          ref={(element) => {
            headings.current[questions.length] = element;
          }}
          tabIndex={-1}
        >
          Roughly how big is the space?
        </legend>
        <label className={styles.field}>
          Area in m² (optional)
          <input
            name={AREA_PARAM}
            inputMode="decimal"
            defaultValue={area}
            aria-describedby="finder-area-help"
          />
        </label>
        <p id="finder-area-help" className={styles.help}>
          We will work out how much you need on each product. Leave it empty if you are not sure or
          are buying things like lighting.
        </p>
        <div className={styles.stepActions}>
          {oneAtATime && (
            <button type="button" className="button-secondary" onClick={() => goTo(step - 1)}>
              Back
            </button>
          )}
          <button type="submit" className="button">
            Show my results
          </button>
        </div>
      </fieldset>
    </Form>
  );
}
