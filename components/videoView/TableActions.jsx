import React from 'react';
import { ConfigProvider, theme } from 'antd';

const BestPointsTable = ({ data, onWatch }) => {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="liquid-glass iridescent-border rounded-2xl flex-1 flex flex-col min-h-[400px]" style={{
        backdropFilter: 'blur(3px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Liquid glass radial gradient overlay */}
        <div style={{
          content: '',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(128, 236, 19, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>
        
        <div className="p-6 pb-2 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-white text-xl font-bold tracking-tight">Best Moments</h2>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 max-h-[500px] scrollbar-hide relative z-10">
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <div 
                key={item.key || index}
                className="group flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#80ec13]/30 transition-all cursor-pointer"
                onClick={() => onWatch(item)}
              >
                <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#80ec13]/20 to-[#80ec13]/5"></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                    <span className="material-symbols-outlined text-[#80ec13]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">Best Point</p>
                  <p className="text-white/50 text-xs font-mono">{item.bestPoint}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-white/50 text-sm">No best moments detected</p>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default BestPointsTable;