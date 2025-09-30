import React from 'react';

const PageTitle = ({ title }) => {
  return (
    <div className="bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      </div>
    </div>
  );
};

export default PageTitle;
