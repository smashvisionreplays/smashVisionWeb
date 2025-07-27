import React from 'react';
import {ConfigProvider, Steps, theme } from 'antd';
// const description2 = 'This is a description.';
// const items2 = [
//   {
//     title: 'Finished',
//     description: description2,
//   },
//   {
//     title: 'In Progress',
//     description: description2,
//   },
//   {
//     title: 'Waiting',
//     description: description2,
//   },
// ];
const ProgressBar = ({items, current, percent, status}) => (
  <>
  <ConfigProvider
    theme={{
      
      algorithm:theme.darkAlgorithm,
      components:{
        Steps:{
          colorPrimary:'#c7f607',
          navArrowColor:'#c7f607',
          algorithm:true,
          colorTextDescription:"#8b8a8f",
        }
      }
    }}
  >
    
    <Steps items={items} current={current} percent={percent} size="small" labelPlacement="horizontal" />
    <br />
    
  </ConfigProvider>
  
    
  </>
);
export default ProgressBar;