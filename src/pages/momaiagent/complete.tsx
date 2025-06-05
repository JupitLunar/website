import React from 'react';

const Complete: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verified Successfully</h1>
        <p className="mb-6">Your email has been successfully verified. Thank you for registering!</p>
      </div>
    </div>
  );
};

export default Complete; 