import React, { useEffect, useRef, useState } from 'react';
import {Typography,Box ,Button, TextField} from '@mui/material';

const WebCam = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [serverResponse, setServerResponse] = useState('');
  const [prompt,setPrompt]=useState('');

  const enableWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  };

  const disableWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  };

  const captureImage = async () => {
    if (!stream) {
      console.error('Webcam stream not available');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(sendImageToServer, 'image/jpeg');
  };

  const sendImageToServer = async (blob) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);

    reader.onloadend = async () => {
      const octetStream = reader.result;
      var response = await fetch('http://localhost:5000/image', {
        method: 'POST',
        body: octetStream,
        headers: {
          'Content-Type': 'application/octet-stream',
          'prompt':prompt
        },
      });
      var data=await response.json();
      setServerResponse(data.message);
    };
  };

  useEffect(() => {
    return () => {
      disableWebcam();
    };
  }, []);

  return (
    <div>
    <Box style={{marginTop:"20px",marginBottom:"20px",marginLeft:"10px"}}><Typography variant="h5">Gemini Webcam App</Typography></Box>
      <Box style={{display:"flex"}}>
      <Box style={{marginLeft:"10px"}}> <video ref={videoRef} width="640" height="480" autoPlay></video></Box>
      <Box style={{marginLeft:"30px"}}>
        <h2>Gemini Response:</h2>
        <Typography>Q: {prompt}<br></br>A: {serverResponse}</Typography>
      </Box>
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
        <Button onClick={enableWebcam} disabled={!!stream}>
          Start Camera
        </Button>
        <Button onClick={disableWebcam} disabled={!stream}>
          Close Camera
        </Button>
      </Box>
      <Box style={{display:"flex",justifyContent:"center"}}>
        <TextField onChange={(e)=>setPrompt(e.target.value)}></TextField>
        <Button onClick={captureImage} disabled={!stream}>
          Chat to Gemini
        </Button>
      </Box>
    </div>
  );
};

export default WebCam;
