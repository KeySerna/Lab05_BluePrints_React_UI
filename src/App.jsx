import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CreateBlueprintPage from './pages/CreateBlueprintPage.jsx';
import EditBlueprintPage from './pages/EditBlueprintPage.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/new"
          element={
            <PrivateRoute>
              <CreateBlueprintPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:author/:name"
          element={
            <PrivateRoute>
              <EditBlueprintPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
