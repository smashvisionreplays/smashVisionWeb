/**
 * The dashboard's tabs and who may see them.
 *
 * Both navigations render from this list — the desktop sidebar and the mobile
 * tab strip — so a role can't be offered a tab in one and not the other.
 * `DashboardContent` re-checks the role before rendering, because hiding a tab
 * is presentation, not access control.
 */
export const getDashboardTabs = (t) => [
  { name: 'Clips', label: t('myClips'), roles: ['member', 'club', 'admin'], icon: '/clips.svg' },
  { name: 'Videos', label: 'Videos', roles: ['club'], icon: '/videocam.svg' },
  { name: 'Lives', label: t('lives'), roles: ['club'], icon: '/live_tv.svg' },
  { name: 'Statistics', label: t('statistics'), roles: ['club'], icon: '/statistics.svg' },
  { name: 'Admin', label: t('adminPanel'), roles: ['admin'], icon: '/admin.svg' },
];

export const getTabsForRole = (t, role) =>
  getDashboardTabs(t).filter((tab) => tab.roles.includes(role));
