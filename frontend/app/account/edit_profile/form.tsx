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

    const response = await fetch(`/api/auth/update`, {
      method: "POST",
      body: JSON.stringify({
        username: session?.user?.name,
        password: formData.get("password"),
      }),
    });
    console.log({ response });

    router.push("/");
    router.refresh();
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mx-auto max-w-md mt-10"
      >
        <input
          name="password"
          className="border border-black  text-black"
          type="password"
          placeholder="password"
        />

        <button type="submit">Change Password</button>
      </form>
      <DeleteUserButton userId={username} />
    </div>
  );
}
