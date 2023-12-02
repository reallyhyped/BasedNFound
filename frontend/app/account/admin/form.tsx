'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/auth/admin/register`, {
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

    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col w-full p-8 space-y-4 items-center bg-white sm:w-96 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Admin Registration</h1>
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
            name="first_name"
            className="w-full px-4 py-2 rounded-lg mb-4"
            placeholder='first name'
            required
          />
          <input
            name="last_name"
            className="w-full px-4 py-2 rounded-lg mb-4"
            placeholder='last name'
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
            Create Admin
          </button>
        </form>
        <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-center mb-4"><Link href="/account/admin/approve_business">Approve Businesses</Link></button>
      </div>
    </div>
  );
}