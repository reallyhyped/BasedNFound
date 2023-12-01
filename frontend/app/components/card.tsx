import Link from "next/link";

const Card = ({ item }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-2">
      <img className="w-full" src={item.image} alt={item.description} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{item.name}</div>
        <p className="text-gray-700 text-base">{item.date}</p>
        <Link href={`/item/${item.id}`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Details</button>
        </Link>
      </div>
    </div>
  );
};

export default Card