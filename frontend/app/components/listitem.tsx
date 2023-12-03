"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ListItem = ({ item, refetchItems }) => {

  const [claimerInfo, setClaimerInfo] = useState(null);
  const { data: session, status } = useSession();
  const [businessInfo, setBusinessInfo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/business/business_location/${item.business_id}`)
      .then(response => response.json())
      .then(data => {
        setBusinessInfo(data);
      })
      .catch(err => console.error('Error fetching business info:', err));
  }, []);

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

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-2 bg-white">
      <img className="w-full h-48 object-cover" src={item.image} alt={item.item_description} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{item.name}</div>
        <p className="text-gray-700 text-base mb-1">{item.item_description}</p>
        <p className="text-gray-500 text-sm mb-2">Date: {item.item_date}</p>
        {session?.userType === 'Administrator' && businessInfo && (
          <><p className="text-gray-500 text-sm mb-2">Business: {businessInfo.business_name}</p><p className="text-gray-500 text-sm mb-2">Address: {`${businessInfo.address}, ${businessInfo.city} ${businessInfo.state}, ${businessInfo.zipcode}`}</p></>

        )}

        {item.item_status === 'lost' && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-3 w-full"
            onClick={reportFound}
          >
            Report Found
          </button>
        )}

        {item.claim_status === 'Pending' && claimerInfo && (
          <div className="bg-gray-100 p-3 rounded-lg mb-3">
            <p className="text-gray-800 font-semibold mb-1">Pending Claim by:</p>
            <p className="text-gray-700 text-sm mb-1">{claimerInfo.first_name} {claimerInfo.last_name}</p>
            <p className="text-gray-600 text-sm mb-1">Username: {claimerInfo.username}</p>

            <p className="text-gray-600 text-sm mb-1">Email: {claimerInfo.email}</p>
            <p className="text-gray-600 text-sm mb-3">Phone: {claimerInfo.phone_number}</p>
            <div className="flex space-x-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1"
                onClick={approveClaim}
              >
                Approve Claim
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-1"
                onClick={rejectClaim}
              >
                Reject Claim
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItem;