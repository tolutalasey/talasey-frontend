export const ASSISTANT_NAME = 'Tala';

export function greeting(hour: number): string {
  const time = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `${time}! I'm ${ASSISTANT_NAME}, Talasey's assistant. Ask me anything about paving, decking, pergolas and the rest of our range, or tell me about your garden and I'll help you find the right fit.`;
}

export const STARTERS = [
  'Help me choose paving',
  'Design a pergola',
  'How much will I need?',
  'Delivery and samples',
] as const;
