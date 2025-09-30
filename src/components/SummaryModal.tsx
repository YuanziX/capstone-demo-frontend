import { useAppStore, type ViolationInstance } from "../store/useAppStore";
import { X, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SummaryModal = ({ isOpen, onClose }: SummaryModalProps) => {
  const violations = useAppStore((state) => state.violations);

  if (!isOpen) {
    return null;
  }

  const formatInstance = (instance: ViolationInstance, index: number) => {
    // Ensure duration is calculated for any ongoing violations when the modal opens
    const duration = instance.endTime
      ? (instance.endTime - instance.startTime) / 1000
      : (Date.now() - instance.startTime) / 1000;

    const details = instance.details ? ` - ${instance.details}` : "";
    return `Instance ${index + 1}: ${duration.toFixed(1)}s${details}`;
  };

  const totalViolations = Object.values(violations).reduce(
    (sum, data) => sum + data.count,
    0
  );
  const hasViolations = totalViolations > 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <Card
        className="w-full max-w-4xl max-h-[85vh] flex flex-col transform animate-in slide-in-from-bottom-4 duration-300"
        variant="gradient"
        padding="none"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-xl ${
                hasViolations ? "bg-red-500/20" : "bg-green-500/20"
              }`}
            >
              {hasViolations ? (
                <AlertTriangle className="text-red-400" size={24} />
              ) : (
                <CheckCircle className="text-green-400" size={24} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <FileText size={24} />
                <span>Session Summary</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {hasViolations
                  ? `${totalViolations} violations detected`
                  : "Clean session - no violations"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="!p-2">
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {hasViolations ? (
            <div className="grid gap-4">
              {Object.entries(violations).map(
                ([type, data]) =>
                  data.count > 0 && (
                    <Card key={type} className="p-4" variant="glass">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white capitalize">
                            {type.replace(/([A-Z])/g, " $1").trim()}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Violation details and timeline
                          </p>
                        </div>
                        <Badge
                          variant={
                            data.count > 5
                              ? "danger"
                              : data.count > 2
                              ? "warning"
                              : "info"
                          }
                          size="lg"
                        >
                          {data.count} occurrences
                        </Badge>
                      </div>

                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {data.instances.map((instance, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-white/5"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">
                                {index + 1}
                              </div>
                              <div>
                                <div className="text-white text-sm font-medium">
                                  Instance {index + 1}
                                </div>
                                {instance.details && (
                                  <div className="text-gray-400 text-xs">
                                    {instance.details}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400 text-xs">
                              <Clock size={12} />
                              <span>
                                {formatInstance(instance, index).split(": ")[1]}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-6 bg-green-500/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Perfect Session!
              </h3>
              <p className="text-gray-400">
                No violations were detected during this monitoring session.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            Session completed at {new Date().toLocaleTimeString()}
          </div>
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Review Later
            </Button>
            <Button variant="primary" onClick={onClose}>
              Close Summary
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryModal;
