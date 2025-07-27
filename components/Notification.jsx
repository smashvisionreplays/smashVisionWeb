import React from 'react';
import { Alert } from 'antd';
const App = ({type, message, description}) => (
  <>
   
   <Alert
      message={message}
      description={description}
      type={type}
      showIcon
      className='w-full h-min'
    />
    
  </>
);
export default App;