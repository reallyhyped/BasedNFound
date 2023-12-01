"use client";
import React, { useState, useEffect } from "react";
import Footer from "../../components/footer";
import { useSession } from "next-auth/react";
import Business from "@/app/account/business/page";

export default function Page({ params }: { params: { itemID: string } }) {
  const { data: session } = useSession();
  const [item, setItem] = useState(null);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/item/${params.itemID}`
        );
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [params.itemID]);

  const handleClaim = () => {
    setIsClaimed(true); // You might want to also send a request to update the item status
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
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold mt-4">{item.name}</h1>
      <img
        src={item.image}
        alt={item.name}
        className="w-96 h-96 object-cover"
      />
      <p className="text-lg">{item.description}</p>
      <p className="text-lg">Found on: {item.date}</p>

      {item.status === "found" &&
        !isClaimed &&
        session?.userType === "user" && (
          <button
            onClick={handleClaim}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Claim
          </button>
        )}
      {isClaimed && <p className="text-lg">Claimed successfully!</p>}

      {session?.userType === "Business" &&
        session?.id === item.business_id &&
        item.status === "lost" && (
          <button
            onClick={handleSetFound}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Set Found
          </button>
        )}

      {session?.userType === "Administrator" && item.status === "false" && (
        <button
          onClick={handleSetFound}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Set Found
        </button>
      )}

      <Footer />
    </div>
  );
}
