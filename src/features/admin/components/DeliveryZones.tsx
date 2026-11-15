import { Button } from '@/ui/Button/Button';
import { Table } from '@/ui/Table/Table';
import { TextAreaField } from '@/ui/TextAreaField/TextAreaField';
import { TextField } from '@/ui/TextField/TextField';
import NextLink from 'next/link';
import { money, poundsText, RowActions, staffStyles as styles } from '@/features/staff';
import { VisuallyHidden } from '@/ui/VisuallyHidden/VisuallyHidden';
import { deleteZone, saveZone } from '../actions';
import { dateText } from '../labels';
import type { Zone, ZoneDay } from '../types';

export function ZoneList({ zones }: { zones: Zone[] }) {
  return (
    <Table caption={`${zones.length} delivery zones`}>
      <thead>
        <tr>
          <th scope="col">Zone</th>
          <th scope="col">Postcode areas</th>
          <th scope="col">Pallet from</th>
          <th scope="col">Pallets a day</th>
          <th scope="col">
            <VisuallyHidden>Actions</VisuallyHidden>
          </th>
        </tr>
      </thead>
      <tbody>
        {zones.map((zone) => {
          const pallet = zone.rates.filter((rate) => rate.shipment === 'pallet');
          return (
            <tr key={zone.zone}>
              <th scope="row">
                <NextLink href={`/admin/delivery/${zone.zone}/`}>{zone.zone}</NextLink>
                {zone.sample && <span className={styles.status}>sample prices</span>}
              </th>
              <td>{zone.areas.join(' ')}</td>
              <td>{pallet[0] ? money(pallet[0].pricePence) : 'No pallets'}</td>
              <td>{zone.palletsPerDay ?? '–'}</td>
              <td>
                <RowActions
                  name={zone.zone}
                  editHref={`/admin/delivery/${zone.zone}/`}
                  remove={deleteZone}
                  fields={{ zone: zone.zone }}
                  afterDelete="Postcodes in it can no longer be delivered to."
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export function ZoneEditor({ zone, days }: { zone?: Zone; days?: ZoneDay[] }) {
  return (
    <>
      <form action={saveZone} className={`${styles.panel} ${styles.stack}`}>
        {zone ? (
          <input type="hidden" name="zone" value={zone.zone} />
        ) : (
          <TextField
            label="Zone name"
            name="zone"
            description="Lower-case words with hyphens, like north-east"
            isRequired
          />
        )}
        {zone && <input type="hidden" name="existing" value="yes" />}
        <TextField
          label="Postcode areas"
          name="areas"
          defaultValue={zone?.areas.join(' ')}
          description="The letters at the start of the postcode, separated by spaces, like M SK OL"
        />
        <TextAreaField
          label="Rates"
          name="rates"
          rows={6}
          defaultValue={zone?.rates
            .map((rate) => `${rate.shipment}, ${rate.maxWeightKg}, ${poundsText(rate.pricePence)}`)
            .join('\n')}
          description="One per line: pallet or parcel, the heaviest weight in kg, the price in pounds. Like: pallet, 1000, 65.00"
        />
        <div className={styles.row}>
          <TextField
            label="Pallets a day"
            name="palletsPerDay"
            defaultValue={zone?.palletsPerDay?.toString() ?? ''}
            inputMode="numeric"
          />
          <TextField
            label="Working days' notice"
            name="leadTimeDays"
            defaultValue={zone?.leadTimeDays?.toString() ?? ''}
            inputMode="numeric"
          />
        </div>
        <div className={styles.actions}>
          <Button type="submit">{zone ? 'Save zone' : 'Add zone'}</Button>
        </div>
      </form>
      {days && (
        <Table caption="Pallet days">
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Booked</th>
              <th scope="col">Held at checkout</th>
              <th scope="col">Free</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date}>
                <th scope="row">{dateText(day.date)}</th>
                <td>{day.booked}</td>
                <td>{day.held}</td>
                <td>{Math.max(day.capacity - day.booked - day.held, 0)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {zone && (
        <form action={deleteZone} className={styles.actions}>
          <input type="hidden" name="zone" value={zone.zone} />
          <Button type="submit" variant="secondary">
            Delete zone
          </Button>
        </form>
      )}
    </>
  );
}
