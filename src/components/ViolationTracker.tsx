import { useAppStore, type ViolationType } from "../store/useAppStore";
import { AlertTriangle, User, Users, EyeOff, Smartphone } from "lucide-react";

const icons: Record<ViolationType, React.ReactNode> = {
  NoFace: <User size={20} className="mr-2" />,
  MultipleFaces: <Users size={20} className="mr-2" />,
  LookingAway: <EyeOff size={20} className="mr-2" />,
  ObjectDetected: <Smartphone size={20} className="mr-2" />,
};

const ViolationTracker = () => {
  const violations = useAppStore((state) => state.violations);

  const formatDuration = (instance: {
    startTime: number;
    endTime: number | null;
    details?: string;
  }) => {
    let durationText;
    if (instance.endTime === null) {
      const elapsed = (Date.now() - instance.startTime) / 1000;
      durationText = `${elapsed.toFixed(1)}s (ongoing)`;
    } else {
      const duration = (instance.endTime - instance.startTime) / 1000;
      durationText = `${duration.toFixed(1)}s`;
    }
    return instance.details
      ? `${durationText} - ${instance.details}`
      : durationText;
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800 text-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <AlertTriangle className="mr-2 text-yellow-400" size={20} />
        Violation Tracker
      </h2>
      <div className="space-y-3">
        {Object.entries(violations).map(([type, data]) => {
          const lastInstance = data.instances[data.instances.length - 1];
          const isOngoing = lastInstance && lastInstance.endTime === null;
          return (
            <div
              key={type}
              className={`p-3 rounded-lg transition-all ${
                isOngoing
                  ? "bg-red-900/50 border border-red-500"
                  : "bg-gray-700"
              }`}
            >
              <div className="flex justify-between items-center font-semibold">
                <span className="flex items-center">
                  {icons[type as ViolationType]}
                  {type.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span>Count: {data.count}</span>
              </div>
              {lastInstance && (
                <div className="text-right text-sm text-gray-400 mt-1">
                  Last instance: {formatDuration(lastInstance)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViolationTracker;
