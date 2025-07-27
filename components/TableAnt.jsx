import React, { useEffect } from 'react';
import { Table, ConfigProvider, theme } from 'antd';

const App = ({ data, columns, needsExpand, needsVirtual }) => {
  // Ensure each row has a unique key
  const dataWithKeys = data.map((item, index) => ({
    ...item,
    key: index, // Use index as the key (or use a unique ID from your data if available)
  }));

  useEffect(() => {
    console.log('Data:', dataWithKeys);
  }
  , []);

  // Define the onChange handler for the table
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Table: {
            bodySortBg: "rgba(0,0,0,0)",
            algorithm: true,
            headerBg: "rgba(0,0,0,0)",
            colorBgContainer: "rgba(255,255,255,0)",
          },
        },
      }}
    >
      
      <Table
      className='px-2'
      columns={columns}
      dataSource={dataWithKeys}
      onChange={onChange}
      pagination={true}
      {...(needsVirtual ? { virtual: true } : {})}
      {...(needsExpand
        ? {
            expandable: {
              expandedRowRender: (record) => <p style={{ margin: 0 }}>Notes: {record.notes}</p>,
              rowExpandable: (record) => record.notes,
            },
          }
        : {})}
    />

    </ConfigProvider>
    
  );
};

export default App;