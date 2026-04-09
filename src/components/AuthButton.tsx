import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';

export default async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-text-secondary hidden sm:inline-block">
        Hi, {user.email?.split('@')[0]}
      </span>
      <form action={async () => {
        "use server";
        const supabaseServer = await createClient();
        await supabaseServer.auth.signOut();
        redirect('/');
      }}>
        <button className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
          Sign Out
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
    >
      Log in
    </Link>
  );
}
