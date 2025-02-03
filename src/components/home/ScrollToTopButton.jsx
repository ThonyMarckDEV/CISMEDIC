import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  const toggleVisibility = () => {
    // Show button when page is scrolled down more than 300 pixels
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 left-4 z-50 
            bg-black text-white 
            p-3 rounded-full 
            shadow-lg 
            hover:bg-gray-800
            w-14 h-14 
            flex items-center justify-center
            animate-bounce-custom
            transition-all duration-300 ease-in-out"
          aria-label="Scroll to top"
        >
          <ChevronUp size={32} />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;