import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from "./pages/LoginForm"
import RegisterForm from "./pages/RegisterForm"
import Todo from "./pages/Todo"
import { useSelector } from 'react-redux';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
      
        <Route 
          path="/todo-app" 
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App
