import { useAppStore, type ViolationInstance } from "../store/useAppStore";
import { X } from "lucide-react";

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

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Modal Content */}
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-cyan-400">Violation Summary</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {Object.entries(violations).map(([type, data]) => (
            <div key={type}>
              <h3 className="text-lg font-semibold mb-2 capitalize">
                {type.replace(/([A-Z])/g, " $1").trim()} -
                <span className="text-yellow-400"> Total: {data.count}</span>
              </h3>
              {data.instances.length > 0 ? (
                <ul className="list-disc list-inside bg-gray-900 p-3 rounded-md space-y-1 text-gray-300">
                  {data.instances.map((instance, index) => (
                    <li key={index}>{formatInstance(instance, index)}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic px-3">
                  No violations of this type recorded.
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
