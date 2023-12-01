"use client"
import React, { useState, useEffect } from 'react';

const ReviewBusiness = ({ business, onApproved }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/location/${business.location_id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLocation(data);
      })
      .catch(error => {
        console.error('Error fetching location:', error);
      });
  }, [business.location_id]);

  const approveBusiness = () => {
    fetch(`http://localhost:8000/business/approve/${business.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Business approved:', data);
        // Perform any additional actions on successful approval
        onApproved(business.id);
      })
      .catch(error => {
        console.error('Error approving business:', error);
      });
  };

  const rejectBusiness = () => {
    fetch(`http://localhost:8000/business/${business.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Business rejected:', data);
        // Call onApproved to remove the component
        onApproved(business.id);
      })
      .catch(error => {
        console.error('Error rejecting business:', error);
      });
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-2">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{business.name}</div>
        <p className="text-gray-700 text-base">
          {location ? `${location.address}, ${location.city}, ${location.state}, ${location.zipcode}` : 'Loading location...'}
        </p>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
          onClick={approveBusiness}
        >
          Approve
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={rejectBusiness}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ReviewBusiness;