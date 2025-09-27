import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // REMOVE THIS AFTER TESTING
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }

  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
}
