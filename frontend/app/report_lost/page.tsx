"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useState, useEffect } from "react";

const ReportLost = () => {
  const { data: session } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]); // State to store businesses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:8000/category/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        setError(error.message);
      });

    // Fetch businesses
    fetch("http://localhost:8000/business/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setBusinesses(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    // Create a Date object from the input value
    const inputDate = new Date(form.querySelector('input[type="date"]').value);

    // Adjust the date to the local timezone and convert to ISO string
    const date = inputDate.toISOString().slice(0, -1);

    const itemName = form.querySelector('textarea[name="itemName"]').value; // Retrieves the name from the textarea
    const businessId = form.querySelector("select").value; // Business ID
    const itemPhotoUrl = form.querySelector('input[type="url"]').value;
    const description = form.querySelector("textarea").value;
    const bnfUserId = session?.id; // From session

    // Logging values
    // console.log('Name:', itemName);
    // console.log('Date:', date);
    // console.log('Business ID:', businessId);
    // console.log('Selected Categories:', selectedCategories);
    // console.log('Item Photo URL:', itemPhotoUrl);
    // console.log('Description:', description);
    // console.log('User ID:', bnfUserId);

    // Constructing the request body
    const claimData = {
      date: date,
      status: "No one has claimed", // Assuming status needs to be set as "Pending"
      bnf_user_id: bnfUserId,
      description: description,
      // Add other fields as needed
    };

    // Making the POST request
    try {
      const response = await fetch("http://localhost:8000/claim/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(claimData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Extract claim ID from response
      const claimResponse = await response.json();
      console.log("Claim submitted:", claimResponse);

      // Assuming claimResponse contains an id field for the newly created claim
      const claimId = claimResponse.id;

      // Making the POST request to the log endpoint
      const logData = {
        date: date,
        description: "Item has been reported as lost", // Update this as needed
        claim_id: claimId,
      };

      const logResponse = await fetch("http://localhost:8000/log/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(logData),
      });

      if (!logResponse.ok) {
        throw new Error("Log response was not ok");
      }

      // Handle log response
      const logResponseData = await logResponse.json();
      console.log("Log submitted:", logResponseData);

      // Constructing the request body for the new item
      const itemData = {
        name: itemName,
        date: date,
        claim_id: claimId,
        business_id: businessId,
        description: description,
        image: itemPhotoUrl,
        status: "lost",
        bnf_user_id: bnfUserId,
      };

      // Making the POST request to create the item
      const itemResponse = await fetch("http://localhost:8000/item/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!itemResponse.ok) {
        throw new Error("Item response was not ok");
      }

      const itemResponseData = await itemResponse.json();
      console.log("Item created:", itemResponseData);

      const itemId = itemResponseData.id; // Assuming this is the format of the response

      // Making the POST request for each category
      for (const categoryId of selectedCategories) {
        const containData = {
          category_id: categoryId,
          item_id: itemId,
        };

        const containResponse = await fetch("http://localhost:8000/contain/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(containData),
        });

        if (!containResponse.ok) {
          throw new Error("Contain response was not ok");
        }

        const containResponseData = await containResponse.json();
        console.log("Contain data submitted:", containResponseData);
      }

      // Update state to indicate submission
      setSubmitted(true);
      form.reset(); // This resets all native form fields
      setSelectedCategories([]); // Resetting any additional React state
    } catch (error) {
      console.error(
        "Error submitting claim, log, item, or contain:",
        error.message
      );
      setError(error.message);
    }
  };

  const handleCategoryChange = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedCategories(selectedOptions);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!session) {
    redirect("/account/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col w-full p-8 space-y-4 items-center bg-white sm:w-96 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Report Lost Item</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full px-4 py-2 rounded-lg mb-4"
            name="itemName"
            placeholder="Name"
            required
          ></textarea>
          <input
            className="w-full px-4 py-2 rounded-lg mb-4"
            type="date"
            placeholder="Date"
            required
          />
          <select className="w-full px-4 py-2 rounded-lg mb-4" required>
            <option value="">Select business</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 rounded-lg mb-4"
            multiple
            required
            onChange={handleCategoryChange}
            value={selectedCategories}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            className="w-full px-4 py-2 rounded-lg mb-4"
            type="url"
            placeholder="Item photo URL"
          />
          <textarea
            className="w-full px-4 py-2 rounded-lg mb-4"
            placeholder="Description"
            required
          ></textarea>
          <button
            className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white mb-4"
            type="submit"
          >
            Submit
          </button>
        </form>
        {submitted && (
          <p className="mt-4 text-green-500">
            You have successfully reported a lost item.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportLost;
