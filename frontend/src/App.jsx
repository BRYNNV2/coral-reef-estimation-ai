import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import GalleryPage from './components/GalleryPage';
import ModelDocsPage from './components/ModelDocsPage';
import ResearchPage from './components/ResearchPage';
import FAQPage from './components/FAQPage';
import ContactPage from './components/ContactPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import PartnersPage from './components/PartnersPage';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-[999] w-12 h-12 rounded-full bg-[var(--color-gold)] text-[var(--color-ocean-950)] flex items-center justify-center shadow-2xl shadow-[var(--color-gold)]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--color-gold-light)] ${
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
      }`}
      aria-label="Kembali ke atas"
    >
      <ArrowUp size={24} strokeWidth={2.5} />
    </button>
  );
};

function App() {
  const [page, setPage] = useState('landing');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const renderPage = () => {
    if (page === 'dashboard') {
      return <Dashboard onBack={() => setPage('landing')} />;
    }
    if (page === 'gallery') {
      return <GalleryPage onBack={() => setPage('landing')} />;
    }
    if (page === 'modeldocs') {
      return <ModelDocsPage onBack={() => setPage('landing')} />;
    }
    if (page === 'research') {
      return <ResearchPage onBack={() => setPage('landing')} />;
    }
    if (page === 'faq') {
      return <FAQPage onBack={() => setPage('landing')} />;
    }
    if (page === 'contact') {
      return <ContactPage onBack={() => setPage('landing')} />;
    }
    if (page === 'privacy') {
      return <PrivacyPolicyPage onBack={() => setPage('landing')} />;
    }
    if (page === 'terms') {
      return <TermsOfServicePage onBack={() => setPage('landing')} />;
    }
    if (page === 'partners') {
      return <PartnersPage onBack={() => setPage('landing')} />;
    }

    return (
      <LandingPage 
        onStartDetection={() => setPage('dashboard')} 
        onExploreGallery={() => setPage('gallery')}
        onModelDocs={() => setPage('modeldocs')}
        onResearch={() => setPage('research')}
        onFAQ={() => setPage('faq')}
        onContact={() => setPage('contact')}
        onPrivacy={() => setPage('privacy')}
        onTerms={() => setPage('terms')}
        onPartners={() => setPage('partners')}
      />
    );
  };

  return (
    <>
      {renderPage()}
      <ScrollToTopButton />
    </>
  );
}

export default App;
