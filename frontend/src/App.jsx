import ProducerPage from "./pages/ProducerPage";
import DriverPage from "./pages/DriverPage";
import BrickyardPage from "./pages/BrickyardPage";

export default function App() {
  const path = window.location.pathname;

  if (path === "/driver") return <DriverPage />;
  if (path === "/brickyard") return <BrickyardPage />;
  return <ProducerPage />;
}