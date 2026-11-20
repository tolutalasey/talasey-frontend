import { FREE_SAMPLES } from '../samples';
import styles from './Samples.module.css';

const STEPS = [
  { title: 'Pick your range', text: 'Choose by material, colour or finish across our range.' },
  {
    title: `Add up to ${FREE_SAMPLES} free`,
    text: 'Build your sample bag — extra pieces are just £5 each.',
  },
  {
    title: 'Delivered to your door',
    text: 'Flat £5 delivery on samples on their own, UK mainland addresses.',
  },
  {
    title: 'Order with confidence',
    text: 'See the true colour and finish in your own light, before you buy.',
  },
];

const FAQS = [
  {
    question: 'Why isn’t Classicstone available as a sample?',
    answer:
      'Natural stone is characteristically subject to colour variation and markings, so a single sample can’t represent the full blend. We recommend visiting a stockist display for this range.',
  },
  {
    question: 'Can I order samples from different ranges at once?',
    answer: 'Yes — add samples from any range to one bag.',
  },
  {
    question: 'What if the colour looks different from the website?',
    answer:
      'That’s exactly what the sample is for — natural materials vary by batch and light. Always confirm against the physical piece before a full order.',
  },
];

// The current site's sample service page, under the samples: how it works and common questions.
export function SampleServiceInfo() {
  return (
    <>
      <section className={styles.info} aria-labelledby="sample-steps">
        <p className="eyebrow">Process</p>
        <h2 id="sample-steps">From swatch to spec, in four steps</h2>
        <ol className={styles.infoSteps}>
          {STEPS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={styles.info} aria-labelledby="sample-questions">
        <p className="eyebrow">Good to know</p>
        <h2 id="sample-questions">Sample service questions</h2>
        {FAQS.map((faq) => (
          <details key={faq.question} className={styles.infoQuestion}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>
    </>
  );
}
