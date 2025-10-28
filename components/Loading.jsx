import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center p-8">
      {/* You can replace this text with a Tailwind CSS spinner if you prefer */}
      <p className="text-xl text-gray-500">Loading...</p>
    </div>
  );
};

export default Loading;