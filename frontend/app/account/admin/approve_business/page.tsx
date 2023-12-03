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
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Business Review</h1>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          There are {businesses.length} businesses need to review.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.map(business => (
            <ReviewBusiness key={business.id} business={business} onApproved={() => removeBusiness(business.id)} />
          ))}
        </div>
      </div>
    </div>
  );

};

export default ApproveBusiness;
