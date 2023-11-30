import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center w-full h-24 border-t p-4 bg-gray-200">
      <p className="mb-4 text-center">Can't find what you are looking for? You can report a lost item and we'll let you know as soon as we find your item!</p>
      <Link href="/newClaim">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Report Lost Item</button>
      </Link>
    </footer>
  );
};

export default Footer;