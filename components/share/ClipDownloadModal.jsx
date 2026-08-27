import React, { useState, useEffect } from 'react';
import { Modal, ConfigProvider } from 'antd';
import { glassModalTheme, glassModalStyles } from '../glassModalTheme';
import ClipOptionButton, { DownloadIcon, InstagramIcon } from './ClipOptionButton';
import { buildClipFileName, saveBlob } from './clipFiles';
import { fetchClipFile } from '../../src/controllers/serverController';
import { useLanguage } from '../../src/contexts/LanguageContext';

/**
 * Desktop browsers cannot share files, so this is how the story format is
 * reached there: download it and post it from a phone. The plain clip is a
 * normal link the browser streams; the story version is fetched first because
 * the server has to render it, and that needs a spinner rather than a frozen
 * tab.
 */
const ClipDownloadModal = ({ clip, open, onClose, onError }) => {
  const { t } = useLanguage();
  const [preparing, setPreparing] = useState(false);

  useEffect(() => { setPreparing(false); }, [clip?.UID]);

  const downloadClip = () => {
    window.location.href = `/api/proxy/clips/${clip?.UID}/download/file`;
    onClose?.();
  };

  const downloadStory = async () => {
    setPreparing(true);
    try {
      const blob = await fetchClipFile(clip?.UID, 'story');
      saveBlob(blob, buildClipFileName(clip?.Clip_Name, 'story'));
      onClose?.();
    } catch (error) {
      console.error('Error downloading the story version:', error);
      onError?.(error?.status === 503 ? t('storyBusyRetry') : t('downloadStoryFailed'));
    } finally {
      setPreparing(false);
    }
  };

  return (
    <ConfigProvider theme={glassModalTheme} modal={{ styles: glassModalStyles }}>
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] shadow-[0_0_8px_rgba(172,187,34,0.4)] flex-shrink-0"></div>
            <span className="text-white/90 font-semibold text-base">{t('downloadClipTitleModal')}</span>
          </div>
        }
        open={open}
        onCancel={() => !preparing && onClose?.()}
        footer={null}
        width={420}
        destroyOnHidden
        closeIcon={<span className="text-white/40 hover:text-white/80 transition-colors text-lg leading-none">✕</span>}
      >
        <div className="flex flex-col gap-3">
          <ClipOptionButton
            icon={<DownloadIcon />}
            label={t('downloadClipOption')}
            description={t('downloadClipOptionDescription')}
            onClick={downloadClip}
            busy={false}
          />
          <ClipOptionButton
            icon={<InstagramIcon />}
            label={preparing ? t('preparingStory') : t('downloadStoryOption')}
            description={t('downloadStoryOptionDescription')}
            onClick={downloadStory}
            busy={preparing}
          />
          <p className="text-white/30 text-xs leading-relaxed mt-1">{t('downloadStoryHint')}</p>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ClipDownloadModal;
