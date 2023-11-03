"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // If the session is loading, you might want to show nothing or some placeholder
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            {/* Website Logo */}
            <Link href="/">
              <span className="flex items-center py-4 px-2 font-semibold text-gray-500 text-lg cursor-pointer">
                BasedNFound
              </span>
            </Link>
            {/* Primary Navbar items */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <span className="py-4 px-2 text-red-500 border-b-4 border-red-500 font-semibold cursor-pointer">
                  Home
                </span>
              </Link>
              {/* More nav items */}
            </div>
          </div>
          {/* Secondary Navbar items */}
          {session ? (
            <div className="hidden md:flex items-center space-x-3">
              {/* User Profile link */}
              <Link href="/account/">
                <span className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300 cursor-pointer">
                  {session.user?.name || session.user?.email}
                </span>
              </Link>
              {/* Logout button */}
              <span
                onClick={() =>
                  signOut({ callbackUrl: "http://localhost:3000/" })
                }
                className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300 cursor-pointer"
              >
                Sign Out
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              {/* Login button */}
              <Link
                href="/account/login"
                className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300 cursor-pointer"
              >
                Log In
              </Link>
              {/* Signup button */}
              <Link href="/account/register">
                <span className="py-2 px-2 font-medium text-white bg-red-500 rounded hover:bg-red-400 transition duration-300 cursor-pointer">
                  Sign Up
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
