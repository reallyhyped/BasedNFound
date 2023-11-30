"use client";
import React, { useState } from 'react'

const newClaim = () => {
    const [submitted, setSubmitted] = useState(false);
    const [categories, setCategories] = useState([
        { id: 1, name: 'Show all categories' },
        { id: 2, name: 'Bags & Backpacks' },
        { id: 3, name: 'Children Items' },
        { id: 4, name: 'Clothing' },
        { id: 5, name: 'Computers & Electronics' },
        { id: 6, name: 'Eyewear' },
        { id: 7, name: 'Footwear' },
        { id: 8, name: 'Hokie P' },
        { id: 9, name: 'IDs & Cards' },
        { id: 10, name: 'Keys' },
        { id: 11, name: 'Miscellaneous' },
        { id: 12, name: 'Mobile Devices' },
        { id: 13, name: 'Wallets & Purses' },
        { id: 14, name: 'Watches & Jewelry' },
        { id: 15, name: 'Water Bottles' },
    ]);

    //locations here
    const locations = ['Location 1', 'Location 2', 'Location 3']; 

    const handleSubmit = (event) => {
      event.preventDefault();
      setSubmitted(true);
    }
  
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex flex-col w-full p-8 space-y-4 items-center bg-white sm:w-96 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Add a New Claim</h1>
          <form onSubmit={handleSubmit}>
            <input className="w-full px-4 py-2 rounded-lg mb-4" type="date" placeholder="Date" required />
            <select className="w-full px-4 py-2 rounded-lg mb-4" required>
              <option value="">Select Location</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
            <select className="w-full px-4 py-2 rounded-lg mb-4" required>
              <option value="">Select categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
            <input className="w-full px-4 py-2 rounded-lg mb-4" type="url" placeholder="Item photo URL" />
            <textarea className="w-full px-4 py-2 rounded-lg mb-4" placeholder="Description" required></textarea>
            <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white mb-4" type="submit">Submit</button>
          </form>
          {submitted && <p className="mt-4 text-green-500">You have successfully submitted the claim and it is now waiting for the administrator's review.</p>}
        </div>
      </div>
    )
  }

  export default newClaim