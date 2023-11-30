import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password, first_name, last_name, email, phone_number } =
      await request.json();
    //validate email and password here
    try {
      const apiUrl = "http://backend:8000/user/";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password, // Note: Password should be handled securely!
          first_name,
          last_name,
          email,
          phone_number,
        }),
      });

      if (!response.ok) {
        // If the response is not OK, throw an error
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("User created:", data);
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
