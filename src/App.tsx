import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheatingDetector from "./pages/CheatingDetector";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cheating-detector" element={<CheatingDetector />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
