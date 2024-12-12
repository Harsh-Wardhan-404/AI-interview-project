import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Dashboard } from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import {
  GrammarAssessment,
  FeedbackPage,
  AssessmentSetup,
} from "./pages/Assessment";

import { Login, Register } from "./pages/authentication";
import { Home } from "./pages/Home";
import { Navbar, PrivateRoute, LoadingScreen } from "./components";

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserAuthenticated(true);
      } else {
        setIsUserAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const assessmentRoutes = [
    { path: "setup", element: <AssessmentSetup /> },
    { path: "grammar", element: <GrammarAssessment /> },
    { path: "feedback", element: <FeedbackPage /> },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar isUserAuthenticated={isUserAuthenticated} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute isAuthenticated={isUserAuthenticated}>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              {assessmentRoutes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={`assessment/${path}`}
                  element={element}
                />
              ))}
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
