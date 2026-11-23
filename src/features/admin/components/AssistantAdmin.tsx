import NextLink from 'next/link';
import { Button } from '@/ui/Button/Button';
import {
  Badge,
  ChatIcon,
  ChevronRightIcon,
  EmptyState,
  QuestionIcon,
  staffStyles as styles,
} from '@/features/staff';
import { switchAssistant } from '../actions';
import type {
  AssistantConversationSummary,
  AssistantExchange,
  AssistantGap,
  AssistantStatus,
  AssistantUsage,
} from '../types';

const when = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

const number = new Intl.NumberFormat('en-GB');
const dollars = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'USD' });

const conversationPath = (id: string) => `/admin/assistant/${id}/`;

export function AssistantSwitch({ status }: { status: AssistantStatus }) {
  if (!status.configured) {
    return (
      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Not set up yet</h2>
        <p className={styles.panelLead}>
          Tala needs an Anthropic API key. Add ANTHROPIC_API_KEY to the backend&apos;s environment
          and redeploy, then switch it on here.
        </p>
      </section>
    );
  }
  return (
    <section className={styles.panel}>
      <form action={switchAssistant} className={styles.row}>
        <input type="hidden" name="on" value={status.on ? 'no' : 'yes'} />
        <span className={styles.listMain}>
          <strong>{status.on ? 'Tala is on' : 'Tala is off'}</strong>
          <span className={styles.listSub}>
            {status.on
              ? `The chat shows in the corner of every page. Model: ${status.model}.`
              : 'The chat button is hidden from the site.'}
          </span>
        </span>
        <Button type="submit" variant={status.on ? 'secondary' : 'primary'}>
          {status.on ? 'Switch off' : 'Switch on'}
        </Button>
      </form>
    </section>
  );
}

export function AssistantStats({ usage }: { usage: AssistantUsage }) {
  const tokens = usage.inputTokens + usage.cachedTokens + usage.outputTokens;
  return (
    <dl className={styles.stats}>
      <div className={`${styles.stat} ${styles.statFeature}`}>
        <dt>Conversations</dt>
        <dd>{number.format(usage.conversations)}</dd>
        <span className={styles.statNote}>
          {number.format(usage.messages)} {usage.messages === 1 ? 'message' : 'messages'}
        </span>
      </div>
      <div className={styles.stat}>
        <dt>Cost</dt>
        <dd>{usage.costUsd === null ? '–' : dollars.format(usage.costUsd)}</dd>
        <span className={styles.statNote}>
          {number.format(tokens)} tokens
          {usage.costUsd === null && ', set the model price to see the cost'}
        </span>
      </div>
      <div className={styles.stat}>
        <dt>Couldn&apos;t answer</dt>
        <dd>{number.format(usage.gaps)}</dd>
        <span className={styles.statNote}>
          {number.format(usage.failed)} {usage.failed === 1 ? 'reply' : 'replies'} failed
        </span>
      </div>
      <div className={styles.stat}>
        <dt>Passed to the team</dt>
        <dd>{number.format(usage.handedOff)}</dd>
        <span className={styles.statNote}>Sent as enquiries</span>
      </div>
    </dl>
  );
}

export function AssistantGaps({ gaps }: { gaps: AssistantGap[] }) {
  if (gaps.length === 0) {
    return (
      <EmptyState icon={<QuestionIcon />} title="Nothing missing">
        When Tala can&apos;t answer from the site&apos;s content, the question shows here so the
        content can be added.
      </EmptyState>
    );
  }
  return (
    <ul className={styles.list}>
      {gaps.map((gap) => (
        <li key={gap.id} className={styles.listRow}>
          <span className={styles.listMain}>
            <NextLink href={conversationPath(gap.conversationId)} className={styles.listTitle}>
              {gap.gap}
            </NextLink>
            <span className={styles.listSub}>
              “{gap.question}” · {gap.page ?? 'unknown page'} · {when(gap.createdAt)}
            </span>
          </span>
          <ChevronRightIcon className={styles.chev} />
        </li>
      ))}
    </ul>
  );
}

export function AssistantConversations({
  conversations,
}: {
  conversations: AssistantConversationSummary[];
}) {
  if (conversations.length === 0) {
    return (
      <EmptyState icon={<ChatIcon />} title="No conversations yet">
        Chats with Tala appear here for 90 days.
      </EmptyState>
    );
  }
  return (
    <ul className={styles.list}>
      {conversations.map((conversation) => (
        <li key={conversation.id} className={styles.listRow}>
          <span className={styles.listMain}>
            <NextLink href={conversationPath(conversation.id)} className={styles.listTitle}>
              {conversation.firstQuestion}
            </NextLink>
            <span className={styles.listSub}>
              {when(conversation.lastAt)} · {conversation.messages}{' '}
              {conversation.messages === 1 ? 'message' : 'messages'}
              {conversation.photos > 0 &&
                ` · ${conversation.photos} ${conversation.photos === 1 ? 'photo' : 'photos'}`}
              {conversation.pages[0] && ` · ${conversation.pages[0]}`}
            </span>
          </span>
          <span className={styles.listEnd}>
            {conversation.handedOff && <Badge tone="good">Passed to team</Badge>}
            {conversation.gaps > 0 && <Badge tone="warn">Gap</Badge>}
          </span>
          <ChevronRightIcon className={styles.chev} />
        </li>
      ))}
    </ul>
  );
}

export function AssistantTranscript({ exchanges }: { exchanges: AssistantExchange[] }) {
  return (
    <ol className={styles.list}>
      {exchanges.map((exchange) => (
        <li key={exchange.id} className={styles.stack}>
          <p className={styles.listSub}>
            {when(exchange.createdAt)}
            {exchange.page && ` · ${exchange.page}`}
            {exchange.hadPhoto && ' · sent a photo'}
          </p>
          <p>
            <strong>Visitor:</strong> {exchange.question}
          </p>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            <strong>Tala:</strong>{' '}
            {exchange.failed ? <em>No reply (it failed)</em> : exchange.reply}
          </p>
          {exchange.products.length > 0 && (
            <p className={styles.listSub}>Cards: {exchange.products.join(', ')}</p>
          )}
          {exchange.gap && <Badge tone="warn">Couldn&apos;t answer: {exchange.gap}</Badge>}
          {exchange.handedOff && <Badge tone="good">Passed to the team</Badge>}
        </li>
      ))}
    </ol>
  );
}
