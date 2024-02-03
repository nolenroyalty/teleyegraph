import React from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

function useLandmarker() {
  const [landmarker, setLandmarker] = React.useState(null);

  React.useEffect(() => {
    console.log("useLandmarker");
    async function getFilesetResolver() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      return filesetResolver;
    }

    async function getLandmarker() {
      const filesetResolver = await getFilesetResolver();
      return FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });
    }

    getLandmarker().then((landmarker) => {
      setLandmarker(landmarker);
    });
  }, []);

  return landmarker;
}

export default useLandmarker;
