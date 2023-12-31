"use client"
import React, { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
}

interface DropdownMenuProps {
  onCategorySelect: (categoryId: number) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Filter Category');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/category/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleCategorySelect = (categoryName: string, categoryId: number) => {
    setSelectedCategory(categoryName);
    setIsOpen(false); // Close the dropdown after selection

    onCategorySelect(categoryId);
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
          {selectedCategory}
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {/* Add the "Show All" option */}
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={() => handleCategorySelect('Show All', null)}
            >
              Show All
            </a>
            {/* Render other categories */}
            {categories.map((category) => (
              <a
                key={category.id}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => handleCategorySelect(category.name, category.id)}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;