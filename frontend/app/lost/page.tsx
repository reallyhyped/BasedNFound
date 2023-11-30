"use client"
import React from 'react';

// Import your components
import DropdownMenu from '../components/dropdownMenu';
import Card from '../components/card';
import Pagination from '../components/pagination';
import Footer from '../components/footer';
import Link from 'next/link';

const LostPage = () => {
  const items = [

  ]; // Your array of unclaimed items

  //create a demo items array
  const demoItem = [
    {
      id: 1,
      name: "Phone",
      date: "2022-01-01",
      description: "A black iPhone 12 Pro Max with a black case.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 2,
      name: "Wallet",
      date: "2022-01-01",
      description: "A brown leather wallet with a blue stripe.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 3,
      name: "Keys",
      date: "2022-01-01",
      description: "A set of keys with a blue keychain.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 4,
      name: "Watch",
      date: "2022-01-01",
      description: "A silver watch with a black band.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 5,
      name: "Airpods",
      date: "2022-01-01",
      description: "A pair of white Airpods.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 6,
      name: "Glasses",
      date: "2022-01-01",
      description: "A pair of black glasses.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 7,
      name: "Laptop",
      date: "2022-01-01",
      description: "A black Macbook Pro.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 8,
      name: "Backpack",
      date: "2022-01-01",
      description: "A black backpack with a blue stripe.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    }
  ];

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Lost Items</h1>
      <div className="flex justify-between items-center w-3/4 p-4 pl-4 pr-4">
        <div>We found {demoItem.length} unclaimed items.</div>
        <Link href="/newClaim">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">File A Claim</button>
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
        {demoItem.map(item => (
          <Card key={item.id} item={item} />
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