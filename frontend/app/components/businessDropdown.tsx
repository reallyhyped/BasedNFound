"use client"
import React, { useState, useEffect } from 'react';

interface Business {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    username: string;
    location_id: number;
    status: boolean;
}

interface DropdownMenuProps {
    onBusinessSelect: (BusinessId: number) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onBusinessSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setBusiness] = useState<Business[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState('Filter Business');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/business/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setBusiness(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleBusinessSelect = (BusinessName: string, BusinessId: number) => {
        setSelectedBusiness(BusinessName);
        setIsOpen(false); // Close the dropdown after selection

        onBusinessSelect(BusinessId);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedBusiness}
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                            onClick={() => handleBusinessSelect('All Businesses', null)} // null or a special flag
                        >
                            All Businesses
                        </a>
                        {categories.map((Business) => (
                            <a
                                key={Business.id}
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                                onClick={() => handleBusinessSelect(Business.name, Business.id)}
                            >
                                {Business.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;

