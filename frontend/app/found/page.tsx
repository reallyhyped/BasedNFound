"use client";
import React, { useState, useEffect } from "react";
import DropdownMenu from "../components/dropdownMenu"; // Adjust the path as needed
import Card from "../components/card"; // Adjust the path as needed
import Pagination from "../components/pagination"; // Adjust the path as needed
import Footer from "../components/footer"; // Adjust the path as needed
import Link from "next/link";

interface Item {
  id: number;
  name: string;
  date: string;
  claim_id: number;
  business_id: number;
  description: string;
  image: string;
  status: string;
}

const FoundPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = selectedCategoryId
          ? `http://localhost:8000/item/category/${selectedCategoryId}`
          : "http://localhost:8000/item";
        const response = await fetch(url);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCategoryId]);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  const foundItems = items.filter((item) => item.status === "found");

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Found Items</h1>
      <div className="flex justify-between items-center w-3/4 p-4 pl-4 pr-4">
        <div>We found {foundItems.length} unclaimed items.</div>
        <Link href="/report_lost">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Report Lost Item
          </button>
        </Link>
      </div>
      <div className="flex justify-between items-center w-3/4 p-4 pl-4 pr-4">
        <DropdownMenu onCategorySelect={handleCategorySelect} />

        <div className="flex">
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Search"
          />
          <button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Search
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-start w-5/6">
        {foundItems.map((foundItem) => (
          <Card key={foundItem.id} item={foundItem} />
        ))}
      </div>
      <div className="w-full p-4">
        {/* Your pagination component */}
        {/*<Pagination />*/}
      </div>
      <Footer />
    </div>
  );
};

export default FoundPage;
