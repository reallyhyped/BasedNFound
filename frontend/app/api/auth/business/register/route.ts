import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, phone_number, username, password, location_id, status } =
      await request.json();
    //validate email and password here
    try {
      const apiUrl = "http://backend:8000/business/";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password, // Note: Password should be handled securely!
          email,
          name,
          location_id,
          phone_number,
          status,
        }),
      });

      if (!response.ok) {
        // If the response is not OK, throw an error
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Business created:", data);
      // You might want to redirect the user or clear the form
      // or give some success message
    } catch (error) {
      console.error("There was an error!", error);
      // Handle error, e.g., show an error message to the user
    }
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}
