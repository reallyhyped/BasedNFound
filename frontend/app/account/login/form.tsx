"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!response?.error) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col w-full p-8 space-y-4 items-center bg-white sm:w-96 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
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

          <button
            className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white mb-4"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
