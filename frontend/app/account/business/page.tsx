import React from 'react';
import Footer from '../../components/footer';
// import ListItem from '../../components/listitem';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Card from '../../components/card';
import { redirect } from 'next/navigation';

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

const Business = () => {

  const [items, setItems] = useState<Item[][]>([]);

  const { data: session } = useSession();
  if (session?.userType != "Administrator") {
    redirect('/');
  }


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

  const lostItems = items.flat().filter((item) => item.business_id === session.id);
  const foundItems = items.flat().filter((item) => item.business_id === session.id);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Business Name</h1>
      <div className="flex flex-wrap justify-center items-start w-5/6">
        <h2 className="w-full text-xl font-bold mt-4">Found Items</h2>
        {foundItems.map((foundItem, index) => (
          <Card key={index} item={foundItem} />
        ))}
        <h2 className="w-full text-xl font-bold mt-4">Lost Items</h2>
        {lostItems.map((lostItem, index) => (
          <Card key={index} item={lostItem} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Business;