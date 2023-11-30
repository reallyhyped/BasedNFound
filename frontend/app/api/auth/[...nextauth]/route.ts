import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          const apiUrl = "http://backend:8000/user/";
          const response = await fetch(`${apiUrl}${credentials?.username}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const apiUrl = "http://backend:8000/business/";
            const response = await fetch(`${apiUrl}${credentials?.username}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            const data = await response.json();
            if (data.password == credentials?.password && data.status) {
              return {
                name: data.username,
                first_name: data.name,
                email: data.email,
                userType: "Business",
                phone_number: data.phone_number,
              };
            }

            if (!response.ok) {
              const apiUrl = "http://backend:8000/admin/";
              const response = await fetch(
                `${apiUrl}${credentials?.username}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              const data = await response.json();
              if (data.password == credentials?.password) {
                return {
                  name: data.username,
                  email: data.email,
                  userType: "Administrator",
                  first_name: data.first_name,
                  last_name: data.last_name,
                  phone_number: data.phone_number,
                };
              }

              if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
              }
            }
          }

          const data = await response.json();
          if (data.password == credentials?.password) {
            return {
              name: data.username,
              email: data.email,
              userType: "user",
              first_name: data.first_name,
              last_name: data.last_name,
              phone_number: data.phone_number,
            };
          }
        } catch (error) {
          console.error("There was an error!", error);
          return null;
          // Handle error, e.g., show an error message to the user
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // user is the object returned from the authorize function
      if (user) {
        token.userType = user.userType; // Add user type to the token
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.phone_number = user.phone_number;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the user type to the session
      session.userType = token.userType;
      session.first_name = token.first_name;
      session.last_name = token.last_name;
      session.phone_number = token.phone_number;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
