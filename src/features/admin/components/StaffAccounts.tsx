import { Button, Checkbox, SelectField, Table, TextField } from '@/ui';
import { staffStyles as styles } from '@/features/staff';
import { createStaff, updateStaff } from '../actions';
import type { StaffAccount } from '../types';

const ROLES = [
  { value: 'owner', label: 'Owner: everything' },
  { value: 'catalogue', label: 'Catalogue: products, orders, delivery' },
  { value: 'editor', label: 'Editor: writes and publishes content' },
  { value: 'contributor', label: 'Contributor: writes content for an editor' },
];

export function StaffAccounts({ accounts }: { accounts: StaffAccount[] }) {
  return (
    <>
      <Table caption="Staff accounts">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role, access and password</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <th scope="row">
                {account.name}
                <br />
                <span>{account.email}</span>
                <br />
                <span>Two-factor {account.twoFactor ? 'on' : 'off'}</span>
              </th>
              <td>
                <form action={updateStaff} className={styles.row}>
                  <input type="hidden" name="id" value={account.id} />
                  <SelectField
                    label="Role"
                    name="role"
                    defaultValue={account.role}
                    options={ROLES}
                  />
                  <Checkbox name="active" defaultSelected={account.active}>
                    Can sign in
                  </Checkbox>
                  {account.twoFactor && (
                    <Checkbox name="resetTwoFactor">Turn off two-factor (lost phone)</Checkbox>
                  )}
                  <TextField
                    label="New password"
                    name="password"
                    type="password"
                    description="Leave empty to keep it"
                  />
                  <Button type="submit" variant="secondary">
                    Save
                  </Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <form action={createStaff} className={`${styles.panel} ${styles.stack}`}>
        <h2>Add someone</h2>
        <TextField label="Name" name="name" isRequired />
        <TextField label="Email" name="email" type="email" isRequired />
        <SelectField label="Role" name="role" defaultValue="contributor" options={ROLES} />
        <TextField
          label="Password"
          name="password"
          type="password"
          description="At least 10 characters"
          isRequired
        />
        <div className={styles.actions}>
          <Button type="submit">Add account</Button>
        </div>
      </form>
    </>
  );
}
