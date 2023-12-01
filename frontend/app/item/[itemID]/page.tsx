"use client"
import React, { useState, useEffect } from 'react';
import Footer from '../../components/footer';

export default function Page({ params }: { params: { itemID: string } }) {
    const [item, setItem] = useState(null);
    const [isClaimed, setIsClaimed] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`http://localhost:8000/item/${params.itemID}`);
                const data = await response.json();
                setItem(data);
            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };

        fetchItem();
    }, [params.itemID]);

    const handleClaim = () => {
        setIsClaimed(true);
    };

    if (!item) {
        return <div>Loading...</div>;
    }

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

}