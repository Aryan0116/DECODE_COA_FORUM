import { useState, useEffect } from 'react';
import './Loader.css';

const Loader = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time (you can remove this in production)
    const timer = setTimeout(() => {
      setLoading(false);
      // Clean up any remaining loader effects
      document.body.style.overflow = 'auto';
      document.body.style.padding = '';
      document.body.style.margin = '';
      document.body.style.display = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
    }, 2500);
    
    // Prevent scrolling while loading
    if (loading) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      clearTimeout(timer);
      // Ensure cleanup happens on unmount as well
      document.body.style.overflow = 'auto';
      document.body.style.padding = '';
      document.body.style.margin = '';
      document.body.style.display = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
    };
  }, [loading]);
  
  if (!loading) return null;
  
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="spinner">
          <div className="circle"></div>
        </div>
        <h1 className="loader-title">DECODE COA FORUM</h1>
        <p className="loader-subtitle">Discuss • Learn • Grow</p>
      </div>
    </div>
  );
};

export default Loader;