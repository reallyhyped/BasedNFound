"use client"
import React, { useState, useEffect } from 'react';
import ReviewItem from '../../components/reviewitem';

const ReviewClaim = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items that need review from your API
    fetch('http://localhost:8000/item/not_approved')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setItems(data);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }, []);

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const approveItem = (itemId) => {
    // Similar to the ReviewBusiness component, send a PUT request to approve the item
    fetch(`http://localhost:8000/item/approve/${itemId}`, {
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
        console.log('Item approved:', data);
        // Perform any additional actions on successful approval
        removeItem(itemId);
      })
      .catch(error => {
        console.error('Error approving item:', error);
      });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Claim Review</h1>
      <div className="flex flex-wrap justify-center items-start w-5/6">
        <h2 className="w-full text-xl font-bold mt-4">There are {items.length} items need to review.</h2>
        {items.map(item => (
          <ReviewItem key={item.id} item={item} onApproved={() => approveItem(item.id)} />
        ))}
      </div>
    </div>
  );
};

export default ReviewClaim;