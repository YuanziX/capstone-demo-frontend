import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Capstone Project
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome! Choose a tool to get started:
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/cheating-detector")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow"
          >
            Cheating Detector
          </button>
        </div>
      </div>
      <footer className="mt-8 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Capstone Project Team
      </footer>
    </div>
  );
}
