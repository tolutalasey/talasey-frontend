import NextLink from 'next/link';
import { Fragment } from 'react';
import { blocks, type Inline } from '@/lib/rich-text';
import { withListBreaks } from '../message-text';

function Parts({ parts }: { parts: Inline[] }) {
  return parts.map((part, index) => (
    <Fragment key={index}>
      {part.kind === 'link' ? (
        <NextLink href={part.href}>{part.text}</NextLink>
      ) : part.kind === 'bold' ? (
        <strong>{part.text}</strong>
      ) : (
        part.text
      )}
    </Fragment>
  ));
}

// The assistant's reply with its simple formatting: paragraphs, bullets, bold and links. Text is
// never treated as HTML.
export function MessageText({ text }: { text: string }) {
  return blocks(withListBreaks(text)).map((block, index) =>
    block.kind === 'list' ? (
      <ul key={index}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>
            <Parts parts={item} />
          </li>
        ))}
      </ul>
    ) : block.kind === 'paragraph' ? (
      <p key={index}>
        <Parts parts={block.parts} />
      </p>
    ) : block.kind === 'heading' ? (
      <p key={index}>
        <strong>{block.text}</strong>
      </p>
    ) : null,
  );
}
