import { addSampleToBasket } from '@/features/checkout';

// "Order sample" on a product card: puts that sample in the bag and opens the bag.
export function SampleButton({ offerId, name }: { offerId: string; name: string }) {
  return (
    <form action={addSampleToBasket}>
      <input type="hidden" name="offerId" value={offerId} />
      <input type="hidden" name="next" value="/basket/" />
      <button type="submit" aria-label={`Order a sample of ${name}`}>
        Order sample
      </button>
    </form>
  );
}
