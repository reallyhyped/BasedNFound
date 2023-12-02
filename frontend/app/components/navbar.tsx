"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import logo from "../TEXTLOGO.png";

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // If the session is loading, you might want to show nothing or some placeholder
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            {/* Website Logo */}
            <Link href="/">
              <div className="flex items-center py-4 px-2 cursor-pointer">
              <Image src={logo} width={250} height={35} alt={"BasedNFound"} />
              </div>
            </Link>
            {/* Primary Navbar items */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <span className="py-4 px-2 text-blue-600 border-b-4 border-blue-600 font-semibold cursor-pointer">
                  Home
                </span>
              </Link>
              {/* More nav items */}
              {/* Lost button */}
              <Link href="/lost">
                <span className="py-4 px-2 text-blue-600 border-b-4 border-blue-600 font-semibold cursor-pointer">
                  Lost
                </span>
              </Link>
              {/* Found button */}
              <Link href="/found">
                <span className="py-4 px-2 text-blue-600 border-b-4 border-blue-600 font-semibold cursor-pointer">
                  Found
                </span>
              </Link>
            </div>
          </div>
          {/* Secondary Navbar items */}
          {session ? (
            <div className="hidden md:flex items-center space-x-3">
              {/* User Profile link */}
              <Link href="/account/">
                <span className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer">
                  {session.user?.name || session.user?.email}
                </span>
              </Link>
              {/* Admin Page */}
              {session.userType === "Administrator" && (
                <Link href="/account/admin">
                  <span className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer">
                    Admin
                  </span>
                </Link>
              )}
              {/* Business Page */}
              {session.userType === "Business" && (
                <Link href="/account/business">
                  <span className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer">
                    {session.first_name}
                  </span>
                </Link>
              )}
              {/* Logout button */}
              <span
                onClick={() =>
                  signOut({ callbackUrl: "http://localhost:3000/" })
                }
                className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer"
              >
                Sign Out
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              {/* Login button */}
              <Link
                href="/account/login"
                className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-blue-600 hover:text-white transition duration-300 cursor-pointer"
              >
                Log In
              </Link>
              {/* Signup button */}
              <Link href="/account/register">
                <span className="py-2 px-2 font-medium text-white bg-blue-600 rounded hover:bg-red-400 transition duration-300 cursor-pointer">
                  Sign Up
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav >
  );
}
