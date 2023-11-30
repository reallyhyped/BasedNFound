import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    console.log(username);
    try {
      const apiUrl = `http://backend:8000/user/${username}`; // API endpoint to delete the user

      const response = await fetch(apiUrl, {
        method: "DELETE",
        // No need to send a body for a DELETE request in this case
      });

      if (!response.ok) {
        // If the response is not OK, throw an error
        throw new Error(`Error: ${response.status}`);
      }

      // Optional: response from delete operation, if the backend provides any
      const data = await response.json();
      console.log("User deleted:", data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  } catch (e) {
    console.log(e);
  }
  return NextResponse.json({ message: "success" });
}
