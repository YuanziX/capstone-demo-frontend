import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheatingDetector from "./pages/CheatingDetector";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import ResumeValidityChecker from "./pages/ResumeValidityChecker";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cheating-detector" element={<CheatingDetector />} />
        <Route
          path="/resume-validity-checker"
          element={<ResumeValidityChecker />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
