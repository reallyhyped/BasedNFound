import React from 'react';

import ReviewBusiness from '../../../components/reviewbusiness';

const ApproveBusiness = () => {
  const demoItems = [
    {
      id: 1,
      name: "Store 1",
      approved: true,
      location: "800 Main St, Dallas, TX 75202",
    },
    {
      id: 2,
      name: "Store 2",
      approved: true,
      location: "800 Main St, Dallas, TX 75202",
    },
    {
      id: 3,
      name: "Store 3",
      approved: true,
      location: "800 Main St, Dallas, TX 75202",
    },
    {
      id: 4,
      name: "Store 4",
      approved: true,
      location: "800 Main St, Dallas, TX 75202",
    }]; // Your array of found items
 

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Business Review</h1>
      <div className="flex flex-wrap justify-center items-start w-5/6">
        <h2 className="w-full text-xl font-bold mt-4">There are {demoItems.length} businesses need to review.</h2>
        {demoItems.map(item => (
          <ReviewBusiness key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ApproveBusiness;