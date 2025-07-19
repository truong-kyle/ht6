import React from 'react';

const Courier = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Courier Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome to the courier interface!</p>
        <button 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => console.log('Courier button clicked')}
        >
          Start Delivery
        </button>
      </div>
    </div>
  );
};

export default Courier;