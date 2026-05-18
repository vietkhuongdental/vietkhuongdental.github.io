// React Imports
import { useEffect, useState } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 800);
      };

      checkIfMobile();

      window.addEventListener('resize', checkIfMobile);

      return () => window.removeEventListener('resize', checkIfMobile);
    }
  }, []);

  return isMobile;
}
