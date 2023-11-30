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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 mx-auto max-w-md mt-10"
    >
      <input
        name="username"
        className="border border-black text-black"
        type="input"
        placeholder='username'
      />
      <input
        name="password"
        className="border border-black  text-black"
        type="password"
        placeholder='password'
      />
      <input
        name="name"
        className="border border-black  text-black"
        placeholder='name'
      />
      {/* <select name="location" className="border border-black text-black">
        {locations.map(location => (
          <option key={location.id} value={location.id}>
            {`${location.address}, ${location.city}, ${location.state}, ${location.zipcode}`}
          </option>
        ))}
      </select> */}
      <input
        name="address"
        className="border border-black  text-black"
        placeholder='address'
      />
      <input
        name="city"
        className="border border-black  text-black"
        placeholder='city'
      />
      <input
        name="state"
        className="border border-black  text-black"
        placeholder='state'
      />
      <input
        name="zipcode"
        className="border border-black  text-black"
        type="number"
        placeholder='zipcode'
      />
      <input
        name="email"
        className="border border-black  text-black"
        type="email"
        placeholder='email'
      />
      <input
        name="phone_number"
        className="border border-black  text-black"
        placeholder='phone number'
      />

      <button type="submit">Register</button>
    </form>
  );
}