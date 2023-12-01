"use client"
import React, { useState, useEffect } from 'react';
import ReviewBusiness from '../../../components/reviewbusiness';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const ApproveBusiness = () => {
  const { data: session, status } = useSession();
  console.log(session)

  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/business/not_approved')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBusinesses(data);
      })
      .catch(error => {
        console.error('Error fetching businesses:', error);
      });
  }, []);

  const removeBusiness = (id) => {
    setBusinesses(businesses.filter(business => business.id !== id));
  };

  // Wait for session to be loaded
  if (status === 'loading') {
    return <div>Loading...</div>; // Or your custom loading component
  }

  // Redirect if not an administrator
  if (session?.userType !== "Administrator") {
    redirect('/');
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Business Review</h1>
      <div className="flex flex-wrap justify-center items-start w-5/6">
        <h2 className="w-full text-xl font-bold mt-4">There are {businesses.length} businesses need to review.</h2>
        {businesses.map(business => (
          <ReviewBusiness key={business.id} business={business} onApproved={() => removeBusiness(business.id)} />
        ))}
      </div>
    </div>
  );
};

export default ApproveBusiness;
