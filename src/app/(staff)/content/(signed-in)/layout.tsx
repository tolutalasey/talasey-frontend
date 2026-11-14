import type { ReactNode } from 'react';
import { CONTENT_GROUPS, typeMeta } from '@/features/content-editor';
import {
  HomeIcon,
  NotAllowed,
  requireStaff,
  RocketIcon,
  StaffShell,
  type StaffNavGroup,
} from '@/features/staff';
import { contentTypes } from './types.server';

export default async function ContentLayout({ children }: { children: ReactNode }) {
  const { me, allowed } = await requireStaff('content', 'content.edit');
  const types = allowed ? await contentTypes() : [];
  const groups: StaffNavGroup[] = [
    {
      links: [
        { href: '/content/', label: 'Overview', icon: <HomeIcon /> },
        {
          href: '/content/releases/',
          label: 'Releases',
          icon: <RocketIcon />,
          permission: 'content.publish',
        },
      ],
    },
    ...CONTENT_GROUPS.map((label) => ({
      label,
      links: types
        .filter((type) => typeMeta(type.type).group === label)
        .map((type) => ({
          href: `/content/${type.type}/`,
          label: type.label,
          icon: typeMeta(type.type).icon,
        })),
    })),
  ];
  return (
    <StaffShell area="content" groups={groups} me={me}>
      {allowed ? children : <NotAllowed />}
    </StaffShell>
  );
}
