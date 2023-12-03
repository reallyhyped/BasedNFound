"use client";
import React, { useState, useEffect } from 'react';
import Footer from '../../components/footer';
import ListItem from '../../components/listitem';
import DropdownMenu from '@/app/components/businessDropdown';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Business = () => {
  const { data: session, status } = useSession();
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);

  if (session?.userType === "user") {
    redirect('/');
  }

  useEffect(() => {
    if (session?.id && session.userType == "Business") {
      fetch(`http://localhost:8000/business/business_location/${session.id}`)
        .then(response => response.json())
        .then(data => {
          setBusinessInfo(data);
        })
        .catch(err => console.error('Error fetching business info:', err));

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

    if (session?.id && session.userType == "Administrator") {
      let url = 'http://localhost:8000/business/business_location/';
      if (selectedBusiness) {
        url += selectedBusiness; // Append business ID if a specific business is selected
      }
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setBusinessInfo(data);
        })
        .catch(err => console.error('Error fetching business info:', err));

      if (selectedBusiness) {
        fetch(`http://localhost:8000/item_claim/item_claim_by_business/${selectedBusiness}`)
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
      else {
        fetch(`http://localhost:8000/item_claim/all_item_claims`)
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


    }
  }, [session?.id, selectedBusiness]);


  const refetchItems = () => {
    if (session?.id && session.userType == "Business") {
      fetch(`http://localhost:8000/business/business_location/${session.id}`)
        .then(response => response.json())
        .then(data => {
          setBusinessInfo(data);
        })
        .catch(err => console.error('Error fetching business info:', err));

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

    if (session?.id && session.userType == "Administrator") {
      let url = 'http://localhost:8000/business/business_location/';
      if (selectedBusiness) {
        url += selectedBusiness; // Append business ID if a specific business is selected
      }
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setBusinessInfo(data);
        })
        .catch(err => console.error('Error fetching business info:', err));

      if (selectedBusiness) {
        fetch(`http://localhost:8000/item_claim/item_claim_by_business/${selectedBusiness}`)
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
      else {
        fetch(`http://localhost:8000/item_claim/all_item_claims`)
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


    }
  };
  if (status === 'loading') return <div>Loading...</div>;
  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error}</p>;

  const handleBusinessSelect = (businessId: number) => {
    setSelectedBusiness(businessId);
  };


  return (
    <div className="flex flex-col items-center p-4 m-2">
      {session.userType === "Administrator" && (
        <DropdownMenu onBusinessSelect={handleBusinessSelect} className="mb-4" />
      )}
      <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
        {businessInfo?.business_name || "All Businesses"}
      </h1>
      {businessInfo && businessInfo.address && businessInfo.city && businessInfo.state && businessInfo.zipcode && (
        <p className="text-lg text-gray-600 mb-4 shadow">
          {`${businessInfo.address}, ${businessInfo.city}, ${businessInfo.state}, ${businessInfo.zipcode}`}
        </p>
      )}
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-wrap justify-center bg-white-200 p-4 shadow-lg rounded-lg mb-6 w-5/6">
          <h2 className="w-full text-xl font-bold text-gray-700 mt-4 mb-2">Found Items</h2>
          {foundItems.length > 0 ? (
            foundItems.map(item => <ListItem key={item.item_id} item={item} refetchItems={refetchItems} />)
          ) : (
            <p className="text-gray-500">No found items.</p>
          )}
        </div>
        <div className="flex flex-wrap justify-center bg-white-200 p-4 shadow-lg rounded-lg w-5/6">
          <h2 className="w-full text-xl font-bold text-gray-700 mt-4 mb-2">Lost Items</h2>
          {lostItems.length > 0 ? (
            lostItems.map(item => <ListItem key={item.item_id} item={item} refetchItems={refetchItems} />)
          ) : (
            <p className="text-gray-500">No lost items.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );


};

export default Business;
