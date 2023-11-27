import { getServerSession } from 'next-auth';
import Form from './form';
import { redirect } from 'next/navigation';
import Link from 'next/link';


export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect('/');
  }
  return (<div><Form /><Link href="/account/register">Register</Link></div>);
}