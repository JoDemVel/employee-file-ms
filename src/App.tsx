import { Route, Routes } from 'react-router';
import './App.css';
import RootLayout from '@/app/layout/RootLayout';
import EmployeesPage from '@/app/pages/employees/Employees';

function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/employees" element={<EmployeesPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
