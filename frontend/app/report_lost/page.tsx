"use client"
import React, { useState, useEffect } from 'react';

const ReportLost = () => {
    const [submitted, setSubmitted] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [businesses, setBusinesses] = useState([]); // State to store businesses
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch categories
        fetch('http://localhost:8000/category/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCategories(data);
            })
            .catch(error => {
                setError(error.message);
            });

        // Fetch businesses
        fetch('http://localhost:8000/business/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setBusinesses(data);
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Getting values from uncontrolled components (input, textarea, and single select)
        const form = event.target;
        const date = form.querySelector('input[type="date"]').value;
        const business = form.querySelector('select').value; // Assuming this is the first select element for business
        const itemPhotoUrl = form.querySelector('input[type="url"]').value;
        const description = form.querySelector('textarea').value;

        // Logging values
        console.log('Date:', date);
        console.log('Business:', business);
        console.log('Selected Categories:', selectedCategories); // This is from controlled component state
        console.log('Item Photo URL:', itemPhotoUrl);
        console.log('Description:', description);
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
                <h1 className="text-2xl font-bold mb-4">Report Lost Item</h1>
                <form onSubmit={handleSubmit}>
                    <input className="w-full px-4 py-2 rounded-lg mb-4" type="date" placeholder="Date" required />
                    <select className="w-full px-4 py-2 rounded-lg mb-4" required>
                        <option value="">Select business</option>
                        {businesses.map((business) => (
                            <option key={business.id} value={business.id}>{business.name}</option>
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
    );
}

export default ReportLost;
