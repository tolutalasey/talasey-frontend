'use client';

import { useActionState } from 'react';
import { Button } from '@/ui/Button/Button';
import { importSheet, type SheetImportState } from '../catalogue-actions';
import styles from './StaffForm.module.css';

const initial: SheetImportState = { version: 0, applied: false, report: [], problem: null };

export function CatalogueTransfer() {
  const [state, action, pending] = useActionState(importSheet, initial);
  return (
    <>
      <section className={`${styles.panel} ${styles.stack}`} aria-labelledby="export">
        <h2 id="export">Download the catalogue</h2>
        <p>
          Every product option with its SKU, price, stock, weight and coverage, as a spreadsheet for
          checking, totting up or sending on.
        </p>
        <p>
          <a href="/admin/catalogue/export/" download>
            Download as Excel (.xlsx)
          </a>
        </p>
      </section>

      <form action={action} className={`${styles.panel} ${styles.stack}`} aria-labelledby="import">
        <h2 id="import">Update from the product master sheet</h2>
        <p>
          Products are matched by web address or SKU. New ones are added unpublished, changed ones
          updated, and rows that can&apos;t be imported yet are listed with the reason. Check first:
          nothing changes until you click <strong>Import</strong>.
        </p>
        <label htmlFor="sheet">Product master sheet (.xlsx)</label>
        <input
          id="sheet"
          type="file"
          name="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          required
        />
        <div className={styles.actions}>
          <Button
            type="submit"
            name="intent"
            value="check"
            variant="secondary"
            isDisabled={pending}
          >
            Check what would change
          </Button>
          <Button type="submit" name="intent" value="apply" isDisabled={pending}>
            Import
          </Button>
        </div>
        {pending && <p role="status">Reading the sheet…</p>}
      </form>

      {state.problem && (
        <div role="alert" className={styles.problem}>
          {state.problem}
        </div>
      )}
      {state.report.length > 0 && (
        <section
          key={state.version}
          className={`${styles.panel} ${styles.stack}`}
          aria-labelledby="report"
        >
          <h2 id="report">
            {state.applied ? 'Imported' : 'What would change (nothing saved yet)'}
          </h2>
          <ul>
            {state.report.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
