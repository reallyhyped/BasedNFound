"use client"
import { signIn, signOut, useSession } from 'next-auth/react';

const SignInButton = () => {
    const { data: session } = useSession();

    if (session && session.user ){
        return(<button onClick={()=> signOut({ callbackUrl: 'http://localhost:3000/' })}>Sign Out</button>)
    }

  return (
    <button onClick={() => signIn()}>
      Sign in
    </button>
  );
};

export default SignInButton;