import { Navigate, Route, Routes } from 'react-router';
import './App.css';
import RootLayout from '@/app/layout/RootLayout';
import EmployeesPage from '@/app/pages/employees/EmployeesPage';
import { EmployeeDetailPage } from '@/app/pages/employee-detail/EmployeeDetailPage';
import { DepartmentsPage } from './app/pages/departments/DepartmentsPage';
import { PositionsPage } from './app/pages/positions/PositionsPage';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/employees" element={<EmployeesPage />} />
          <Route
            path="/employees/:employeeId"
            element={<EmployeeDetailPage />}
          />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="*" element={<Navigate to="/employees" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
