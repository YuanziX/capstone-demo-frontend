import { useEffect, forwardRef } from "react";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import Card from "./ui/Card";

interface WebcamFeedProps {
  onStream: (stream: MediaStream) => void;
}

const WebcamFeed = forwardRef<HTMLVideoElement, WebcamFeedProps>(
  ({ onStream }, ref) => {
    useEffect(() => {
      let stream: MediaStream | null = null;
      const setupWebcam = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: false,
          });

          const video = ref && "current" in ref ? ref.current : null;
          if (video) {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
              video.play();
              if (stream) {
                onStream(stream);
              }
            };
          }
        } catch (err) {
          console.error("Error accessing webcam:", err);
          toast.error(
            "Could not access the webcam. Please grant permission and refresh."
          );
        }
      };

      setupWebcam();

      return () => {
        stream?.getTracks().forEach((track) => track.stop());
      };
    }, [ref, onStream]);

    return (
      <Card
        className="relative w-full max-w-2xl overflow-hidden"
        variant="glass"
        padding="none"
      >
        <div className="relative bg-gray-900/50">
          <video
            ref={ref}
            playsInline
            className="w-full h-full transform -scale-x-100 rounded-2xl"
          />

          {/* Status indicators */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <div className="flex items-center bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full border border-white/30 shadow-lg">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2 shadow-sm"></div>
              <span className="font-medium drop-shadow-sm">LIVE</span>
            </div>
          </div>

          <div className="absolute top-4 right-4">
            <div className="p-2 bg-black/70 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
              <Camera className="text-white drop-shadow-sm" size={16} />
            </div>
          </div>

          {/* Webcam frame overlay */}
          <div className="absolute inset-4 border-2 border-blue-400/40 rounded-xl pointer-events-none shadow-sm">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-300 rounded-tl-lg shadow-sm"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-300 rounded-tr-lg shadow-sm"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-300 rounded-bl-lg shadow-sm"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-300 rounded-br-lg shadow-sm"></div>
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full border border-white/30 flex items-center justify-between shadow-lg">
              <span className="font-medium drop-shadow-sm">Camera Feed</span>
              <span className="text-green-300 drop-shadow-sm">●</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }
);

export default WebcamFeed;
