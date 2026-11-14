import { Button } from '@/ui/Button/Button';
import { Checkbox } from '@/ui/Checkbox/Checkbox';
import { SelectField } from '@/ui/SelectField/SelectField';
import { TextField } from '@/ui/TextField/TextField';
import {
  Badge,
  EmptyState,
  PencilIcon,
  staffStyles as styles,
  TagIcon,
  TrashIcon,
  type BadgeTone,
} from '@/features/staff';
import { londonLabel, toLondonTime } from '@/lib/london-time';
import { deletePromotion, savePromotion } from '../actions';
import {
  PROMOTION_KINDS,
  describePromotion,
  formFromPromotion,
  type PromotionFormValues,
} from '../promotion-form';
import type { Promotion } from '../types';

function toneOf(promotion: Promotion, now: Date): BadgeTone {
  if (!promotion.active) return 'neutral';
  if (new Date(promotion.startsAt) > now) return 'info';
  if (promotion.endsAt && new Date(promotion.endsAt) <= now) return 'neutral';
  if (promotion.maxUses !== null && promotion.uses >= promotion.maxUses) return 'warn';
  return 'good';
}

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
      <div className={styles.fields3}>
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
    <div className={styles.stack}>
      <section className={`${styles.panel} ${styles.flush}`} aria-labelledby="promotions">
        <div className={styles.toolbar}>
          <div className={styles.listMain}>
            <h2 id="promotions" className={styles.panelTitle}>
              Promotions
            </h2>
            <span className={styles.listSub}>
              Shoppers get the best money-off promotion they qualify for, never two at once. Free
              delivery adds on top.
            </span>
          </div>
          <span className={styles.count}>
            {promotions.filter((promotion) => toneOf(promotion, now) === 'good').length} running
          </span>
        </div>
        {promotions.length === 0 ? (
          <EmptyState icon={<TagIcon />} title="No promotions yet">
            Add one below. It can start now or at a time you choose.
          </EmptyState>
        ) : (
          <ul className={styles.list}>
            {promotions.map((promotion) => (
              <li key={promotion.id}>
                <details className={styles.person}>
                  <summary className={styles.personRow}>
                    <span className={styles.docIcon} aria-hidden="true">
                      <TagIcon />
                    </span>
                    <span className={styles.listMain}>
                      <strong>{promotion.name}</strong>
                      <span className={styles.listSub}>
                        {describePromotion(promotion)} · Used {promotion.uses}
                        {promotion.maxUses !== null && ` of ${promotion.maxUses}`}
                      </span>
                    </span>
                    <span className={styles.listEnd}>
                      <code className={styles.code}>{promotion.code ?? 'Automatic'}</code>
                      <Badge tone={toneOf(promotion, now)}>{statusOf(promotion, now)}</Badge>
                      <span className={styles.editHint}>
                        <PencilIcon />
                        Edit
                      </span>
                    </span>
                  </summary>
                  <div className={styles.personForm}>
                    <form action={savePromotion} className={styles.stack}>
                      <input type="hidden" name="id" value={promotion.id} />
                      <PromotionFields values={formFromPromotion(promotion)} />
                      <div className={styles.actions}>
                        <Button type="submit">Save changes</Button>
                      </div>
                    </form>
                    <form action={deletePromotion} className={styles.actions}>
                      <input type="hidden" name="id" value={promotion.id} />
                      <button type="submit" className={styles.dangerButton}>
                        <TrashIcon />
                        Remove {promotion.name}
                      </button>
                    </form>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form action={savePromotion} className={`${styles.panel} ${styles.stack}`}>
        <h2>Add a promotion</h2>
        <PromotionFields values={blank} />
        <div className={styles.actions}>
          <Button type="submit">Add promotion</Button>
        </div>
      </form>
    </div>
  );
}
