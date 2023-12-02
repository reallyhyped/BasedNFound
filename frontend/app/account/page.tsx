"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

const UserProfile = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Please sign in to view your profile</div>;
  }

  const username = session.user?.name;
  const email = session.user?.email;
  const userType = session.userType;
  const first_name = session.first_name;
  const last_name = session.last_name || "";
  const phone_number = session.phone_number;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col w-full p-8 space-y-4 items-center bg-white sm:w-96 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold mb-4">{"Username: " + username}</h1>
        <p className="mb-4">{"Name: " + first_name + " " + last_name}</p>
        <p className="mb-4">{"Email: " + email}</p>
        <p className="mb-4">{"Phone Number: " + phone_number}</p>
        <p className="mb-4">{"User Type: " + userType}</p>

        <Link href="/account/edit_profile" className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-center mb-4">Edit Profile</Link>
      </div>
    </div>

  );
};

export default UserProfile;
