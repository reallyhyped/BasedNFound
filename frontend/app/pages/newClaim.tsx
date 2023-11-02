import React, { useState } from 'react'

const newClaim = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
      event.preventDefault();
      setSubmitted(true);
    }
  
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex flex-col w-full p-8 space-y-4 items-center bg-white sm:w-96 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Add a New Claim</h1>
          <form onSubmit={handleSubmit}>
            <input className="w-full px-4 py-2 rounded-lg mb-4" type="time" placeholder="Time" required />
            <input className="w-full px-4 py-2 rounded-lg mb-4" type="text" placeholder="Location" required />
            <p className="text-left w-full mb-2">Add item photo</p>
            <input className="w-full px-4 py-2 rounded-lg mb-4" type="file" />
            <textarea className="w-full px-4 py-2 rounded-lg mb-4" placeholder="Description" required></textarea>
            <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white mb-4" type="submit">Submit</button>
          </form>
          {submitted && <p className="mt-4 text-green-500">You have successfully submitted the claim and it is now waiting for the administrator's review.</p>}
        </div>
      </div>
    )
  }

  export default newClaim