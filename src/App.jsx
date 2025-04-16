import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ContactListPage from './pages/ContactListPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/community/:communityId" element={<ContactListPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App; 