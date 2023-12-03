"use client"

import { useEffect, useState } from "react";

const ListItem = ({ item, refetchItems }) => {

  const [claimerInfo, setClaimerInfo] = useState(null);

  useEffect(() => {
    if (item.claim_status === 'Pending') {
      fetch(`http://localhost:8000/user/id/${item.claim_bnf_user_id}`)
        .then(response => response.json())
        .then(data => {
          setClaimerInfo(data);
        })
        .catch(error => console.error('Error fetching claimer info:', error));
    }
  }, [item.claim_bnf_user_id, item.claim_status]);

  const reportFound = async () => {
    try {
      // Make a PUT request to mark the item as found
      const response = await fetch(`http://localhost:8000/item/set_found/${item.item_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedItem = await response.json();
      console.log("Item marked as found:", updatedItem);

      // Create a log entry if the item's status is now 'found'
      if (updatedItem.status === "found") {
        const logResponse = await fetch("http://localhost:8000/log/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: new Date().toISOString().slice(0, -1), // Current date in ISO format
            description: "Item marked as found by the business", // Custom description
            claim_id: updatedItem.claim_id, // Using claim_id from the item
          }),
        });

        if (!logResponse.ok) {
          throw new Error("Log response was not ok");
        }

        await logResponse.json();
        console.log("Log submitted for found item");

        refetchItems(); // Refetch items to update UI
      }
    } catch (error) {
      console.error("Error setting item as found or logging:", error);
    }
  };
  // Function to handle the "Approve Claim" action
  const approveClaim = async () => {
    try {
      const response = await fetch(`http://localhost:8000/item_claim/approve_claim/${item.item_id}`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to approve claim');
      console.log('Claim approved for item', item.item_id);
      refetchItems(); // Refetch items after approval
    } catch (error) {
      console.error('Error approving claim:', error);
    }
  };

  const rejectClaim = async () => {
    try {
      const response = await fetch(`http://localhost:8000/item_claim/reject_claim/${item.item_id}`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to reject claim');
      console.log('Claim rejected for item', item.item_id);
      refetchItems(); // Refetch items after rejection
    } catch (error) {
      console.error('Error rejecting claim:', error);
    }
  };


  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-2">
      <img className="w-full" src={item.image} alt={item.item_description} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{item.name}</div>
        <p className="text-gray-700 text-base">{item.item_description}</p>
        <p className="text-gray-700 text-base">{item.item_date}</p>

        {item.item_status === 'lost' && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
            onClick={reportFound}
          >
            Report Found
          </button>
        )}

        {item.claim_status === 'Pending' && claimerInfo && (
          <>
            <p className="text-gray-700 text-base mb-2">Claimed by: {claimerInfo.first_name} {claimerInfo.last_name}</p>
            <p className="text-gray-700 text-base mb-2">Username: {claimerInfo.username}</p>

            <p className="text-gray-700 text-base mb-2">Email: {claimerInfo.email}</p>
            <p className="text-gray-700 text-base mb-2">Phone: {claimerInfo.phone_number}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 mr-2"
              onClick={approveClaim}
            >
              Approve Claim
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2"
              onClick={rejectClaim}
            >
              Reject Claim
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default ListItem;