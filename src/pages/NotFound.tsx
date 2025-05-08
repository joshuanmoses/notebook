
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-mono font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-4">Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Notebook
        </a>
      </div>
    </div>
  );
};

export default NotFound;
