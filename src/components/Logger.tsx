import { useAppStore } from "../store/useAppStore";
import { Terminal, Circle } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

const Logger = () => {
  const logs = useAppStore((state) => state.logs);

  return (
    <Card className="w-full max-w-2xl" variant="glass">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center drop-shadow-sm">
          <div className="p-2 bg-green-500/20 rounded-lg mr-3 border border-green-400/20">
            <Terminal className="text-green-300" size={20} />
          </div>
          Event Log
        </h2>
        <Badge variant="success" size="sm">
          {logs.length}
        </Badge>
      </div>

      <Card className="h-48 overflow-hidden" variant="default" padding="none">
        <div className="h-full overflow-y-auto bg-gray-900/80 p-4 font-mono text-sm space-y-2">
          {logs.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-300">
              <div className="text-center">
                <Circle className="mx-auto mb-2 opacity-60" size={24} />
                <p>Waiting for events...</p>
              </div>
            </div>
          )}
          {logs
            .slice()
            .reverse()
            .map((log, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/60 hover:bg-gray-800/80 transition-all duration-200 border border-green-500/20"
              >
                <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0 animate-pulse shadow-sm"></div>
                <div className="flex-1">
                  <div className="text-gray-300 text-xs mb-1">
                    {log.timestamp}
                  </div>
                  <div className="text-green-300">{log.message}</div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </Card>
  );
};

export default Logger;
