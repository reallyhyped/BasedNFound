"use client";

import Link from "next/link";
import Image from "next/image";
import icon from "./iconLOGO.png"

export default function Home() {
  return (
  <main className="flex flex-col items-center justify-center h-screen p-4">

      <Image src={icon} width={300} height={300} alt={"BasedNFound"} className="mt-8 mb-4" />
        <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold">Welcome to BasedNFound</h1>
        <p>Here you can find lost items and report found items.</p>
        </div>


    <div className="space-x-4">
      <Link href="/lost">
        <button className="px-4 py-2 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition">Lost</button>
      </Link>
      <Link href="/found">
        <button className="px-4 py-2 border border-green-600 rounded hover:bg-green-600 hover:text-white transition">Found</button>
      </Link>
    </div>
  </main>);
}
