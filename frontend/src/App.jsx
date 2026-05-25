import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import GalleryPage from './components/GalleryPage';

function App() {
  const [page, setPage] = useState('landing');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (page === 'dashboard') {
    return <Dashboard onBack={() => setPage('landing')} />;
  }
  
  if (page === 'gallery') {
    return <GalleryPage onBack={() => setPage('landing')} />;
  }

  return (
    <LandingPage 
      onStartDetection={() => setPage('dashboard')} 
      onExploreGallery={() => setPage('gallery')}
    />
  );
}

export default App;
