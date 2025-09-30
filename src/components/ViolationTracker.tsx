import { useAppStore, type ViolationType } from "../store/useAppStore";
import {
  AlertTriangle,
  User,
  Users,
  EyeOff,
  Smartphone,
  Clock,
} from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

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
    <Card className="w-full max-w-2xl" variant="glass">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center drop-shadow-sm">
          <div className="p-2 bg-yellow-500/20 rounded-lg mr-3 border border-yellow-400/20">
            <AlertTriangle className="text-yellow-300" size={20} />
          </div>
          Violation Monitor
        </h2>
        <Badge variant="info" className="animate-pulse">
          Live
        </Badge>
      </div>

      <div className="space-y-4">
        {Object.entries(violations).map(([type, data]) => {
          const lastInstance = data.instances[data.instances.length - 1];
          const isOngoing = lastInstance && lastInstance.endTime === null;
          return (
            <Card
              key={type}
              className={`transition-all duration-300 hover:scale-[1.02] ${
                isOngoing
                  ? "bg-red-500/10 border-red-500/50 shadow-red-500/20"
                  : "bg-white/5 hover:bg-white/10"
              }`}
              padding="md"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isOngoing ? "bg-red-500/20" : "bg-gray-500/20"
                    }`}
                  >
                    {icons[type as ViolationType]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm drop-shadow-sm">
                      {type.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    {lastInstance && (
                      <div className="flex items-center text-xs text-gray-300 mt-1">
                        <Clock size={12} className="mr-1" />
                        {formatDuration(lastInstance)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      isOngoing
                        ? "danger"
                        : data.count > 0
                        ? "warning"
                        : "default"
                    }
                    pulse={isOngoing}
                    size="sm"
                  >
                    {data.count}
                  </Badge>
                  {isOngoing && (
                    <div className="text-xs text-red-300 mt-1 font-medium drop-shadow-sm">
                      Active
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {Object.keys(violations).length === 0 && (
          <div className="text-center py-8">
            <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-green-400/20">
              <AlertTriangle className="text-green-300" size={24} />
            </div>
            <p className="text-gray-200 text-sm">No violations detected</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ViolationTracker;
