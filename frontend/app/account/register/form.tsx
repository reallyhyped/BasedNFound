'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone_number: formData.get('phone_number'),
      }),
    });
      
    router.push("/")
    router.refresh();
    

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
        name="first_name"
        className="border border-black  text-black"
        placeholder='first name'
      />
      <input
        name="last_name"
        className="border border-black  text-black"
        placeholder='last name'
      /><input
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