"use client"
import React, { useState } from 'react';

// Import your components
import Footer from '../components/footer';

const ItemDetail = () => {

    const item = {
        id: 1,
        name: "Phone",
        date: "2022-01-01",
        description: "A black iPhone 12 Pro Max with a black case.",
        image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    };

    const [isClaimed, setIsClaimed] = useState(false);

    const handleClaim = () => {
        setIsClaimed(true);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl font-bold mt-4">{item.name}</h1>
            <img src={item.image} alt={item.name} className="w-96 h-96 object-cover" />
            <p className="text-lg">{item.description}</p>
            <p className="text-lg">Found on: {item.date}</p>
            {!isClaimed ? (
                <button onClick={handleClaim} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Claim</button>
            ) : (
                <p className="text-lg">Claimed successfully!</p>
            )}
            <Footer />
        </div>
    );
};

export default ItemDetail;