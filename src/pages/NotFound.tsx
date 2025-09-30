import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search, AlertTriangle, Zap } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Main Error Display */}
        <div className="text-center mb-12 max-w-2xl">
          <Badge variant="danger" className="mb-6 animate-pulse">
            <AlertTriangle className="mr-2" size={16} />
            Error 404
          </Badge>

          {/* Large 404 Display */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-black mb-4">
              <span className="bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
                404
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-red-400 to-orange-400 mx-auto rounded-full"></div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Page Not Found
          </h2>

          <p className="text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md">
            Oops! The page you're looking for seems to have vanished into the
            digital void. Don't worry, our AI hasn't detected any suspicious
            activity here.
          </p>

          {/* Error Details Card */}
          <Card className="mb-12 text-left" variant="gradient">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-red-500/20 rounded-full border border-red-400/20">
                <Search className="text-red-300" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-sm">
                  What happened?
                </h3>
                <div className="space-y-2 text-gray-200">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3 shadow-sm"></div>
                    The requested URL was not found on this server
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 shadow-sm"></div>
                    The page may have been moved or deleted
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 shadow-sm"></div>
                    Check the URL for any typos or errors
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/")}
            leftIcon={<Home size={20} />}
            className="group-hover:shadow-blue-500/25"
          >
            Return Home
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft size={20} />}
          >
            Go Back
          </Button>
        </div>

        {/* Quick Navigation */}
        <Card className="w-full max-w-md" variant="glass">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center drop-shadow-sm">
            <div className="p-2 bg-blue-500/20 rounded-lg mr-3 border border-blue-400/20">
              <Zap className="text-blue-300" size={18} />
            </div>
            Quick Navigation
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full p-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border border-white/5 text-left transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium group-hover:text-blue-300 transition-colors">
                    Landing Page
                  </div>
                  <div className="text-gray-300 text-sm">
                    Explore our AI solutions
                  </div>
                </div>
                <ArrowLeft
                  className="text-gray-400 group-hover:text-blue-300 transition-colors transform rotate-180"
                  size={16}
                />
              </div>
            </button>

            <button
              onClick={() => navigate("/cheating-detector")}
              className="w-full p-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border border-white/5 text-left transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium group-hover:text-green-300 transition-colors">
                    AI Proctoring System
                  </div>
                  <div className="text-gray-300 text-sm">
                    Real-time monitoring
                  </div>
                </div>
                <ArrowLeft
                  className="text-gray-400 group-hover:text-green-300 transition-colors transform rotate-180"
                  size={16}
                />
              </div>
            </button>
          </div>
        </Card>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm">
            <span>&copy; {new Date().getFullYear()}</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Capstone Project Team</span>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <span>Error 404</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
