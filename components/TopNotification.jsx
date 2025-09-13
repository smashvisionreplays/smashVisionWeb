import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const TopNotification = ({ type, message, description, timing = true, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const isLongContent = description && description.length > 100;
  const shortDescription = isLongContent ? description.substring(0, 100) + '...' : description;

  useEffect(() => {
    if (timing) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [timing, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'backdrop-blur-xl bg-green-500/10 border-green-400/20',
          text: 'text-green-100',
          textSecondary: 'text-green-200/80'
        };
      case 'error':
        return {
          bg: 'backdrop-blur-xl bg-red-500/10 border-red-400/20',
          text: 'text-red-100',
          textSecondary: 'text-red-200/80'
        };
      case 'info':
      default:
        return {
          bg: 'backdrop-blur-xl bg-blue-500/10 border-blue-400/20',
          text: 'text-blue-100',
          textSecondary: 'text-blue-200/80'
        };
    }
  };

  const colors = getColors();
  const hasNavbar = document.querySelector('nav');
  const topPosition = hasNavbar ? 'top-16' : 'top-0';

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  return (
    <div className={`fixed ${topPosition} left-1/2 transform -translate-x-1/2 z-50 w-full lg:w-10/12 xl:w-8/12 px-4 transition-all duration-300 ease-in-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className={`${colors.bg} border rounded-2xl shadow-2xl p-4 mx-auto`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm ${colors.text} mb-1 break-words`}>
              {message}
            </h4>
            {description && (
              <div className={`text-sm ${colors.textSecondary} leading-relaxed break-words overflow-hidden`}>
                <p className="whitespace-pre-wrap">
                  {isExpanded ? description : shortDescription}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isLongContent && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`${colors.text} hover:opacity-75 transition-opacity flex items-center gap-1 text-xs font-medium`}
              >
                {isExpanded ? 'Less' : 'More'}
                <ChevronDownIcon className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            )}
            <button
              onClick={handleClose}
              className={`${colors.text} hover:opacity-75 transition-opacity`}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNotification;