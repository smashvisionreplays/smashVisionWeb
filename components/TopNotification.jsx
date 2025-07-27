import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TopNotification = ({ type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-400" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  };

  // Check if navbar exists by looking for nav element
  const hasNavbar = document.querySelector('nav');
  const topPosition = hasNavbar ? 'top-16' : 'top-0';

  return (
    <div className={`fixed ${topPosition} left-0 right-0 z-50 border-b ${getBgColor()} p-4`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          {getIcon()}
          <span className={`ml-3 text-sm font-medium ${getTextColor()}`}>
            {message}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-4 inline-flex ${getTextColor()} hover:opacity-75`}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopNotification;