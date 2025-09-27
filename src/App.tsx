import { useRef, useEffect, useState } from "react";
import WebcamFeed from "./components/WebcamFeed";
import ViolationTracker from "./components/ViolationTracker";
import { useAppStore, type ViolationType } from "./store/useAppStore";
import {
  initializeDetector,
  startDetection,
  stopDetection,
} from "./services/cheatingDetector";
import { PlayCircle, StopCircle, Loader2 } from "lucide-react";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    addLog,
    isDetectorReady,
    setDetectorReady,
    startViolation,
    endViolation,
    resetViolations,
  } = useAppStore();

  const [isDetecting, setIsDetecting] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDetector();
        setDetectorReady(true);
      } catch {
        alert("Failed to initialize AI model. Check the console for details.");
      }
    };
    init();
  }, [setDetectorReady]);

  const handleViolationStart = (type: ViolationType) => startViolation(type);
  const handleViolationEnd = (type: ViolationType) => endViolation(type);

  const handleStart = () => {
    if (videoRef.current) {
      resetViolations();
      setIsDetecting(true);
      startDetection(
        videoRef.current,
        handleViolationStart,
        handleViolationEnd
      );
      addLog("✅ Detection started.");
    }
  };

  const handleStop = () => {
    setIsDetecting(false);
    Object.keys(useAppStore.getState().violations).forEach((type) => {
      endViolation(type as ViolationType);
    });
    stopDetection();
    addLog("⏹️ Detection stopped.");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-4xl font-bold text-cyan-400">Proctoring Demo</h1>

      <div className="flex w-full max-w-7xl flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 items-center md:items-start">
        {/* Left Column */}
        <div className="flex flex-col items-center space-y-4 w-full">
          <WebcamFeed ref={videoRef} onStream={setWebcamStream} />

          <div className="flex space-x-4">
            <button
              onClick={handleStart}
              disabled={!isDetectorReady || isDetecting || !webcamStream}
              className="px-6 py-2 bg-green-600 rounded-lg font-semibold flex items-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-500 transition-colors"
            >
              {isDetectorReady ? (
                <PlayCircle />
              ) : (
                <Loader2 className="animate-spin" />
              )}
              <span>Start Detection</span>
            </button>
            <button
              onClick={handleStop}
              disabled={!isDetecting}
              className="px-6 py-2 bg-red-600 rounded-lg font-semibold flex items-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-red-500 transition-colors"
            >
              <StopCircle />
              <span>Stop Detection</span>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full">
          <ViolationTracker />
        </div>
      </div>
    </div>
  );
}

export default App;
