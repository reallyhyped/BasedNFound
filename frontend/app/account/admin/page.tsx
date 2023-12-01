"use client"
import { useSession } from 'next-auth/react';
import Form from './form';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const { data: session } = useSession();
    if (session?.userType != "Administrator") {
        redirect('/');
    }
    return <div><div><Form /></div><div><Link href="/account/admin/approve_business">Approve Businesses</Link></div></div>
}