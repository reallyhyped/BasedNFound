"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import DropdownMenu from '../components/dropdownMenu';
import Card from '../components/card';
import Pagination from '../components/pagination';
import Footer from '../components/footer';
import Link from 'next/link';

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

const LostPage = () => {
  const [items, setItems] = useState<Item[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/item');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const lostItems = items.flat().filter((item) => item.status === 'lost');

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Lost Items</h1>
        <div>We found {lostItems.length} unclaimed items.</div>
        <Link href="/report_lost">
        </Link>
      </div>
      <div className="flex justify-between items-center w-3/4 p-4 pl-4 pr-4">
        <DropdownMenu />
        <div className="flex">
          <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Search" />
          <button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-start w-5/6">
        {lostItems.map((lostItem, index) => (
            <Card key={index} item={lostItem} />
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

export default LostPage;