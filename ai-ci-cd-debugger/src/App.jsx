import LiveLogs from "./components/LiveLogs";
import DebugSuggestions from "./components/DebugSuggestions";
import PastLogs from "./components/PastLogs";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 p-8">
      <LiveLogs />
      <DebugSuggestions />
      <PastLogs />
    </div>
  );
}

export default App;
