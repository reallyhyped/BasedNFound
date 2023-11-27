import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
    session: {
      strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. 'Sign in with...')
          name: 'Credentials',
          // The credentials is used to generate a suitable form on the sign in page.
          // You can specify whatever fields you are expecting to be submitted.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            username: {},
            password: {}
          },
          async authorize(credentials, req) {
            try {
              const apiUrl = 'http://backend:8000/user/';
              const response = await fetch(`${apiUrl}${credentials?.username}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              })
          
              if (!response.ok) {
                  throw new Error(`Error: ${response.status}`);
              }
          
              const data = await response.json();
              if(data.password == credentials?.password){
                return{
                  name: data.username,
                  email: data.email,
                  userType: "user"
                }
              }


          
          } catch (error) {
              console.error('There was an error!', error);
              return null
              // Handle error, e.g., show an error message to the user
          }
        
          },
        })
      ],
      callbacks: {
        async jwt({ token, user }) {
            // user is the object returned from the authorize function
            if (user) {
                token.userType = user.userType; // Add user type to the token
            }
            return token;
        },
        async session({ session, token }) {
            // Add the user type to the session
            session.userType = token.userType;
            return session;
        }
    }
});

export {handler as GET, handler as POST}