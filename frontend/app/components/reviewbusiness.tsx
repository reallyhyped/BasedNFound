const ReviewBusiness = ({ item }) => {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg m-2">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{item.name}</div>
          <p className="text-gray-700 text-base">{item.location}</p>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4">Approve</button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Reject</button>
        </div>
      </div>
    );
  };

export default ReviewBusiness;