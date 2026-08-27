import React, { useState, useEffect, useRef } from 'react';
import { fetchClipFile } from '../../src/controllers/serverController';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { canShareVideoFiles, buildClipFileName } from './clipFiles';
import ClipOptionButton, { ShareIcon, InstagramIcon } from './ClipOptionButton';

/**
 * Two-step on purpose: browsers only allow navigator.share() while the user
 * gesture is still live (~5s), and downloading the clip takes longer than that
 * on mobile data. So the first tap fetches the file and the second one — still
 * a fresh gesture, with the file already in memory — opens the sheet.
 * `prefetch` skips step one where we know the clip is ready (ClipView).
 * `description` switches from the compact pill to the option row used inside
 * the share modal.
 */
const ShareClipButton = ({ clipUID, clipName, note, className = '', prefetch = false, variant = 'clip', description, onError }) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle'); // idle | preparing | ready
  const fileRef = useRef(null);
  const [supported] = useState(canShareVideoFiles);

  const prepareFile = async () => {
    if (fileRef.current) return fileRef.current;
    const blob = await fetchClipFile(clipUID, variant);
    const file = new File([blob], buildClipFileName(clipName, variant), { type: blob.type || 'video/mp4' });
    fileRef.current = file;
    return file;
  };

  // The prepared file belongs to one clip in one format; drop it if either changes.
  useEffect(() => {
    fileRef.current = null;
    setStatus('idle');
  }, [clipUID, variant]);

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

  // Desktop browsers cannot hand a file to another app; the download options
  // cover that case instead.
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
      onError?.(error?.status === 503 ? t('storyBusyRetry') : t('shareClipFailed'));
    }
  };

  const isStory = variant === 'story';
  const label = status === 'preparing'
    ? t(isStory ? 'preparingStory' : 'preparingClip')
    : status === 'ready'
      ? t('shareNow')
      : t(isStory ? 'shareToStory' : 'shareClip');
  const icon = isStory ? <InstagramIcon /> : <ShareIcon />;

  if (description) {
    return (
      <ClipOptionButton
        icon={icon}
        label={label}
        description={description}
        onClick={handleClick}
        busy={status === 'preparing'}
        className={className}
      />
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === 'preparing'}
      className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 text-[#B8E016] border border-[#acbb22]/25 rounded-xl text-sm font-medium hover:from-[#acbb22]/30 hover:to-[#B8E016]/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {status === 'preparing'
        ? <span className="w-4 h-4 rounded-full border-2 border-[#acbb22]/30 border-t-[#B8E016] animate-spin"></span>
        : <span className="w-4 h-4">{icon}</span>}
      {label}
    </button>
  );
};

export default ShareClipButton;
