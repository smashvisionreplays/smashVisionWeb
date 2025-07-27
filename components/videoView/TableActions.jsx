import React from 'react';
import { Button, Space, Table, ConfigProvider, theme } from 'antd';

const BestPointsTable = ({ data, onWatch }) => {
  const columns = [
    {
      title: 'Best Points',
      dataIndex: 'bestPoint',
      key: 'bestPoint',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button onClick={() => onWatch(record)} type="primary" size="small">
            Watch
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Table: {
            bodySortBg: "rgba(0,0,0,0)",
            headerBg: "rgba(0,0,0,0)",
            colorBgContainer: "rgba(255,255,255,0.05)",
          },
        },
      }}
    >
      <Table 
        columns={columns} 
        dataSource={data} 
        size="small"
        pagination={false}
      />
    </ConfigProvider>
  );
};

export default BestPointsTable;