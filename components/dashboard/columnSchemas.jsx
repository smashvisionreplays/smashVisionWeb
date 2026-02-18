import { Button, Input, Table, Modal } from "antd";
import { useState } from "react";
import { useLanguage } from '../../src/contexts/LanguageContext';
import VideoPlayer from "../videoView/VideoPlayer"; // Adjust the import path as needed
import TagDisplay from "../TagDisplay";

export const videosColumns = (videos, showVideoInModal, blockVideo, unblockVideo, t) => {
  const uniqueCourtNumbers = [...new Set(videos.map(item => item.Court_Number))];
  const uniqueDays = [...new Set(videos.map(item => t(item.Weekday) || item.Weekday))];
  return [
    {
      title: t('day') || 'Day',
      dataIndex: 'Weekday',
      key: 'Weekday',
      filters: uniqueDays.map(day => ({
        text: t(day)|| day,
        value: t(day)|| day,
      })),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {return t(record.Weekday)===value},
      render: (weekday) => t(weekday) || weekday
    },
    {
      title: t('court') || 'Court',
      dataIndex: 'Court_Number',
      key: 'Court_Number',
      filters: uniqueCourtNumbers.map(number => ({
        text: number,
        value: number,
      })),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {return record.Court_Number==value}
    },
    {
      title: t('hour') || 'Hour',
      dataIndex: 'Hour',
      key: 'Hour',
    },
    {
      title: t('actions') || 'Actions',
      children:[
        {
          title: t('recorded') || 'Recorded',
          dataIndex: 'URL',
          key: 'URL',
          filters: [
            { text: t('recorded'), value: true },
            { text: t('notRecorded'), value: false },
          ],
          filterMode: 'tree',
          filterSearch: true,
          filterMultiple:true,
          onFilter: (value, record) => {return record.URL ? value : !value},
          render: (_, record) => (
            <button
              disabled={!record.URL}
              onClick={() => showVideoInModal({
                videoUID: record.UID,
                id_club: record.id_club,
                weekday: record.Weekday,
                court_number: record.Court_Number,
                hour: record.originalHour,
                section: record.Hour_Section
              })}
              className={`px-3 py-1.5 bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 text-[#B8E016] border border-[#acbb22]/25 rounded-xl text-sm font-medium hover:from-[#acbb22]/30 hover:to-[#B8E016]/20 transition-all duration-200 ${!record.URL ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {t('watch') || 'Watch'}
            </button>
          ),
        },
        {
          title: t('status') || 'Status',
          dataIndex: 'Blocked',
          key: 'Blocked',
          filters: [
            { text: t('blocked'), value: "Si" },
            { text: t('unblocked'), value: "No" },
          ],
          filterMode: 'tree',
          filterSearch: true,
          filterMultiple:true,
          onFilter: (value, record) => {return record.Blocked===value},
          render: (_, record) => (
            <button
              onClick={() => record.Blocked === "No" ? blockVideo(record.ID) : unblockVideo(record.ID)}
              className={record.Blocked === "No"
                ? "px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-all duration-200"
                : "px-3 py-1.5 bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 text-[#B8E016] border border-[#acbb22]/25 rounded-xl text-sm font-medium hover:from-[#acbb22]/30 hover:to-[#B8E016]/20 transition-all duration-200"
              }
            >
              {record.Blocked === "No" ? (t('block') || 'Block') : (t('unblock') || 'Unblock')}
            </button>
          ),
        },

      ]    
    }
  ];
}

  export const clipsColumns = (clips, showVideoInModal, t) => {
    const uniqueDays = [...new Set(clips.map(item => item.Weekday))];
    return [
      {
        title: t('day') || 'Day',
        dataIndex: 'Weekday',
        key: 'Weekday',
        filters: uniqueDays.map(day => ({
          text: t(day)|| day,
          value: t(day)|| day,
        })),
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => {return t(record.Weekday)===value},
        render: (weekday) => t(weekday) || weekday
      },
      {
        title: t('date') || 'Date',
        dataIndex: 'date',
        key: 'date',
      },    
      {
        title: t('tag') || 'Tag',
        dataIndex: 'tag',
        key: 'tag',
        render: (tags) => <TagDisplay tags={tags} />,
      },
      {
        title: t('actions') || 'Actions',
        dataIndex: 'downloadURL',
        key: 'downloadURL',
        render: (_, record) => (
          <div className="flex gap-2">
            <button
              disabled={!record.URL}
              onClick={() => showVideoInModal({
                videoUID: record.UID,
                id_club: record.id_club,
                Clip_Name: record.Clip_Name,
                weekday: record.Weekday,
                court_number: record.Court_Number,
                hour: record.originalHour,
                section: record.Hour_Section
              })}
              className={`px-3 py-1.5 bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 text-[#B8E016] border border-[#acbb22]/25 rounded-xl text-sm font-medium hover:from-[#acbb22]/30 hover:to-[#B8E016]/20 transition-all duration-200 ${!record.URL ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {t('watch') || 'Watch'}
            </button>
            {record.downloadURL && (
              <a
                href={record.downloadURL}
                className="px-3 py-1.5 bg-sky-500/10 text-sky-300 border border-sky-400/25 rounded-xl text-sm font-medium hover:bg-sky-500/20 hover:text-sky-200 transition-all duration-200"
              >
                {t('download') || 'Download'}
              </a>
            )}
          </div>
        ),
        // render: (url2 ) => (url2 ? <Button className="" href={url2}>Link</Button> : 'No video'),
      },
  
    ];
  }

  export const livesColumns = (cameras, rtmpKeys, handleInputChange, handleStartLive, handleStopLive, connectingCameras, t) => {
    return [
      {
        title: t('court') || 'Court',
        dataIndex: 'court_number',
        key: 'court_number',
        filters: cameras.map(item => ({
          text: item.court_number,
          value: item.court_number,
        })),
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => {return record.Court_Number==value}
      },
      {
        title: t('status') || 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: t('link') || 'Link',
        dataIndex: 'url',
        key: 'url',
        render: (url) => (url && url!='null' ? <Button className="" href={url}>{t('link') || 'Link'}</Button> : 'No video'),
      },
      {
        title: t('notes') || 'Notes',
        dataIndex: 'notes',
        key: 'notes',
        responsive: ['lg', 'md'],
      },
      {
        title: 'Endpoint',
        dataIndex: 'endpoint',
        key: 'endpoint',
        hidden:true
      },
      {
        title: t('actions') || 'Actions',
        key: 'actions',
        render: (_, record) => {
          const isConnecting = connectingCameras.has(record.ID);
          return record.status !== "Live" ? (
            <button
              onClick={() => handleStartLive(
                record.ID,
                record.court_number,
                record.ip,
                rtmpKeys[record.court_number] || "auto",
                record.endpoint
              )}
              disabled={isConnecting}
              className="px-3 py-1.5 bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 text-[#B8E016] border border-[#acbb22]/25 rounded-xl text-xs font-medium hover:from-[#acbb22]/30 hover:to-[#B8E016]/20 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting && <span className="w-3 h-3 rounded-full border border-[#B8E016]/40 border-t-[#B8E016] animate-spin inline-block"></span>}
              {isConnecting ? (t('connecting') || 'Connecting...') : (t('startLive') || 'Start Live')}
            </button>
          ) : (
            <button
              onClick={() => handleStopLive(record.ID, record.ip, record.endpoint)}
              disabled={isConnecting}
              className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-medium hover:bg-red-500/20 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting && <span className="w-3 h-3 rounded-full border border-red-400/40 border-t-red-400 animate-spin inline-block"></span>}
              {isConnecting ? (t('stopping') || 'Stopping...') : (t('stopLive') || 'Stop Live')}
            </button>
          );
        }
      },
    ];
  }
