import React, { useEffect, useRef } from 'react';

const useClickAway = (onClose: (event: React.MouseEvent | React.KeyboardEvent) => void) => {
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickAway = (event: MouseEvent | KeyboardEvent) => {
      if (drawerRef.current && !drawerRef.current.contains((event as MouseEvent).target as Node)) {
        onClose(event as unknown as React.MouseEvent);
      }
    };

    document.addEventListener('click', handleClickAway);

    return () => {
      document.removeEventListener('click', handleClickAway);
    };
  }, [onClose]);

  return drawerRef;
};

export default useClickAway;
