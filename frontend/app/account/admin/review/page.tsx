import React from 'react';

import ReviewItem from '../../../components/reviewitem';

const Review = () => {
  const demoItems = [
    {
      id: 1,
      name: "Phone",
      date: "2022-01-01",
      approved: true,
      description: "A black iPhone 12 Pro Max with a black case.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 2,
      name: "Wallet",
      date: "2022-01-01",
      approved: true,
      description: "A brown leather wallet with a blue stripe.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 3,
      name: "Keys",
      date: "2022-01-01",
      approved: true,
      description: "A set of keys with a blue keychain.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 4,
      name: "Watch",
      date: "2022-01-01",
      approved: true,
      description: "A silver watch with a black band.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    }]; // Your array of found items
 

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Claim Review</h1>
      <div className="flex flex-wrap justify-center items-start w-5/6">
        <h2 className="w-full text-xl font-bold mt-4">There are {demoItems.length} items need to review.</h2>
        {demoItems.map(item => (
          <ReviewItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Review;