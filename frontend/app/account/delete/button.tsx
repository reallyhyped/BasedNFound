"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"; // Corrected from 'next/navigation'
import { signOut } from "next-auth/react";

export default function DeleteUserButton() {
  const { data: session, status } = useSession();

  // Fallback username if not found in session
  const username = session?.user?.name ?? "defaultUsername";

  const handleDelete = async () => {
    // Check if the session is loading or there's no user logged in
    if (status === "loading" || !username) {
      console.error("Cannot delete: No user logged in or session is loading.");
      return;
    }
    if (session?.userType == "user") {
      try {
        const response = await fetch(`/api/auth/user/delete/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        });
      } catch (error) {
        console.error("There was an error!", error);
        alert("Error occurred during deletion");
      }

      signOut({ callbackUrl: "http://localhost:3000/" });
    };

    if (session?.userType == "Business") {
      try {
        const response = await fetch(`/api/auth/business/delete/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        });
      } catch (error) {
        console.error("There was an error!", error);
        alert("Error occurred during deletion");
      }

      signOut({ callbackUrl: "http://localhost:3000/" });
    };

    if (session?.userType == "Administrator") {
      try {
        const response = await fetch(`/api/auth/admin/delete/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        });
      } catch (error) {
        console.error("There was an error!", error);
        alert("Error occurred during deletion");
      }

      signOut({ callbackUrl: "http://localhost:3000/" });
    };
  }



  // Render the button only if there is a username
  return username ? (
    <button onClick={handleDelete} type="button">
      Delete Profile
    </button>
  ) : null;
}
