import React from 'react';

interface CenteredContainerProps {
  children: React.ReactNode;
  className?: string;
}

const CenteredContainer: React.FC<CenteredContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center w-full ${className}`}>
      {children}
    </div>
  );
};

export default CenteredContainer; 