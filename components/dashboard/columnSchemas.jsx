import { Button, Input, Table, Modal } from "antd";
import { useState } from "react";
import { useLanguage } from '../../src/contexts/LanguageContext';
import VideoPlayer from "../videoView/VideoPlayer"; // Adjust the import path as needed

export const videosColumns = (videos, showVideoInModal, blockVideo, unblockVideo, t) => {
  const uniqueCourtNumbers = [...new Set(videos.map(item => item.Court_Number))];
  const uniqueDays = [...new Set(videos.map(item => item.Weekday))];
  return [
    {
      title: t('day') || 'Day',
      dataIndex: 'Weekday',
      key: 'Weekday',
      filters: uniqueDays.map(day => ({
        text: day,
        value: day,
      })),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {return record.Weekday===value}
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
            { text: 'Recorded', value: true },
            { text: 'Not Recorded', value: false },
          ],
          filterMode: 'tree',
          filterSearch: true,
          filterMultiple:true,
          onFilter: (value, record) => {return record.URL ? value : !value},
          render: (_, record) => (
            <>
            <Button disabled={!record.URL}
                    onClick={()=>showVideoInModal({
                      videoUID:record.UID,
                      id_club:record.id_club, 
                      weekday:record.Weekday, 
                      court_number:record.Court_Number, 
                      hour:record.originalHour, 
                      section:record.Hour_Section
                    })} 
                    target="_blank" 
                    className="mr-2 bg-blue-500" 
            >
                  {t('watch') || 'Watch'}
            </Button>
            </>
          ),    
        },
        {
          title: t('status') || 'Status',
          dataIndex: 'Blocked',
          key: 'Blocked',
          filters: [
            { text: 'Blocked', value: "Si" },
            { text: 'Not Blocked', value: "No" },
          ],
          filterMode: 'tree',
          filterSearch: true,
          filterMultiple:true,
          onFilter: (value, record) => {return record.Blocked===value},
          render: (_, record) => (
            <>
              <Button
                onClick={() => record.Blocked=="No" ? blockVideo(record.ID): unblockVideo(record.ID)}
                className={record.Blocked=="No" ? "bg-red-500" : "bg-green-500"}
              >
                {record.Blocked=="No" ? (t('block') || 'Block') : (t('unblock') || 'Unblock')}
              </Button>
            </>
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
          text: day,
          value: day,
        })),
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => {return record.Weekday===value}
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
      },
      {
        title: t('actions') || 'Actions',
        dataIndex: 'downloadURL',
        key: 'downloadURL',
        render: (_, record) => (
          <>
          <Button disabled={!record.URL}
                  onClick={()=>showVideoInModal({
                    videoUID:record.UID,
                    id_club:record.id_club,
                    Clip_Name:record.Clip_Name,
                    weekday:record.Weekday, 
                    court_number:record.Court_Number, 
                    hour:record.originalHour, 
                    section:record.Hour_Section
                  })} 
                  target="_blank" 
                  className="mr-2 bg-blue-500" 
          >
                {t('watch') || 'Watch'}
          </Button>
          {record.downloadURL && <Button className="" href={record.downloadURL}>{t('download') || 'Download'}</Button>}
          </>
        ),
        // render: (url2 ) => (url2 ? <Button className="" href={url2}>Link</Button> : 'No video'),
      },
      {
        title: 'Download URL',
        dataIndex: 'downloadURL',
        key: 'downloadURL',
        render: (downloadURL) => (downloadURL ? <Button className="" href={downloadURL}>Download</Button> : 'N/A'),
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
        render: (url) => (url ? <Button className="" href={url}>{t('link') || 'Link'}</Button> : 'No video'),
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
            <Button
              onClick={() =>
                handleStartLive(
                  record.ID,
                  record.court_number,
                  record.ip,
                  rtmpKeys[record.court_number] || "auto",
                  record.endpoint
                )
              }
              className="bg-green-500"
              disabled={isConnecting}
              loading={isConnecting}
            >
              {isConnecting ? (t('connecting') || 'Connecting...') : (t('startLive') || 'Start Live')}
            </Button>
          ) : (
            <Button 
              className="bg-red-500"
              onClick={() =>
                handleStopLive(
                  record.ID,
                  record.ip,
                  record.endpoint
                )
              }
              disabled={isConnecting}
              loading={isConnecting}
            >
              {isConnecting ? (t('stopping') || 'Stopping...') : (t('stopLive') || 'Stop Live')}
            </Button>
          );
        }
      },
    ];
  }
