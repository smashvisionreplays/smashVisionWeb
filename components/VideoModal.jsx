import React, { useState, useRef, useEffect} from 'react';
import { Button, Modal, ConfigProvider, theme  } from 'antd';
import VideoPlayer from "../components/videoView/VideoPlayer";
import { useNavigate } from "react-router-dom";

const App = ({videoData, isModalOpen, handleOk, handleCancel}) => {
    const videoRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    let navigate = useNavigate();

  useEffect(() => {
    if (!isModalOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isModalOpen]); 

  const handleGoToCreateClip= ()=>{
    navigate(`/videoView`, 
        { state: videoData
      });
  }

  const buildFooter = () => {
    return [
      <div key={"footer"}>
      <Button key="close" onClick={handleCancel}>
        Close
      </Button>
      
      {!videoData?.Clip_Name &&
        <Button key="submit" type="primary" loading={false} onClick={handleGoToCreateClip}>
          Create Clip
        </Button>
      }
      </div>
    ];
  }

  return (
    <>
    <ConfigProvider
    modal={{
        styles: {
            body: {
                boxShadow: 'inset 0 0 5px #999',
                borderRadius: 5,
              },
            mask: {
                backdropFilter: 'blur(10px)',
              },
        }
    }}
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
    
    <Modal 
        title="Video"  
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={buildFooter}
          width={{
            xs: '90%',
            sm: '80%',
            md: '70%',
            lg: '60%',
            xl: '50%',
            xxl: '40%',
          }}
    
    >
        <VideoPlayer videoRef={videoRef} onVideoLoaded={setIsVideoLoaded} uid={videoData?.videoUID} />
    </Modal>
    
  </ConfigProvider>
      
    </>
  );
};
export default App;