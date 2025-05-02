import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';
import Loader from './components/Loader.tsx';
import './index.css';

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const handleLoadComplete = () => {
    setIsLoading(false);
  };
  
  // Optional: You can set a minimum loading time to ensure the loader is seen
  useEffect(() => {
    // If you want to always show the loader for at least 2.5 seconds
    // Otherwise, remove this effect if you want instant loading when ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <React.StrictMode>
      {isLoading ? (
        <Loader onLoadComplete={handleLoadComplete} />
      ) : (
        <App />
      )}
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);