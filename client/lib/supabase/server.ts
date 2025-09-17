import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const supabaseServer = async () => {
  // AWAIT COOKIE STORE ONCE AT THE TOP LEVEL
  const resolvedCookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // USE RESOLVED COOKIE STORE DIRECTLY
        getAll: () => resolvedCookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            // USE REGULAR FOREACH WITHOUT ASYNC/AWAIT INSIDE
            cookiesToSet.forEach(({ name, value, options }) => {
              resolvedCookieStore.set(name, value, options);
            });
          } catch {
            // The setAll method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
