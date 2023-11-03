"use client"
import { useSession } from 'next-auth/react';
import Link from 'next/link';


const UserProfile = () =>{
  const {data: session} = useSession();

  if (!session) {
    return <div>Please sign in to view your profile</div>;
  }

  const username = session.user?.name
  const email = session.user?.email;

  return (
    <div>
      <h1>{"Username: "+ username}</h1>
      <p>{"Email: "+ email}</p>
      <Link href="/account/edit_profile">Edit Profile</Link>
    </div>
  );
};

export default UserProfile;