import { Button } from '@/ui/Button/Button';
import { Checkbox } from '@/ui/Checkbox/Checkbox';
import { SelectField } from '@/ui/SelectField/SelectField';
import { TextField } from '@/ui/TextField/TextField';
import { Badge, PencilIcon, staffStyles as styles } from '@/features/staff';
import { createStaff, updateStaff } from '../actions';
import type { StaffAccount } from '../types';

const ROLES = [
  { value: 'owner', label: 'Owner: everything' },
  { value: 'catalogue', label: 'Catalogue: products, orders, delivery' },
  { value: 'editor', label: 'Editor: writes and publishes content' },
  { value: 'contributor', label: 'Contributor: writes content for an editor' },
];

const ROLE_NAME: Record<string, string> = {
  owner: 'Owner',
  catalogue: 'Catalogue',
  editor: 'Editor',
  contributor: 'Contributor',
};

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export function AddStaffForm() {
  return (
    <form action={createStaff}>
      <TextField label="Name" name="name" isRequired />
      <TextField label="Email" name="email" type="email" isRequired />
      <SelectField label="Role" name="role" defaultValue="contributor" options={ROLES} />
      <TextField
        label="Password"
        name="password"
        type="password"
        description="At least 10 characters. Give it to them in person."
        isRequired
      />
      <Button type="submit">Add account</Button>
    </form>
  );
}

export function StaffAccounts({ accounts }: { accounts: StaffAccount[] }) {
  return (
    <section className={`${styles.panel} ${styles.flush}`} aria-label="Staff accounts">
      <div className={styles.toolbar}>
        <h2 className={styles.panelTitle}>Accounts</h2>
        <span className={styles.count}>
          {accounts.filter((account) => account.active).length} of {accounts.length} can sign in
        </span>
      </div>
      <ul className={styles.list}>
        {accounts.map((account) => (
          <li key={account.id}>
            <details className={styles.person}>
              <summary className={styles.personRow}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(account.name)}
                </span>
                <span className={styles.listMain}>
                  <strong>{account.name}</strong>
                  <span className={styles.listSub}>{account.email}</span>
                </span>
                <span className={styles.listEnd}>
                  <Badge tone="brand">{ROLE_NAME[account.role] ?? account.role}</Badge>
                  <Badge tone={account.twoFactor ? 'good' : 'warn'}>
                    {account.twoFactor ? 'Two-factor on' : 'Two-factor off'}
                  </Badge>
                  {!account.active && <Badge tone="bad">Can&rsquo;t sign in</Badge>}
                  <span className={styles.editHint}>
                    <PencilIcon />
                    Edit
                  </span>
                </span>
              </summary>
              <form action={updateStaff} className={styles.personForm}>
                <input type="hidden" name="id" value={account.id} />
                <div className={styles.fields}>
                  <SelectField
                    label="Role"
                    name="role"
                    defaultValue={account.role}
                    options={ROLES}
                  />
                  <TextField
                    label="New password"
                    name="password"
                    type="password"
                    description="Leave empty to keep it"
                  />
                  <Checkbox name="active" defaultSelected={account.active}>
                    Can sign in
                  </Checkbox>
                  {account.twoFactor && (
                    <Checkbox name="resetTwoFactor">Turn off two-factor (lost phone)</Checkbox>
                  )}
                </div>
                <div className={styles.actions}>
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
