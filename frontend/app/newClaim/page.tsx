"use client"
import React, { useState, useEffect } from 'react';

const NewClaim = () => {
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/category/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const locations = ['Location 1', 'Location 2', 'Location 3'];

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the submission with selectedCategories
    setSubmitted(true);
  };

  const handleCategoryChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedCategories(selectedOptions);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
          <select
            className="w-full px-4 py-2 rounded-lg mb-4"
            multiple
            required
            onChange={handleCategoryChange}
            value={selectedCategories}
          >
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

export default NewClaim;
