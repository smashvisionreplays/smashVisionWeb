import React, { useState, useEffect, useRef } from 'react';
import { fetchClipFile } from '../../src/controllers/serverController';
import { useLanguage } from '../../src/contexts/LanguageContext';

// Sharing a real video file is the only way to land a clip in WhatsApp or an
// Instagram story from the web: navigator.share() opens the OS sheet and the
// user picks the app. There is no way to target one app directly.
export const canShareVideoFiles = () => {
  try {
    const probe = new File([new Blob(['0'], { type: 'video/mp4' })], 'probe.mp4', { type: 'video/mp4' });
    return Boolean(navigator.canShare?.({ files: [probe] }));
  } catch {
    return false;
  }
};

const buildClipFileName = (clipName) => {
  const base = (clipName || 'smashvision-clip').toString().replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '');
  return `${base || 'smashvision-clip'}.mp4`;
};

/**
 * Two-step on purpose: browsers only allow navigator.share() while the user
 * gesture is still live (~5s), and downloading the clip takes longer than that
 * on mobile data. So the first tap fetches the file and the second one — still
 * a fresh gesture, with the file already in memory — opens the sheet.
 * `prefetch` skips step one where we know the clip is ready (ClipView).
 */
const ShareClipButton = ({ clipUID, clipName, note, className = '', prefetch = false, onError }) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle'); // idle | preparing | ready
  const fileRef = useRef(null);
  const [supported] = useState(canShareVideoFiles);

  const prepareFile = async () => {
    if (fileRef.current) return fileRef.current;
    const blob = await fetchClipFile(clipUID);
    const file = new File([blob], buildClipFileName(clipName), { type: blob.type || 'video/mp4' });
    fileRef.current = file;
    return file;
  };

  useEffect(() => {
    if (!supported || !prefetch || !clipUID) return;
    let cancelled = false;

    setStatus('preparing');
    prepareFile()
      .then(() => { if (!cancelled) setStatus('ready'); })
      .catch(() => { if (!cancelled) setStatus('idle'); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clipUID, prefetch, supported]);

  // Desktop browsers cannot hand a file to another app, and Download is already
  // next to this button there, so the share button is mobile-only.
  if (!supported) return null;

  const handleClick = async () => {
    try {
      if (!fileRef.current) {
        setStatus('preparing');
        await prepareFile();
        // The gesture that started the download has expired by now, so stop
        // here and let the next tap do the sharing.
        setStatus('ready');
        return;
      }

      await navigator.share({
        files: [fileRef.current],
        title: clipName || t('shareClipTitle'),
        text: note || t('shareClipMessage'),
      });
    } catch (error) {
      if (error?.name === 'AbortError') return; // the user dismissed the sheet
      console.error('Error sharing clip:', error);
      setStatus(fileRef.current ? 'ready' : 'idle');
      onError?.(t('shareClipFailed'));
    }
  };

  const label = status === 'preparing'
    ? t('preparingClip')
    : status === 'ready'
      ? t('shareNow')
      : t('shareClip');

  return (
    <button
      onClick={handleClick}
      disabled={status === 'preparing'}
      className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 text-[#B8E016] border border-[#acbb22]/25 rounded-xl text-sm font-medium hover:from-[#acbb22]/30 hover:to-[#B8E016]/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {status === 'preparing' ? (
        <span className="w-4 h-4 rounded-full border-2 border-[#acbb22]/30 border-t-[#B8E016] animate-spin"></span>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
      )}
      {label}
    </button>
  );
};

export default ShareClipButton;
