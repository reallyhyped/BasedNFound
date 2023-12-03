"use client"
import React, { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import ListItem from '../../components/listitem';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Business = () => {
  const { data: session, status } = useSession();
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.id) {
      fetch(`http://localhost:8000/item_claim/item_claim_by_business/${session.id}`)
        .then(response => response.json())
        .then(data => {
          const found = data.filter(item => item.item_status === 'found');
          const lost = data.filter(item => item.item_status === 'lost');
          setFoundItems(found);
          setLostItems(lost);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [session?.id]);

  const refetchItems = () => {
    fetch(`http://localhost:8000/item_claim/item_claim_by_business/${session.id}`)
      .then(response => response.json())
      .then(data => {
        const found = data.filter(item => item.item_status === 'found');
        const lost = data.filter(item => item.item_status === 'lost');
        setFoundItems(found);
        setLostItems(lost);
      })
      .catch(err => setError(err.message));
  };
  if (status === 'loading') return <div>Loading...</div>;
  if (loading) return <p>Loading...</p>;
  if (session?.userType != "Business") {
    redirect('/')
  }
  if (error) return <p>Error: {error}</p>;


  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Business Name</h1>
      <div className="flex flex-wrap justify-center items-start w-5/6">
        <h2 className="w-full text-xl font-bold mt-4">Found Items</h2>
        {foundItems.length > 0 ? (
          foundItems.map(item => <ListItem key={item.item_id} item={item} refetchItems={refetchItems} />)
        ) : (
          <p>No found items.</p>
        )}
        <h2 className="w-full text-xl font-bold mt-4">Lost Items</h2>
        {lostItems.length > 0 ? (
          lostItems.map(item => <ListItem key={item.item_id} item={item} refetchItems={refetchItems} />)
        ) : (
          <p>No lost items.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Business;
