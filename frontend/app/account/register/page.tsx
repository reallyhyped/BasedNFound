import { getServerSession } from "next-auth";
import Form from "./form";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RegisterPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return (
    <div>
      <div>
        <Form />
      </div>
      <div>
        <Link href="/account/business/register">
          Are you a business? Create an account here
        </Link>
      </div>
    </div>
  );
}
