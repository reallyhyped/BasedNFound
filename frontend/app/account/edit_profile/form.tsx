"use client";

import { useSession } from "next-auth/react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import DeleteUserButton from "../delete/button";

export default function Form() {
  const { data: session } = useSession();
  const username = session?.user?.name ?? "defaultUsername"; // Replace 'defaultUsername' with appropriate fallback

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (session?.userType == "user") {
      const response = await fetch(`/api/auth/user/update`, {
        method: "POST",
        body: JSON.stringify({
          username: session?.user?.name,
          password: formData.get("password"),
        }),
      });
      console.log({ response });
    }

    if (session?.userType == "Business") {
      const response = await fetch(`/api/auth/business/update`, {
        method: "POST",
        body: JSON.stringify({
          username: session?.user?.name,
          password: formData.get("password"),
        }),
      });
      console.log({ response });
    }

    if (session?.userType == "Administrator") {
      const response = await fetch(`/api/auth/admin/update`, {
        method: "POST",
        body: JSON.stringify({
          username: session?.user?.name,
          password: formData.get("password"),
        }),
      });
      console.log({ response });
    }


    router.push("/");
    router.refresh();
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
  <div className="flex flex-col w-full p-8 space-y-4 items-center bg-white sm:w-96 rounded-xl shadow-lg">
    <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
    <form
      onSubmit={handleSubmit}
    >
      <input
        name="password"
        className="w-full px-4 py-2 rounded-lg mb-4"
        type="password"
        placeholder='New password'
        required
      />

      <button
        className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white mb-4"
        type="submit"
      >
        Change Password
      </button>
    </form>
    <DeleteUserButton userId={username} className="w-full px-4 py-2 rounded-lg bg-red-600 text-white mb-4"/>
  </div>
</div>

  );
}
