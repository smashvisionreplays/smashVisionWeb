import React from 'react';
import { Modal, ConfigProvider } from 'antd';
import { glassModalTheme, glassModalStyles } from '../glassModalTheme';
import ShareClipButton from './ShareClipButton';
import { useLanguage } from '../../src/contexts/LanguageContext';

/**
 * One Share button per clip in the dashboard opens this instead of lining the
 * row with a button per format. The clip keeps its own prepared file, so the
 * two options download independently.
 */
const ShareClipModal = ({ clip, open, onClose, onError }) => {
  const { t } = useLanguage();

  return (
    <ConfigProvider theme={glassModalTheme} modal={{ styles: glassModalStyles }}>
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] shadow-[0_0_8px_rgba(172,187,34,0.4)] flex-shrink-0"></div>
            <span className="text-white/90 font-semibold text-base">{t('shareClipTitleModal')}</span>
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width={420}
        destroyOnHidden
        closeIcon={<span className="text-white/40 hover:text-white/80 transition-colors text-lg leading-none">✕</span>}
      >
        <div className="flex flex-col gap-3">
          <ShareClipButton
            clipUID={clip?.UID}
            clipName={clip?.Clip_Name}
            note={clip?.note}
            description={t('shareClipOptionDescription')}
            onError={onError}
          />
          <ShareClipButton
            clipUID={clip?.UID}
            clipName={clip?.Clip_Name}
            note={clip?.note}
            variant="story"
            description={t('shareToStoryOptionDescription')}
            onError={onError}
          />
          <p className="text-white/30 text-xs leading-relaxed mt-1">{t('shareSheetHint')}</p>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ShareClipModal;
