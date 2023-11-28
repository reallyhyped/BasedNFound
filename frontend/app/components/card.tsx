const Card = ({ item }) => {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg m-2">
        <img className="w-full" src={item.image} alt={item.description} />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{item.name}</div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Details</button>
        </div>
      </div>
    );
  };
  
export default Card;