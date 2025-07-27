import { Button, Input, Table, Modal } from "antd";
import { useState } from "react";
import VideoPlayer from "../videoView/VideoPlayer"; // Adjust the import path as needed

export const videosColumns = (videos, showVideoInModal, blockVideo, unblockVideo) => {
  const uniqueCourtNumbers = [...new Set(videos.map(item => item.Court_Number))];
  const uniqueDays = [...new Set(videos.map(item => item.Weekday))];
  return [
    {
      title: 'Day',
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
      title: 'Court',
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
      title: 'Hour',
      dataIndex: 'Hour',
      key: 'Hour',
    },
    {
      title: 'Actions',
      children:[
        {
          title: 'Recorded',
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
                  Watch
            </Button>
            </>
          ),    
        },
        {
          title: 'Status',
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
                {record.Blocked=="No" ? "Block" : "Unblock"}
              </Button>
            </>
          ),    
        },

      ]    
    }
  ];
}

  export const clipsColumns = (clips, showVideoInModal) => {
    const uniqueDays = [...new Set(clips.map(item => item.Weekday))];
    return [
      {
        title: 'Day',
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
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },    
      {
        title: 'Tag',
        dataIndex: 'tag',
        key: 'tag',
      },
      {
        title: 'Actions',
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
                Watch
          </Button>
          {record.downloadURL && <Button className="" href={record.downloadURL}>Download</Button>}
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

  export const livesColumns = (cameras, rtmpKeys, handleInputChange, handleStartLive, handleStopLive, connectingCameras) => {
    return [
      {
        title: 'Court',
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
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Link',
        dataIndex: 'url',
        key: 'url',
        render: (url) => (url ? <Button className="" href={url}>Link</Button> : 'No video'),
      },
      {
        title: 'Notes',
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
        title: 'Actions',
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
              {isConnecting ? "Connecting..." : "Start Live"}
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
              {isConnecting ? "Stopping..." : "Stop Live"}
            </Button>
          );
        }
      },
    ];
  }
