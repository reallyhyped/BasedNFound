
import { NextResponse } from "next/server"
import { useSession } from 'next-auth/react';

export async function POST(request: Request){
    
    try {
        const {username, password} = await request.json()
        //validate email and password here
        try {

            const apiUrl = 'http://backend:8000/business/' + username;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                // No body needed for a GET request
              });
          
              if (!response.ok) {
                // If the response is not OK, throw an error
                throw new Error(`Error: ${response.status}`);
              }
          
            const user = await response.json();

            const update_response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: username,
                    password: password, // Note: Password should be handled securely!
                    name: user.name,
                    location_id: user.location_id,
                    email: user.email,
                    phone_number: user.phone_number,
                    status: user.status
                }),
              });
    
            if (!update_response.ok) {
                throw new Error(`Error: ${update_response.status}`);
            }
    
            const new_data = await update_response.json();
            console.log('User updated:', new_data);
    

            
          } catch (error) {
            console.error('There was an error!', error);
          }
    } catch(e) {
        console.log({e})
    }

    return NextResponse.json({message: 'success'})
}