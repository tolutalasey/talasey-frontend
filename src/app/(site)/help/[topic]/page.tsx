import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFaqs, getHelpGuides, HELP_TOPICS, HelpTopicPage, helpPath } from '@/features/content';
import { pageMetadata } from '@/lib/seo';

type Props = PageProps<'/help/[topic]'>;

const topicFor = (slug: string) => HELP_TOPICS.find((topic) => topic.slug === slug);

export function generateStaticParams() {
  return HELP_TOPICS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = topicFor((await params).topic);
  if (!topic) notFound();
  return pageMetadata({
    title: `${topic.name}: help and answers | Talasey`,
    description: `Answers to common questions about ${topic.name.toLowerCase()} at Talasey, with guides and how to contact us.`,
    path: helpPath(topic),
  });
}

export default async function HelpTopic({ params }: Props) {
  const topic = topicFor((await params).topic);
  if (!topic) notFound();
  const [faqs, guides] = await Promise.all([getFaqs(topic.faqTopic), getHelpGuides(topic)]);
  return <HelpTopicPage topic={topic} faqs={faqs} guides={guides} />;
}
