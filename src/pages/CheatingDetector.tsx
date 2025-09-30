import { useRef, useEffect, useState } from "react";
import WebcamFeed from "../components/WebcamFeed";
import ViolationTracker from "../components/ViolationTracker";
import Logger from "../components/Logger";
import SummaryModal from "../components/SummaryModal";
import { useAppStore, type ViolationType } from "../store/useAppStore";
import {
  initializeDetector,
  startDetection,
  stopDetection,
} from "../services/cheatingDetector";
import {
  PlayCircle,
  StopCircle,
  Loader2,
  Shield,
  Eye,
  Cpu,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function CheatingDetector() {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDetector();
        setDetectorReady(true);
      } catch {
        toast.error(
          "Failed to initialize AI model. Check the console for details."
        );
      }
    };
    init();
  }, [setDetectorReady]);

  const handleViolationStart = (type: ViolationType, details?: string) =>
    startViolation(type, details);
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
    setIsModalOpen(true); // Open the modal
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="relative z-10">
          <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-400/20">
                    <Shield className="text-blue-300" size={32} />
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
                    AI Proctoring System
                  </h1>
                </div>
                <p className="text-gray-200 text-lg max-w-2xl mx-auto drop-shadow-sm">
                  Advanced real-time monitoring powered by machine learning for
                  secure examination environments
                </p>
              </div>

              {/* Status Bar */}
              <Card className="mb-8" variant="glass">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Cpu className="text-blue-300" size={20} />
                      <span className="text-sm text-gray-200 font-medium">
                        AI Model:
                      </span>
                      <Badge
                        variant={isDetectorReady ? "success" : "warning"}
                        size="sm"
                      >
                        {isDetectorReady ? "Ready" : "Loading"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="text-green-300" size={20} />
                      <span className="text-sm text-gray-200 font-medium">
                        Camera:
                      </span>
                      <Badge
                        variant={webcamStream ? "success" : "danger"}
                        size="sm"
                      >
                        {webcamStream ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="text-yellow-300" size={20} />
                      <span className="text-sm text-gray-200 font-medium">
                        Status:
                      </span>
                      <Badge
                        variant={isDetecting ? "success" : "default"}
                        size="sm"
                        pulse={isDetecting}
                      >
                        {isDetecting ? "Monitoring" : "Standby"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleStart}
                      disabled={
                        !isDetectorReady || isDetecting || !webcamStream
                      }
                      variant="success"
                      size="md"
                      isLoading={!isDetectorReady}
                      leftIcon={
                        isDetectorReady ? (
                          <PlayCircle size={20} />
                        ) : (
                          <Loader2 className="animate-spin" size={20} />
                        )
                      }
                    >
                      {isDetecting ? "Monitoring Active" : "Start Detection"}
                    </Button>
                    <Button
                      onClick={handleStop}
                      disabled={!isDetecting}
                      variant="danger"
                      size="md"
                      leftIcon={<StopCircle size={20} />}
                    >
                      Stop & Analyze
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Webcam Feed - Takes 2 columns on large screens */}
              <div className="lg:col-span-2 space-y-6">
                <WebcamFeed ref={videoRef} onStream={setWebcamStream} />
                <Logger />
              </div>

              {/* Violation Tracker - Takes 1 column */}
              <div className="space-y-6">
                <ViolationTracker />

                {/* Quick Stats */}
                <Card variant="glass">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center drop-shadow-sm">
                    <div className="p-2 bg-purple-500/20 rounded-lg mr-3 border border-purple-400/20">
                      <Eye className="text-purple-300" size={18} />
                    </div>
                    Session Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                      <span className="text-gray-200 text-sm font-medium">
                        Detection Time
                      </span>
                      <Badge variant="info" size="sm">
                        {isDetecting ? "Active" : "Stopped"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                      <span className="text-gray-200 text-sm font-medium">
                        AI Confidence
                      </span>
                      <Badge variant="success" size="sm">
                        {isDetectorReady ? "High" : "N/A"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                      <span className="text-gray-200 text-sm font-medium">
                        Frame Rate
                      </span>
                      <Badge variant="success" size="sm">
                        30 FPS
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
