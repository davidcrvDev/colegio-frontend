// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AppLayout from './components/layout/AppLayout';
import AreasPage from './pages/AreasPage';
import OficinasPage from './pages/OficinasPage';
import EmpleadosPage from './pages/EmpleadosPage';
import SalonesPage from './pages/SalonesPage';
import ReportePage from './pages/ReportePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<AppLayout />}>
          <Route path="areas" element={<AreasPage />} />
          <Route path="oficinas" element={<OficinasPage />} />
          <Route path="empleados" element={<EmpleadosPage />} />
          <Route path="salones" element={<SalonesPage />} />
          <Route path="reportes" element={<ReportePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
