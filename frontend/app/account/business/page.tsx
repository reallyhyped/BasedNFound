import React from 'react';
import Footer from '../../components/footer';
import ListItem from '../../components/listitem';

const Business = () => {
  const foundItems = [
    {
      id: 1,
      name: "Phone",
      date: "2022-01-01",
      description: "A black iPhone 12 Pro Max with a black case.",
      claimed: true,
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 2,
      name: "Wallet",
      date: "2022-01-01",
      claimed: true,
      description: "A brown leather wallet with a blue stripe.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 3,
      name: "Keys",
      date: "2022-01-01",
      claimed: true,
      description: "A set of keys with a blue keychain.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 4,
      name: "Watch",
      date: "2022-01-01",
      claimed: false,
      description: "A silver watch with a black band.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
}]; // Your array of found items
  const lostItems = [
    {
      id: 1,
      name: "Phone",
      date: "2022-01-01",
      claimed: false,
      description: "A black iPhone 12 Pro Max with a black case.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 2,
      name: "Wallet",
      date: "2022-01-01",
      claimed: false,
      description: "A brown leather wallet with a blue stripe.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 3,
      name: "Keys",
      date: "2022-01-01",
      claimed: false,
      description: "A set of keys with a blue keychain.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 4,
      name: "Watch",
      date: "2022-01-01",
      claimed: true,
      description: "A silver watch with a black band.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 5,
      name: "Airpods",
      date: "2022-01-01",
      claimed: true,
      description: "A pair of white Airpods.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 6,
      name: "Glasses",
      date: "2022-01-01",
      claimed: true,
      description: "A pair of black glasses.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
    {
      id: 7,
      name: "Laptop",
      date: "2022-01-01",
      claimed: true,
      description: "A black Macbook Pro.",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },
  ]; // Your array of lost items

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-4">Business Name</h1>
      <div className="flex flex-wrap justify-center items-start w-5/6">
        <h2 className="w-full text-xl font-bold mt-4">Found Items</h2>
        {foundItems.map(item => (
          <ListItem key={item.id} item={item} />
        ))}
        <h2 className="w-full text-xl font-bold mt-4">Lost Items</h2>
        {lostItems.map(item => (
          <ListItem key={item.id} item={item} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Business;