import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import Inventory from "./pages/Inventory";
import Lab from "./pages/Lab";
import Genetics from "./pages/Genetics";
import PublicVerification from "./pages/PublicVerification";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Sales from "./pages/Sales";
import Login from "./pages/Login";
import Logistics from "./pages/Logistics";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
        <Router>
          <Routes>
            {/* Protected System Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/genetics" element={<Genetics />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/logistics" element={<Logistics />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Public Routes (No Layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/verify/:hash" element={<PublicVerification />} />
            <Route path="/verify/demo" element={<PublicVerification />} />
          </Routes>
        </Router>
      </AppProvider>
  );
}

export default App;
