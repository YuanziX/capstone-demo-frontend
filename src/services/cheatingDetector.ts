import {
  FaceLandmarker,
  FilesetResolver,
  ObjectDetector,
} from "@mediapipe/tasks-vision";
import { type ViolationType } from "../store/useAppStore";

const LOOK_AWAY_THRESHOLD_SECONDS = 0.2;
const PROHIBITED_OBJECTS = [
  "cell phone",
  "book",
  "laptop",
  "keyboard",
  "remote",
  "mouse",
];

// Service-level state variables
let faceLandmarker: FaceLandmarker | null = null;
let objectDetector: ObjectDetector | null = null;
let detectionInterval: number | null = null;
let lastVideoTime = -1;

// Timers and flags to track violation states
let lookAwayStartTime: number | null = null;
let isLookingAwayViolationActive = false;
let isNoFaceViolationActive = false;
let isMultipleFacesViolationActive = false;
let isObjectViolationActive = false;

export const initializeDetector = async (): Promise<void> => {
  try {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    // Initialize both models in parallel for faster loading
    await Promise.all([
      FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `/models/face_landmarker.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 2,
      }).then((detector) => {
        faceLandmarker = detector;
      }),

      ObjectDetector.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `/models/efficientdet_lite0.tflite`,
          delegate: "CPU",
        },
        runningMode: "VIDEO",
        scoreThreshold: 0.5,
      }).then((detector) => {
        objectDetector = detector;
      }),
    ]);

    console.log("✅ Both detectors are ready.");
  } catch (error) {
    console.error("❌ Failed to initialize detectors:", error);
    throw error;
  }
};

const resetInternalState = () => {
  lookAwayStartTime = null;
  isLookingAwayViolationActive = false;
  isNoFaceViolationActive = false;
  isMultipleFacesViolationActive = false;
  isObjectViolationActive = false;
  lastVideoTime = -1;
};

export const startDetection = (
  videoElement: HTMLVideoElement,
  onViolationStart: (type: ViolationType, details?: string) => void,
  onViolationEnd: (type: ViolationType) => void
) => {
  if (!faceLandmarker || !objectDetector) {
    console.error("Detectors not initialized. Call initializeDetector first.");
    return;
  }
  resetInternalState();

  const detect = () => {
    const now = performance.now();
    if (!faceLandmarker || !objectDetector) {
      return;
    }

    if (videoElement.currentTime !== lastVideoTime) {
      lastVideoTime = videoElement.currentTime;
      const faceResults = faceLandmarker.detectForVideo(videoElement, now);
      const objectResults = objectDetector.detectForVideo(videoElement, now);

      const firstProhibitedDetection = objectResults.detections.find(
        (detection) =>
          PROHIBITED_OBJECTS.includes(detection.categories[0].categoryName)
      );

      if (firstProhibitedDetection && !isObjectViolationActive) {
        isObjectViolationActive = true;
        onViolationStart(
          "ObjectDetected",
          firstProhibitedDetection.categories[0].categoryName
        );
      } else if (!firstProhibitedDetection && isObjectViolationActive) {
        isObjectViolationActive = false;
        onViolationEnd("ObjectDetected");
      }

      const faceCount = faceResults.faceLandmarks.length;

      // --- No Face Detection ---
      if (faceCount === 0 && !isNoFaceViolationActive) {
        isNoFaceViolationActive = true;
        onViolationStart("NoFace");
      } else if (faceCount > 0 && isNoFaceViolationActive) {
        isNoFaceViolationActive = false;
        onViolationEnd("NoFace");
      }

      // --- Multiple Faces Detection ---
      if (faceCount > 1 && !isMultipleFacesViolationActive) {
        isMultipleFacesViolationActive = true;
        onViolationStart("MultipleFaces");
      } else if (faceCount <= 1 && isMultipleFacesViolationActive) {
        isMultipleFacesViolationActive = false;
        onViolationEnd("MultipleFaces");
      }

      // --- Looking Away Detection (only if one face is present) ---
      if (faceCount === 1) {
        const landmarks = faceResults.faceLandmarks[0];
        const nose = landmarks[1];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        const eyeDist = Math.abs(rightEye.x - leftEye.x);
        const noseToLeftDist = Math.abs(nose.x - leftEye.x);
        const ratio = noseToLeftDist / eyeDist;
        const isCurrentlyLookingAway = ratio < 0.35 || ratio > 0.65;

        if (isCurrentlyLookingAway) {
          if (lookAwayStartTime === null) {
            lookAwayStartTime = now;
          } else if (
            !isLookingAwayViolationActive &&
            (now - lookAwayStartTime) / 1000 > LOOK_AWAY_THRESHOLD_SECONDS
          ) {
            isLookingAwayViolationActive = true;
            onViolationStart("LookingAway");
          }
        } else {
          if (isLookingAwayViolationActive) {
            isLookingAwayViolationActive = false;
            onViolationEnd("LookingAway");
          }
          lookAwayStartTime = null;
        }
      } else if (isLookingAwayViolationActive) {
        isLookingAwayViolationActive = false;
        onViolationEnd("LookingAway");
      }
    }
    detectionInterval = requestAnimationFrame(detect);
  };

  detect();
};

export const stopDetection = () => {
  if (detectionInterval) {
    cancelAnimationFrame(detectionInterval);
    detectionInterval = null;
    console.log("⏹️ Detection stopped.");
  }
};
