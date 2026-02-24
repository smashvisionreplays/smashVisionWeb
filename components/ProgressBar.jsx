import React from 'react';
import {ConfigProvider, Steps, theme, Spin } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const ProgressBar = ({items, current, percent, status, direction = 'horizontal'}) => {
  // Create enhanced items with custom icons
  const enhancedItems = items.map((item, index) => {
    let icon = null;
    
    if (index < current) {
      // Completed step
      icon = <CheckCircleOutlined style={{ color: '#c7f607', fontSize: '16px' }} />;
    } else if (index === current) {
      // Current active step - show spinning loader
      icon = <Spin indicator={<LoadingOutlined style={{ fontSize: '16px', color: '#c7f607' }} spin />} />;
    } else {
      // Future step
      icon = <ClockCircleOutlined style={{ color: '#8b8a8f', fontSize: '16px' }} />;
    }
    
    return {
      ...item,
      icon
    };
  });

  return (
    <>
      <style>
        {`
          @keyframes flicker {
            0%, 100% { color: #8b8a8f; }
            50% { color: #c7f607; }
          }
          .ant-steps-item-process .ant-steps-item-title {
            animation: flicker 1.5s infinite;
          }
        `}
      </style>
      <div style={direction === 'vertical' ? { display: 'flex', justifyContent: 'center' } : {}}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          components: {
            Steps: {
              colorPrimary: '#c7f607',
              navArrowColor: '#c7f607',
              algorithm: true,
              colorTextDescription: "#8b8a8f",
            }
          }
        }}
      >
        <Steps
          items={enhancedItems}
          current={current}
          size="small"
          direction={direction}
          labelPlacement={direction === 'vertical' ? 'horizontal' : 'horizontal'}
          status={current < items.length ? 'process' : 'finish'}
        />
        <br />
      </ConfigProvider>
      </div>
    </>
  );
};
export default ProgressBar;