import { theme } from 'antd';

// The dark "liquid glass" treatment shared by the dashboard modals: a heavily
// blurred, barely-tinted surface rather than a solid panel. Kept in one place
// so the video, share and download modals cannot drift apart.
export const glassModalTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgElevated: 'rgba(15, 20, 30, 0.15)',
    colorBorder: 'rgba(255,255,255,0.1)',
    borderRadiusLG: 20,
  },
};

export const glassModalStyles = {
  mask: {
    backdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  content: {
    background: 'rgba(15, 20, 30, 0.35)',
    backdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 1px 0 rgba(255,255,255,0.08) inset',
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    background: 'transparent',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '20px 24px 16px',
    marginBottom: 0,
  },
  body: {
    padding: '20px 24px',
  },
  footer: {
    background: 'transparent',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    padding: '14px 24px',
    marginTop: 0,
  },
};
