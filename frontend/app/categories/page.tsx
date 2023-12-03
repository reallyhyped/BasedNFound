"use client"
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const CategoriesPage: React.FC = () => {
  const [newCategory, setNewCategory] = useState<string>('');
  const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    fetch('http://localhost:8000/category/')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleAddCategory = () => {
    fetch('http://localhost:8000/category/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newCategory }),
    })
      .then(response => response.json())
      .then(data => {
        // Assuming data returns the full category object including the id
        setCategories([...categories, data]);
      })
      .catch(error => console.error('Error adding category:', error))
      .finally(() => setNewCategory(''));
  };

  const handleRemoveCategory = async (categoryId: number) => {
    try {
      await fetch(`http://localhost:8000/category/${categoryId}`, {
        method: 'DELETE',
      });

      // Update the state to remove the category
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Error removing category:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>; // Or your custom loading component
  }

  if (session?.userType != "Administrator") {
    redirect("/")
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-bold text-gray-700 mb-4">Categories</h1>
      <form className="flex items-center mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded mr-2"
        />
        <button
          type="button"
          onClick={handleAddCategory}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Category
        </button>
      </form>
      <ul>
        {categories.map(({ id, name }) => (
          <li key={id} className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded">
            <span className="text-gray-700">{name}</span>
            <button
              type="button"
              onClick={() => handleRemoveCategory(id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
