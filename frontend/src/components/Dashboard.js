import { Button, TextField } from "@mui/material";
import React from "react";
import Webcam from "react-webcam";

function Dashboard() {

  const mediaStream = new MediaRecorder()

  const startCapture = () => {
    
  }


  return (
    <>
      <div className="md:container md:mx-auto p-5">
        <h1 className="text-center">Start your live STREAM!!!!</h1>
        <div className="flex flex-wrap justify-center gap-5">
          {/* <p>Enter a topic</p> */}
          <TextField className="w-3/4" label="Enter a topic" />
          {/* <p>Give a brief description</p> */}
          <TextField className="w-3/4" label="Give a brief description" />
          <div className="breaker"/>
          <Button className="w-1/5 p-5">Start</Button>
        </div>

        {/* container for video streaming */}
        <div className="panel w-full h-[32rem] bg-slate-500">
          <Webcam className="w-1/5 bottom-0 left-0 m-auto"/>
        </div>
        <Button onClick={startCapture}>Start</Button>

      </div>

    </>
  );
}

export default Dashboard;
