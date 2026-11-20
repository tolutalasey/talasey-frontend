import NextLink from 'next/link';
import { Fragment } from 'react';
import { blocks, type Inline } from '../rich-text';

function Text({ parts }: { parts: Inline[] }) {
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

interface Props {
  text: string;
  // Headings in the text sit one level under the heading around it.
  heading?: 'h2' | 'h3' | 'h4';
}

// Text written with the simple formatting in /content: paragraphs, ## headings, - bullets, links
// and bold.
export function RichText({ text, heading: Heading = 'h2' }: Props) {
  return blocks(text).map((block, index) =>
    block.kind === 'heading' ? (
      <Heading key={index}>{block.text}</Heading>
    ) : block.kind === 'list' ? (
      <ul key={index}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>
            <Text parts={item} />
          </li>
        ))}
      </ul>
    ) : (
      <p key={index}>
        <Text parts={block.parts} />
      </p>
    ),
  );
}
