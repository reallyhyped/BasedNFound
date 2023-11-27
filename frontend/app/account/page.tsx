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
    <div>
      <h1>{"Username: " + username}</h1>
      <p>{"Name: " + first_name + " " + last_name}</p>
      <p>{"Email: " + email}</p>
      <p>{"Phone Number: " + phone_number}</p>
      <p>{"User Type: " + userType}</p>

      <Link href="/account/edit_profile">Edit Profile</Link>
    </div>
  );
};

export default UserProfile;
