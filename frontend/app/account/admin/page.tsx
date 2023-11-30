"use client"
import { useSession } from 'next-auth/react';
import Form from './form';
import { redirect } from 'next/navigation';

export default function RegisterPage() {
    const { data: session } = useSession();
    if (session?.userType != "Administrator") {
        redirect('/');
    }
    return <Form />;
}