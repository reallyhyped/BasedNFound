"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../components/footer";
import { useSession } from "next-auth/react";
import Business from "@/app/account/business/page";

export default function Page({ params }: { params: { itemID: string } }) {
  const { data: session } = useSession();
  const [item, setItem] = useState(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [claim, setClaim] = useState(null);
  const [businessLocation, setBusinessLocation] = useState(null);

  useEffect(() => {
    const fetchItemAndClaim = async () => {
      try {
        // Fetch item data
        const itemResponse = await fetch(`http://localhost:8000/item/${params.itemID}`);
        const itemData = await itemResponse.json();
        setItem(itemData);

        // Fetch claim data
        if (itemData.claim_id) {
          const claimResponse = await fetch(`http://localhost:8000/claim/${itemData.claim_id}`);
          const claimData = await claimResponse.json();
          setClaim(claimData);

          if (claimData.status.includes("Pending")) {
            setIsClaimed(true);
          }
        }

        // Fetch business location data
        if (itemData.business_id) {
          const businessLocationResponse = await fetch(`http://localhost:8000/business/business_location/${itemData.business_id}`);
          const businessLocationData = await businessLocationResponse.json();
          setBusinessLocation(businessLocationData);
        }

        console.log(itemData)
      } catch (error) {
        console.error("Error fetching item or claim:", error);
      }
    };

    fetchItemAndClaim();
  }, [params.itemID]);

  const handleClaim = async () => {
    if (!item || !item.claim_id) {
      console.error("Item or claim ID is undefined");
      return;
    }

    try {
      const claimUpdateData = {
        date: new Date().toISOString().slice(0, -1), // Current date in ISO format without timezone
        status: "Pending",
        bnf_user_id: session?.id, // Assuming session.id is the ID of the current user
        description: item.description, // You can customize this description if needed
      };

      const response = await fetch(`http://localhost:8000/claim/${item.claim_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimUpdateData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedClaim = await response.json();
      console.log("Claim updated:", updatedClaim);

      // Log the action
      const logData = {
        date: new Date().toISOString().slice(0, -1), // Current date in ISO format
        description: `Attempted to be claimed by: ${session?.user?.name}`, // Custom description
        claim_id: item.claim_id, // Using claim_id from the item
      };

      const logResponse = await fetch("http://localhost:8000/log/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
      });

      if (!logResponse.ok) {
        throw new Error("Log response was not ok");
      }

      const logResult = await logResponse.json();
      console.log("Log submitted:", logResult);

      setIsClaimed(true); // Update local state to reflect the claim
    } catch (error) {
      console.error("Error updating claim:", error);
    }
  };

  const handleSetFound = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/item/set_found/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedItem = await response.json();
      console.log("Item marked as found:", updatedItem);
      setItem(updatedItem);

      // Assuming the item's status is now 'found', proceed to log the action
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

        const logData = await logResponse.json();
        console.log("Log submitted:", logData);
      }
    } catch (error) {
      console.error("Error setting item as found or logging:", error);
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{item.name}</h1>

        <img src={item.image} alt={item.name} className="mx-auto w-full max-w-md h-auto object-cover rounded-md mb-4" />

        <p className="text-lg text-gray-700 mb-2">{item.description}</p>
        <p className="text-lg text-gray-600 mb-4">
          {item.status === "lost" ? `Lost on: ${item.date}` : `Found on: ${item.date}`}
        </p>

        {businessLocation && (
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800">{businessLocation.business_name}</p>
            <p className="text-md text-gray-600">
              {`${businessLocation.address}, ${businessLocation.city}, ${businessLocation.state}, ${businessLocation.zipcode}`}
            </p>
          </div>
        )}

        {item.status === "found" && !isClaimed && session?.userType === "user" && (
          <button onClick={handleClaim} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            Claim
          </button>
        )}

        {isClaimed && (
          <p className="text-lg font-semibold text-orange-500 mb-4">
            {claim?.bnf_user_id === session?.id ? "Your claim is pending approval" : "Pending to be claimed by another user"}
          </p>
        )}

        {session?.userType === "Business" && session?.id === item.business_id && item.status === "lost" && (
          <button onClick={handleSetFound} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-4">
            Set Found
          </button>
        )}

        {session?.userType === "Administrator" && item.status === "false" && (
          <button onClick={handleSetFound} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-4">
            Set Found
          </button>
        )}
      </div>

      <Footer />
    </div>



  );
}
