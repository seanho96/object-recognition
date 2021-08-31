import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
// import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [objectName, setObjectName] = useState(null);
  const [isInitialised, setInitialised] = useState(false);

  // Main function
  const runCoco = async () => {
    // Load network
    const net = await cocossd.load();

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const drawRect = (detections, ctx) => {
    // Loop through each prediction
    detections.forEach((prediction) => {
      // Extract boxes and classes
      const [x, y, width, height] = prediction["bbox"];
      const text = prediction["class"];
      const accuracy = prediction["score"];

      // Set styling
      const color = "#51ff0d";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.font = "36px Arial";

      // Draw rectangles and text
      ctx.beginPath();
      ctx.fillText(`${Math.floor(accuracy * 100)}%`, x, y - 10);
      ctx.fillText(text, x + 85, y - 10);
      ctx.rect(x, y, width, height);
      ctx.stroke();

      // Set object name state
      setObjectName(text);
    });
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // Update drawing utility
      drawRect(obj, ctx);
    }
  };

  // Video Constraints for using back-facing camera
  // const videoConstraints = {
  //   facingMode: { exact: "user" }
  // };

  useEffect(() => {
    runCoco();

    const initWebcam = setTimeout(() => setInitialised(true), 2500);

    return () => clearTimeout(initWebcam);
    // eslint-disable-next-line
  }, []);

  const WebcamWrapper = () => {
    return isInitialised ? (
      <Webcam
        ref={webcamRef}
        muted={true}
        // videoConstraints={videoConstraints}
        style={{
          textAlign: "center",
          width: "100%",
          height: "100%",
        }}
      />
    ) : (
      <div className="Initialise-wrapper">
        <div>Initialising your camera...</div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="App-content">
        <div className="Video-wrapper">
          <WebcamWrapper />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              textAlign: "center",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className="Text-wrapper">
          <div className="Text-bubble">
            <p className="Text-paragraph">
              Hey NoonGil, please describe what's that in front of me?
            </p>
          </div>
        </div>
        <div className="Text-paragraph-wrapper">{objectName}</div>
      </div>
    </div>
  );
}

export default App;
