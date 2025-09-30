import { useNavigate } from "react-router-dom";
import {
  Shield,
  FileText,
  ArrowRight,
  Cpu,
  Eye,
  Zap,
  Users,
  Award,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl">
          <Badge variant="info" className="mb-6">
            <Cpu className="mr-2" size={16} />
            AI-Powered Solutions
          </Badge>

          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Capstone
            </span>
            <br />
            <span className="text-white drop-shadow-lg">Project Suite</span>
          </h1>

          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Cutting-edge AI solutions for modern challenges. Experience the
            future of intelligent automation and security systems.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center" variant="glass">
              <div className="p-3 bg-blue-500/20 rounded-full w-fit mx-auto mb-4">
                <Eye className="text-blue-400" size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2 drop-shadow-sm">
                Real-time Monitoring
              </h3>
              <p className="text-gray-300 text-sm">
                Advanced computer vision for live detection
              </p>
            </Card>

            <Card className="p-6 text-center" variant="glass">
              <div className="p-3 bg-purple-500/20 rounded-full w-fit mx-auto mb-4">
                <Zap className="text-purple-400" size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2 drop-shadow-sm">
                Lightning Fast
              </h3>
              <p className="text-gray-300 text-sm">
                Optimized algorithms for instant results
              </p>
            </Card>

            <Card className="p-6 text-center" variant="glass">
              <div className="p-3 bg-green-500/20 rounded-full w-fit mx-auto mb-4">
                <Shield className="text-green-400" size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2 drop-shadow-sm">
                Secure & Private
              </h3>
              <p className="text-gray-300 text-sm">
                Enterprise-grade security standards
              </p>
            </Card>
          </div>
        </div>

        {/* Main Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <Card
            className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            variant="gradient"
            onClick={() => navigate("/cheating-detector")}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-blue-500/20 rounded-2xl group-hover:bg-blue-500/30 transition-colors">
                  <Shield className="text-blue-400" size={32} />
                </div>
                <Badge variant="success" size="sm">
                  <Users className="mr-1" size={12} />
                  Active
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-sm">
                AI Proctoring System
              </h2>

              <p className="text-gray-200 mb-6 leading-relaxed">
                Advanced real-time monitoring system powered by computer vision
                and machine learning for secure examination environments.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 shadow-sm"></div>
                  Face detection & tracking
                </div>
                <div className="flex items-center text-sm text-gray-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 shadow-sm"></div>
                  Multiple person detection
                </div>
                <div className="flex items-center text-sm text-gray-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 shadow-sm"></div>
                  Object & device detection
                </div>
                <div className="flex items-center text-sm text-gray-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 shadow-sm"></div>
                  Real-time violation alerts
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full group-hover:shadow-blue-500/25"
                rightIcon={<ArrowRight size={20} />}
              >
                Launch Proctoring System
              </Button>
            </div>
          </Card>

          <Card
            className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            variant="gradient"
            onClick={() => navigate("/resume-validity-checker")}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-purple-500/20 rounded-2xl group-hover:bg-purple-500/30 transition-colors">
                  <FileText className="text-purple-400" size={32} />
                </div>
                <Badge variant="warning" size="sm">
                  <Award className="mr-1" size={12} />
                  Beta
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-sm">
                Resume Validity Checker
              </h2>

              <p className="text-gray-200 mb-6 leading-relaxed">
                Intelligent document analysis tool that validates resume
                authenticity and detects potential inconsistencies or fabricated
                information.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-200">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 shadow-sm"></div>
                  AI-powered content analysis
                </div>
                <div className="flex items-center text-sm text-gray-200">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 shadow-sm"></div>
                  Fraud detection algorithms
                </div>
                <div className="flex items-center text-sm text-gray-200">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 shadow-sm"></div>
                  Consistency verification
                </div>
                <div className="flex items-center text-sm text-gray-200">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 shadow-sm"></div>
                  Detailed authenticity reports
                </div>
              </div>

              <Button
                variant="secondary"
                size="lg"
                className="w-full group-hover:shadow-purple-500/25"
                rightIcon={<ArrowRight size={20} />}
              >
                Launch Resume Checker
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm">
            <span>&copy; {new Date().getFullYear()}</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Capstone Project Team</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Powered by AI</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
