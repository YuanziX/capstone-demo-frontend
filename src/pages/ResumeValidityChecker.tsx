import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Eye,
  Settings,
  Zap,
  Clock,
  BarChart3,
  FileCheck,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { toast } from "sonner";
import { BASE_URL } from "../utils/constants";

interface AnalysisResult {
  success: boolean;
  data: {
    fileName?: string;
    fileSize?: number;
    processingTime: string;
    pdfMetadata?: {
      pages: number;
      title: string;
      author: string;
      creator: string;
      producer: string;
      creationDate: string;
      modificationDate: string;
    };
    textLength: number;
    chunkCount: number;
    chunkSize: number;
    useChunking: boolean;
    parallelProcessing: boolean;
    analysis: {
      overallAuthenticity: number;
      overallConfidence: number;
      chunkResults: Array<{
        chunkId: string;
        text: string;
        isAuthentic: boolean;
        confidence: number;
        issues: string[];
        suggestions: string[];
        verifiedFacts: string[];
        flaggedContent: string[];
        reasoning: string;
      }>;
      chunkScores: Array<{
        chunkId: string;
        authenticityScore: number;
        confidenceScore: number;
      }>;
      summary: {
        totalChunks: number;
        authenticChunks: number;
        flaggedChunks: number;
        commonIssues: string[];
        recommendations: string[];
        averageScore: number;
        scoreDistribution: number[];
      };
    };
  };
  timestamp: string;
}

export default function ResumeValidityChecker() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [textInput, setTextInput] = useState("");
  const [inputMode, setInputMode] = useState<"file" | "text">("file");

  // Configuration state
  const [chunkSize, setChunkSize] = useState(800);
  const [maxChunks, setMaxChunks] = useState(5);
  const [useChunking, setUseChunking] = useState(true);
  const [useParallel, setUseParallel] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-scroll to results when analysis is complete
  useEffect(() => {
    if (analysisResult && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300); // Small delay to ensure the DOM is updated
    }
  }, [analysisResult]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const queryParams = new URLSearchParams({
        chunkSize: chunkSize.toString(),
        maxChunks: maxChunks.toString(),
      });

      const response = await fetch(
        `${BASE_URL}/api/resume/analyze?${queryParams}`,
        {
          method: "POST",
          body: formData,
          mode: "cors",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Analysis failed");
      }

      const result = await response.json();
      console.log("API Response:", result); // Debug log to see actual structure
      setAnalysisResult(result);
      toast.success("Resume analysis completed!");
    } catch (error) {
      console.error("Analysis error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        toast.error(
          "Cannot connect to analysis server. Please ensure the backend is running on " +
            BASE_URL +
            " and CORS is configured."
        );
      } else {
        toast.error(error instanceof Error ? error.message : "Analysis failed");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      toast.error("Please enter resume text to analyze");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch(`${BASE_URL}/api/resume/analyze-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textInput,
          chunkSize,
          maxChunks,
          useChunking,
          parallel: useParallel,
        }),
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Analysis failed");
      }

      const result = await response.json();
      console.log("Text API Response:", result); // Debug log to see actual structure
      setAnalysisResult(result);
      toast.success("Text analysis completed!");
    } catch (error) {
      console.error("Analysis error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        toast.error(
          "Cannot connect to analysis server. Please ensure the backend is running on " +
            BASE_URL +
            " and CORS is configured."
        );
      } else {
        toast.error(error instanceof Error ? error.message : "Analysis failed");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-300";
    if (score >= 60) return "text-yellow-300";
    return "text-red-300";
  };

  const getScoreVariant = (score: number): "success" | "warning" | "danger" => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const getCredibilityStatus = (authenticity: number, confidence: number) => {
    if (authenticity >= 80 && confidence >= 80) return "Highly Authentic";
    if (authenticity >= 70 && confidence >= 70) return "Likely Authentic";
    if (authenticity >= 60 && confidence >= 60) return "Moderately Authentic";
    return "Questionable Authenticity";
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
            <Loader2
              className="animate-spin text-purple-400 mx-auto mb-4"
              size={48}
            />
            <h3 className="text-white text-xl font-semibold mb-2">
              Analyzing Resume
            </h3>
            <p className="text-gray-300">
              Please wait while we process your document...
            </p>
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                leftIcon={<ArrowLeft size={18} />}
                className="absolute left-0"
              >
                Back to Home
              </Button>

              <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-400/20">
                <FileCheck className="text-purple-300" size={32} />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
                Resume Validity Checker
              </h1>
            </div>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto drop-shadow-sm">
              AI-powered resume analysis to detect inconsistencies and validate
              authenticity
            </p>
            <Badge variant="warning" className="mt-4">
              <Zap className="mr-2" size={16} />
              Beta Version
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input Mode Toggle */}
              <Card variant="glass">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white drop-shadow-sm">
                    Input Method
                  </h3>
                  <div className="flex bg-gray-800/50 rounded-lg p-1">
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        inputMode === "file"
                          ? "bg-purple-500/20 text-purple-300"
                          : "text-gray-400 hover:text-gray-300"
                      }`}
                      onClick={() => setInputMode("file")}
                    >
                      PDF Upload
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        inputMode === "text"
                          ? "bg-purple-500/20 text-purple-300"
                          : "text-gray-400 hover:text-gray-300"
                      }`}
                      onClick={() => setInputMode("text")}
                    >
                      Text Input
                    </button>
                  </div>
                </div>

                {inputMode === "file" ? (
                  <div
                    className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload
                      className="mx-auto mb-4 text-purple-300"
                      size={48}
                    />
                    <p className="text-white font-medium mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-gray-400 text-sm">
                      PDF files only (max 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste resume text here..."
                      className="w-full h-64 p-4 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleTextAnalysis}
                      disabled={isAnalyzing || !textInput.trim()}
                      isLoading={isAnalyzing}
                      leftIcon={
                        isAnalyzing ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <FileText size={20} />
                        )
                      }
                      className="w-full"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze Text"}
                    </Button>
                  </div>
                )}
              </Card>

              {/* Analysis Results */}
              {analysisResult && (
                <Card variant="glass" ref={resultsRef}>
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-4 p-6 bg-gray-800/50 rounded-xl border border-white/10">
                        <div className="text-center">
                          <div
                            className={`text-4xl font-bold ${getScoreColor(
                              analysisResult.data.analysis
                                ?.overallAuthenticity || 0
                            )}`}
                          >
                            {analysisResult.data.analysis
                              ?.overallAuthenticity || 0}
                            %
                          </div>
                          <div className="text-gray-400 text-sm">
                            Authenticity Score
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Confidence:{" "}
                            {analysisResult.data.analysis?.overallConfidence ||
                              0}
                            %
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <Badge
                            variant={getScoreVariant(
                              analysisResult.data.analysis
                                ?.overallAuthenticity || 0
                            )}
                            size="lg"
                          >
                            {getCredibilityStatus(
                              analysisResult.data.analysis
                                ?.overallAuthenticity || 0,
                              analysisResult.data.analysis?.overallConfidence ||
                                0
                            )}
                          </Badge>
                          <div className="text-gray-300 text-sm mt-2">
                            Processed in{" "}
                            {analysisResult.data.processingTime || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Flagged Content */}
                    {analysisResult.data.analysis.summary?.flaggedChunks >
                      0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center drop-shadow-sm">
                          <AlertTriangle
                            className="text-yellow-300 mr-2"
                            size={20}
                          />
                          Flagged Content (
                          {analysisResult.data.analysis.summary.flaggedChunks}{" "}
                          chunks)
                        </h4>
                        <div className="space-y-3">
                          {analysisResult.data.analysis.chunkResults
                            ?.filter(
                              (chunk) =>
                                !chunk.isAuthentic || chunk.confidence < 70
                            )
                            .map((chunk, index) => (
                              <div
                                key={index}
                                className="p-4 bg-gray-800/50 rounded-lg border border-white/5"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <span className="font-medium text-white">
                                    {chunk.chunkId}
                                  </span>
                                  <Badge
                                    variant={
                                      chunk.confidence >= 70
                                        ? "warning"
                                        : "danger"
                                    }
                                    size="sm"
                                  >
                                    {chunk.confidence}% confidence
                                  </Badge>
                                </div>
                                {chunk.issues && chunk.issues.length > 0 && (
                                  <div className="mb-2">
                                    <p className="text-gray-300 text-sm font-medium mb-1">
                                      Issues:
                                    </p>
                                    <ul className="text-gray-300 text-sm list-disc list-inside">
                                      {chunk.issues.map((issue, idx) => (
                                        <li key={idx}>{issue}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {chunk.flaggedContent &&
                                  chunk.flaggedContent.length > 0 && (
                                    <div>
                                      <p className="text-gray-300 text-sm font-medium mb-1">
                                        Flagged Content:
                                      </p>
                                      <ul className="text-gray-400 text-xs list-disc list-inside">
                                        {chunk.flaggedContent.map(
                                          (content, idx) => (
                                            <li key={idx}>{content}</li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                <p className="text-gray-400 text-xs mt-2">
                                  {chunk.reasoning}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}{" "}
                    {/* Recommendations */}
                    {analysisResult.data.analysis.summary?.recommendations &&
                      analysisResult.data.analysis.summary.recommendations
                        .length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center drop-shadow-sm">
                            <CheckCircle
                              className="text-green-300 mr-2"
                              size={20}
                            />
                            Recommendations
                          </h4>
                          <div className="space-y-2">
                            {analysisResult.data.analysis.summary.recommendations.map(
                              (rec: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start space-x-3 p-3 bg-green-500/5 rounded-lg border border-green-500/20"
                                >
                                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-gray-200 text-sm">{rec}</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    {/* Chunk Analysis Details */}
                    {analysisResult.data.analysis.chunkScores &&
                      analysisResult.data.analysis.chunkScores.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center drop-shadow-sm">
                            <BarChart3
                              className="text-blue-300 mr-2"
                              size={20}
                            />
                            Detailed Chunk Analysis
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {analysisResult.data.analysis.chunkScores.map(
                              (chunk, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-gray-800/50 rounded-lg border border-white/5"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-white font-medium text-sm">
                                      {chunk.chunkId}
                                    </span>
                                    <Badge
                                      variant={getScoreVariant(
                                        chunk.authenticityScore
                                      )}
                                      size="sm"
                                    >
                                      {chunk.authenticityScore}%
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Confidence: {chunk.confidenceScore}%
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </Card>
              )}
            </div>

            {/* Configuration Panel */}
            <div className="space-y-6">
              {/* Analysis Configuration */}
              <Card variant="glass">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center drop-shadow-sm">
                    <div className="p-2 bg-blue-500/20 rounded-lg mr-3 border border-blue-400/20">
                      <Settings className="text-blue-300" size={18} />
                    </div>
                    Configuration
                  </h3>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-gray-400 hover:text-gray-300 text-sm"
                  >
                    {showAdvanced ? "Simple" : "Advanced"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Chunk Size: {chunkSize} characters
                    </label>
                    <input
                      type="range"
                      min="400"
                      max="1500"
                      step="100"
                      value={chunkSize}
                      onChange={(e) => setChunkSize(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Max Chunks: {maxChunks}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={maxChunks}
                      onChange={(e) => setMaxChunks(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  {showAdvanced && (
                    <div className="space-y-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">
                          Use Chunking
                        </span>
                        <button
                          onClick={() => setUseChunking(!useChunking)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            useChunking ? "bg-purple-500" : "bg-gray-600"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              useChunking ? "translate-x-6" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">
                          Parallel Processing
                        </span>
                        <button
                          onClick={() => setUseParallel(!useParallel)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            useParallel ? "bg-blue-500" : "bg-gray-600"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full transition-transform ${
                              useParallel ? "translate-x-6" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Analysis Stats */}
              {analysisResult && (
                <Card variant="glass">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center drop-shadow-sm">
                    <div className="p-2 bg-green-500/20 rounded-lg mr-3 border border-green-400/20">
                      <BarChart3 className="text-green-300" size={18} />
                    </div>
                    Analysis Stats
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                      <span className="text-gray-200 text-sm font-medium">
                        Text Length
                      </span>
                      <Badge variant="info" size="sm">
                        {(analysisResult.data.textLength || 0).toLocaleString()}{" "}
                        chars
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                      <span className="text-gray-200 text-sm font-medium">
                        Total Chunks
                      </span>
                      <Badge variant="info" size="sm">
                        {analysisResult.data.analysis.summary?.totalChunks ||
                          analysisResult.data.chunkCount ||
                          0}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                      <span className="text-gray-200 text-sm font-medium">
                        Authentic Chunks
                      </span>
                      <Badge variant="success" size="sm">
                        {analysisResult.data.analysis.summary
                          ?.authenticChunks || 0}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                      <span className="text-gray-200 text-sm font-medium">
                        Flagged Chunks
                      </span>
                      <Badge
                        variant={
                          analysisResult.data.analysis.summary?.flaggedChunks >
                          0
                            ? "warning"
                            : "success"
                        }
                        size="sm"
                      >
                        {analysisResult.data.analysis.summary?.flaggedChunks ||
                          0}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                      <span className="text-gray-200 text-sm font-medium">
                        Processing Time
                      </span>
                      <Badge variant="info" size="sm">
                        <Clock className="mr-1" size={12} />
                        {analysisResult.data.processingTime || "N/A"}
                      </Badge>
                    </div>

                    {analysisResult.data.pdfMetadata && (
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                        <span className="text-gray-200 text-sm font-medium">
                          PDF Pages
                        </span>
                        <Badge variant="info" size="sm">
                          {analysisResult.data.pdfMetadata.pages}
                        </Badge>
                      </div>
                    )}

                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                      <span className="text-gray-200 text-sm font-medium">
                        Method
                      </span>
                      <Badge variant="success" size="sm">
                        {analysisResult.data.parallelProcessing
                          ? "Parallel"
                          : "Sequential"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              )}

              {/* Help Card */}
              <Card variant="glass">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center drop-shadow-sm">
                  <div className="p-2 bg-yellow-500/20 rounded-lg mr-3 border border-yellow-400/20">
                    <Eye className="text-yellow-300" size={18} />
                  </div>
                  How it Works
                </h3>

                <div className="space-y-3 text-gray-300 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Upload a PDF resume or paste text content</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>AI analyzes content for inconsistencies and red flags</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      Receive detailed authenticity score and recommendations
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
