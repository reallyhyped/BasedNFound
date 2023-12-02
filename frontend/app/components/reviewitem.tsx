import React, { useState, useEffect } from 'react';

interface ReviewItemProps {
  item: {
    id: number;
    name: string;
    claim_id: number;
    status: string; 
  };
  onApproved: (itemId: number) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ item, onApproved }) => {
  const [claim, setClaim] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/claim/${item.claim_id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setClaim(data);
      })
      .catch(error => {
        console.error('Error fetching claim:', error);
      });
  }, [item.claim_id]);

  const approveItem = () => {
    if (claim && claim.status === 'Pending') {
      fetch(`http://localhost:8000/claim/approve/${claim.id}`, {
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
          // Update the item status to 'claimed'
          updateItemStatus('claimed');
          // Perform any additional actions on successful approval
          onApproved(item.id);
        })
        .catch(error => {
          console.error('Error approving item:', error);
        });
    } else {
      console.log('Item cannot be approved. Status is not pending.');
    }
  };

  const rejectItem = () => {
    if (claim && claim.status === 'Pending') {
      fetch(`http://localhost:8000/claim/reject/${claim.id}`, {
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
          console.log('Item rejected:', data);
          // Update the item status to 'lost'
          updateItemStatus('lost');
          // Call onApproved to remove the component
          onApproved(item.id);
        })
        .catch(error => {
          console.error('Error rejecting item:', error);
        });
    } else {
      console.log('Item cannot be rejected. Status is not pending.');
    }
  };

  const updateItemStatus = (newStatus: string) => {
    // Update the item status to 'lost' or 'claimed'
    fetch(`http://localhost:8000/item/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(`Item status updated to ${newStatus}:`, data);
      })
      .catch(error => {
        console.error('Error updating item status:', error);
      });
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-2">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{item.name}</div>
        <p className="text-gray-700 text-base">
          {claim ? `Claim Status: ${claim.status}` : 'Loading claim status...'}
        </p>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
          onClick={approveItem}
          disabled={claim && claim.status !== 'Pending'}
        >
          Approve
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={rejectItem}
          disabled={claim && claim.status !== 'Pending'}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;
