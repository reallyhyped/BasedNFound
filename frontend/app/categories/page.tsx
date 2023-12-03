import React, { useState, useEffect } from 'react';

const CategoriesPage: React.FC = () => {
  const [newCategory, setNewCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

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
      .then(data => setCategories([...categories, data.name]))
      .catch(error => console.error('Error adding category:', error));

    setNewCategory('');
  };

  const handleRemoveCategory = (index: number) => {
    const categoryToRemove = categories[index];

    
    fetch(`/api/categories/${categoryToRemove}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedCategories = categories.filter((_, i) => i !== index);
        setCategories(updatedCategories);
      })
      .catch(error => console.error('Error removing category:', error));
  };

  return (
    <div>
      <h1>Categories</h1>
      <form>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={handleAddCategory}>
          Add Category
        </button>
      </form>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            {category}
            <button type="button" onClick={() => handleRemoveCategory(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
