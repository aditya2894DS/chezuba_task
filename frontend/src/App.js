import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateOrderComponent from "./Components/CreateOrderComponent";
import Dashboard from "./Components/Dashboard";
import GetOrderComponent from "./Components/GetOrderComponent";
import Sidebar from "./Components/Sidebar";

function App() {
  return (
    <div className="App" style={{display: 'flex'}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sidebar />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/createorder" element={<CreateOrderComponent />} />
            <Route path="/getorder" element={<GetOrderComponent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
