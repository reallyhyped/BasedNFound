const ListItem = ({ item }) => {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg m-2">
        <img className="w-full" src={item.image} alt={item.description} />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{item.name}</div>
          <p className="text-gray-700 text-base">{item.description}</p>
          <p className="text-gray-700 text-base">{item.date}</p>
          <p className="text-gray-700 text-base">Claimed: {item.claimed ? 'Yes' : 'No'}</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Claim</button>
        </div>
      </div>
    );
  };

export default ListItem;