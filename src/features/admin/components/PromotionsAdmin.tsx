import { Button } from '@/ui/Button/Button';
import { Checkbox } from '@/ui/Checkbox/Checkbox';
import { SelectField } from '@/ui/SelectField/SelectField';
import { Table } from '@/ui/Table/Table';
import { TextField } from '@/ui/TextField/TextField';
import { staffStyles as styles } from '@/features/staff';
import { londonLabel, toLondonTime } from '@/lib/london-time';
import { deletePromotion, savePromotion } from '../actions';
import {
  PROMOTION_KINDS,
  describePromotion,
  formFromPromotion,
  type PromotionFormValues,
} from '../promotion-form';
import type { Promotion } from '../types';

function statusOf(promotion: Promotion, now: Date): string {
  if (!promotion.active) return 'Switched off';
  if (new Date(promotion.startsAt) > now) return `Starts ${londonLabel(promotion.startsAt)}`;
  if (promotion.endsAt && new Date(promotion.endsAt) <= now) return 'Ended';
  if (promotion.maxUses !== null && promotion.uses >= promotion.maxUses) return 'Used up';
  return promotion.endsAt ? `Running until ${londonLabel(promotion.endsAt)}` : 'Running';
}

function PromotionFields({ values }: { values: PromotionFormValues }) {
  return (
    <>
      <div className={styles.grid}>
        <TextField label="Name" name="name" defaultValue={values.name} isRequired />
        <TextField
          label="Code"
          name="code"
          defaultValue={values.code}
          description="Leave blank to apply it to every basket that qualifies"
        />
        <SelectField
          label="What they get"
          name="kind"
          defaultValue={values.kind}
          options={[...PROMOTION_KINDS]}
        />
        <TextField
          label="How much off"
          name="value"
          defaultValue={values.value}
          inputMode="decimal"
          description="A percentage, or pounds. Not needed for free delivery."
        />
        <TextField
          label="Minimum spend on products (£)"
          name="minSpend"
          defaultValue={values.minSpend}
          inputMode="decimal"
        />
        <TextField
          label="Times it can be used"
          name="maxUses"
          defaultValue={values.maxUses}
          inputMode="numeric"
          description="Leave blank for no limit"
        />
        <TextField
          label="Starts (UK time)"
          name="startsAt"
          type="datetime-local"
          defaultValue={values.startsAt}
        />
        <TextField
          label="Ends (UK time)"
          name="endsAt"
          type="datetime-local"
          defaultValue={values.endsAt}
          description="Leave blank to keep it running"
        />
      </div>
      <Checkbox name="active" defaultSelected={values.active}>
        Switched on
      </Checkbox>
    </>
  );
}

export function PromotionsAdmin({ promotions, now }: { promotions: Promotion[]; now: Date }) {
  const blank: PromotionFormValues = {
    name: '',
    code: '',
    kind: 'percent',
    value: '',
    minSpend: '',
    startsAt: toLondonTime(now),
    endsAt: '',
    maxUses: '',
    active: true,
  };

  return (
    <>
      <p className={styles.muted}>
        Shoppers get the best money-off promotion they qualify for, never two at once. Free delivery
        adds on top.
      </p>
      {promotions.length === 0 ? (
        <p className={styles.muted}>No promotions yet.</p>
      ) : (
        <Table caption="Promotions">
          <thead>
            <tr>
              <th scope="col">Promotion</th>
              <th scope="col">Code</th>
              <th scope="col">Offer</th>
              <th scope="col">Used</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promotion) => (
              <tr key={promotion.id}>
                <th scope="row">{promotion.name}</th>
                <td>{promotion.code ?? <span className={styles.muted}>Automatic</span>}</td>
                <td>{describePromotion(promotion)}</td>
                <td>
                  {promotion.uses}
                  {promotion.maxUses !== null && ` of ${promotion.maxUses}`}
                </td>
                <td>{statusOf(promotion, now)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <form action={savePromotion} className={`${styles.panel} ${styles.stack}`}>
        <h2>Add a promotion</h2>
        <PromotionFields values={blank} />
        <div className={styles.actions}>
          <Button type="submit">Add promotion</Button>
        </div>
      </form>

      {promotions.map((promotion) => (
        <details key={promotion.id} className={styles.panel}>
          <summary>Change {promotion.name}</summary>
          <form action={savePromotion} className={styles.stack}>
            <input type="hidden" name="id" value={promotion.id} />
            <PromotionFields values={formFromPromotion(promotion)} />
            <div className={styles.actions}>
              <Button type="submit">Save</Button>
            </div>
          </form>
          <form action={deletePromotion}>
            <input type="hidden" name="id" value={promotion.id} />
            <Button type="submit" variant="secondary">
              Remove {promotion.name}
            </Button>
          </form>
        </details>
      ))}
    </>
  );
}
