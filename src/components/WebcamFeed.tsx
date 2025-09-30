import { useEffect, forwardRef } from "react";
import { toast } from "sonner";

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
      <div className="relative w-full max-w-2xl bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <video
          ref={ref}
          playsInline
          className="w-full h-full transform -scale-x-100"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          CAM FEED
        </div>
      </div>
    );
  }
);

export default WebcamFeed;
