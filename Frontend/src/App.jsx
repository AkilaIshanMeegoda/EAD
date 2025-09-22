import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Stations from './pages/Stations';
import Bookings from './pages/Bookings';
import EVOwners from './pages/EVOwners';
import Operator from './pages/Operator';
import EVOwnerPortal from './pages/EVOwnerPortal';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/ev-owner" element={<EVOwnerPortal />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Backoffice', 'StationOperator']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['Backoffice']}>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/stations"
            element={
              <ProtectedRoute allowedRoles={['Backoffice', 'StationOperator']}>
                <Layout>
                  <Stations />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/bookings"
            element={
              <ProtectedRoute allowedRoles={['Backoffice', 'StationOperator']}>
                <Layout>
                  <Bookings />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ev-owners"
            element={
              <ProtectedRoute allowedRoles={['Backoffice']}>
                <Layout>
                  <EVOwners />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/operator"
            element={
              <ProtectedRoute allowedRoles={['StationOperator']}>
                <Layout>
                  <Operator />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;