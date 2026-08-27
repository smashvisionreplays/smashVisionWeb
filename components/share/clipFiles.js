// Shared helpers for the clip share and download options.

// Sharing a real video file is the only way to land a clip in WhatsApp or an
// Instagram story from the web: navigator.share() opens the OS sheet and the
// user picks the app. There is no way to target one app directly, and desktop
// browsers cannot do it at all — hence the download options.
export const canShareVideoFiles = () => {
  try {
    const probe = new File([new Blob(['0'], { type: 'video/mp4' })], 'probe.mp4', { type: 'video/mp4' });
    return Boolean(navigator.canShare?.({ files: [probe] }));
  } catch {
    return false;
  }
};

export const buildClipFileName = (clipName, variant) => {
  const base = (clipName || 'smashvision-clip').toString().replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '');
  return `${base || 'smashvision-clip'}${variant === 'story' ? '-story' : ''}.mp4`;
};

// Hands the browser a blob we already have in memory, named properly. Used for
// the story format, whose first request has to wait on the render anyway.
export const saveBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Give the download a moment to start before the URL stops resolving.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};
