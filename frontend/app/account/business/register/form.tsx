'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Form() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);


  useEffect(() => {
    fetch('http://localhost:8000/location/')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const address = formData.get('address');
    const city = formData.get('city');
    const state = formData.get('state');
    const zipcode = formData.get('zipcode');

    const foundLocation = locations.find(location =>
      location.address == address &&
      location.city == city &&
      location.state == state &&
      location.zipcode == zipcode
    );

    let locationId;
    if (foundLocation) {
      locationId = foundLocation.id;
      await registerBusiness(locationId, formData); // Proceed to register business
    } else {
      try {
        const response = await fetch('http://localhost:8000/location/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({
            address: address,
            city: city,
            state: state,
            zipcode: parseInt(zipcode, 10)
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const newLocation = await response.json();
        locationId = newLocation.id;
        await registerBusiness(locationId, formData); // Proceed to register business
      } catch (error) {
        console.error('Error creating new location:', error);
      }
    }
  };

  async function registerBusiness(locationId, formData) {
    try {
      const businessResponse = await fetch(`/api/auth/business/register`, {
        method: 'POST',
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password'),
          name: formData.get('name'),
          location_id: locationId,
          email: formData.get('email'),
          phone_number: formData.get('phone_number'),
          status: false
        }),
      });

      if (!businessResponse.ok) {
        throw new Error('Network response was not ok');
      }

      // Proceed after successful registration
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error('Error registering business:', error);
    }


  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
  <div className="flex flex-col w-full p-8 space-y-4 items-center bg-white sm:w-96 rounded-xl shadow-lg">
    <h1 className="text-2xl font-bold mb-4">Business Registration</h1>
    <form
      onSubmit={handleSubmit}
    >
      <input
        name="username"
        className="w-full px-4 py-2 rounded-lg mb-4"
        type="input"
        placeholder='username'
        required
      />
      <input
        name="password"
        className="w-full px-4 py-2 rounded-lg mb-4"
        type="password"
        placeholder='password'
        required
      />
      <input
        name="name"
        className="w-full px-4 py-2 rounded-lg mb-4"
        placeholder='name'
        required
      />
      <input
        name="address"
        className="w-full px-4 py-2 rounded-lg mb-4"
        placeholder='address'
        required
      />
      <input
        name="city"
        className="w-full px-4 py-2 rounded-lg mb-4"
        placeholder='city'
        required
      />
      <input
        name="state"
        className="w-full px-4 py-2 rounded-lg mb-4"
        placeholder='state'
        required
      />
      <input
        name="zipcode"
        className="w-full px-4 py-2 rounded-lg mb-4"
        type="number"
        placeholder='zipcode'
        required
      />
      <input
        name="email"
        className="w-full px-4 py-2 rounded-lg mb-4"
        type="email"
        placeholder='email'
        required
      />
      <input
        name="phone_number"
        className="w-full px-4 py-2 rounded-lg mb-4"
        placeholder='phone number'
        required
      />

      <button
        className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white mb-4"
        type="submit"
      >
        Register
      </button>
    </form>
  </div>
</div>

  );
}