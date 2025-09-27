import { useAppStore } from "../store/useAppStore";
import { List } from "lucide-react";

const Logger = () => {
  const logs = useAppStore((state) => state.logs);

  return (
    <div className="w-full max-w-2xl bg-gray-800 text-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold mb-2 flex items-center">
        <List className="mr-2" size={20} /> Event Log
      </h2>
      <div className="h-48 overflow-y-auto bg-gray-900 rounded p-2 font-mono text-sm space-y-1">
        {logs.length === 0 && <p className="text-gray-500">No events yet...</p>}
        {logs
          .slice()
          .reverse()
          .map((log, index) => (
            <p key={index} className="text-green-400">
              <span className="text-gray-400 mr-2">{log.timestamp}</span>
              {log.message}
            </p>
          ))}
      </div>
    </div>
  );
};

export default Logger;
