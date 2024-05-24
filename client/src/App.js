import { Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <Toaster />
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default App;
