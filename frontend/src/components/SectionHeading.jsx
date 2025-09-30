import React from 'react';

const SectionHeading = ({ title }) => {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 pb-2 inline-block">
        {title}
      </h2>
    </div>
  );
};

export default SectionHeading;
